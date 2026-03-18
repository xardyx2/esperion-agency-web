const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Checking DevTools in browser...\n')

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  })

  const page = await browser.newPage()

  // Capture ALL console messages
  page.on('console', (msg) => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`)
  })

  // Capture errors
  page.on('pageerror', (err) => {
    console.log(`[PAGE ERROR] ${err.message}`)
  })

  try {
    console.log('Opening http://localhost:3000...')
    await page.goto('http://localhost:3000')
    await page.waitForTimeout(5000)

    console.log('\n🎮 Pressing Shift+Alt+D to open DevTools...')
    await page.keyboard.press('Shift+Alt+D')

    // Wait longer for DevTools
    await page.waitForTimeout(8000)

    // Check for DevTools UI
    const devtoolsPanel = await page.locator('.nuxt-devtools, [class*="devtools"]').count()
    console.log(`\n📊 DevTools elements found: ${devtoolsPanel}`)

    // Check iframe
    const iframes = await page.locator('iframe').all()
    console.log(`🖼️  Total iframes: ${iframes.length}`)

    for (let i = 0; i < iframes.length; i++) {
      const src = await iframes[i].getAttribute('src')
      const visible = await iframes[i].isVisible()
      console.log(`  Frame ${i}: ${src?.substring(0, 80)}... [${visible ? 'visible' : 'hidden'}]`)
    }

    // Try to access DevTools iframe content
    const devtoolsFrame = page.locator('iframe').first()
    if (await devtoolsFrame.isVisible().catch(() => false)) {
      const frame = await devtoolsFrame.contentFrame()
      if (frame) {
        const text = await frame.locator('body').textContent().catch(() => 'No text')
        console.log('\n📝 DevTools frame content preview:', text.substring(0, 200))

        if (text.includes('Connected')) {
          console.log('✅ DevTools is CONNECTED!')
        } else if (text.includes('Disconnected')) {
          console.log('❌ DevTools is DISCONNECTED')
        }
      }
    }

    // Screenshot
    await page.screenshot({ path: 'devtools-final.png', fullPage: true })
    console.log('\n📸 Screenshot saved: devtools-final.png')

    console.log('\n⏳ Keeping browser open for 15 seconds...')
    await page.waitForTimeout(15000)
  } catch (e) {
    console.error('Error:', e)
  } finally {
    await browser.close()
    console.log('Done!')
  }
})()
