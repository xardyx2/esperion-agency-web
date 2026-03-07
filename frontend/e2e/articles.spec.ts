import { test, expect } from '@playwright/test';

test.describe('Articles', () => {
  test('can view article list', async ({ page }) => {
    await page.goto('/articles');
    const articles = await page.locator('article').count();
    expect(articles).toBeGreaterThan(0);
  });

  test('can view article detail', async ({ page }) => {
    await page.goto('/articles');
    await page.click('article:first-child');
    await expect(page.locator('h1')).toBeVisible();
  });
});