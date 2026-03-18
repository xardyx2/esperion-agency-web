import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  })
  const page = await context.newPage()

  const consoleErrors = []

  // Capture console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push({
        url: page.url(),
        message: msg.text(),
        location: msg.location()
      })
    }
  })

  page.on('pageerror', (error) => {
    consoleErrors.push({
      url: page.url(),
      message: error.message,
      type: 'pageerror'
    })
  })

  console.log('=== Testing Article Detail Page ===')

  // Test 1: Articles
  console.log('Navigating to /id/articles...')
  await page.goto('http://localhost:3000/id/articles', { waitUntil: 'domcontentloaded', timeout: 60000 })
  console.log('Page loaded, waiting for content...')
  await page.waitForTimeout(5000)
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => console.log('Networkidle timeout, continuing...'))

  // Close Vite error overlay if present
  const errorOverlay = await page.$('vite-error-overlay')
  if (errorOverlay) {
    console.log('Found Vite error overlay, dismissing...')
    await errorOverlay.evaluate(el => el.remove())
    await page.waitForTimeout(1000)
  }

  // Check for console errors before proceeding
  console.log(`Console errors so far: ${consoleErrors.length}`)
  consoleErrors.forEach(e => console.log(`  - ${e.message}`))

  // Find and click first "Baca Selengkapnya" button
  const articleCards = await page.$$('.group')
  console.log(`Found ${articleCards.length} article cards`)

  if (articleCards.length > 0) {
    const firstCard = articleCards[0]
    let bacaSelengkapnya = await firstCard.$('a')

    // Try finding button with text "Baca Selengkapnya"
    if (!bacaSelengkapnya) {
      bacaSelengkapnya = await firstCard.$('button, [role="button"], a[href*="articles"]')
    }

    // Try clicking the card itself if it's wrapped in a link
    if (!bacaSelengkapnya) {
      const parentLink = await firstCard.$$('xpath=..//a')
      if (parentLink.length > 0) {
        bacaSelengkapnya = parentLink[0]
      }
    }

    if (bacaSelengkapnya) {
      console.log('Clicking first article...')
      await bacaSelengkapnya.click()
      await page.waitForTimeout(3000)
      await page.waitForLoadState('networkidle')

      // Take screenshot
      await page.screenshot({
        path: 'test-article-detail.png',
        fullPage: false
      })
      console.log('✓ Article detail screenshot saved')
      console.log(`Current URL: ${page.url()}`)
    } else {
      console.log('✗ No link found in first article card')
    }
  } else {
    console.log('✗ No article cards found')
  }

  console.log('\n=== Testing Portfolio/Works Detail Page ===')

  // Test 2: Works
  console.log('Navigating to /id/our-works...')
  await page.goto('http://localhost:3000/id/our-works', { waitUntil: 'domcontentloaded', timeout: 60000 })
  console.log('Page loaded, waiting for content...')
  await page.waitForTimeout(5000)
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => console.log('Networkidle timeout, continuing...'))

  // Close Vite error overlay if present
  const errorOverlay2 = await page.$('vite-error-overlay')
  if (errorOverlay2) {
    console.log('Found Vite error overlay, dismissing...')
    await errorOverlay2.evaluate(el => el.remove())
    await page.waitForTimeout(1000)
  }

  console.log(`Console errors so far: ${consoleErrors.length}`)

  // Find and click first portfolio item
  const workCards = await page.$$('.group, .work-card, [class*="work"], [class*="portfolio"]')
  console.log(`Found ${workCards.length} work cards`)

  if (workCards.length > 0) {
    const firstWork = workCards[0]
    let workLink = await firstWork.$('a')

    if (!workLink) {
      workLink = await firstWork.$('button, [role="button"], a[href*="our-works"]')
    }

    if (!workLink) {
      const parentLink = await firstWork.$$('xpath=..//a')
      if (parentLink.length > 0) {
        workLink = parentLink[0]
      }
    }

    if (workLink) {
      console.log('Clicking first work item...')
      await workLink.click()
      await page.waitForTimeout(3000)
      await page.waitForLoadState('networkidle')

      // Take screenshot
      await page.screenshot({
        path: 'test-works-detail.png',
        fullPage: false
      })
      console.log('✓ Works detail screenshot saved')
      console.log(`Current URL: ${page.url()}`)
    } else {
      console.log('✗ No link found in first work card')
    }
  } else {
    console.log('✗ No work cards found')
  }

  console.log('\n=== Testing Services Detail Page ===')

  // Test 3: Services
  console.log('Navigating to /id/our-services...')
  await page.goto('http://localhost:3000/id/our-services', { waitUntil: 'domcontentloaded', timeout: 60000 })
  console.log('Page loaded, waiting for content...')
  await page.waitForTimeout(5000)
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => console.log('Networkidle timeout, continuing...'))

  // Close Vite error overlay if present
  const errorOverlay3 = await page.$('vite-error-overlay')
  if (errorOverlay3) {
    console.log('Found Vite error overlay, dismissing...')
    await errorOverlay3.evaluate(el => el.remove())
    await page.waitForTimeout(1000)
  }

  console.log(`Console errors so far: ${consoleErrors.length}`)

  // Find and click first service item
  const serviceCards = await page.$$('.group, .service-card, [class*="service"]')
  console.log(`Found ${serviceCards.length} service cards`)

  if (serviceCards.length > 0) {
    const firstService = serviceCards[0]
    let serviceLink = await firstService.$('a')

    if (!serviceLink) {
      serviceLink = await firstService.$('button, [role="button"], a[href*="our-services"]')
    }

    if (!serviceLink) {
      const parentLink = await firstService.$$('xpath=..//a')
      if (parentLink.length > 0) {
        serviceLink = parentLink[0]
      }
    }

    if (serviceLink) {
      console.log('Clicking first service...')
      await serviceLink.click()
      await page.waitForTimeout(3000)
      await page.waitForLoadState('networkidle')

      // Take screenshot
      await page.screenshot({
        path: 'test-services-detail.png',
        fullPage: false
      })
      console.log('✓ Services detail screenshot saved')
      console.log(`Current URL: ${page.url()}`)
    } else {
      console.log('✗ No link found in first service card')
    }
  } else {
    console.log('✗ No service cards found')
  }

  // Report console errors
  console.log('\n=== Console Errors Report ===')
  if (consoleErrors.length === 0) {
    console.log('✓ No console errors detected!')
  } else {
    console.log(`✗ Found ${consoleErrors.length} console error(s):`)
    consoleErrors.forEach((error, index) => {
      console.log(`\n[${index + 1}] ${error.type || 'console.error'}`)
      console.log(`URL: ${error.url}`)
      console.log(`Message: ${error.message}`)
      if (error.location) {
        console.log(`Location: ${error.location.url || ''}:${error.location.lineNumber || ''}:${error.location.columnNumber || ''}`)
      }
    })
  }

  await browser.close()
  console.log('\n=== Testing Complete ===')
})()
