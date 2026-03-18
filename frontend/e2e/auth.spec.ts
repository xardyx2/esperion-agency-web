import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('user can logout', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password')
    await page.click('button[type="submit"]')

    // Logout
    await page.click('[data-testid="logout-button"]')
    await expect(page).toHaveURL('/')
  })
})
