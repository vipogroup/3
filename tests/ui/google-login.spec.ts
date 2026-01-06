import { test, expect } from '@playwright/test';

test.describe('Google Login', () => {
  test('should display Google login button', async ({ page }) => {
    await page.goto('/login');
    // Google login button should be visible
    const googleButton = page.locator('button:has-text("Google"), a:has-text("Google")');
    await expect(googleButton).toBeVisible();
  });
});