const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const OXFORD_DIR = "./output";
const STUDY4_MAX_PAGE = 30;

// Cache file Oxford
const oxfordCache = {};

async function loadCookies(page) {
  const cookies = JSON.parse(fs.readFileSync("cookies.json", "utf8"));
  for (const ck of cookies) {
    await page.setCookie({
      name: ck.name,
      value: ck.value,
      domain: ck.domain,
      path: ck.path,
      httpOnly: ck.httpOnly,
      secure: ck.secure,
      sameSite: ck.sameSite || "Lax"
    });
  }
  console.log("🍪 Cookies loaded!");
}

// Load file Oxford theo chữ cái
function loadOxfordFile(letter) {
  const filePath = path.join(OXFORD_DIR, `${letter}.json`);

  if (!oxfordCache[letter]) {
    if (fs.existsSync(filePath)) {
      oxfordCache[letter] = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } else {
      oxfordCache[letter] = [];
    }
  }
  return oxfordCache[letter];
}

function saveOxfordFile(letter) {
  const filePath = path.join(OXFORD_DIR, `${letter}.json`);
  fs.writeFileSync(filePath, JSON.stringify(oxfordCache[letter], null, 2), "utf8");
}

// Merge dữ liệu Study4 vào Oxford
function mergeEntry(ox, st) {
  return {
    ...ox,
    pos: st.pos || ox.pos,
    ipa: st.ipa || ox.ipa,
    audio: ox.audio,
    meaning_vi: st.meaning_vi || ox.meaning_vi,
    examples_vi: st.examples || ox.examples_vi,
    image: st.image || ox.image
  };
}

function mergeIntoOxford(studyItem) {
  const letter = studyItem.word[0]?.toLowerCase();
  if (!letter || letter < "a" || letter > "z") return;

  const oxList = loadOxfordFile(letter);
  const idx = oxList.findIndex(item => {
  if (!item || !item.word || !studyItem.word) return false;
  return item.word.toLowerCase() === studyItem.word.toLowerCase();
});


  if (idx >= 0) {
    oxList[idx] = mergeEntry(oxList[idx], studyItem);
  } else {
    oxList.push(studyItem);
  }

  saveOxfordFile(letter);
  console.log(`✔ merged: ${studyItem.word}`);
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let total = 0;
      const distance = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        total += distance;
        if (total >= document.body.scrollHeight - 600) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

async function crawlStudy4(listId) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Load cookies vào browser
  await loadCookies(page);

  const base = `https://study4.com/flashcards/lists/${listId}/`;

  // Kiểm tra login
  await page.goto(base, { waitUntil: "networkidle2" });
  if (await page.$('a[href="/accounts/login/"]')) {
    console.log("❌ Cookies hết hạn hoặc không hợp lệ.");
    await browser.close();
    return;
  }

  console.log("🔑 Login bằng cookies OK!");

  // Crawl 30 trang tối đa
  for (let p = 1; p <= STUDY4_MAX_PAGE; p++) {
    const url = `${base}?page=${p}`;
    console.log(`\n➡ Crawling page ${p}: ${url}`);

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await autoScroll(page);

    // Đếm số từ
    const count = await page.evaluate(() =>
      document.querySelectorAll(".termlist-item.contentblock").length
    );

    console.log(`   → Found ${count} items`);
    if (count === 0) {
      console.log("⚠ Empty page → stop.");
      break;
    }

    // Lấy dữ liệu trang này
    const items = await page.evaluate(() => {
      const nodes = document.querySelectorAll(".termlist-item.contentblock");
      const arr = [];

      nodes.forEach(card => {
        const h2 = card.querySelector("h2.h3");

        const word = h2?.childNodes[0]?.nodeValue?.trim() || "";
        const pos = h2?.querySelector("span:nth-of-type(1)")?.innerText.trim() || "";
        const ipa = h2?.querySelector("span:nth-of-type(2)")?.innerText.trim() || "";
        const meaning_vi = card.querySelector(".prewrap")?.innerText.trim() || "";
        const examples = Array.from(card.querySelectorAll(".termlist-item-examples li"))
          .map(li => li.innerText.trim());
        const image = card.querySelector(".termlist-item-images img")?.getAttribute("src") || "";

        arr.push({ word, pos, ipa, meaning_vi, examples, image });
      });

      return arr;
    });

    // Merge từng từ vào Oxford
    for (const item of items) {
      mergeIntoOxford(item);
    }
  }

  console.log("\n🎉 DONE — đã merge vào Oxford files");
  await browser.close();
}

// Run
(async () => {
  const listId = 499; // sửa ID list tại đây
  await crawlStudy4(listId);
})();
