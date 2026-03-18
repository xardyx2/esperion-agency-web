import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  })
  const page = await context.newPage()

  const consoleErrors = []

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

  try {
    await page.goto('http://localhost:3000/id/articles', { waitUntil: 'load', timeout: 30000 })
    await page.waitForTimeout(3000)

    // Close Vite error overlay if present
    await page.evaluate(() => {
      const overlay = document.querySelector('vite-error-overlay')
      if (overlay) overlay.remove()
    })

    // Find first article and click
    const firstArticleLink = await page.$('a[href*="/id/articles/"]')
    if (firstArticleLink) {
      console.log('Found article link, clicking...')
      await firstArticleLink.click()
      await page.waitForTimeout(3000)
      await page.waitForLoadState('load')

      console.log(`Current URL: ${page.url()}`)
      await page.screenshot({ path: 'test-article-detail.png' })
      console.log('✓ Article detail screenshot saved')
    } else {
      console.log('✗ No article links found')
      await page.screenshot({ path: 'test-articles-page.png' })
    }
  } catch (error) {
    console.log(`✗ Article test failed: ${error.message}`)
    await page.screenshot({ path: 'test-article-error.png' })
  }

  console.log('\n=== Testing Portfolio/Works Detail Page ===')

  try {
    await page.goto('http://localhost:3000/id/our-works', { waitUntil: 'load', timeout: 30000 })
    await page.waitForTimeout(3000)

    await page.evaluate(() => {
      const overlay = document.querySelector('vite-error-overlay')
      if (overlay) overlay.remove()
    })

    const firstWorkLink = await page.$('a[href*="/id/our-works/"]')
    if (firstWorkLink) {
      console.log('Found work link, clicking...')
      await firstWorkLink.click()
      await page.waitForTimeout(3000)
      await page.waitForLoadState('load')

      console.log(`Current URL: ${page.url()}`)
      await page.screenshot({ path: 'test-works-detail.png' })
      console.log('✓ Works detail screenshot saved')
    } else {
      console.log('✗ No work links found')
      await page.screenshot({ path: 'test-works-page.png' })
    }
  } catch (error) {
    console.log(`✗ Works test failed: ${error.message}`)
    await page.screenshot({ path: 'test-works-error.png' })
  }

  console.log('\n=== Testing Services Detail Page ===')

  try {
    await page.goto('http://localhost:3000/id/our-services', { waitUntil: 'load', timeout: 30000 })
    await page.waitForTimeout(3000)

    await page.evaluate(() => {
      const overlay = document.querySelector('vite-error-overlay')
      if (overlay) overlay.remove()
    })

    const firstServiceLink = await page.$('a[href*="/id/our-services/"]')
    if (firstServiceLink) {
      console.log('Found service link, clicking...')
      await firstServiceLink.click()
      await page.waitForTimeout(3000)
      await page.waitForLoadState('load')

      console.log(`Current URL: ${page.url()}`)
      await page.screenshot({ path: 'test-services-detail.png' })
      console.log('✓ Services detail screenshot saved')
    } else {
      console.log('✗ No service links found')
      await page.screenshot({ path: 'test-services-page.png' })
    }
  } catch (error) {
    console.log(`✗ Services test failed: ${error.message}`)
    await page.screenshot({ path: 'test-services-error.png' })
  }

  console.log('\n=== Console Errors Report ===')
  if (consoleErrors.length === 0) {
    console.log('✓ No console errors detected!')
  } else {
    console.log(`✗ Found ${consoleErrors.length} console error(s):`)
    consoleErrors.forEach((error, i) => {
      console.log(`\n[${i + 1}] ${error.type || 'error'}`)
      console.log(`URL: ${error.url}`)
      console.log(`Message: ${error.message}`)
    })
  }

  await browser.close()
  console.log('\n=== Testing Complete ===')
  console.log('Screenshots saved to frontend/ directory')
})()
