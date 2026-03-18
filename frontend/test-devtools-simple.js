const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Testing Nuxt DevTools...\n')

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  })

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  })

  const page = await context.newPage()

  // Capture console messages
  page.on('console', (msg) => {
    const type = msg.type()
    const text = msg.text()
    if (text.includes('devtools') || text.includes('refused') || text.includes('error') || type === 'error') {
      console.log(`[${type.toUpperCase()}] ${text}`)
    }
  })

  // Capture page errors
  page.on('pageerror', (err) => {
    console.log(`[PAGE ERROR] ${err.message}`)
  })

  try {
    // Navigate to the site
    console.log('📍 Opening http://localhost:3000')
    await page.goto('http://localhost:3000', { timeout: 60000 })
    await page.waitForTimeout(3000)
    console.log('✅ Page loaded')

    // Take screenshot before devtools
    await page.screenshot({ path: 'test-before-devtools.png' })

    // Try to open DevTools with keyboard shortcut
    console.log('\n🎮 Pressing Shift+Alt+D...')
    await page.keyboard.press('Shift+Alt+D')
    await page.waitForTimeout(5000)

    // Check for devtools iframe
    const devtoolsIframe = await page.locator('iframe[src*="__nuxt_devtools__"]').first()
    const hasDevtoolsIframe = await devtoolsIframe.isVisible().catch(() => false)

    // Check for connection refused error
    const pageContent = await page.content()
    const hasRefusedError = pageContent.includes('refused') || pageContent.includes('ERR_CONNECTION_REFUSED')

    console.log('\n📊 Test Results:')
    console.log('   - DevTools iframe visible:', hasDevtoolsIframe)
    console.log('   - Connection refused error:', hasRefusedError)

    // Try to find any error messages
    const errorElements = await page.locator('text=/refused to connect|unable to connect|connection refused/i').count()
    console.log('   - Error elements found:', errorElements)

    // Take screenshot after trying devtools
    await page.screenshot({ path: 'test-after-devtools.png', fullPage: true })

    if (hasRefusedError || errorElements > 0) {
      console.log('\n❌ CONFIRMED: "localhost refused to connect" error present')
    } else if (hasDevtoolsIframe) {
      console.log('\n✅ DevTools appears to be working!')
    } else {
      console.log('\n⚠️  DevTools iframe not found - might be hidden or failed to load')
    }

    // Wait so user can see
    console.log('\n⏳ Waiting 15 seconds...')
    await page.waitForTimeout(15000)
  } catch (error) {
    console.error('❌ Error:', error.message)
    await page.screenshot({ path: 'test-error.png' })
  } finally {
    await browser.close()
    console.log('\n👋 Done!')
  }
})()
