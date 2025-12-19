const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  if (fs.existsSync("cookies.json")) {
    const cookies = JSON.parse(fs.readFileSync("cookies.json", "utf8"));
    await page.setCookie(...cookies);
  }

  const problemIds = [
    405234, 405235, 405236, 405237, 405238,
    405239, 405240, 405241, 405242, 405243,
    405244, 405245, 405246, 405247, 405248,
    405249, 405250, 405251, 405252
  ];

  const results = [];

  for (const id of problemIds) {
    const url = `https://study4.com/problems/${id}/?view=embed`;
    console.log("➡ Crawling", url);

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });

    await page.waitForFunction(
      () => document.querySelector(".problem-mcq-question"),
      { timeout: 0 }
    );

    const data = await page.evaluate(() => {
      const q = document.querySelector(".problem-mcq-question");
      return {
        qnum: q.dataset.qnum,
        correct: q.dataset.correct,
        question: q.querySelector(".problem-mcq-context")?.innerText.trim(),
        answers: [...q.querySelectorAll(".problem-mcq-answer label")].map(l =>
          l.innerText.trim()
        ),
        explanation:
          q.querySelector(".problem-mcq-explanation")?.innerText.trim() || null,
      };
    });

    results.push(data);
  }

  fs.writeFileSync(
    "problemset_2771.json",
    JSON.stringify(results, null, 2)
  );

  console.log("✅ DONE:", results.length, "questions");
  await browser.close();
})();
