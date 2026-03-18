import { test, expect } from '@playwright/test'

test.describe('Inline Editing', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to dashboard
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'password')
    await page.click('button[type="submit"]')
    
    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard')
  })

  test.describe('Text Field Editing', () => {
    test('should click to edit article title', async ({ page }) => {
      await page.goto('/dashboard/articles')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('table tbody tr')

      // Find and click first article title inline editor
      const inlineEdit = page.locator('[data-testid="inline-edit-text"]').first()
      await inlineEdit.click()

      // Verify input is focused and editable
      const input = page.locator('[data-testid="inline-edit-input"]')
      await expect(input).toBeVisible()
      await expect(input).toBeFocused()
    })

    test('should press Enter to save changes', async ({ page }) => {
      await page.goto('/dashboard/articles')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('table tbody tr')

      // Click to edit
      const inlineEdit = page.locator('[data-testid="inline-edit-text"]').first()
      await inlineEdit.click()

      // Type new value
      const input = page.locator('[data-testid="inline-edit-input"]')
      await input.fill('Updated Article Title')

      // Press Enter to save
      await input.press('Enter')

      // Verify edit mode is closed and new value is displayed
      await expect(input).toBeHidden()
      await expect(inlineEdit).toContainText('Updated Article Title')
    })

    test('should press Escape to cancel changes', async ({ page }) => {
      await page.goto('/dashboard/articles')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('table tbody tr')

      // Click to edit
      const inlineEdit = page.locator('[data-testid="inline-edit-text"]').first()
      await inlineEdit.click()

      // Type new value
      const input = page.locator('[data-testid="inline-edit-input"]')
      await input.fill('Cancelled Title')

      // Press Escape to cancel
      await input.press('Escape')

      // Verify edit mode is closed and original value is preserved
      await expect(input).toBeHidden()
      await expect(inlineEdit).not.toContainText('Cancelled Title')
    })

    test('should display validation error', async ({ page }) => {
      await page.goto('/dashboard/articles')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('table tbody tr')

      // Click to edit
      const inlineEdit = page.locator('[data-testid="inline-edit-text"]').first()
      await inlineEdit.click()

      // Clear input (triggering required validation if applicable)
      const input = page.locator('[data-testid="inline-edit-input"]')
      await input.clear()

      // Press Enter to save
      await input.press('Enter')

      // Verify error message is displayed if validation exists
      const errorMessage = page.locator('[data-testid="inline-edit-error"]')
      await expect(errorMessage).toBeVisible()
    })
  })

  test.describe('Undo Functionality', () => {
    test('should undo changes via toast action', async ({ page }) => {
      await page.goto('/dashboard/articles')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('table tbody tr')

      // Click to edit
      const inlineEdit = page.locator('[data-testid="inline-edit-text"]').first()
      await inlineEdit.click()

      // Type new value
      const input = page.locator('[data-testid="inline-edit-input"]')
      await input.fill('Title For Undo Test')

      // Press Enter to save
      await input.press('Enter')

      // Wait for toast with undo action
      await expect(page.locator('.toast-success')).toBeVisible()

      // Click undo button in toast
      const undoButton = page.locator('.toast-success button:has-text("Undo"), button:has-text("Undo")')
      await undoButton.click()

      // Verify value is reverted (wait a bit for update)
      await page.waitForTimeout(500)
      await expect(inlineEdit).not.toContainText('Title For Undo Test')
    })
  })

  test.describe('Toggle Type Editing', () => {
    test('should toggle featured status via switch', async ({ page }) => {
      await page.goto('/dashboard/works')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('[data-testid="inline-edit-toggle"]')

      // Find first toggle
      const toggle = page.locator('[data-testid="inline-edit-toggle"]').first()
      const initialState = await toggle.isChecked()

      // Click to toggle
      await toggle.click()

      // Verify state changed - toggle should be in opposite state
      const newState = await toggle.isChecked()
      await expect(newState).toBe(!initialState)

      // Verify toast notification
      await expect(page.locator('.toast-success')).toBeVisible()
    })

    test('should toggle user active status', async ({ page }) => {
      await page.goto('/dashboard/users')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('table tbody tr')

      // Find active toggle in users table
      const toggle = page.locator('[data-testid="inline-edit-toggle"]').first()
      const initialState = await toggle.isChecked()

      // Click to toggle
      await toggle.click()

      // Verify state changed - toggle should be in opposite state
      const newState = await toggle.isChecked()
      await expect(newState).toBe(!initialState)

      // Verify success toast
      await expect(page.locator('.toast-success')).toBeVisible()
    })
  })

  test.describe('Select Type Editing', () => {
    test('should edit via select dropdown', async ({ page }) => {
      await page.goto('/dashboard/clients')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('table tbody tr')

      // Click to edit status - look for text that can be edited
      const inlineEdit = page.locator('[data-testid="inline-edit-text"]').nth(1)
      await inlineEdit.click()

      // Verify select is visible if it becomes a select
      const select = page.locator('select')
      await expect(select).toBeVisible()

      // Select first option
      await select.selectOption({ index: 0 })
    })
  })

  test.describe('Cross-Page Inline Editing', () => {
    test('should support inline editing on Articles page', async ({ page }) => {
      await page.goto('/dashboard/articles')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('table tbody tr')

      // Verify inline edit is available for title
      const inlineEdit = page.locator('[data-testid="inline-edit-text"]').first()
      await expect(inlineEdit).toBeVisible()

      // Click and verify input appears
      await inlineEdit.click()
      await expect(page.locator('[data-testid="inline-edit-input"]')).toBeVisible()
    })

    test('should support inline editing on Works page', async ({ page }) => {
      await page.goto('/dashboard/works')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('[data-testid="inline-edit-toggle"]')

      // Verify inline edit for title
      const titleEdit = page.locator('[data-testid="inline-edit-text"]').first()
      await expect(titleEdit).toBeVisible()

      // Verify toggle for featured
      const toggleEdit = page.locator('[data-testid="inline-edit-toggle"]').first()
      await expect(toggleEdit).toBeVisible()
    })

    test('should support inline editing on Clients page', async ({ page }) => {
      await page.goto('/dashboard/clients')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('table tbody tr')

      // Verify inline edit is available
      const inlineEdit = page.locator('[data-testid="inline-edit-text"]').first()
      await expect(inlineEdit).toBeVisible()
    })

    test('should support inline editing on Services page', async ({ page }) => {
      await page.goto('/dashboard/services')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('[data-testid="inline-edit-text"]')

      // Verify inline edit for service title
      const inlineEdit = page.locator('[data-testid="inline-edit-text"]').first()
      await expect(inlineEdit).toBeVisible()

      // Verify toggle for featured
      const toggleEdit = page.locator('[data-testid="inline-edit-toggle"]').first()
      await expect(toggleEdit).toBeVisible()
    })

    test('should support inline editing on Users page', async ({ page }) => {
      await page.goto('/dashboard/users')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('table tbody tr')

      // Verify inline edit for active status
      const toggleEdit = page.locator('[data-testid="inline-edit-toggle"]').first()
      await expect(toggleEdit).toBeVisible()
    })
  })

  test.describe('Keyboard Shortcuts', () => {
    test('should save with Enter key on text fields', async ({ page }) => {
      await page.goto('/dashboard/articles')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('table tbody tr')

      // Click to edit
      const inlineEdit = page.locator('[data-testid="inline-edit-text"]').first()
      await inlineEdit.click()

      // Type and press Enter
      const input = page.locator('[data-testid="inline-edit-input"]')
      await input.fill('Quick Edit Test')
      await input.press('Enter')

      // Verify saved
      await expect(input).toBeHidden()
      await expect(inlineEdit).toContainText('Quick Edit Test')
    })

    test('should cancel with Escape key', async ({ page }) => {
      await page.goto('/dashboard/works')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('[data-testid="inline-edit-text"]')

      // Click to edit
      const inlineEdit = page.locator('[data-testid="inline-edit-text"]').first()
      await inlineEdit.click()

      // Type and press Escape
      const input = page.locator('[data-testid="inline-edit-input"]')
      await input.fill('Cancelled Edit')
      await input.press('Escape')

      // Verify cancelled
      await expect(input).toBeHidden()
      await expect(inlineEdit).not.toContainText('Cancelled Edit')
    })
  })

  test.describe('Button Actions', () => {
    test('should save with check button', async ({ page }) => {
      await page.goto('/dashboard/articles')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('table tbody tr')

      // Click to edit
      const inlineEdit = page.locator('[data-testid="inline-edit-text"]').first()
      await inlineEdit.click()

      // Type new value
      const input = page.locator('[data-testid="inline-edit-input"]')
      await input.fill('Saved with Button')

      // Click check button
      const saveButton = page.locator('[data-testid="inline-edit-save"]')
      await saveButton.click()

      // Verify saved
      await expect(input).toBeHidden()
      await expect(inlineEdit).toContainText('Saved with Button')
    })

    test('should cancel with X button', async ({ page }) => {
      await page.goto('/dashboard/articles')
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('table tbody tr')

      // Click to edit
      const inlineEdit = page.locator('[data-testid="inline-edit-text"]').first()
      await inlineEdit.click()

      // Type new value
      const input = page.locator('[data-testid="inline-edit-input"]')
      await input.fill('Cancelled with Button')

      // Click X button
      const cancelButton = page.locator('[data-testid="inline-edit-cancel"]')
      await cancelButton.click()

      // Verify cancelled
      await expect(input).toBeHidden()
      await expect(inlineEdit).not.toContainText('Cancelled with Button')
    })
  })
})
