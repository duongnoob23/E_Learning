// crawl_by_letter.js
// Usage: node crawl_by_letter.js a
// Make sure you have split_links/a.json created already.

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const LETTER = process.argv[2];
if (!LETTER || !/^[a-z]$/.test(LETTER)) {
  console.error('Usage: node crawl_by_letter.js <letter>');
  process.exit(1);
}

const INPUT_FILE = path.resolve(__dirname, `split_links/${LETTER}.json`);
const OUTPUT_DIR = path.resolve(__dirname, 'output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, `${LETTER}.json`);

const LAUNCH_OPTIONS = {
  headless: true,
  protocolTimeout: 180000,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
};
const PAGE_OPTIONS = {
  gotoTimeout: 120000, 
  waitUntil: 'networkidle2',
};
const RETRY_LIMIT = 2;     // số lần retry khi gặp lỗi
const DELAY_BETWEEN = 500; // ms giữa các requests

const sleep = ms => new Promise(res => setTimeout(res, ms));
const safeReadJSON = file => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return null;
  }
};

if (!fs.existsSync(INPUT_FILE)) {
  console.error('Input file not found:', INPUT_FILE);
  process.exit(1);
}
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const links = safeReadJSON(INPUT_FILE);
if (!Array.isArray(links) || links.length === 0) {
  console.error('No links found in', INPUT_FILE);
  process.exit(1);
}

let results = [];
if (fs.existsSync(OUTPUT_FILE)) {
  const old = safeReadJSON(OUTPUT_FILE);
  if (Array.isArray(old)) results = old;
}
const seen = new Set(results.map(r => r.url));

const scrapeScript = () => {
  const out = { word: '', pos: '', phonetic_br: '', phonetic_us: '', audio_br: '', audio_us: '', definitions: [], examples: [] };
  const h1 = document.querySelector('h1.headword') || document.querySelector('.headword');
  if (h1) out.word = h1.innerText.trim();
  const posEl = document.querySelector('.pos') || document.querySelector('.top-g .pos');
  if (posEl) out.pos = posEl.innerText.trim();
  const phonBr = document.querySelector('.phonetics .phons_br .phon') ||
                 document.querySelector('.phons_br .phon') ||
                 document.querySelector('.pron .phon.br') ||
                 document.querySelector('.phon');
  if (phonBr) out.phonetic_br = phonBr.innerText.trim();

  const phonUs = document.querySelector('.phonetics .phons_n_am .phon') ||
                 document.querySelector('.phons_n_am .phon') ||
                 document.querySelector('.pron .phon.us');
  if (phonUs) out.phonetic_us = phonUs.innerText.trim();

  // Audio: many pages put audio in .sound with data-src-mp3 or data-src-ogg or <source>
  const tryAudio = (rootSelector) => {
    const root = document.querySelector(rootSelector);
    if (!root) return '';
    // data-src-mp3 attribute (common)
    const btn = root.querySelector('.sound.audio_play_button') || root.querySelector('.sound');
    if (btn) {
      const mp3 = btn.getAttribute('data-src-mp3') || btn.getAttribute('data-src-ogg') || btn.getAttribute('data-src');
      if (mp3) return mp3;
    }
    // <audio><source src=...>
    const a = root.querySelector('audio source');
    if (a && a.src) return a.src;
    return '';
  };

  out.audio_br = tryAudio('.phons_br') || tryAudio('.phons-br') || '';
  out.audio_us = tryAudio('.phons_n_am') || tryAudio('.phons-us') || '';

  // Definitions and examples — Oxford uses .sense .def and examples .examples .ex or .x
  const defs = [];
  // cover both top-level senses and nested senses
  const defNodes = document.querySelectorAll('.sense .def, .sn .def, .def');
  defNodes.forEach(d => {
    const txt = d.innerText.trim();
    if (txt) defs.push(txt);
  });
  out.definitions = Array.from(new Set(defs)).slice(0, 20); // dedupe, limit to reduce size

  const examples = [];
  const exNodes = document.querySelectorAll('.sense .examples .ex, .examples .ex, .example, .x, .eg, .examples li');
  exNodes.forEach(e => {
    const txt = e.innerText.trim();
    if (txt) examples.push(txt);
  });
  out.examples = Array.from(new Set(examples)).slice(0, 30);

  return out;
};

(async () => {
  console.log(`Start crawling letter '${LETTER}' — total links: ${links.length}`);
  const browser = await puppeteer.launch(LAUNCH_OPTIONS);
  const page = await browser.newPage();

  // speed up: block images/styles/fonts
  try {
    await page.setRequestInterception(true);
    page.on('request', req => {
      const t = req.resourceType();
      if (t === 'image' || t === 'stylesheet' || t === 'font') req.abort();
      else req.continue();
    });
  } catch (e) {
    console.warn('Request interception setup failed (ignored).', e.message);
  }

  // set reasonable timeouts
  page.setDefaultNavigationTimeout(PAGE_OPTIONS.gotoTimeout);
  page.setDefaultTimeout(60000);

  for (let i = 0; i < links.length; i++) {
    const url = links[i];
    if (!url || seen.has(url)) continue;

    let attempt = 0;
    let success = false;
    let record = null;

    while (attempt <= RETRY_LIMIT && !success) {
      attempt++;
      try {
        console.log(`[${LETTER}] (${i + 1}/${links.length}) [try ${attempt}] ${url}`);
        await page.goto(url, { timeout: PAGE_OPTIONS.gotoTimeout, waitUntil: PAGE_OPTIONS.waitUntil });

        // give a short wait for render
        await sleep(300);

        // evaluate
        const data = await page.evaluate(scrapeScript);

        record = {
          url,
          ...data,
          crawled_at: new Date().toISOString()
        };

        // push and save immediately (incremental)
        results.push(record);
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf8');

        // mark seen to skip next runs
        seen.add(url);

        success = true;
        // polite delay
        await sleep(DELAY_BETWEEN);
      } catch (err) {
        console.warn(`Error scraping ${url} (attempt ${attempt}):`, err.message);
        if (attempt > RETRY_LIMIT) {
          console.warn(`→ Skipping ${url} after ${attempt} attempts.`);
          // save an error record so you know it failed
          record = {
            url,
            error: err.message,
            crawled_at: new Date().toISOString()
          };
          results.push(record);
          fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf8');
          seen.add(url);
        } else {
          // small backoff before retry
          await sleep(1000 * attempt);
        }
      }
    } // while retry
  } // for links

  console.log(`Crawling letter '${LETTER}' finished. Saved ${results.length} items to ${OUTPUT_FILE}`);
  await browser.close();
})();
