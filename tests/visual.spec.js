/**
 * Stage 15.12 - Visual Snapshot Tests
 * Playwright visual regression testing
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

// Test credentials
const ADMIN_USER = {
  email: 'admin@vipo.local',
  password: '12345678A'
};

// Pages to test
const publicPages = [
  { name: 'Home', url: '/' },
  { name: 'Login', url: '/login' },
  { name: 'Register', url: '/register' },
  { name: 'Join', url: '/join?ref=TEST123' },
];

const authenticatedPages = [
  { name: 'Dashboard', url: '/dashboard' },
  { name: 'Agent Dashboard', url: '/agent' },
  { name: 'Admin Dashboard', url: '/admin' },
];

test.describe('Visual Regression - Public Pages', () => {
  publicPages.forEach(({ name, url }) => {
    test(`${name} page visual snapshot`, async ({ page }) => {
      await page.goto(`${BASE_URL}${url}`);
      
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');
      
      // Take screenshot
      await expect(page).toHaveScreenshot(`${name.toLowerCase().replace(/\s+/g, '-')}.png`, {
        fullPage: true,
        maxDiffPixels: 100, // 0.1% tolerance
        threshold: 0.1,
      });
    });

    test(`${name} page mobile visual snapshot`, async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto(`${BASE_URL}${url}`);
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot(`${name.toLowerCase().replace(/\s+/g, '-')}-mobile.png`, {
        fullPage: true,
        maxDiffPixels: 100,
        threshold: 0.1,
      });
    });
  });
});

test.describe('Visual Regression - Authenticated Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_USER.email);
    await page.fill('input[type="password"]', ADMIN_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(admin|dashboard)/);
  });

  authenticatedPages.forEach(({ name, url }) => {
    test(`${name} page visual snapshot`, async ({ page }) => {
      await page.goto(`${BASE_URL}${url}`);
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot(`${name.toLowerCase().replace(/\s+/g, '-')}.png`, {
        fullPage: true,
        maxDiffPixels: 100,
        threshold: 0.1,
      });
    });

    test(`${name} page mobile visual snapshot`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto(`${BASE_URL}${url}`);
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot(`${name.toLowerCase().replace(/\s+/g, '-')}-mobile.png`, {
        fullPage: true,
        maxDiffPixels: 100,
        threshold: 0.1,
      });
    });
  });
});

test.describe('Visual Regression - Components', () => {
  test('Toast notification visual', async ({ page }) => {
    await page.goto(`${BASE_URL}/join?ref=TEST123`);
    await page.waitForLoadState('networkidle');
    
    // Wait for toast to appear
    await page.waitForSelector('[role="alert"]', { timeout: 5000 });
    
    // Screenshot just the toast
    const toast = await page.locator('[role="alert"]');
    await expect(toast).toHaveScreenshot('toast-notification.png', {
      maxDiffPixels: 50,
      threshold: 0.1,
    });
  });

  test('Empty state visual', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_USER.email);
    await page.fill('input[type="password"]', ADMIN_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(admin|dashboard)/);
    
    // Navigate to page with empty state
    await page.goto(`${BASE_URL}/agent`);
    await page.waitForLoadState('networkidle');
    
    // If there's an empty state, screenshot it
    const emptyState = await page.locator('text=אין').first();
    if (await emptyState.isVisible()) {
      await expect(page).toHaveScreenshot('empty-state.png', {
        maxDiffPixels: 100,
        threshold: 0.1,
      });
    }
  });

  test('Table visual', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_USER.email);
    await page.fill('input[type="password"]', ADMIN_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(admin|dashboard)/);
    
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');
    
    // Screenshot table if exists
    const table = await page.locator('table').first();
    if (await table.isVisible()) {
      await expect(table).toHaveScreenshot('admin-table.png', {
        maxDiffPixels: 100,
        threshold: 0.1,
      });
    }
  });
});

test.describe('Visual Regression - Responsive', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`Home page ${name} viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(`${BASE_URL}/`);
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot(`home-${name.toLowerCase()}.png`, {
        fullPage: true,
        maxDiffPixels: 100,
        threshold: 0.1,
      });
    });
  });
});

test.describe('Visual Regression - Dark Mode', () => {
  test('Home page dark mode', async ({ page }) => {
    // Enable dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('home-dark.png', {
      fullPage: true,
      maxDiffPixels: 100,
      threshold: 0.1,
    });
  });
});

test.describe('Visual Regression - Interactions', () => {
  test('Button hover state', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    const button = await page.locator('button[type="submit"]');
    await button.hover();
    
    await expect(button).toHaveScreenshot('button-hover.png', {
      maxDiffPixels: 50,
      threshold: 0.1,
    });
  });

  test('Input focus state', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    const input = await page.locator('input[type="email"]');
    await input.focus();
    
    await expect(input).toHaveScreenshot('input-focus.png', {
      maxDiffPixels: 50,
      threshold: 0.1,
    });
  });
});
