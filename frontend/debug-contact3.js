const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  console.log('Navigating...');
  try {
    await page.goto('http://localhost:3000/id/contact-us', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000);
    
    const title = await page.title();
    console.log('\n--- Page Title ---');
    console.log(title);
    
    const html = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
    console.log('\n--- Body HTML (first 500 chars) ---');
    console.log(html);
  } catch (e) {
    console.log('Error:', e.message);
  }

  await browser.close();
})();
