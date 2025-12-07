const fs = require("fs");

// đọc file link đã crawl
const links = JSON.parse(fs.readFileSync("oxford_word_links.json", "utf8"));

const groups = {};

for (const link of links) {
  if (!link || typeof link !== "string") continue;

  // lấy phần cuối URL
  const parts = link.split("/");
  const wordSlug = parts.pop(); // ví dụ: abandon_1 hoặc "" nếu link kết thúc bằng /

  if (!wordSlug || wordSlug.length === 0) continue; // bỏ link rác

  // bỏ phần _1, _2...
  const pureWord = wordSlug.replace(/_[0-9]+$/, "");

  if (!pureWord || pureWord.length === 0) continue;

  const first = pureWord[0]?.toLowerCase();

  // nếu không phải chữ cái (ví dụ số, ký tự), bỏ qua
  if (!first || !/[a-z]/.test(first)) continue;

  if (!groups[first]) groups[first] = [];
  groups[first].push(link);
}

// tạo folder
if (!fs.existsSync("split_links")) {
  fs.mkdirSync("split_links");
}

// xuất file
for (const letter in groups) {
  fs.writeFileSync(
    `split_links/${letter}.json`,
    JSON.stringify(groups[letter], null, 2)
  );
  console.log(`Tạo ${letter}.json (${groups[letter].length} link)`);
}

console.log("\n🎉 DONE — Đã tách link thành 26 file thành công!");
