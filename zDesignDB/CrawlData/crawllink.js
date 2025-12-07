const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeLinks() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const baseUrl = 'https://www.oxfordlearnersdictionaries.com';
  const url = baseUrl + '/wordlists/oxford3000-5000';

  // ----------------------------------------------------
  // 1️⃣ Truy cập trang wordlist
  // ----------------------------------------------------
  await page.goto(url, { waitUntil: 'networkidle2' });

  // ----------------------------------------------------
  // 2️⃣ Lấy đúng UL có class "top-g"
  //    Sau đó lấy tất cả <a> bên trong <li>
  // ----------------------------------------------------
  const links = await page.evaluate(() => {
    const ul = document.querySelector('ul.top-g');     // đúng cấu trúc bạn gửi ảnh
    const hrefArray = [];

    if (!ul) return hrefArray; // nếu trang load chậm hoặc selector thay đổi

    ul.querySelectorAll('li a').forEach(a => {
      hrefArray.push(a.href);   // lấy đúng href của từ
    });

    return hrefArray;
  });

  // ----------------------------------------------------
  // 3️⃣ Lưu file JSON
  // ----------------------------------------------------
  fs.writeFileSync(
    'oxford_word_links.json',
    JSON.stringify(links, null, 2),
    'utf8'
  );

  console.log(`Đã lấy ${links.length} link.`);
  console.log('Lưu vào file: oxford_word_links.json');

  await browser.close();
}

scrapeLinks();
