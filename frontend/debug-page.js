const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });

  // Capture page errors
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  // Capture request failures
  page.on('requestfailed', request => {
    console.log(`[REQUEST FAILED] ${request.url()} - ${request.failure().errorText}`);
  });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Wait a bit for any client-side errors
  await page.waitForTimeout(3000);

  // Get page info
  const title = await page.title();
  const html = await page.content();

  console.log('\n--- Page Info ---');
  console.log('Title:', title);
  console.log('HTML length:', html.length);
  console.log('HTML preview (first 500 chars):', html.substring(0, 500));

  await browser.close();
})();
