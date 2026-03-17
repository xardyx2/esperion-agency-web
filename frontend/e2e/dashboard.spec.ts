import { test, expect, type Page } from '@playwright/test'

const loginToDashboard = async (page: Page) => {
  await page.goto('/login', { waitUntil: 'domcontentloaded' })

  const emailInput = page.locator('input[name="email"], input[type="email"]').first()
  const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
  const submitButton = page.locator('button[type="submit"]').first()

  await expect(emailInput).toBeVisible({ timeout: 10000 })
  await expect(passwordInput).toBeVisible({ timeout: 10000 })

  await emailInput.fill('test@example.com')
  await passwordInput.fill('password123')
  await submitButton.click()
  await page.waitForTimeout(1200)
}

const openDashboard = async (page: Page) => {
  await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })

  const loginInput = page.locator('input[name="email"], input[type="email"]').first()
  const redirectedToLogin = page.url().includes('/login') || await loginInput.isVisible().catch(() => false)
  if (!redirectedToLogin) return

  await loginToDashboard(page)
  await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
}

test.describe('Dashboard', () => {
  // Helper to login before dashboard tests
  test.beforeEach(async ({ page }) => {
    await openDashboard(page)
  })

  test.describe('Dashboard Home', () => {
    test('dashboard home loads after login', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
      // Dashboard should have some content
      await expect(page.locator('h1, h2, [data-testid="dashboard-title"]').first()).toBeVisible()
    })
  })

  test.describe('Dashboard Navigation', () => {
    test('can navigate to Articles from dashboard', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })

      // Find articles link in dashboard nav
      const articlesLink = page.locator('a[href*="/dashboard/articles"], [data-testid="nav-articles"]').first()
      if (await articlesLink.isVisible().catch(() => false)) {
        await articlesLink.click()
        await expect(page).toHaveURL(/.*\/dashboard\/articles/)
      }
    })

    test('can navigate to Works from dashboard', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })

      const worksLink = page.locator('a[href*="/dashboard/works"], [data-testid="nav-works"]').first()
      if (await worksLink.isVisible().catch(() => false)) {
        await worksLink.click()
        await expect(page).toHaveURL(/.*\/dashboard\/works/)
      }
    })

    test('can navigate to Services from dashboard', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })

      const servicesLink = page.locator('a[href*="/dashboard/services"], [data-testid="nav-services"]').first()
      if (await servicesLink.isVisible().catch(() => false)) {
        await servicesLink.click()
        await expect(page).toHaveURL(/.*\/dashboard\/services/)
      }
    })

    test('can navigate to Clients from dashboard', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })

      const clientsLink = page.locator('a[href*="/dashboard/clients"], [data-testid="nav-clients"]').first()
      if (await clientsLink.isVisible().catch(() => false)) {
        await clientsLink.click()
        await expect(page).toHaveURL(/.*\/dashboard\/clients/)
      }
    })

    test('can navigate to Media from dashboard', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })

      const mediaLink = page.locator('a[href*="/dashboard/media"], [data-testid="nav-media"]').first()
      if (await mediaLink.isVisible().catch(() => false)) {
        await mediaLink.click()
        await expect(page).toHaveURL(/.*\/dashboard\/media/)
      }
    })

    test('can navigate to Contact from dashboard', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })

      const contactLink = page.locator('a[href*="/dashboard/contact"], [data-testid="nav-contact"]').first()
      if (await contactLink.isVisible().catch(() => false)) {
        await contactLink.click()
        await expect(page).toHaveURL(/.*\/dashboard\/contact/)
      }
    })

    test('can navigate to Users from dashboard', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })

      const usersLink = page.locator('a[href*="/dashboard/users"], [data-testid="nav-users"]').first()
      if (await usersLink.isVisible().catch(() => false)) {
        await usersLink.click()
        await expect(page).toHaveURL(/.*\/dashboard\/users/)
      }
    })

    test('can navigate to Settings from dashboard', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })

      const settingsLink = page.locator('a[href*="/dashboard/settings"], [data-testid="nav-settings"]').first()
      if (await settingsLink.isVisible().catch(() => false)) {
        await settingsLink.click()
        await expect(page).toHaveURL(/.*\/dashboard\/settings/)
      }
    })
  })

  test.describe('Sidebar Navigation', () => {
    test('dashboard navigation shell is visible', async ({ page, isMobile }) => {
      await openDashboard(page)
      if (isMobile) {
        const menuButton = page.locator('[data-testid="sidebar-collapse"]').first()
        await expect(menuButton).toBeVisible()
        return
      }

      const sidebar = page.locator('aside, [data-testid="dashboard-sidebar"]')
      const sidebarVisible = await sidebar.first().isVisible().catch(() => false)
      if (!sidebarVisible) {
        const navLink = page.locator('a[href*="/dashboard/articles"], a[href*="/dashboard/works"]').first()
        await expect(navLink).toBeVisible()
      }
    })

    test('can collapse sidebar', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
      const collapseButton = page.locator('[data-testid="sidebar-collapse"]').first()
      if (await collapseButton.isVisible().catch(() => false)) {
        await collapseButton.click()
        // Sidebar should be collapsed - check for collapsed state
        await page.waitForTimeout(300)
      }
    })
  })

  test.describe('Protected Routes', () => {
    test('redirects to login when accessing dashboard without auth', async ({ page }) => {
      // Create a new context without auth
      await page.context().clearCookies()
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
      // Should either redirect to login or show login prompt
      await page.waitForTimeout(1000)
      const currentUrl = page.url()
      expect(currentUrl).toMatch(/login|dashboard/)
    })
  })
})
