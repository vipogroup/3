# Google Login Deployment Checklist (NextAuth + Legacy JWT)

This guide covers everything required to launch Google Login on https://vipo-group.com while keeping the existing `auth_token` bridge and referral + rate-limit protections.

---

## 1. Environment Variables

| Variable | Local `.env.local` (examples) | Vercel (Production / Preview / Development) | Notes |
| --- | --- | --- | --- |
| `GOOGLE_CLIENT_ID` | `GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com` | Same value per environment | Issued by Google Cloud console |
| `GOOGLE_CLIENT_SECRET` | `GOOGLE_CLIENT_SECRET=xxxxxxxx` | Same value per environment | Keep secret; rotate if exposed |
| `NEXTAUTH_URL` | `NEXTAUTH_URL=http://localhost:3001` | `NEXTAUTH_URL=https://vipo-group.com` | Must exactly match origin (https in prod) |
| `NEXTAUTH_SECRET` | `NEXTAUTH_SECRET=<long-random-string>` | Same value (random, 32+ chars) | Required for NextAuth JWT signing |
| `JWT_SECRET` | `JWT_SECRET=<legacy-jwt-secret>` | Same value | Used by legacy `auth_token` issuer |
| `MONGODB_URI` | `MONGODB_URI=mongodb+srv://...` | Same value | Ensure connectivity from Vercel |
| `MONGODB_DB` *(if used)* | `MONGODB_DB=vipo` | Same value | Matches existing deployments |
| `PUBLIC_URL` | `PUBLIC_URL=http://localhost:3001` | `PUBLIC_URL=https://vipo-group.com` | Used in referral links & emails |

> **Tip:** verify other auth-related vars already present in `.env.example` (e.g., `NEXT_PUBLIC_BASE_URL`) match the domain.

---

## 2. Google Cloud Console Configuration

1. **Create / choose project** in Google Cloud Console.
2. **OAuth consent screen**
   - Type: *External* (unless all users are within same Google Workspace).
   - Add app name, support email, logo (optional), and developer contact.
   - Add scopes (basic profile/email scopes default are enough for Google provider).
3. **Authorized domains:**
   - `vipo-group.com`
4. **Create OAuth Client ID** (Web application):
   - **Authorized JavaScript origins**
     - `https://vipo-group.com`
     - `http://localhost:3001`
   - **Authorized redirect URIs**
     - `https://vipo-group.com/api/auth/callback/google`
     - `http://localhost:3001/api/auth/callback/google`
5. Save client ID / secret and copy into env vars.
6. If Google shows “verification required”, submit the consent screen for verification (optional if app is internal / limited to test users).

---

## 3. Vercel Deployment Steps

1. **Set env vars**
   - Vercel dashboard → Project (**vipo-group.com**) → *Settings → Environment Variables*.
   - Add each variable for **Production**, **Preview**, and **Development** scopes.
2. **Redeploy**
   - After updating env vars, click *Deployments → Redeploy* the latest production build or trigger `vercel --prod`.
3. **Verify build picks up env vars**
   - In deployment logs, ensure Next.js prints `NEXTAUTH_URL` and other envs (without values). Alternatively, start a preview deployment and inspect `process.env` in server logs.
4. **Custom domain alignment**
   - Ensure `NEXTAUTH_URL` equals the canonical public URL (`https://vipo-group.com`). If using `www` alias, add both the alias and the root domain to Authorized domains/origins in Google.
5. **Mongo connectivity**
   - Confirm `MONGODB_URI` allows Vercel IPs (whitelist or enable access from anywhere with proper credentials).

---

## 4. Smoke Tests

### Local (http://localhost:3001)
1. **Google login flow**
   - Navigate to `/login`, click “Continue with Google”, complete OAuth → expect redirect to `/dashboard`.
   - Confirm browser cookies include `auth_token`, `token`, and `next-auth.session-token`.
2. **Session API**
   - `GET http://localhost:3001/api/auth/session` → JSON should include `session.user.id`, `session.user.role`.
3. **Referral capture**
   - Visit `/login?ref=<existingAgentId>` → Google sign-in → new user’s Mongo doc should have `referredBy` set (only on first login). Check server log for `[REFERRAL] applied`.
4. **Rate limit**
   - Send >10 login attempts within 5 minutes → expect HTTP 429 with `Retry-After`. Audit log should capture `[RATE_LIMIT]` / `login_fail` events.
5. **Audit log**
   - Check Mongo collection `auth_audit` contains entries for `login_success`, `login_fail`, `google_success`, etc.

### Production (https://vipo-group.com)
1. Repeat steps above using `https://vipo-group.com`.
2. **OAuth callback** – ensure Google redirects to `https://vipo-group.com/api/auth/callback/google` without `redirect_uri_mismatch`.
3. **Inspect cookies** – ensure cookies are marked `Secure` and `SameSite=Lax`.
4. **Logs** – Vercel → Deployment → *Functions* tab should show `[GOOGLE_AUTH]`, `[REFERRAL]`, `[RATE_LIMIT]`, `[AUTH_AUDIT]` entries during tests.

---

## 5. Troubleshooting Guide

| Symptom | Possible Cause | Fix |
| --- | --- | --- |
| `redirect_uri_mismatch` from Google | Redirect URL not listed | Add exact URL (with https) in Google console. |
| `invalid_client` | Wrong client ID/secret | Re-copy credentials; ensure they match environment scope. |
| NextAuth error: `NEXTAUTH_URL` mismatch | Env var missing or wrong protocol | Set `NEXTAUTH_URL` to `https://vipo-group.com` (prod) / `http://localhost:3001` (dev). Redeploy. |
| Runtime error: `NEXTAUTH_SECRET` missing | Secret not set or mismatched | Set same secret in all envs; redeploy. |
| Cookies missing in production | `NEXTAUTH_URL` wrong or browser blocks third-party cookies | Ensure domain matches, cookies flagged `Secure` (auto when using https). |
| Mongo connection timeout | Missing network access or wrong URI | Whitelist Vercel IPs / enable access; verify credentials; ensure `MONGODB_URI` correct. |
| Duplicate key `E11000` on `email` or `providerAccountId` | User already exists | This is expected when the same email signs in twice; ensure `upsert` handles it. Delete or merge duplicates manually if needed. |
| Rate limit triggers unexpectedly | Threshold too low | Adjust limits in `lib/security/rateLimit.js` or config file, redeploy. |

---

## 6. Post-Deployment Checklist

- [ ] Env vars set in Vercel (Production + Preview + Development).
- [ ] Google OAuth client verified and published (if required).
- [ ] Latest production deployment succeeds with new env vars.
- [ ] Smoke tests (login, session API, referral, rate limit) pass locally and in production.
- [ ] Audit logs confirmed in Mongo (TTL indexes created).
- [ ] Monitoring/alerts configured (optional) for auth errors and rate limit spikes.
