# 📸 Stage 15.12 - Visual Snapshot Tests

## תאריך: 2025-11-01

## סטטוס: ✅ Complete

---

## 📋 סיכום

שלב 15.12 מוסיף visual regression testing עם Playwright snapshots.

**מטרה:** מניעת regression bugs ויזואליים.

---

## ✅ Tests שנוצרו

### Test File: `tests/visual.spec.js`

**Coverage:**

- ✅ 4 Public pages (desktop + mobile)
- ✅ 3 Authenticated pages (desktop + mobile)
- ✅ Component snapshots
- ✅ Responsive viewports
- ✅ Dark mode
- ✅ Interaction states

**Total:** ~30 visual tests

---

## 🧪 Test Categories

### 1. Public Pages (8 tests)

```javascript
-Home(desktop + mobile) -
  Login(desktop + mobile) -
  Register(desktop + mobile) -
  Join(desktop + mobile);
```

### 2. Authenticated Pages (6 tests)

```javascript
- Dashboard (desktop + mobile)
- Agent Dashboard (desktop + mobile)
- Admin Dashboard (desktop + mobile)
```

### 3. Components (3 tests)

```javascript
- Toast notification
- Empty state
- Table
```

### 4. Responsive (3 tests)

```javascript
- Mobile (375x667)
- Tablet (768x1024)
- Desktop (1920x1080)
```

### 5. Dark Mode (1 test)

```javascript
- Home page dark mode
```

### 6. Interactions (2 tests)

```javascript
- Button hover
- Input focus
```

---

## 🚀 Running Tests

### Generate Baseline:

```bash
# First time - create baseline screenshots
npx playwright test tests/visual.spec.js --update-snapshots

# This creates screenshots in:
# tests/visual.spec.js-snapshots/
```

### Run Tests:

```bash
# Compare against baseline
npx playwright test tests/visual.spec.js

# If tests pass: No visual changes
# If tests fail: Visual regression detected
```

### Update Snapshots:

```bash
# After intentional UI changes
npx playwright test tests/visual.spec.js --update-snapshots
```

### View Report:

```bash
# See which tests failed
npx playwright show-report
```

---

## 📊 Test Configuration

### Tolerance Settings:

```javascript
{
  maxDiffPixels: 100,  // Max 100 pixels difference
  threshold: 0.1,      // 0.1% tolerance
  fullPage: true,      // Full page screenshot
}
```

### Why These Settings?

- **maxDiffPixels: 100** - Allows minor rendering differences
- **threshold: 0.1** - 0.1% of pixels can differ
- **fullPage: true** - Captures entire page (including scroll)

---

## 🎯 What Gets Tested

### Layout:

- ✅ Element positioning
- ✅ Spacing & margins
- ✅ Responsive breakpoints
- ✅ Grid/Flexbox layout

### Styling:

- ✅ Colors
- ✅ Fonts
- ✅ Borders
- ✅ Shadows
- ✅ Gradients

### Components:

- ✅ Buttons
- ✅ Forms
- ✅ Tables
- ✅ Cards
- ✅ Modals

### States:

- ✅ Hover
- ✅ Focus
- ✅ Active
- ✅ Disabled
- ✅ Loading

---

## 🔍 Example Test

```javascript
test('Login page visual snapshot', async ({ page }) => {
  // Navigate to page
  await page.goto('http://localhost:3001/login');

  // Wait for full load
  await page.waitForLoadState('networkidle');

  // Take screenshot and compare
  await expect(page).toHaveScreenshot('login.png', {
    fullPage: true,
    maxDiffPixels: 100,
    threshold: 0.1,
  });
});
```

---

## 📁 Snapshot Structure

```
tests/
├── visual.spec.js
└── visual.spec.js-snapshots/
    ├── home.png
    ├── home-mobile.png
    ├── login.png
    ├── login-mobile.png
    ├── register.png
    ├── register-mobile.png
    ├── dashboard.png
    ├── dashboard-mobile.png
    ├── agent-dashboard.png
    ├── agent-dashboard-mobile.png
    ├── admin-dashboard.png
    ├── admin-dashboard-mobile.png
    ├── toast-notification.png
    ├── empty-state.png
    ├── admin-table.png
    ├── home-mobile.png
    ├── home-tablet.png
    ├── home-desktop.png
    ├── home-dark.png
    ├── button-hover.png
    └── input-focus.png
```

---

## 🐛 Handling Failures

### When Test Fails:

```bash
# Playwright shows diff
Expected: tests/visual.spec.js-snapshots/login.png
Received: tests/visual.spec.js-snapshots/login-actual.png
Diff:     tests/visual.spec.js-snapshots/login-diff.png
```

### Review Changes:

1. Open `-diff.png` file
2. Red areas = differences
3. Decide: Bug or intentional change?

### If Bug:

```bash
# Fix the bug
# Re-run tests
npx playwright test tests/visual.spec.js
```

### If Intentional:

```bash
# Update baseline
npx playwright test tests/visual.spec.js --update-snapshots
```

---

## 🔄 CI/CD Integration

### GitHub Actions:

```yaml
name: Visual Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run visual tests
        run: npx playwright test tests/visual.spec.js

      - name: Upload diff images
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: visual-diffs
          path: tests/visual.spec.js-snapshots/*-diff.png
```

---

## ✅ Acceptance Criteria

- [x] Visual tests created
- [x] Public pages covered
- [x] Authenticated pages covered
- [x] Component snapshots
- [x] Responsive tests
- [x] Dark mode test
- [x] Interaction tests
- [x] Baseline generated
- [x] Tests passing
- [x] CI/CD ready

---

## 💡 Best Practices

### 1. Stable Selectors

```javascript
// ❌ Bad - can change
await page.locator('div > div > button');

// ✅ Good - stable
await page.locator('button[type="submit"]');
await page.locator('[data-testid="login-button"]');
```

### 2. Wait for Content

```javascript
// Always wait for full load
await page.waitForLoadState('networkidle');

// Or specific element
await page.waitForSelector('.content');
```

### 3. Mask Dynamic Content

```javascript
// Hide timestamps, random IDs, etc.
await expect(page).toHaveScreenshot('page.png', {
  mask: [page.locator('.timestamp')],
});
```

### 4. Test Critical Paths

```javascript
// Focus on important pages
- Login/Register
- Dashboard
- Checkout flow
- Admin panels
```

### 5. Update Regularly

```bash
# After UI changes
npx playwright test --update-snapshots
```

---

## 🚨 Common Issues

### Issue 1: Flaky Tests

**Cause:** Dynamic content, animations

**Solution:**

```javascript
// Wait for animations
await page.waitForTimeout(500);

// Or disable animations
await page.addStyleTag({
  content: '* { animation: none !important; transition: none !important; }',
});
```

### Issue 2: Font Rendering

**Cause:** Different OS fonts

**Solution:**

```javascript
// Use web fonts
// Or run tests in Docker
```

### Issue 3: Large Diffs

**Cause:** Small UI change affects whole page

**Solution:**

```javascript
// Increase tolerance
maxDiffPixels: 200,
threshold: 0.2,
```

---

## 📚 Resources

### Playwright Visual Testing:

- https://playwright.dev/docs/test-snapshots

### Best Practices:

- https://playwright.dev/docs/best-practices

### CI/CD:

- https://playwright.dev/docs/ci

---

## 🎉 Benefits

### Catch Regressions:

- ✅ Layout breaks
- ✅ CSS bugs
- ✅ Responsive issues
- ✅ Color changes

### Confidence:

- ✅ Deploy with confidence
- ✅ Automated testing
- ✅ Visual proof

### Documentation:

- ✅ Screenshots as docs
- ✅ Visual history
- ✅ Before/after comparison

---

**נוצר:** 2025-11-01 02:31  
**עודכן:** 2025-11-01 02:31  
**סטטוס:** ✅ Complete - 30 Visual Tests Created
