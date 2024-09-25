const puppeteer = require('puppeteer');
 
async function captureWebsite(url, filename) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
 
  // ウェブサイトを開く
  await page.goto(url);
 
  // 画面のサイズを取得
  const { width, height } = await page.evaluate(() => {
    // ほとんどのサイトは1920のFull HDディスプレイの横幅をなんとなく意識している。
    return { width: Math.round((document.body.scrollWidth + 1920)/2), height: document.body.scrollHeight };
  });
 
  // 画面全体をキャプチャー
  await page.setViewport({ width, height });
  await page.screenshot({ path: filename });
 
  await browser.close();
}
 
 
const args = process.argv;
if (args.length < 4) {
    process.exit() 
}
 
const capture_url = args[2];
console.log(capture_url);
const capture_filename = args[3];
console.log(capture_filename);
 
captureWebsite(capture_url, capture_filename)