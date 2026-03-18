import { test, expect } from '@playwright/test'

test.describe('Dashboard Bulk Actions', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to dashboard
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'password')
    await page.click('button[type="submit"]')
    
    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard')
  })

  test.describe('Articles Page Bulk Actions', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/articles')
      await page.waitForLoadState('networkidle')
    })

    test('should select individual articles via checkbox', async ({ page }) => {
      // Wait for table to load
      await page.waitForSelector('table tbody tr')
      
      // Click first checkbox
      const firstCheckbox = page.locator('table tbody tr:first-child td:first-child input[type="checkbox"]')
      await firstCheckbox.click()
      
      // Verify selection
      await expect(firstCheckbox).toBeChecked()
      
      // Verify toolbar shows 1 selected
      await expect(page.locator('[data-testid="bulk-toolbar"]')).toContainText('1 selected')
    })

    test('should select all articles via header checkbox', async ({ page }) => {
      await page.waitForSelector('table tbody tr')
      
      // Click select all checkbox in header
      const selectAllCheckbox = page.locator('table thead tr th:first-child input[type="checkbox"]')
      await selectAllCheckbox.click()
      
      // Verify all checkboxes are checked
      const checkboxes = page.locator('table tbody td:first-child input[type="checkbox"]')
      const count = await checkboxes.count()
      
      for (let i = 0; i < count; i++) {
        await expect(checkboxes.nth(i)).toBeChecked()
      }
    })

    test('should clear selection via toolbar', async ({ page }) => {
      // Select some items
      await page.locator('table tbody tr:first-child td:first-child input[type="checkbox"]').click()
      await page.locator('table tbody tr:nth-child(2) td:first-child input[type="checkbox"]').click()
      
      // Verify toolbar is visible
      await expect(page.locator('[data-testid="bulk-toolbar"]')).toBeVisible()
      
      // Click clear button
      await page.click('[data-testid="bulk-clear"]')
      
      // Verify all checkboxes are unchecked
      const checkboxes = page.locator('table tbody td:first-child input[type="checkbox"]')
      const count = await checkboxes.count()
      
      for (let i = 0; i < count; i++) {
        await expect(checkboxes.nth(i)).not.toBeChecked()
      }
      
      // Verify toolbar is hidden
      await expect(page.locator('[data-testid="bulk-toolbar"]')).toBeHidden()
    })

    test('should export selected articles', async ({ page }) => {
      // Select first article
      await page.locator('table tbody tr:first-child td:first-child input[type="checkbox"]').click()
      
      // Click export button
      await page.click('[data-testid="bulk-export"]')
      
      // Verify download started (check for toast or notification)
      await expect(page.locator('.toast-success')).toContainText('Export completed')
    })

    test('should delete selected articles with confirmation', async ({ page }) => {
      // Select articles to delete
      await page.locator('table tbody tr:first-child td:first-child input[type="checkbox"]').click()
      
      // Click delete button
      await page.click('[data-testid="bulk-delete"]')
      
      // Verify confirmation dialog
      await expect(page.locator('[data-testid="confirm-dialog"]')).toBeVisible()
      await expect(page.locator('[data-testid="confirm-dialog"]')).toContainText('Delete')
      
      // Confirm deletion
      await page.click('[data-testid="confirm-yes"]')
      
      // Verify success
      await expect(page.locator('.toast-success')).toContainText('deleted successfully')
    })

    test('should support shift+click range selection', async ({ page }) => {
      // Click first checkbox
      await page.locator('table tbody tr:first-child td:first-child input[type="checkbox"]').click()
      
      // Shift+click third checkbox
      await page.locator('table tbody tr:nth-child(3) td:first-child input[type="checkbox"]').click({
        modifiers: ['Shift']
      })
      
      // Verify first 3 items are selected
      await expect(page.locator('table tbody tr:first-child td:first-child input[type="checkbox"]')).toBeChecked()
      await expect(page.locator('table tbody tr:nth-child(2) td:first-child input[type="checkbox"]')).toBeChecked()
      await expect(page.locator('table tbody tr:nth-child(3) td:first-child input[type="checkbox"]')).toBeChecked()
      
      // Verify toolbar shows 3 selected
      await expect(page.locator('[data-testid="bulk-toolbar"]')).toContainText('3 selected')
    })
  })

  test.describe('Media Page Bulk Actions', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/media')
      await page.waitForLoadState('networkidle')
    })

    test('should select media items in grid view', async ({ page }) => {
      await page.waitForSelector('[data-testid="media-grid"] [data-testid="media-item"]')
      
      // Click first item checkbox
      const firstCheckbox = page.locator('[data-testid="media-item"]:first-child input[type="checkbox"]')
      await firstCheckbox.click()
      
      // Verify selection
      await expect(firstCheckbox).toBeChecked()
      await expect(page.locator('[data-testid="bulk-toolbar"]')).toBeVisible()
    })

    test('should download selected media files', async ({ page }) => {
      // Select media items
      await page.locator('[data-testid="media-item"]:first-child input[type="checkbox"]').click()
      
      // Click download button
      await page.click('[data-testid="bulk-download"]')
      
      // Verify download started
      await expect(page.locator('.toast-success')).toContainText('Download started')
    })
  })

  test.describe('Clients Page Bulk Actions', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/clients')
      await page.waitForLoadState('networkidle')
    })

    test('should export selected clients', async ({ page }) => {
      await page.waitForSelector('table tbody tr')
      
      // Select clients
      await page.locator('table tbody tr:first-child td:first-child input[type="checkbox"]').click()
      await page.locator('table tbody tr:nth-child(2) td:first-child input[type="checkbox"]').click()
      
      // Export
      await page.click('[data-testid="bulk-export"]')
      
      // Verify
      await expect(page.locator('.toast-success')).toContainText('Export completed')
    })
  })

  test.describe('Contact Page Bulk Actions', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/contact')
      await page.waitForLoadState('networkidle')
    })

    test('should export selected submissions', async ({ page }) => {
      await page.waitForSelector('table tbody tr')
      
      // Select submissions
      await page.locator('table tbody tr:first-child td:first-child input[type="checkbox"]').click()
      
      // Export
      await page.click('[data-testid="bulk-export"]')
      
      // Verify CSV download
      await expect(page.locator('.toast-success')).toContainText('Export completed')
    })
  })

  test.describe('Users Page Bulk Actions', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.goto('/login')
      await page.fill('input[type="email"]', 'admin@example.com')
      await page.fill('input[type="password"]', 'password')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')
      
      await page.goto('/dashboard/users')
      await page.waitForLoadState('networkidle')
    })

    test('should delete selected users', async ({ page }) => {
      await page.waitForSelector('table tbody tr')
      
      // Select users (skip first which might be current user)
      await page.locator('table tbody tr:nth-child(2) td:first-child input[type="checkbox"]').click()
      
      // Delete
      await page.click('[data-testid="bulk-delete"]')
      
      // Confirm
      await page.click('[data-testid="confirm-yes"]')
      
      // Verify
      await expect(page.locator('.toast-success')).toContainText('deleted')
    })
  })

  test.describe('Keyboard Shortcuts', () => {
    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/dashboard/articles')
      await page.waitForSelector('table tbody tr')
      
      // Focus first checkbox
      await page.locator('table tbody tr:first-child td:first-child input[type="checkbox"]').focus()
      
      // Press space to select
      await page.keyboard.press('Space')
      
      // Verify selected
      await expect(page.locator('table tbody tr:first-child td:first-child input[type="checkbox"]')).toBeChecked()
    })
  })
})
