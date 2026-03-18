import { test, expect } from '@playwright/test'

test.describe('Frontend Issue Reproduction', () => {
  let consoleErrors: string[] = []

  test.beforeEach(async ({ page }) => {
    consoleErrors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    await page.goto('http://localhost:3001/id')
    await page.waitForLoadState('networkidle')
  })

  test('Dark mode toggle - 5 cycle test', async ({ page }) => {
    const results = []

    for (let i = 1; i <= 5; i++) {
      consoleErrors = []

      // Get current theme
      const html = page.locator('html')
      const beforeClass = await html.getAttribute('class') || ''
      const beforeTheme = beforeClass.includes('dark') ? 'dark' : 'light'

      // Find and click toggle
      const toggle = page.locator('[data-testid="theme-toggle"], button:has-text("Dark"), button:has-text("Light"), .theme-toggle, [aria-label*="theme"], [aria-label*="mode"]')
      const toggleCount = await toggle.count()

      if (toggleCount === 0) {
        // Try to find any button that might be theme toggle
        const buttons = page.locator('button')
        const buttonCount = await buttons.count()
        results.push({
          cycle: i,
          status: 'FAIL',
          error: `No toggle found. Total buttons: ${buttonCount}`
        })
        continue
      }

      await toggle.first().click()
      await page.waitForTimeout(1000)

      // Check if theme changed
      const afterClass = await html.getAttribute('class') || ''
      const afterTheme = afterClass.includes('dark') ? 'dark' : 'light'

      results.push({
        cycle: i,
        before: beforeTheme,
        after: afterTheme,
        changed: beforeTheme !== afterTheme,
        consoleErrors: [...consoleErrors],
        url: page.url()
      })

      // Navigate between pages
      if (i < 5) {
        if (i % 2 === 1) {
          await page.click('a:has-text("About"), a[href*="about"]')
        } else {
          await page.click('a:has-text("Services"), a[href*="services"]')
        }
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(500)
      }
    }

    console.log('=== DARK MODE TEST RESULTS ===')
    console.log(JSON.stringify(results, null, 2))

    // Check if toggle failed
    const failedCycles = results.filter(r => !r.changed && r.before !== undefined)
    if (failedCycles.length > 0) {
      console.log(`TOGGLE FAILED at cycle ${failedCycles[0].cycle}`)
    }
  })

  test('Language switcher test', async ({ page }) => {
    await page.goto('http://localhost:3001/id')
    await page.waitForLoadState('networkidle')

    const initialUrl = page.url()
    console.log(`Initial URL: ${initialUrl}`)

    // Find language switcher
    const langSwitcher = page.locator('[data-testid="lang-switcher"], button:has-text("EN"), button:has-text("ID"), .lang-switcher, [aria-label*="language"], select[id*="lang"]')
    const count = await langSwitcher.count()

    console.log(`Language switcher elements found: ${count}`)

    if (count === 0) {
      // Try to find any dropdown or button
      const allButtons = await page.locator('button').count()
      console.log(`Total buttons on page: ${allButtons}`)
    }

    // Try to click and switch to English
    await langSwitcher.first().click()
    await page.waitForTimeout(1000)

    // Look for English option
    const enOption = page.locator('button:has-text("EN"), a:has-text("EN"), option[value="en"]')
    const enCount = await enOption.count()

    if (enCount > 0) {
      await enOption.first().click()
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
    }

    const finalUrl = page.url()
    console.log(`Final URL: ${finalUrl}`)
    console.log(`URL changed: ${initialUrl !== finalUrl}`)
    console.log(`Contains /en/: ${finalUrl.includes('/en/')}`)
  })

  test('Service detail page test', async ({ page }) => {
    await page.goto('http://localhost:3001/id/our-services')
    await page.waitForLoadState('networkidle')

    console.log('=== SERVICE DETAIL PAGE TEST ===')
    console.log(`URL: ${page.url()}`)

    // Find service cards
    const cards = page.locator('[data-testid="service-card"], .service-card, a[href*="our-services"]')
    const cardCount = await cards.count()
    console.log(`Service cards found: ${cardCount}`)

    if (cardCount === 0) {
      // Try any card-like element
      const allLinks = await page.locator('a').count()
      console.log(`Total links on page: ${allLinks}`)
    }

    if (cardCount > 0) {
      const href = await cards.first().getAttribute('href')
      console.log(`First card href: ${href}`)

      await cards.first().click()
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      console.log(`After click URL: ${page.url()}`)
      console.log(`Page title: ${await page.title()}`)

      // Check if page loaded or error
      const body = page.locator('body')
      const bodyText = await body.innerText()
      console.log(`Page content length: ${bodyText.length}`)
      console.log(`Contains 404: ${bodyText.includes('404')}`)
      console.log(`Contains error: ${bodyText.toLowerCase().includes('error')}`)
    }
  })

  test('Article detail page test', async ({ page }) => {
    await page.goto('http://localhost:3001/id/articles')
    await page.waitForLoadState('networkidle')

    console.log('=== ARTICLE DETAIL PAGE TEST ===')
    console.log(`URL: ${page.url()}`)

    // Find article cards
    const cards = page.locator('[data-testid="article-card"], .article-card, a[href*="articles"]')
    const cardCount = await cards.count()
    console.log(`Article cards found: ${cardCount}`)

    if (cardCount > 0) {
      const href = await cards.first().getAttribute('href')
      console.log(`First card href: ${href}`)

      await cards.first().click()
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      console.log(`After click URL: ${page.url()}`)
      console.log(`Page title: ${await page.title()}`)

      const body = page.locator('body')
      const bodyText = await body.innerText()
      console.log(`Page content length: ${bodyText.length}`)
    }
  })

  test('localStorage colorMode check', async ({ page }) => {
    await page.goto('http://localhost:3001/id')
    await page.waitForLoadState('networkidle')

    // Check initial localStorage
    const initialColorMode = await page.evaluate(() => localStorage.getItem('colorMode'))
    console.log(`Initial colorMode: ${initialColorMode}`)

    // Click dark mode
    const toggle = page.locator('button[aria-label*="theme"], button[aria-label*="mode"], .theme-toggle')
    await toggle.first().click()
    await page.waitForTimeout(1000)

    // Check localStorage after toggle
    const afterColorMode = await page.evaluate(() => localStorage.getItem('colorMode'))
    console.log(`After toggle colorMode: ${afterColorMode}`)

    // Navigate and check persistence
    await page.click('a:has-text("About"), a[href*="about"]')
    await page.waitForLoadState('networkidle')

    const persistedColorMode = await page.evaluate(() => localStorage.getItem('colorMode'))
    console.log(`After navigation colorMode: ${persistedColorMode}`)
  })
})
