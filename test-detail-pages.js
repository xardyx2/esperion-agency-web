import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  const consoleErrors = [];
  
  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push({
        url: page.url(),
        message: msg.text(),
        location: msg.location()
      });
    }
  });
  
  page.on('pageerror', error => {
    consoleErrors.push({
      url: page.url(),
      message: error.message,
      type: 'pageerror'
    });
  });
  
  console.log('=== Testing Article Detail Page ===');
  
  // Test 1: Articles
  await page.goto('http://localhost:3000/id/articles', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Find and click first "Baca Selengkapnya" button
  const articleCards = await page.$$('.group');
  console.log(`Found ${articleCards.length} article cards`);
  
  if (articleCards.length > 0) {
    const firstCard = articleCards[0];
    const bacaSelengkapnya = await firstCard.$('a');
    
    if (bacaSelengkapnya) {
      console.log('Clicking first article...');
      await bacaSelengkapnya.click();
      await page.waitForTimeout(3000);
      await page.waitForLoadState('networkidle');
      
      // Take screenshot
      await page.screenshot({ 
        path: 'test-article-detail.png',
        fullPage: false 
      });
      console.log('✓ Article detail screenshot saved');
      console.log(`Current URL: ${page.url()}`);
    } else {
      console.log('✗ No link found in first article card');
    }
  } else {
    console.log('✗ No article cards found');
  }
  
  console.log('\n=== Testing Portfolio/Works Detail Page ===');
  
  // Test 2: Works
  await page.goto('http://localhost:3000/id/our-works', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Find and click first portfolio item
  const workCards = await page.$$('.group, .work-card, [class*="work"], [class*="portfolio"]');
  console.log(`Found ${workCards.length} work cards`);
  
  if (workCards.length > 0) {
    const firstWork = workCards[0];
    const workLink = await firstWork.$('a');
    
    if (workLink) {
      console.log('Clicking first work item...');
      await workLink.click();
      await page.waitForTimeout(3000);
      await page.waitForLoadState('networkidle');
      
      // Take screenshot
      await page.screenshot({ 
        path: 'test-works-detail.png',
        fullPage: false 
      });
      console.log('✓ Works detail screenshot saved');
      console.log(`Current URL: ${page.url()}`);
    } else {
      console.log('✗ No link found in first work card');
    }
  } else {
    console.log('✗ No work cards found');
  }
  
  console.log('\n=== Testing Services Detail Page ===');
  
  // Test 3: Services
  await page.goto('http://localhost:3000/id/our-services', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Find and click first service item
  const serviceCards = await page.$$('.group, .service-card, [class*="service"]');
  console.log(`Found ${serviceCards.length} service cards`);
  
  if (serviceCards.length > 0) {
    const firstService = serviceCards[0];
    const serviceLink = await firstService.$('a');
    
    if (serviceLink) {
      console.log('Clicking first service...');
      await serviceLink.click();
      await page.waitForTimeout(3000);
      await page.waitForLoadState('networkidle');
      
      // Take screenshot
      await page.screenshot({ 
        path: 'test-services-detail.png',
        fullPage: false 
      });
      console.log('✓ Services detail screenshot saved');
      console.log(`Current URL: ${page.url()}`);
    } else {
      console.log('✗ No link found in first service card');
    }
  } else {
    console.log('✗ No service cards found');
  }
  
  // Report console errors
  console.log('\n=== Console Errors Report ===');
  if (consoleErrors.length === 0) {
    console.log('✓ No console errors detected!');
  } else {
    console.log(`✗ Found ${consoleErrors.length} console error(s):`);
    consoleErrors.forEach((error, index) => {
      console.log(`\n[${index + 1}] ${error.type || 'console.error'}`);
      console.log(`URL: ${error.url}`);
      console.log(`Message: ${error.message}`);
      if (error.location) {
        console.log(`Location: ${error.location.url || ''}:${error.location.lineNumber || ''}:${error.location.columnNumber || ''}`);
      }
    });
  }
  
  await browser.close();
  console.log('\n=== Testing Complete ===');
})();
