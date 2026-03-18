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

  console.log('Navigating to http://localhost:3000/id/contact-us...');
  await page.goto('http://localhost:3000/id/contact-us', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('\n--- Console Logs ---');
  consoleLogs.forEach(log => console.log(log));
  
  console.log('\n--- Page Errors ---');
  errors.forEach(err => console.log(err));

  const title = await page.title();
  console.log('\n--- Page Title ---');
  console.log(title);

  await browser.close();
})();
