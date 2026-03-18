const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  console.log('Navigating...');
  await page.goto('http://localhost:3000/id', { waitUntil: 'networkidle' });
  
  // Wait longer for content to render
  await page.waitForTimeout(5000);
  
  // Take screenshot
  await page.screenshot({ path: 'C:/Users/hunte/AppData/Local/Temp/esperion-waited.png', fullPage: false });
  console.log('Screenshot saved');
  
  await browser.close();
})();
