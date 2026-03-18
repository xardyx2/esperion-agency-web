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
    if (error.stack) {
      console.log(`[PAGE ERROR STACK] ${error.stack.substring(0, 500)}`);
    }
  });

  // Capture response with error
  page.on('response', async response => {
    if (response.status() >= 400) {
      console.log(`[RESPONSE ERROR] ${response.status()} ${response.url()}`);
      try {
        const text = await response.text();
        if (text.includes('NuxtError') || text.includes('__nuxt_error__')) {
          console.log('[ERROR PAGE HTML]:', text.substring(0, 1000));
        }
      } catch (e) {}
    }
  });

  console.log('Navigating to http://localhost:3000/id...');
  await page.goto('http://localhost:3000/id', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Get error from Nuxt
  const nuxtError = await page.evaluate(() => {
    return window.__nuxt_error__ || window.$nuxt?.payload?.error;
  });

  if (nuxtError) {
    console.log('[NUXT ERROR]:', JSON.stringify(nuxtError, null, 2));
  }

  // Get page HTML to look for error details
  const html = await page.content();
  const errorMatch = html.match(/window\.__NUXT__=(\{.*?\});/);
  if (errorMatch) {
    try {
      const nuxtData = JSON.parse(errorMatch[1]);
      if (nuxtData.error) {
        console.log('[NUXT DATA ERROR]:', JSON.stringify(nuxtData.error, null, 2));
      }
    } catch (e) {}
  }

  await browser.close();
})();
