import { chromium } from 'playwright'

async function testDevtools() {
  console.log('🚀 Opening browser to test Nuxt DevTools...\n')

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  })

  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // Navigate to localhost:3000
    console.log('📍 Navigating to http://localhost:3000...')
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')

    console.log('✅ Page loaded:', await page.title())
    console.log('   URL:', page.url())

    // Wait a bit
    await page.waitForTimeout(3000)

    // Try to open DevTools using Shift+Alt+D
    console.log('\n🎮 Pressing Shift+Alt+D to open DevTools...')
    await page.keyboard.press('Shift+Alt+D')
    await page.waitForTimeout(3000)

    // Check if DevTools iframe exists or error page
    const devtoolsIframe = await page.locator('iframe[src*="devtools"]').count()
    const errorMessage = await page.locator('text=/refused|error|can\'t|unable/i').count()

    console.log('\n📊 Results:')
    console.log('   - DevTools iframe found:', devtoolsIframe > 0)
    console.log('   - Error messages found:', errorMessage)

    // Check page console for errors
    const consoleLogs = []
    page.on('console', msg => consoleLogs.push(msg.text()))
    page.on('pageerror', err => consoleLogs.push(`Error: ${err.message}`))

    await page.waitForTimeout(2000)

    // Get screenshot
    await page.screenshot({ path: 'devtools-test.png', fullPage: true })
    console.log('\n📸 Screenshot saved: devtools-test.png')

    // Check if there's any connection refused error in the page
    const pageContent = await page.content()
    if (pageContent.includes('refused') || pageContent.includes('ERR_CONNECTION_REFUSED')) {
      console.log('\n❌ FOUND: "localhost refused to connect" error')
    } else {
      console.log('\n✅ No obvious "refused to connect" error found in page')
    }

    // List all iframes
    const iframes = await page.locator('iframe').all()
    console.log(`\n🖼️  Total iframes on page: ${iframes.length}`)

    for (let i = 0; i < iframes.length; i++) {
      const src = await iframes[i].getAttribute('src')
      console.log(`   - iframe ${i + 1}: ${src || 'no src'}`)
    }

    // Wait for user to see
    console.log('\n⏳ Waiting 10 seconds so you can see the page...')
    await page.waitForTimeout(10000)
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await browser.close()
    console.log('\n👋 Browser closed')
  }
}

testDevtools()
