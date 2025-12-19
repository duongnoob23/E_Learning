const puppeteer = require("puppeteer");
const fs = require("fs");

const URL =
  "https://study4.com/courses/28/complete-toeic/learn/activities/7385/";

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  // 🍪 Load cookies
  if (fs.existsSync("cookies.json")) {
    const cookies = JSON.parse(fs.readFileSync("cookies.json"));
    await page.setCookie(...cookies);
    console.log("🍪 Cookies loaded");
  }

  // 🚀 Load page
  await page.goto(URL, { waitUntil: "domcontentloaded" });

  // ⏳ Chờ danh sách câu hỏi (PAGE CHA)
  await page.waitForSelector(".problemset-problem-number.jqchange-problem", {
    timeout: 60000
  });

  const buttons = await page.$$(".problemset-problem-number.jqchange-problem");
  console.log("🔢 Total questions:", buttons.length);

  const results = [];

  for (let i = 0; i < buttons.length; i++) {
    console.log(`➡ Crawling question ${i + 1}`);

    // 👉 Click câu hỏi
    await buttons[i].click();

    // ⏳ Chờ iframe có src
    await page.waitForFunction(() => {
      const iframe = document.querySelector("iframe.problem-iframe");
      return iframe && iframe.src && iframe.src.length > 10;
    }, { timeout: 60000 });

    // 🎯 Lấy iframe
    const iframeHandle = await page.$("iframe.problem-iframe");
    const frame = await iframeHandle.contentFrame();

    // ⏳ Chờ nội dung câu hỏi TRONG iframe
    await frame.waitForSelector(".problem-mcq-question", { timeout: 60000 });

    const data = await frame.evaluate(() => {
      const root = document.querySelector(".problem-mcq-question");
      if (!root) return null;

      return {
        question_id: root.dataset.qnum,
        correct: root.dataset.correct,
        question: root.querySelector(".problem-mcq-context span")?.innerText,
        answers: [...root.querySelectorAll(".problem-mcq-answer label")].map(l => ({
          key: l.innerText.trim()[0],
          text: l.innerText.trim().slice(3)
        })),
        explanation:
          root.querySelector(".problem-mcq-explanation")?.innerText || ""
      };
    });

    if (data) results.push(data);

    await sleep(300);
  }

  fs.writeFileSync(
    "study4_activity.json",
    JSON.stringify(results, null, 2),
    "utf8"
  );

  console.log("✅ DONE – Crawl thành công toàn bộ");
  await browser.close();
})();
