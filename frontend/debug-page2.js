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
    console.log(`[PAGE ERROR STACK] ${error.stack}`);
  });

  // Capture request failures
  page.on('requestfailed', request => {
    console.log(`[REQUEST FAILED] ${request.url()} - ${request.failure().errorText}`);
  });

  // Capture response errors
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`[RESPONSE ERROR] ${response.status()} ${response.url()}`);
    }
  });

  console.log('Navigating to http://localhost:3000...');
  const response = await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  console.log(`Response status: ${response.status()}`);
  console.log(`Response status text: ${response.statusText()}`);

  // Wait a bit for any client-side errors
  await page.waitForTimeout(3000);

  // Get page info
  const title = await page.title();
  const html = await page.content();

  console.log('\n--- Page Info ---');
  console.log('Title:', title);
  console.log('HTML length:', html.length);

  // Check if there's a 500 error page
  if (html.includes('500') && html.includes('Internal Server Error')) {
    console.log('\n--- 500 Error Page Content (first 1000 chars) ---');
    console.log(html.substring(0, 1000));
  }

  await browser.close();
})();
