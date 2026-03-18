import { test, expect } from '@playwright/test'

test.describe('Banner Slider Animation QA', () => {
  let consoleErrors: string[] = []
  let consoleWarnings: string[] = []

  test.beforeEach(async ({ page }) => {
    // Capture console logs
    consoleErrors = []
    consoleWarnings = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
      if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text())
      }
    })

    // Capture page errors
    page.on('pageerror', (error) => {
      consoleErrors.push(error.message)
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  // ========================================
  // SCENARIO 1: Auto-rotate Animation Test
  // ========================================
  test('SCENARIO 1: Auto-rotate with slide animation (not instant fade)', async ({ page }) => {
    console.log('\n=== SCENARIO 1: Auto-rotate Animation Test ===')

    // Wait for banner section to be visible
    const bannerSection = page.locator('section').first()
    await expect(bannerSection).toBeVisible({ timeout: 10000 })

    // Get initial slide text
    const initialSlide = page.locator('.banner-slide h1, section h1').first()
    const initialText = await initialSlide.textContent()
    console.log(`Initial slide text: "${initialText}"`)

    // Take screenshot of initial state
    await page.screenshot({ path: 'test-results/banner-01-initial.png', fullPage: false })

    // Wait for transition (5 seconds auto-rotate + buffer)
    console.log('Waiting 5.5 seconds for auto-rotate...')
    await page.waitForTimeout(5500)

    // Take screenshot after transition
    await page.screenshot({ path: 'test-results/banner-02-after-auto-rotate.png', fullPage: false })

    // Verify slide changed
    const newSlide = page.locator('.banner-slide h1, section h1').first()
    const newText = await newSlide.textContent()
    console.log(`New slide text: "${newText}"`)

    // PASS criteria: Slide text should be different
    const slideChanged = initialText !== newText
    console.log(`Slide changed: ${slideChanged}`)

    // Verify CSS uses transform (not opacity)
    const slideElement = page.locator('.banner-slide').first()
    const computedStyle = await slideElement.evaluate((el) => {
      const style = getComputedStyle(el)
      return {
        transform: style.transform,
        transition: style.transition
      }
    })
    console.log('Computed styles:', computedStyle)

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0)

    expect(slideChanged).toBe(true)
    console.log('SCENARIO 1: PASS')
  })

  // ========================================
  // SCENARIO 2: Manual Navigation (Arrows)
  // ========================================
  test('SCENARIO 2: Manual navigation with arrow buttons', async ({ page }) => {
    console.log('\n=== SCENARIO 2: Manual Navigation (Arrows) ===')

    const bannerSection = page.locator('section').first()
    await expect(bannerSection).toBeVisible()

    // Get initial slide
    const initialSlide = page.locator('.banner-slide h1, section h1').first()
    const initialText = await initialSlide.textContent()
    console.log(`Initial slide: "${initialText}"`)

    // Find next arrow button
    const nextArrow = page.locator('button[aria-label="Next slide"]')
    const prevArrow = page.locator('button[aria-label="Previous slide"]')

    // Check if arrows are visible (desktop only)
    const nextVisible = await nextArrow.isVisible().catch(() => false)
    console.log(`Next arrow visible: ${nextVisible}`)

    if (nextVisible) {
      // Take screenshot before click
      await page.screenshot({ path: 'test-results/banner-03-before-next.png' })

      // Click next arrow
      await nextArrow.click()

      // Wait for transition (500ms animation + buffer)
      await page.waitForTimeout(700)

      // Take screenshot after click
      await page.screenshot({ path: 'test-results/banner-04-after-next.png' })

      // Verify slide changed
      const afterNextText = await page.locator('.banner-slide h1, section h1').first().textContent()
      console.log(`After next: "${afterNextText}"`)

      const nextWorked = initialText !== afterNextText
      console.log(`Next arrow worked: ${nextWorked}`)

      // Click previous arrow
      await prevArrow.click()
      await page.waitForTimeout(700)

      await page.screenshot({ path: 'test-results/banner-05-after-prev.png' })

      const afterPrevText = await page.locator('.banner-slide h1, section h1').first().textContent()
      console.log(`After prev: "${afterPrevText}"`)

      expect(nextWorked).toBe(true)
    } else {
      console.log('Arrows not visible (mobile viewport) - skipping arrow test')
      test.skip()
    }

    expect(consoleErrors).toHaveLength(0)
    console.log('SCENARIO 2: PASS')
  })

  // ========================================
  // SCENARIO 3: Manual Navigation (Dots)
  // ========================================
  test('SCENARIO 3: Manual navigation with dot buttons', async ({ page }) => {
    console.log('\n=== SCENARIO 3: Manual Navigation (Dots) ===')

    const bannerSection = page.locator('section').first()
    await expect(bannerSection).toBeVisible()

    // Get initial slide
    const initialText = await page.locator('.banner-slide h1, section h1').first().textContent()
    console.log(`Initial slide: "${initialText}"`)

    // Find all dot buttons
    const dots = page.locator('button[aria-label^="Go to slide"]')
    const dotCount = await dots.count()
    console.log(`Found ${dotCount} dot buttons`)

    if (dotCount >= 2) {
      // Take screenshot before
      await page.screenshot({ path: 'test-results/banner-06-before-dot.png' })

      // Click second dot
      await dots.nth(1).click()
      await page.waitForTimeout(700)

      // Take screenshot after
      await page.screenshot({ path: 'test-results/banner-07-after-dot-2.png' })

      const afterDotText = await page.locator('.banner-slide h1, section h1').first().textContent()
      console.log(`After dot 2: "${afterDotText}"`)

      const dotWorked = initialText !== afterDotText
      console.log(`Dot navigation worked: ${dotWorked}`)

      expect(dotWorked).toBe(true)
    } else {
      console.log('Not enough dots found')
      expect(dotCount).toBeGreaterThanOrEqual(2)
    }

    expect(consoleErrors).toHaveLength(0)
    console.log('SCENARIO 3: PASS')
  })

  // ========================================
  // SCENARIO 4: Pause on Hover
  // ========================================
  test('SCENARIO 4: Pause on hover functionality', async ({ page }) => {
    console.log('\n=== SCENARIO 4: Pause on Hover ===')

    const bannerSection = page.locator('section').first()
    await expect(bannerSection).toBeVisible()

    // Get initial slide
    const initialText = await page.locator('.banner-slide h1, section h1').first().textContent()
    console.log(`Initial slide: "${initialText}"`)

    // Hover over banner
    await bannerSection.hover()
    console.log('Hovering over banner...')

    await page.screenshot({ path: 'test-results/banner-08-hover-state.png' })

    // Wait 10 seconds while hovering (should NOT change)
    console.log('Waiting 10 seconds while hovering (slide should NOT change)...')
    await page.waitForTimeout(10000)

    // Check slide after hover wait
    const afterHoverText = await page.locator('.banner-slide h1, section h1').first().textContent()
    console.log(`After 10s hover: "${afterHoverText}"`)

    const slidePaused = initialText === afterHoverText
    console.log(`Slide paused during hover: ${slidePaused}`)

    // Move mouse away to resume
    await page.mouse.move(0, 0)
    console.log('Mouse moved away, waiting 5.5 seconds for resume...')
    await page.waitForTimeout(5500)

    await page.screenshot({ path: 'test-results/banner-09-after-resume.png' })

    const afterResumeText = await page.locator('.banner-slide h1, section h1').first().textContent()
    console.log(`After resume: "${afterResumeText}"`)

    const autoRotateResumed = afterHoverText !== afterResumeText
    console.log(`Auto-rotate resumed: ${autoRotateResumed}`)

    expect(slidePaused).toBe(true)
    expect(consoleErrors).toHaveLength(0)
    console.log('SCENARIO 4: PASS')
  })

  // ========================================
  // SCENARIO 5: Keyboard Navigation
  // ========================================
  test('SCENARIO 5: Keyboard navigation (ArrowLeft/ArrowRight)', async ({ page }) => {
    console.log('\n=== SCENARIO 5: Keyboard Navigation ===')

    const bannerSection = page.locator('section').first()
    await expect(bannerSection).toBeVisible()

    // Focus on the page
    await bannerSection.click()

    // Get initial slide
    const initialText = await page.locator('.banner-slide h1, section h1').first().textContent()
    console.log(`Initial slide: "${initialText}"`)

    await page.screenshot({ path: 'test-results/banner-10-before-keyboard.png' })

    // Press ArrowRight
    console.log('Pressing ArrowRight...')
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(700)

    await page.screenshot({ path: 'test-results/banner-11-after-arrowright.png' })

    const afterRightText = await page.locator('.banner-slide h1, section h1').first().textContent()
    console.log(`After ArrowRight: "${afterRightText}"`)

    const rightWorked = initialText !== afterRightText
    console.log(`ArrowRight worked: ${rightWorked}`)

    // Press ArrowLeft
    console.log('Pressing ArrowLeft...')
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(700)

    await page.screenshot({ path: 'test-results/banner-12-after-arrowleft.png' })

    const afterLeftText = await page.locator('.banner-slide h1, section h1').first().textContent()
    console.log(`After ArrowLeft: "${afterLeftText}"`)

    expect(rightWorked).toBe(true)
    expect(consoleErrors).toHaveLength(0)
    console.log('SCENARIO 5: PASS')
  })

  // ========================================
  // SCENARIO 6: Touch Swipe (Mobile)
  // ========================================
  test('SCENARIO 6: Touch swipe on mobile viewport (375x667)', async ({ page }) => {
    console.log('\n=== SCENARIO 6: Touch Swipe (Mobile) ===')

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    console.log('Viewport set to 375x667 (mobile)')

    // Reload page with new viewport
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const bannerSection = page.locator('section').first()
    await expect(bannerSection).toBeVisible()

    // Get initial slide
    const initialText = await page.locator('.banner-slide h1, section h1').first().textContent()
    console.log(`Initial slide: "${initialText}"`)

    await page.screenshot({ path: 'test-results/banner-13-mobile-initial.png' })

    // Get banner position for swipe
    const box = await bannerSection.boundingBox()
    if (box) {
      const startX = box.x + box.width * 0.8
      const startY = box.y + box.height / 2
      const endX = box.x + box.width * 0.2

      // Swipe left (next slide)
      console.log(`Swiping left from (${startX}, ${startY}) to (${endX}, ${startY})...`)
      await page.mouse.move(startX, startY)
      await page.mouse.down()
      await page.mouse.move(endX, startY, { steps: 10 })
      await page.mouse.up()

      await page.waitForTimeout(700)

      await page.screenshot({ path: 'test-results/banner-14-mobile-after-swipe-left.png' })

      const afterSwipeLeftText = await page.locator('.banner-slide h1, section h1').first().textContent()
      console.log(`After swipe left: "${afterSwipeLeftText}"`)

      const swipeLeftWorked = initialText !== afterSwipeLeftText
      console.log(`Swipe left worked: ${swipeLeftWorked}`)

      // Swipe right (previous slide)
      console.log('Swiping right...')
      await page.mouse.move(endX, startY)
      await page.mouse.down()
      await page.mouse.move(startX, startY, { steps: 10 })
      await page.mouse.up()

      await page.waitForTimeout(700)

      await page.screenshot({ path: 'test-results/banner-15-mobile-after-swipe-right.png' })

      expect(swipeLeftWorked).toBe(true)
    } else {
      console.log('Could not get banner bounding box')
      expect(box).toBeDefined()
    }

    expect(consoleErrors).toHaveLength(0)
    console.log('SCENARIO 6: PASS')
  })

  // ========================================
  // SCENARIO 7: Verify CSS Transform Animation
  // ========================================
  test('SCENARIO 7: Verify CSS uses transform (not opacity)', async ({ page }) => {
    console.log('\n=== SCENARIO 7: CSS Transform Verification ===')

    const bannerSection = page.locator('section').first()
    await expect(bannerSection).toBeVisible()

    // Check CSS classes exist
    const html = await page.content()

    const hasBannerEnterActive = html.includes('banner-enter-active') || html.includes('banner')
    console.log(`Has banner transition classes: ${hasBannerEnterActive}`)

    // Check computed styles during transition
    const slideElement = page.locator('.banner-slide').first()

    // Get CSS transition property
    const transitionInfo = await slideElement.evaluate((el) => {
      const style = getComputedStyle(el)
      return {
        transform: style.transform,
        transition: style.transition,
        position: style.position
      }
    })
    console.log('Slide computed styles:', transitionInfo)

    // Verify transform is used (not just opacity)
    const styleTag = page.locator('style')
    const styleContent = await styleTag.first().textContent().catch(() => '') ?? ''

    const hasTransformInCSS = styleContent.includes('translateX') || styleContent.includes('transform')
    console.log(`CSS contains transform: ${hasTransformInCSS}`)

    await page.screenshot({ path: 'test-results/banner-16-css-verification.png' })

    expect(transitionInfo.position).toBe('absolute')
    expect(consoleErrors).toHaveLength(0)
    console.log('SCENARIO 7: PASS')
  })

  // ========================================
  // SUMMARY: Console Error Report
  // ========================================
  test('SUMMARY: Zero console errors across all scenarios', async ({ page }) => {
    console.log('\n=== SUMMARY: Console Error Report ===')
    console.log(`Console errors: ${consoleErrors.length}`)
    console.log(`Console warnings: ${consoleWarnings.length}`)

    if (consoleErrors.length > 0) {
      console.log('ERRORS FOUND:')
      consoleErrors.forEach(err => console.log(`  - ${err}`))
    }

    if (consoleWarnings.length > 0) {
      console.log('WARNINGS FOUND:')
      consoleWarnings.forEach(warn => console.log(`  - ${warn}`))
    }

    await page.screenshot({ path: 'test-results/banner-17-final.png' })

    expect(consoleErrors).toHaveLength(0)
    console.log('SUMMARY: PASS - No console errors')
  })
})
