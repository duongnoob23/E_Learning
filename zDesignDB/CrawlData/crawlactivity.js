const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

/* ========== CONFIG ========== */
const COURSE_ID = 28;
const OUTPUT_DIR = "./study4_part/part7";

const ACTIVITY_IDS = [
  7351,
  7352,
  7381,
  7630,
  7631,
  7382,
  7353,
  7358,
  7360,
  7356,
  7359,
  7357,
  7361,
  7354,
  7355
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

      /* STEP 2: DETECT PROBLEM SET TYPE */
      const problemSetInfo = await page.evaluate(() => {
        // Dạng cũ: có iframe .learncourse-iframe
        const oldIframe = document.querySelector(".learncourse-iframe");
        if (oldIframe && oldIframe.src) {
          return {
            type: "old",
            problemSetUrl: oldIframe.src
          };
        }
        
        // Dạng mới: có iframe .problem-iframe và problem IDs trên cùng trang
        const newIframe = document.querySelector(".problem-iframe");
        if (newIframe) {
          const problemIds = [...document.querySelectorAll(
            ".problemset-problem-number[data-problem_id], .jqchange-problem[data-problem_id]"
          )].map(el => Number(el.dataset.problem_id));
          
          if (problemIds.length > 0) {
            return {
              type: "new",
              problemIds: problemIds
            };
          }
        }
        
        return null;
      });

      if (!problemSetInfo) {
        console.log("⚠️ Không tìm thấy problem-set → skip");
        continue;
      }

      let problemIds;

      if (problemSetInfo.type === "old") {
        /* STEP 3: OPEN PROBLEM SET (dạng cũ) */
        console.log("📋 Dạng bài tập cũ (iframe)");
        await page.goto(problemSetInfo.problemSetUrl, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });

        /* STEP 4: GET PROBLEM IDS (dạng cũ) */
        problemIds = await page.evaluate(() => {
          return [...document.querySelectorAll(
            ".problemset-problem-number[data-problem_id]"
          )].map(el => Number(el.dataset.problem_id));
        });
      } else {
        /* Dạng mới: problem IDs đã có sẵn trên trang */
        console.log("📋 Dạng bài tập mới (trực tiếp)");
        problemIds = problemSetInfo.problemIds;
      }

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

          const problemData = await page.evaluate(() => {
            // Lấy tất cả các câu hỏi trong trang
            const allQuestions = document.querySelectorAll(".problem-mcq-question");
            if (!allQuestions || allQuestions.length === 0) return null;

            // Tìm CONTEXT CHUNG (loại mới: nhiều questions cùng context)
            let sharedContextEl = document.querySelector(".problem-mcq-context-wrapper .problem-mcq-context") ||
                                 document.querySelector(".problem-mcq-data-left .problem-mcq-context");
            
            // Kiểm tra xem có phải loại context chung không
            const hasSharedContext = !!sharedContextEl;

            // AUDIO (chung cho cả problem)
            const audioEl = document.querySelector("audio source");
            const audio = audioEl ? audioEl.getAttribute("src") : null;

            // TRANSCRIPT (chung)
            const transcriptEl = document.querySelector(".problem-mcq-script");
            const transcript = transcriptEl
              ? transcriptEl.innerText.trim()
              : null;

            // TRANSLATION (chung - có thể trong collapse)
            let translationEl = document.querySelector(".problem-mcq-translation");
            // Nếu translation trong collapse, cần lấy từ collapse content
            if (!translationEl) {
              const collapseEl = document.querySelector("#mcq-translation");
              if (collapseEl) {
                translationEl = collapseEl.querySelector(".problem-mcq-translation");
              }
            }
            const translation = translationEl
              ? translationEl.innerText.trim()
              : null;

            // IMAGES (từ context chung nếu có)
            const sharedImages = sharedContextEl
              ? [...sharedContextEl.querySelectorAll("img")].map(img =>
                  img.getAttribute("src")
                )
              : [];

            // Context text và HTML (chung)
            const sharedQuestionText = sharedContextEl?.innerText.trim() || "";
            const sharedQuestionHtml = sharedContextEl?.innerHTML.trim() || "";

            // Xử lý từng câu hỏi
            const questions = [];
            
            for (const q of allQuestions) {
              // Nếu có context chung, dùng chung; nếu không, tìm context riêng
              let contextEl = sharedContextEl;
              let question_text = sharedQuestionText;
              let question_html = sharedQuestionHtml;
              let images = sharedImages;

              // Nếu không có context chung, thử lấy từ question riêng (loại cũ)
              if (!contextEl) {
                contextEl = q.querySelector(".problem-mcq-context");
                if (contextEl) {
                  question_text = contextEl.innerText.trim() || "";
                  question_html = contextEl.innerHTML.trim() || "";
                  images = [...contextEl.querySelectorAll("img")].map(img =>
                    img.getAttribute("src")
                  );
                }
              }

              // Lấy explanation (có thể trong collapse)
              let explanationEl = q.querySelector(".problem-mcq-explanation");
              if (!explanationEl) {
                const qnum = q.dataset.qnum;
                const collapseId = `mcq-explanation-${qnum}`;
                const collapseEl = document.querySelector(`#${collapseId}`);
                if (collapseEl) {
                  explanationEl = collapseEl.querySelector(".problem-mcq-explanation");
                }
              }

              const questionData = {
                qnum: q.dataset.qnum,
                correct: q.dataset.correct,

                // Context (chung hoặc riêng tùy loại)
                question_text: question_text,
                question_html: question_html,
                
                // Audio, transcript, translation (chung)
                audio: audio,
                transcript: transcript,
                translation: translation,
                images: images,

                // Đáp án riêng cho từng câu
                answers: [...q.querySelectorAll(".problem-mcq-answer label")].map(l =>
                  l.innerText.trim()
                ),

                // Explanation riêng cho từng câu
                explanation: explanationEl?.innerText.trim() || null
              };

              questions.push(questionData);
            }

            // Nếu chỉ có 1 question, trả về object đơn (tương thích với code cũ)
            // Nếu có nhiều questions, trả về array
            return questions.length === 1 ? questions[0] : questions;
          });

          // Xử lý kết quả
          if (problemData) {
            if (Array.isArray(problemData)) {
              // Nhiều câu hỏi trong một problem
              questions.push(...problemData);
              console.log(`  ✓ Crawled ${problemData.length} questions from problem ${pid}`);
            } else {
              // Một câu hỏi (tương thích với code cũ)
              questions.push(problemData);
            }
          }

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
