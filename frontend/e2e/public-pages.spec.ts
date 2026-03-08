import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test.describe('Homepage', () => {
    test('homepage loads correctly', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/Esperion/i);
      await expect(page.locator('h1, [data-testid="hero-title"]')).toBeVisible();
    });

    test('homepage has navigation', async ({ page }) => {
      await page.goto('/');
      const nav = page.locator('nav, [data-testid="main-nav"]');
      await expect(nav).toBeVisible();
    });

    test('theme toggle updates public theme colors', async ({ page }) => {
      await page.goto('/');

      const toggle = page.getByRole('button', { name: /switch to dark mode|switch to light mode/i });
      await expect(toggle).toBeVisible();

      const html = page.locator('html');
      const header = page.locator('header').first();

      const lightHeaderBg = await header.evaluate((element) => getComputedStyle(element).backgroundColor);

      await toggle.click();

      await expect(html).toHaveClass(/dark/);

      const darkHeaderBg = await header.evaluate((element) => getComputedStyle(element).backgroundColor);
      expect(darkHeaderBg).not.toBe(lightHeaderBg);

      await toggle.click();
      await expect(html).not.toHaveClass(/dark/);
    });
  });

  test.describe('Works Page', () => {
    test('works page loads', async ({ page }) => {
      await page.goto('/id/our-works');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('can navigate to work detail', async ({ page }) => {
      await page.goto('/id/our-works');
      // Click on first work item if exists
      const firstWork = page.locator('a[href*="/id/our-works/"]').first();
      if (await firstWork.isVisible().catch(() => false)) {
        await firstWork.click();
        await expect(page).toHaveURL(/\/id\/our-works\/[^/]+$/);
        await expect(page.locator('h1, [data-testid="work-title"]')).toBeVisible();
      }
    });
  });

  test.describe('Services Page', () => {
    test('services page loads', async ({ page }) => {
      await page.goto('/id/our-services');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('can navigate to service detail', async ({ page }) => {
      await page.goto('/id/our-services');
      // Click on first service item if exists
      const firstService = page.locator('a[href*="/id/our-services/"]').first();
      if (await firstService.isVisible().catch(() => false)) {
        await firstService.click();
        await expect(page).toHaveURL(/\/id\/our-services\/[^/]+$/);
        await expect(page.locator('h1, [data-testid="service-title"]')).toBeVisible();
      }
    });
  });

  test.describe('Articles Page', () => {
    test('articles page loads', async ({ page }) => {
      await page.goto('/id/articles');
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test.describe('About Page', () => {
    test('about page loads', async ({ page }) => {
      await page.goto('/id/about');
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test.describe('Contact Page', () => {
    test('contact page loads', async ({ page }) => {
      await page.goto('/id/contact-us');
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('form')).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('can navigate to all public pages from nav', async ({ page }) => {
      await page.goto('/');
      
      // Click on Works in navigation
      const worksLink = page.locator('nav a:has-text("Works"), [data-testid="nav-works"]').first();
      if (await worksLink.isVisible().catch(() => false)) {
        await worksLink.click();
        await expect(page).toHaveURL(/.*\/(id|en)\/our-works/);
      }
      
      // Click on Services in navigation
      await page.goto('/');
      const servicesLink = page.locator('nav a:has-text("Services"), [data-testid="nav-services"]').first();
      if (await servicesLink.isVisible().catch(() => false)) {
        await servicesLink.click();
        await expect(page).toHaveURL(/.*\/(id|en)\/our-services/);
      }
      
      // Click on Articles in navigation
      await page.goto('/');
      const articlesLink = page.locator('nav a:has-text("Articles"), [data-testid="nav-articles"]').first();
      if (await articlesLink.isVisible().catch(() => false)) {
        await articlesLink.click();
        await expect(page).toHaveURL(/.*\/(id|en)\/articles/);
      }
      
      // Click on Contact in navigation
      await page.goto('/');
      const contactLink = page.locator('nav a:has-text("Contact"), [data-testid="nav-contact"]').first();
      if (await contactLink.isVisible().catch(() => false)) {
        await contactLink.click();
        await expect(page).toHaveURL(/.*\/(id|en)\/contact-us/);
      }
    });

    test('home to listing to detail flow keeps locale prefix', async ({ page }) => {
      await page.goto('/id');

      const worksHomeCard = page.locator('a[href^="/id/our-works/"]').first();
      if (await worksHomeCard.isVisible().catch(() => false)) {
        await worksHomeCard.click();
        await expect(page).toHaveURL(/\/id\/our-works\/[^/]+$/);
      }

      await page.goto('/id/our-services');
      const servicesDetailLink = page.locator('a[href^="/id/our-services/"]').first();
      if (await servicesDetailLink.isVisible().catch(() => false)) {
        await servicesDetailLink.click();
        await expect(page).toHaveURL(/\/id\/our-services\/[^/]+$/);
      }

      await page.goto('/id/articles');
      const articleDetailLink = page.locator('a[href^="/id/articles/"]').first();
      if (await articleDetailLink.isVisible().catch(() => false)) {
        await articleDetailLink.click();
        await expect(page).toHaveURL(/\/id\/articles\/[^/]+$/);
      }
    });
  });
});
