const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

/* ========== CONFIG ========== */
const COURSE_ID = 28;
const OUTPUT_DIR = "./study4_part/part4";

const ACTIVITY_IDS = [
  7339,
  7340,
  7341,
  9690,
  9691,
  9692,
  7368,
  7369,
  7383,
  7371,
  7372,
  7373,
  7374,
  7375,
  7376,
  7377,
  7378,
  7379,
  7380,
  7381,
  7382
];
/* ============================ */

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log("📁 Created output folder");
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  /* ===== LOAD COOKIE ===== */
  if (fs.existsSync("cookies.json")) {
    const cookies = JSON.parse(fs.readFileSync("cookies.json", "utf8"));
    await page.setCookie(...cookies);
  }

  /* ===== LOOP ACTIVITIES ===== */
  for (const activityId of ACTIVITY_IDS) {
    const activityUrl =
      `https://study4.com/courses/${COURSE_ID}/complete-toeic/learn/activities/${activityId}/`;

    console.log(`\n📘 Activity ${activityId}`);

    try {
      /* STEP 1: OPEN ACTIVITY */
      await page.goto(activityUrl, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      /* STEP 2: GET PROBLEM SET URL */
      const problemSetUrl = await page.evaluate(() => {
        const iframe = document.querySelector(".learncourse-iframe");
        return iframe ? iframe.src : null;
      });

      if (!problemSetUrl) {
        console.log("⚠️ Không có problem-set → skip");
        continue;
      }

      /* STEP 3: OPEN PROBLEM SET */
      await page.goto(problemSetUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      /* STEP 4: GET PROBLEM IDS */
      const problemIds = await page.evaluate(() => {
        return [...document.querySelectorAll(
          ".problemset-problem-number[data-problem_id]"
        )].map(el => Number(el.dataset.problem_id));
      });

      console.log("🧩 Problems:", problemIds.length);

      /* STEP 5: CRAWL PROBLEMS */
      const questions = [];

      for (const pid of problemIds) {
        const problemUrl =
          `https://study4.com/problems/${pid}/?view=embed`;

        console.log("➡ Problem", pid);

        try {
          await page.goto(problemUrl, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
          });

          await page.waitForSelector(".problem-mcq-question", {
            timeout: 30000,
          });

          const data = await page.evaluate(() => {
            const q = document.querySelector(".problem-mcq-question");
            if (!q) return null;
          
            const contextEl = q.querySelector(".problem-mcq-context");
          
            // AUDIO
            const audioEl = document.querySelector("audio source");
            const audio = audioEl ? audioEl.getAttribute("src") : null;
          
            // TRANSCRIPT
            const transcriptEl = document.querySelector(".problem-mcq-script");
            const transcript = transcriptEl
              ? transcriptEl.innerText.trim()
              : null;
          
            // TRANSLATION
            const translationEl = document.querySelector(".problem-mcq-translation");
            const translation = translationEl
              ? translationEl.innerText.trim()
              : null;
          
            // IMAGES (có hoặc không)
            const images = contextEl
              ? [...contextEl.querySelectorAll("img")].map(img =>
                  img.getAttribute("src")
                )
              : [];
          
            return {
              qnum: q.dataset.qnum,
              correct: q.dataset.correct,
          
              audio,
              transcript,
              translation,
          
              question_text: contextEl?.innerText.trim() || "",
              question_html: contextEl?.innerHTML.trim() || "",
          
              images,
          
              answers: [...q.querySelectorAll(".problem-mcq-answer label")].map(l =>
                l.innerText.trim()
              ),
          
              explanation:
                q.querySelector(".problem-mcq-explanation")?.innerText.trim() || null
            };
          });
          

          if (data) questions.push(data);

          await new Promise(r => setTimeout(r, 1200));

        } catch (err) {
          console.log("⚠️ Skip problem", pid);
        }
      }

      /* STEP 6: SAVE FILE */
      const outFile = path.join(
        OUTPUT_DIR,
        `activity_${activityId}.json`
      );

      fs.writeFileSync(
        outFile,
        JSON.stringify(
          {
            activity_id: activityId,
            activity_url: activityUrl,
            total_questions: questions.length,
            questions,
          },
          null,
          2
        ),
        "utf8"
      );

      console.log(`✅ Saved → ${outFile}`);
      await new Promise(r => setTimeout(r, 3000));

    } catch (err) {
      console.log("❌ Activity lỗi:", activityId, err.message);
    }
  }

  await browser.close();
  console.log("\n🎉 ALL DONE");
})();
