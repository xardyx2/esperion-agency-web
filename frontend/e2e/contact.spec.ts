import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test('user can submit contact form', async ({ page }) => {
    await page.goto('/contact-us')
    await page.fill('[name="full_name"]', 'John Doe')
    await page.fill('[name="email"]', 'john@example.com')
    await page.fill('[name="description"]', 'Test inquiry')
    await page.click('button[type="submit"]')
    await expect(page.locator('.success-message')).toBeVisible()
  })
})
