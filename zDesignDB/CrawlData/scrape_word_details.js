const fs = require("fs");
const puppeteer = require("puppeteer");

async function scrapeWordDetail(page, url) {
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

  return await page.evaluate(() => {
    const data = {};

    // ===== 1. Từ (headword) =====
    data.word = document.querySelector("h1.headword")?.innerText || "";

    // ===== 2. Phiên âm (IPA) =====
    data.phonetic_br = document.querySelector(".phonetics .phons_br .phon")?.innerText || "";
    data.phonetic_us = document.querySelector(".phonetics .phons_n_am .phon")?.innerText || "";

    // ===== 3. Phát âm (audio link) =====
    data.audio_br =
      document.querySelector(".phons_br .sound.audio_play_button")?.getAttribute("data-src-mp3") || "";

    data.audio_us =
      document.querySelector(".phons_n_am .sound.audio_play_button")?.getAttribute("data-src-mp3") || "";

    // ===== 4. Loại từ (noun, verb...) =====
    data.pos = document.querySelector(".pos")?.innerText || "";

    // ===== 5. Nghĩa =====
    const defNodes = document.querySelectorAll(".sense .def");
    data.definitions = Array.from(defNodes).map((d) => d.innerText.trim());

    // ===== 6. Ví dụ =====
    const exNodes = document.querySelectorAll(".sense .examples .ex");
    data.examples = Array.from(exNodes).map((e) => e.innerText.trim());

    return data;
  });
}

async function main() {
  const links = JSON.parse(fs.readFileSync("oxford_word_links.json", "utf8"));
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];

  for (let i = 0; i < links.length; i++) {
    const url = links[i];
    console.log(`(${i + 1}/${links.length}) Scraping: ${url}`);

    try {
      const detail = await scrapeWordDetail(page, url);
      detail.url = url;
      results.push(detail);
    } catch (err) {
      console.log("❌ Error at:", url, err.message);
    }
  }

  // Lưu ra file JSON
  fs.writeFileSync("oxford_words_data.json", JSON.stringify(results, null, 2), "utf8");

  console.log("\n🎉 DONE! Saved to oxford_words_data.json");
  await browser.close();
}

main();
