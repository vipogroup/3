# Google Auth QA & Sanity Plan

This guide summarizes automated and manual QA coverage needed before releasing the Google OAuth + legacy auth bridge for VIPO.

---

## 1. Automated Checks

### 1.1 Playwright E2E

Playwright is already configured in this repo (`npm run test:ui`). Add the following sanity test:

```ts
// tests/ui/google-login.spec.ts
import { test, expect } from '@playwright/test';

// Smoke test – validates that the Google button exists and triggers the OAuth route.
test('login page shows Google sign-in CTA', async ({ page }) => {
  await page.goto('http://localhost:3001/login');

  const googleButton = page.getByTestId('google-signin');
  await expect(googleButton).toBeVisible();

  const [request] = await Promise.all([
    page.waitForRequest((req) => req.url().includes('/api/auth/signin/google') && req.method() === 'GET'),
    googleButton.click(),
  ]);

  expect(request.url()).toContain('/api/auth/signin/google');
});
```

> **How to run:** `npm run test:ui`

Ensure `/login` includes `data-testid="google-signin"` on the primary button so the test remains stable.

---

## 2. Manual QA Checklist

| Scenario | Steps | Expected |
| --- | --- | --- |
| Legacy login success | 1. Navigate to `/login`. 2. Fill valid email/password. 3. Submit. | Redirect to `/dashboard`, auth cookies set, audit log `login_success`. |
| Legacy login fail | Same as above with invalid credentials. | Stay on `/login`, error message shown, audit log `login_fail`. |
| Google login (existing user) | 1. `/login`. 2. Click Google, complete OAuth with existing account. | Redirect to `/dashboard`, onboarding skipped, audit log `google_success`. |
| Google login (first-time) → save onboarding | 1. `/login`. 2. Google sign-in with new account. 3. On `/agents/onboarding`, fill phone/payout, click Save. | API `PATCH /api/agents/onboarding` returns 200, redirect to `/dashboard`, `onboardingCompletedAt` set. |
| Google login (first-time) → skip onboarding | Same as above but click “דלג”. | Redirect to `/dashboard` immediately, onboarding page not shown on next login. |
| Referral capture | 1. Visit `/login?ref=<existingAgentId>`. 2. Google sign-in new account. | On first login, user doc `referredBy` set, referrer counters incremented. Subsequent logins do not change counters. Logs show `[REFERRAL] applied`. |
| Rate limit | Submit >10 login attempts within 5 minutes (or >5 register attempts/10 min). | 429 JSON `{ error: 'TOO_MANY_REQUESTS' }`, `Retry-After` header. Audit log reason `rate_limited`. |
| Auth audit logs | After running scenarios above, query Mongo `auth_audit` collection. | Entries exist for success/fail events, respect TTL (30 days). |

---

## 3. Debugging Guide

| Issue | Where to look | Notes |
| --- | --- | --- |
| OAuth `redirect_uri_mismatch` / `invalid_client` | Google Cloud console, Vercel logs, NextAuth error param in callback URL (e.g. `/login?error=OAuthSignin`). | Ensure `NEXTAUTH_URL`, redirect URIs and credentials match. |
| NextAuth error page (`?error=`) | Browser URL query, Vercel logs (`Functions` tab). | Map error codes: `OAuthSignin`, `AccessDenied`, `Configuration`. |
| Duplicate key `E11000` | Vercel logs, Mongo shell. | Happens when email/provider already exists; ensure upsert handles gracefully. |
| Cookies missing in production | Browser DevTools → Application → Cookies. Check `Secure` + `SameSite=Lax`. Ensure domain matches `NEXTAUTH_URL`. |
| Session verification | Send `GET https://vipo-group.com/api/auth/session` (or local). | Response should contain `session.user.id`, `session.user.role`. |
| Rate limit false positives | Mongo `auth_rate_limits` collection, TTL index; adjust thresholds. |
| Referral not applied | Check cookie `vipo_ref`, referral logs `[REFERRAL]`. Ensure referrer exists and not same user. |

Common log prefixes in Vercel: `[GOOGLE_AUTH]`, `[REFERRAL]`, `[RATE_LIMIT]`, `[AUTH_AUDIT]`, `[ONBOARDING]`.

---

## 4. Go / No-Go Release Checklist

- [ ] Env vars for Google + NextAuth configured and verified in Vercel.
- [ ] Latest deployment contains updated `/login`, onboarding, API routes.
- [ ] Automated Playwright smoke test passes (`npm run test:ui`).
- [ ] Manual QA checklist scenarios validated in staging/production.
- [ ] Referral + rate limit + audit logs observed in DB.
- [ ] No critical errors in Vercel function logs after tests.
- [ ] Rollback plan ready (previous deployment + disable Google auth if needed).
