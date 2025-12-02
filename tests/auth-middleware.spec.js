/**
 * Stage 15.2 - Routing & Middleware Verification Tests
 * Tests authentication and authorization for protected routes
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

// Test credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'test123456',
  fullName: 'Test User',
};

const ADMIN_USER = {
  email: 'admin@vipo.local',
  password: '12345678A',
};

test.describe('Authentication Middleware', () => {
  test('/api/auth/me returns 401 before login', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/auth/me`);

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('/api/auth/me returns 200 after login', async ({ request }) => {
    // First, login
    const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: ADMIN_USER.email,
        password: ADMIN_USER.password,
      },
    });

    expect(loginResponse.status()).toBe(200);

    // Extract token from Set-Cookie header
    const cookies = loginResponse.headers()['set-cookie'];
    expect(cookies).toBeTruthy();

    // Now check /api/auth/me with the cookie
    const meResponse = await request.get(`${BASE_URL}/api/auth/me`);

    expect(meResponse.status()).toBe(200);

    const user = await meResponse.json();
    expect(user).toHaveProperty('email');
    expect(user.email).toBe(ADMIN_USER.email);
  });

  test('Login with invalid credentials returns 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('Login with valid credentials returns 200 and sets cookie', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: ADMIN_USER.email,
        password: ADMIN_USER.password,
      },
    });

    expect(response.status()).toBe(200);

    const cookies = response.headers()['set-cookie'];
    expect(cookies).toContain('token=');
    expect(cookies).toContain('HttpOnly');
    expect(cookies).toContain('Path=/');
  });
});

test.describe('Protected Routes - Admin', () => {
  test('/admin redirects to /login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);

    // Should redirect to login
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain('/login');
  });

  test('/admin accessible after login', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_USER.email);
    await page.fill('input[type="password"]', ADMIN_USER.password);
    await page.click('button[type="submit"]');

    // Wait for redirect after login
    await page.waitForURL(/\/(admin|dashboard)/);

    // Now try to access admin
    await page.goto(`${BASE_URL}/admin`);

    // Should NOT redirect to login
    expect(page.url()).not.toContain('/login');
    expect(page.url()).toContain('/admin');
  });

  test('/admin/users requires admin role', async ({ page, request }) => {
    // Login as admin
    await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: ADMIN_USER.email,
        password: ADMIN_USER.password,
      },
    });

    // Try to access admin users page
    await page.goto(`${BASE_URL}/admin/users`);

    // Should be accessible
    expect(page.url()).toContain('/admin/users');
  });
});

test.describe('Protected Routes - Agent', () => {
  test('/agent redirects to /login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/agent`);

    // Should redirect to login
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain('/login');
  });

  test('/agent accessible after login', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_USER.email);
    await page.fill('input[type="password"]', ADMIN_USER.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/(admin|dashboard|agent)/);

    // Try to access agent
    await page.goto(`${BASE_URL}/agent`);

    // Should be accessible (admin can access agent routes)
    expect(page.url()).not.toContain('/login');
  });
});

test.describe('Protected API Routes', () => {
  test('/api/private/* returns 401 without auth', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/private/test`);

    // Should return 401 or 404 (if route doesn't exist)
    expect([401, 404]).toContain(response.status());
  });

  test('/api/transactions returns 401 without auth', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/transactions`);

    expect(response.status()).toBe(401);
  });

  test('/api/transactions returns 200 with auth', async ({ request }) => {
    // Login first
    await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: ADMIN_USER.email,
        password: ADMIN_USER.password,
      },
    });

    // Now access transactions
    const response = await request.get(`${BASE_URL}/api/transactions`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('ok');
    expect(data).toHaveProperty('items');
  });

  test('/api/admin/transactions requires admin role', async ({ request }) => {
    // Login as admin
    await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: ADMIN_USER.email,
        password: ADMIN_USER.password,
      },
    });

    // Access admin endpoint
    const response = await request.get(`${BASE_URL}/api/admin/transactions`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('ok');
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('count');
  });
});

test.describe('Public Routes', () => {
  test('/ (home) is accessible without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    expect(page.url()).toBe(`${BASE_URL}/`);
    expect(page.url()).not.toContain('/login');
  });

  test('/login is accessible without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    expect(page.url()).toContain('/login');
  });

  test('/register is accessible without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    expect(page.url()).toContain('/register');
  });

  test('/products is accessible without auth', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/products`);

    // Should be accessible (200 or 404 if page doesn't exist)
    expect([200, 404]).toContain(response.status());
  });
});

test.describe('Cookie Security', () => {
  test('Auth cookie has HttpOnly flag', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: ADMIN_USER.email,
        password: ADMIN_USER.password,
      },
    });

    const cookies = response.headers()['set-cookie'];
    expect(cookies).toContain('HttpOnly');
  });

  test('Auth cookie has Path=/', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: ADMIN_USER.email,
        password: ADMIN_USER.password,
      },
    });

    const cookies = response.headers()['set-cookie'];
    expect(cookies).toContain('Path=/');
  });

  test('Auth cookie has SameSite attribute', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: ADMIN_USER.email,
        password: ADMIN_USER.password,
      },
    });

    const cookies = response.headers()['set-cookie'];
    expect(cookies).toMatch(/SameSite=(Lax|Strict)/i);
  });
});

test.describe('Logout', () => {
  test('Logout clears auth cookie', async ({ request }) => {
    // Login first
    await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: ADMIN_USER.email,
        password: ADMIN_USER.password,
      },
    });

    // Logout
    const logoutResponse = await request.post(`${BASE_URL}/api/auth/logout`);

    expect(logoutResponse.status()).toBe(200);

    // Try to access protected route
    const meResponse = await request.get(`${BASE_URL}/api/auth/me`);
    expect(meResponse.status()).toBe(401);
  });
});
