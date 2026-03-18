const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Testing DevTools connection...\n')

  const browser = await chromium.launch({
    headless: false
  })

  const page = await browser.newPage()

  // Intercept WebSocket connections
  page.on('websocket', (ws) => {
    console.log('WebSocket created:', ws.url())

    ws.on('framesent', data => console.log('  → Sent:', data.payload))
    ws.on('framereceived', data => console.log('  ← Received:', data.payload))
    ws.on('close', () => console.log('  ✗ WebSocket closed'))
    ws.on('socketerror', err => console.log('  ✗ WebSocket error:', err))
  })

  // Log console
  page.on('console', (msg) => {
    const text = msg.text()
    if (text.includes('devtools') || text.includes('WebSocket') || text.includes('hmr') || msg.type() === 'error') {
      console.log(`[${msg.type().toUpperCase()}] ${text.slice(0, 200)}`)
    }
  })

  try {
    await page.goto('http://localhost:3000')
    await page.waitForTimeout(3000)

    console.log('\n🎮 Opening DevTools...')
    await page.keyboard.press('Shift+Alt+D')
    await page.waitForTimeout(5000)

    // Take screenshot
    await page.screenshot({ path: 'devtools-status.png', fullPage: true })
    console.log('📸 Screenshot: devtools-status.png')

    // Check devtools iframe
    const devtoolsFrame = page.locator('iframe[src*="__nuxt_devtools__"]').first()
    const hasFrame = await devtoolsFrame.isVisible().catch(() => false)

    if (hasFrame) {
      const frame = await devtoolsFrame.contentFrame()
      if (frame) {
        const frameContent = await frame.content()
        const isConnected = !frameContent.includes('Disconnected')
        console.log('\n📊 DevTools Status:', isConnected ? '✅ Connected' : '❌ Disconnected')
      }
    }

    await page.waitForTimeout(10000)
  } catch (e) {
    console.error('Error:', e)
  } finally {
    await browser.close()
  }
})()
