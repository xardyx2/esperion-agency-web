const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Checking DevTools manually...\n')

  const browser = await chromium.launch({
    headless: false
  })

  const page = await browser.newPage()

  // Log all console messages
  page.on('console', (msg) => {
    console.log(`[${msg.type()}] ${msg.text()}`)
  })

  try {
    // Navigate and wait
    await page.goto('http://localhost:3000')
    await page.waitForTimeout(3000)

    // Get page HTML
    const html = await page.content()

    // Check for devtools-related content
    const hasDevtools = html.includes('__nuxt_devtools__')
    const hasDevToolsClient = html.includes('@nuxt/devtools')
    const hasDevtoolsIframe = html.includes('devtools')

    console.log('Page analysis:')
    console.log('  - Has __nuxt_devtools__:', hasDevtools)
    console.log('  - Has @nuxt/devtools:', hasDevToolsClient)
    console.log('  - Has devtools iframe:', hasDevtoolsIframe)

    // Try pressing Shift+Alt+D
    console.log('\nPressing Shift+Alt+D...')
    await page.keyboard.press('Shift+Alt+D')
    await page.waitForTimeout(3000)

    // Check for any iframe
    const iframes = await page.locator('iframe').count()
    console.log('  - Total iframes after pressing:', iframes)

    // Take screenshot
    await page.screenshot({ path: 'devtools-check.png', fullPage: true })
    console.log('  - Screenshot saved: devtools-check.png')

    // Wait to see
    await page.waitForTimeout(10000)
  } catch (e) {
    console.error('Error:', e)
  } finally {
    await browser.close()
  }
})()
