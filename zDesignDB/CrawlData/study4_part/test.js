const fs = require("fs");
const path = require("path");

const ACTIVITY_IDS = [
  7339, 7340, 7341, 9690, 9691, 9692,
  7368, 7369, 7383, 7371, 7372, 7373,
  7374, 7375, 7376, 7377, 7378, 7379,
  7380, 7381, 7382
];

const SOURCE_DIR = "./part4";     // folder hiện tại
const TARGET_DIR = "./part5";   // folder muốn chuyển sang

// tạo folder đích nếu chưa tồn tại
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

ACTIVITY_IDS.forEach(id => {
  const fileName = `activity_${id}.json`;
  const from = path.join(SOURCE_DIR, fileName);
  const to = path.join(TARGET_DIR, fileName);

  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
    console.log(`✅ Moved: ${fileName}`);
  } else {
    console.log(`⚠️ Not found: ${fileName}`);
  }
});
