import { test, expect } from '@playwright/test'

test.describe('Dashboard Redesign', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@esperion.id')
    await page.fill('input[type="password"]', 'password')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard')
  })

  test.describe('Dashboard Shell', () => {
    test('should display dashboard header with all elements', async ({ page }) => {
      await expect(page.locator('[data-testid="dashboard-sidebar"]')).toBeVisible()
      await expect(page.locator('text=New')).toBeVisible() // Quick create
      await expect(page.locator('text=Visit Site')).toBeVisible()
      await expect(page.locator('[data-testid="language-switcher"]')).toBeVisible()
    })

    test('should toggle sidebar collapse', async ({ page }) => {
      const sidebar = page.locator('[data-testid="dashboard-sidebar"]')
      await expect(sidebar).toBeVisible()
      
      await page.click('[data-testid="sidebar-collapse"]')
      await expect(sidebar).toHaveClass(/collapsed/)
    })

    test('should open command palette with keyboard shortcut', async ({ page }) => {
      await page.keyboard.press('Control+k')
      await expect(page.locator('text=Search commands, pages, actions...')).toBeVisible()
      
      // Close with escape
      await page.keyboard.press('Escape')
      await expect(page.locator('text=Search commands, pages, actions...')).not.toBeVisible()
    })

    test('should switch language', async ({ page }) => {
      await page.click('[data-testid="language-switcher"]')
      await page.click('text=English')
      await expect(page).toHaveURL(/\/en\/dashboard/)
    })

    test('should display user menu with avatar', async ({ page }) => {
      await page.click('[data-testid="user-menu"]')
      await expect(page.locator('text=My Profile')).toBeVisible()
      await expect(page.locator('text=Sessions')).toBeVisible()
      await expect(page.locator('text=Settings')).toBeVisible()
      await expect(page.locator('text=Log out')).toBeVisible()
    })
  })

  test.describe('Navigation', () => {
    test('should navigate to all dashboard sections', async ({ page }) => {
      const sections = [
        { name: 'Articles', url: '/dashboard/articles' },
        { name: 'Works', url: '/dashboard/works' },
        { name: 'Services', url: '/dashboard/services' },
        { name: 'Clients', url: '/dashboard/clients' },
        { name: 'Media', url: '/dashboard/media' },
        { name: 'Contact', url: '/dashboard/contact' },
        { name: 'Users', url: '/dashboard/users' },
        { name: 'Settings', url: '/dashboard/settings' }
      ]

      for (const section of sections) {
        await page.click(`[data-testid="nav-${section.name.toLowerCase()}"]`)
        await expect(page).toHaveURL(new RegExp(section.url))
        await expect(page.locator('h1')).toContainText(section.name)
      }
    })
  })

  test.describe('Articles Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/articles')
    })

    test('should display articles table', async ({ page }) => {
      await expect(page.locator('table')).toBeVisible()
      await expect(page.locator('text=Title')).toBeVisible()
      await expect(page.locator('text=Category')).toBeVisible()
      await expect(page.locator('text=Status')).toBeVisible()
    })

    test('should filter articles by search', async ({ page }) => {
      await page.fill('[data-testid="search-input"]', 'test article')
      await expect(page.locator('table tbody tr')).toHaveCount(1)
    })

    test('should create new article', async ({ page }) => {
      await page.click('text=New Article')
      await expect(page).toHaveURL(/\/dashboard\/articles\/new/)
      await expect(page.locator('text=Create Article')).toBeVisible()
    })

    test('should show empty state when no articles', async ({ page }) => {
      // Clear all articles (mock scenario)
      await expect(page.locator('text=No articles found')).toBeVisible()
      await expect(page.locator('text=Create Article')).toBeVisible()
    })
  })

  test.describe('Quick Create Menu', () => {
    test('should open quick create dropdown', async ({ page }) => {
      await page.click('text=New')
      await expect(page.locator('text=Article')).toBeVisible()
      await expect(page.locator('text=Work')).toBeVisible()
      await expect(page.locator('text=Service')).toBeVisible()
      await expect(page.locator('text=Client')).toBeVisible()
      await expect(page.locator('text=Media')).toBeVisible()
    })

    test('should navigate to new article from quick create', async ({ page }) => {
      await page.click('text=New')
      await page.click('text=Article')
      await expect(page).toHaveURL(/\/dashboard\/articles\/new/)
    })
  })

  test.describe('Theme Switching', () => {
    test('should toggle dark mode', async ({ page }) => {
      // Check initial state
      await expect(page.locator('html')).not.toHaveClass(/dark/)
      
      // Toggle dark mode
      await page.click('[data-testid="theme-toggle"]')
      await expect(page.locator('html')).toHaveClass(/dark/)
      
      // Toggle back to light
      await page.click('[data-testid="theme-toggle"]')
      await expect(page.locator('html')).not.toHaveClass(/dark/)
    })
  })

  test.describe('Responsive Design', () => {
    test('should adapt layout for mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Sidebar should be hidden on mobile
      await expect(page.locator('[data-testid="dashboard-sidebar"]')).not.toBeVisible()
      
      // Mobile menu button should be visible
      await expect(page.locator('[data-testid="mobile-menu-btn"]')).toBeVisible()
    })

    test('should show mobile navigation menu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      await page.click('[data-testid="mobile-menu-btn"]')
      await expect(page.locator('text=Overview')).toBeVisible()
      await expect(page.locator('text=Articles')).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await expect(page.locator('[aria-label="Select language"]')).toBeVisible()
      await expect(page.locator('[aria-label="User menu"]')).toBeVisible()
      await expect(page.locator('[aria-label="Toggle theme"]')).toBeVisible()
    })

    test('should support keyboard navigation', async ({ page }) => {
      // Tab through main navigation
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // Should be able to activate with Enter
      await page.keyboard.press('Enter')
    })
  })
})
