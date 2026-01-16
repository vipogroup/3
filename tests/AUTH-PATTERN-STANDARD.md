# Test Auth Pattern Standard 🔒

**Version:** 1.0  
**Status:** LOCKED  
**Effective:** 2026-01-15

---

## Overview

All API tests (Stage8+) MUST follow this authentication pattern. No exceptions.

---

## Auth Pattern Requirements

### 1. Auth-First
```javascript
const TEST_TOKEN = process.env.TEST_LOGIN_TOKEN || '';
```

### 2. JWT Validation
```javascript
function isValidJwt(token) {
  return token && token.split('.').length === 3;
}
```

### 3. Skip if Missing
```javascript
if (!TEST_TOKEN) {
  console.log('SKIP: missing TEST_LOGIN_TOKEN');
  ctx.skip();
  return;
}
```

### 4. Fail-Fast if Invalid
```javascript
if (!isValidJwt(TEST_TOKEN)) {
  throw new Error('Invalid TEST_LOGIN_TOKEN: must be a real JWT (header.payload.signature)');
}
```

### 5. Use Authorization Header
```javascript
.set('Authorization', `Bearer ${TEST_TOKEN}`)
```

---

## Template

```javascript
import request from 'supertest';
import { describe, it, expect, afterAll } from 'vitest';

const base = process.env.PUBLIC_URL || 'http://localhost:3001';
const TEST_TOKEN = process.env.TEST_LOGIN_TOKEN || '';

function isValidJwt(token) {
  return token && token.split('.').length === 3;
}

describe('Stage X - Feature Name', () => {
  it('test description', async (ctx) => {
    console.log('TEST_LOGIN_TOKEN jwt-like:', isValidJwt(TEST_TOKEN));

    if (!TEST_TOKEN) {
      console.log('SKIP: missing TEST_LOGIN_TOKEN');
      ctx.skip();
      return;
    }

    if (!isValidJwt(TEST_TOKEN)) {
      throw new Error('Invalid TEST_LOGIN_TOKEN: must be a real JWT (header.payload.signature)');
    }

    // Test implementation with:
    // .set('Authorization', `Bearer ${TEST_TOKEN}`)
  }, 15000);
});
```

---

## CI/CD Requirements

### Secrets
- **KEY:** `TEST_LOGIN_TOKEN`
- **VALUE:** Real JWT from Dev/Stage login
- **Protection:** Masked/Protected in all environments

### Nightly Criteria
- **Tests:** ALL PASSED
- **Skipped:** 0 (with valid JWT)
- **Exit code:** 0

### On Failure
- Auto-create Issue with verbose log
- No code changes without approved Issue

---

## Allowed Skip Conditions

1. `TEST_LOGIN_TOKEN` missing (CI without secret)
2. Rate-limited (429) with no fallback

**NOT allowed:** Skip for convenience or "flaky" tests

---

## Stage Status

| Stage | Status | Auth Pattern |
|-------|--------|--------------|
| Stage8 | 🔒 CLOSED | ✅ Compliant |
| Stage9 | 🟢 ACTIVE | ✅ Compliant |
| Stage10+ | 📋 PLANNED | Must comply |

---

**This standard is LOCKED. Changes require system review.**
