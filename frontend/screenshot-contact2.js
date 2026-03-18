const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  console.log('Navigating...');
  await page.goto('http://localhost:3000/id/contact-us', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Wait for Vue to hydrate
  await page.waitForTimeout(5000);
  
  const title = await page.title();
  console.log('\n--- Page Title ---');
  console.log(title);
  
  // Take screenshot
  await page.screenshot({ path: 'C:/Users/hunte/AppData/Local/Temp/esperion-contact2.png' });
  console.log('\nScreenshot saved');

  await browser.close();
})();
