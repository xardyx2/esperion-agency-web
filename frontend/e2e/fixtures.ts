import { test as base, type Page, expect } from '@playwright/test'

/**
 * Custom fixtures for Esperion E2E tests
 */
export interface Fixtures {
  // Add custom fixtures here
}

export interface CustomPage extends Page {
  login: (email?: string, password?: string) => Promise<void>
  logout: () => Promise<void>
  switchLanguage: (lang: 'en' | 'id') => Promise<void>
  fillContactForm: (data: { fullName: string, email: string, description: string }) => Promise<void>
}

// Extend the test context
export const test = base.extend<Fixtures>({
  // Add custom fixtures here if needed
})

// Re-export expect for convenience
export { expect }

/**
 * Helper to create a page with custom methods
 */
export function extendPage(page: Page): CustomPage {
  return Object.assign(page, {
    async login(email = 'test@example.com', password = 'password123') {
      await page.goto('/login')
      const emailInput = page.locator('input[name="email"], input[type="email"], input[id="email"]').first()
      const passwordInput = page.locator('input[name="password"], input[type="password"]').first()
      await emailInput.fill(email)
      await passwordInput.fill(password)
      const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first()
      await submitButton.click()
      await page.waitForURL('**/dashboard', { timeout: 15000 }).catch(() => {})
    },

    async logout() {
      const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout"), a:has-text("Logout")').first()
      if (await logoutButton.isVisible().catch(() => false)) {
        await logoutButton.click()
        await page.waitForURL('**/')
      }
    },

    async switchLanguage(lang: 'en' | 'id') {
      const langSwitcher = page.locator('[data-testid="lang-switcher"], button:has-text("EN"), button:has-text("ID")').first()
      await langSwitcher.click()
      await page.waitForTimeout(500)
    },

    async fillContactForm(data: { fullName: string, email: string, description: string }) {
      await page.goto('/contact-us')
      await page.fill('input[name="full_name"], input[id="full_name"]', data.fullName)
      await page.fill('input[name="email"], input[type="email"]', data.email)
      await page.fill('textarea[name="description"], textarea[id="description"]', data.description)
      await page.click('button[type="submit"], button:has-text("Submit")')
    }
  })
}
