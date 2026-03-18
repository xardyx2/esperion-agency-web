const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const errors = [];
  const consoleLogs = [];

  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    errors.push(`[PAGE ERROR] ${error.message}`);
  });

  console.log('Navigating to http://localhost:3000/id...');
  await page.goto('http://localhost:3000/id', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Get page content
  const bodyHTML = await page.evaluate(() => document.body.innerHTML.substring(0, 1000));
  
  console.log('\n--- Console Logs ---');
  consoleLogs.forEach(log => console.log(log));
  
  console.log('\n--- Page Errors ---');
  errors.forEach(err => console.log(err));
  
  console.log('\n--- Body HTML (first 1000 chars) ---');
  console.log(bodyHTML);

  await browser.close();
})();
