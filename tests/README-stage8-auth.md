### Stage 8 Referral Tests – CI Auth Setup

**Stage8 requires `TEST_LOGIN_TOKEN` in CI.**

**TEST_LOGIN_TOKEN חייב להיות JWT אמיתי שמתקבל לאחר login במערכת (Dev/Stage) ולא ערך דמה.**

Format: `header.payload.signature` (3 parts separated by dots)

## Behavior

- Missing `TEST_LOGIN_TOKEN` → test skipped: `SKIP: missing TEST_LOGIN_TOKEN`
- Invalid format (not JWT) → test fails: `Invalid TEST_LOGIN_TOKEN: must be a real JWT`
- Valid JWT → test runs with `Authorization: Bearer <token>`

## Getting a Real JWT

1. Login to your app (Dev/Stage environment)
2. Open DevTools → Application → Cookies
3. Copy the `token` cookie value (starts with `eyJ...`)

## Running locally

**PowerShell:**
```powershell
$env:TEST_LOGIN_TOKEN="eyJhbGciOiJIUzI1NiIs..."; npm run test:api -- --reporter=verbose
```

**CMD:**
```cmd
set TEST_LOGIN_TOKEN=eyJhbGciOiJIUzI1NiIs...&& npm run test:api -- --reporter=verbose
```

## CI Setup

Add `TEST_LOGIN_TOKEN` as a secret in your CI platform (GitHub Actions, Vercel, etc.)

```yaml
env:
  TEST_LOGIN_TOKEN: ${{ secrets.TEST_LOGIN_TOKEN }}
```

## Expected Results

- With valid JWT: **22 passed, 0 skipped**
- Without token: 21 passed, 1 skipped
