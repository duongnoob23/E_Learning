const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

/* ================= CONFIG ================= */
const OUTPUT_DIR = "./study4_part/part6";
const LESSON_IDS = [
  6548
];


const LESSON_URL_TEMPLATE =
  "https://study4.com/courses/28/complete-toeic/learn/activities/{ID}/";


/* ============ PREPARE FOLDER ============== */
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log("📁 Created study4_data folder");
}
/* ========================================= */

/* ============ LOAD COOKIES ================ */
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
  console.log("🍪 Cookies loaded");
}
/* ========================================= */

/* ============ CRAWL LESSON CONTENT ========= */
async function crawlLessonContent(page) {
  return await page.evaluate(() => {
    const block = document.querySelector(".contentblock");
    if (!block) return null;

    const title = block.querySelector("h1")?.innerText.trim() || "";

    // clone để giữ nguyên HTML
    const clone = block.cloneNode(true);

    // remove script (an toàn)
    clone.querySelectorAll("script").forEach(e => e.remove());

    return {
      title,
      content_html: clone.innerHTML.trim()
    };
  });
}
/* ========================================= */

/* ============ CRAWL YOUTUBE IFRAME ========= */
async function crawlYoutubeIframe(page) {
  return await page.evaluate(() => {
    const iframe = document.querySelector('iframe[src*="youtube.com/embed"]');
    if (!iframe) return null;

    const src = iframe.getAttribute("src") || "";
    const match = src.match(/embed\/([^?]+)/);
    const videoId = match ? match[1] : "";

    return {
      type: "youtube",
      video_id: videoId,
      embed_url: `https://www.youtube.com/embed/${videoId}`,
      watch_url: `https://www.youtube.com/watch?v=${videoId}`,
      title: iframe.getAttribute("title") || "",
      width: iframe.getAttribute("width") || "",
      height: iframe.getAttribute("height") || ""
    };
  });
}
/* ========================================= */

/* ================= MAIN =================== */
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });

  const page = await browser.newPage();
  await loadCookies(page);

  for (const lessonId of LESSON_IDS) {
    const lessonUrl = LESSON_URL_TEMPLATE.replace("{ID}", lessonId);
    console.log(`🌐 Crawling lesson ${lessonId}...`);

    try {
      await page.goto(lessonUrl, {
        waitUntil: "networkidle2",
        timeout: 60000
      });

      const lesson = await crawlLessonContent(page);
      if (!lesson) {
        console.log(`⚠️ Lesson ${lessonId}: Không tìm thấy .contentblock`);
        continue;
      }

      const video = await crawlYoutubeIframe(page);

      const result = {
        lesson_id: lessonId,
        url: lessonUrl,
        title: lesson.title,
        content_html: lesson.content_html,
        video
      };

      const safeName = lesson.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");

      const outFile = path.join(
        OUTPUT_DIR,
        `lesson_${lessonId}_${safeName}.json`
      );

      fs.writeFileSync(outFile, JSON.stringify(result, null, 2), "utf8");
      console.log(`✅ Saved → ${outFile}`);

    } catch (err) {
      console.log(`❌ Lỗi lesson ${lessonId}:`, err.message);
    }
  }

  await browser.close();
})();

