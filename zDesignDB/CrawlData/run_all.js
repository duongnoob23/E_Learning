const { execSync } = require("child_process");

const letters = "pqrstuvwxyz".split("");

for (const l of letters) {
  console.log(`===== Crawling ${l} =====`);
  execSync(`node crawl_by_letter.js ${l}`, { stdio: "inherit" });
}
console.log("DONE!");
