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
  const response = await page.goto('http://localhost:3000/id/contact-us', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('\n--- Response Status ---');
  console.log(response.status(), response.statusText());

  const html = await page.content();
  if (html.includes('__nuxt_error__') || html.includes('500')) {
    console.log('\n--- Error Page HTML (first 1000 chars) ---');
    console.log(html.substring(0, 1000));
  }

  await browser.close();
})();
