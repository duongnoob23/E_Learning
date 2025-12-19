const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = "./study4_data";
const STUDY4_MAX_PAGE = 2;

// tạo folder output
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log("📁 Created study4_data directory");
}

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

  await loadCookies(page);

  const base = `https://study4.com/flashcards/lists/${listId}/`;

  // check login
  await page.goto(base, { waitUntil: "networkidle2" });
  if (await page.$('a[href="/accounts/login/"]')) {
    console.log("❌ Cookies hết hạn.");
    await browser.close();
    return;
  }

  console.log("🔑 Login OK!");

  const allItems = [];

  for (let p = 1; p <= STUDY4_MAX_PAGE; p++) {
    const url = `${base}?page=${p}`;
    console.log(`\n➡ Crawling page ${p}`);

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await autoScroll(page);

    const items = await page.evaluate(() => {
      const cards = document.querySelectorAll(".termlist-item.contentblock");
      const data = [];

      cards.forEach(card => {
        const h2 = card.querySelector("h2.h3");

        const word = h2?.childNodes[0]?.nodeValue?.trim() || "";
        const pos = h2?.querySelector("span:nth-of-type(1)")?.innerText.trim() || "";
        const ipa = h2?.querySelector("span:nth-of-type(2)")?.innerText.trim() || "";

        const image =
          card.querySelector(".termlist-item-images img")?.getAttribute("src") || "";

        const audios = Array.from(h2?.querySelectorAll("audio source") || []);
        const audio_uk = audios[0]?.getAttribute("src") || "";
        const audio_us = audios[1]?.getAttribute("src") || "";

        const meaningRaw =
          card.querySelector(".prewrap")?.innerText.trim() || "";
        const [meaning_vi, meaning_en] = meaningRaw.split("=");

        const examples = Array.from(
          card.querySelectorAll(".termlist-item-examples li")
        ).map(li => ({
          text: li.innerText.trim(),
          audio: li.querySelector("audio source")?.getAttribute("src") || ""
        }));

        data.push({
          word,
          pos,
          ipa,
          image,
          audio_uk,
          audio_us,
          meaning_vi: meaning_vi?.trim() || "",
          meaning_en: meaning_en?.trim() || "",
          examples
        });
      });

      return data;
    });

    if (items.length === 0) {
      console.log("⚠ Không còn dữ liệu → dừng.");
      break;
    }

    console.log(`   → Found ${items.length} items`);
    allItems.push(...items);
  }

  const outFile = path.join(OUTPUT_DIR, `list_${listId}.json`);
  fs.writeFileSync(outFile, JSON.stringify(allItems, null, 2), "utf8");

  console.log(`\n🎉 DONE! Tổng ${allItems.length} từ → ${outFile}`);
  await browser.close();
}

// RUN
(async () => {
  for (let listId = 45116; listId <= 4511616; listId++) {
    console.log(`\n==============================`);
    console.log(`🚀 START listId = ${listId}`);
    console.log(`==============================`);

    try {
      await crawlStudy4(listId);
    } catch (err) {
      console.error(`❌ Error with listId ${listId}:`, err.message);
    }

    // nghỉ 3–5s để tránh bị block
    await new Promise(r => setTimeout(r, 4000));
  }

  console.log("\n🎉 ALL LISTS DONE!");
})();

