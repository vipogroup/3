import { test, expect } from '@playwright/test';

/**
 * Google Login Smoke Tests
 * Validates the Google OAuth entry point on the login page
 */

test.describe('Google Login', () => {
  test('login page loads and shows Google sign-in button', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    // Check page title/header
    await expect(page.locator('h1')).toContainText('VIPO');

    // Check Google button exists and is visible
    const googleButton = page.getByTestId('google-signin');
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toContainText('Google');
  });

  test('Google button triggers OAuth redirect', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    const googleButton = page.getByTestId('google-signin');
    await expect(googleButton).toBeVisible();

    // Click and verify redirect to NextAuth signin
    const [request] = await Promise.all([
      page.waitForRequest(
        (req) => req.url().includes('/api/auth/signin') || req.url().includes('accounts.google.com'),
        { timeout: 5000 }
      ),
      googleButton.click(),
    ]);

    // Should redirect to NextAuth or Google
    expect(
      request.url().includes('/api/auth/signin') || 
      request.url().includes('accounts.google.com')
    ).toBeTruthy();
  });

  test('login page shows legacy email/password form', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    // Check email field exists
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    // Check password field exists
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

    // Check submit button exists
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('referral parameter is preserved', async ({ page }) => {
    const refId = 'test-referral-123';
    await page.goto(`http://localhost:3001/login?ref=${refId}`);

    // Check Google button exists
    const googleButton = page.getByTestId('google-signin');
    await expect(googleButton).toBeVisible();

    // Click Google button - it should save ref to cookie
    await googleButton.click();

    // Verify cookie was set (via page context)
    const cookies = await page.context().cookies();
    const refCookie = cookies.find(c => c.name === 'refSource');
    
    // Cookie should exist with the ref value
    expect(refCookie?.value).toBe(refId);
  });
});
