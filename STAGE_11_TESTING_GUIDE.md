# 🧪 Stage 11 - Testing Guide: Referral System

## 🎯 מטרה

מדריך בדיקות מקיף למערכת ההפניות (חבר-מביא-חבר).

---

## 📋 Pre-Test Checklist

### הכנה:

- [ ] השרת רץ: `npm run dev`
- [ ] יש משתמש admin: `admin@vipo.local` / `12345678A`
- [ ] יש משתמש agent/customer לבדיקה
- [ ] DevTools פתוח (F12) לבדיקת cookies ו-localStorage

---

## 🧪 11.7 - Manual E2E Testing

### Test 1: שמירת מקור הפניה

#### 1.1 - Cookie Creation ✅

**צעדים:**

1. פתח דפדפן incognito
2. קבל User ID של משתמש קיים (למשל מ-DB או מהדשבורד)
3. גלוש ל: `http://localhost:3001/?ref=<USER_ID>`

**בדיקה:**

- [ ] DevTools → Application → Cookies
- [ ] קוקי `refSource` נוצר עם הערך `<USER_ID>`
- [ ] `HttpOnly`: true
- [ ] `SameSite`: lax
- [ ] `Max-Age`: 2592000 (30 days)

#### 1.2 - Cookie Persistence ✅

**צעדים:**

1. רענן את הדף (F5)
2. בדוק cookies שוב

**בדיקה:**

- [ ] הקוקי עדיין קיים
- [ ] הערך לא השתנה

#### 1.3 - localStorage Fallback ✅

**צעדים:**

1. פתח Console
2. הקלד: `localStorage.getItem("referrerId")`

**בדיקה:**

- [ ] מחזיר את ה-USER_ID
- [ ] זהה לערך בקוקי

---

### Test 2: הרשמה עם הפניה

#### 2.1 - Successful Referral Registration ✅

**צעדים:**

1. המשך מ-Test 1 (עם הקוקי)
2. גלוש ל: `http://localhost:3001/register`
3. מלא פרטים:
   - שם: Test User
   - אימייל: testuser@example.com
   - סיסמה: test123456
   - תפקיד: לקוח
4. לחץ "הרשמה"

**בדיקה:**

- [ ] ההרשמה מצליחה
- [ ] מופנה לדף הבית (auto-login)
- [ ] בדוק ב-DB:
  ```javascript
  db.users.findOne({ email: 'testuser@example.com' });
  ```
- [ ] השדה `referredBy` מכיל את ה-USER_ID המקורי
- [ ] הקוקי `refSource` נמחק (בדוק ב-DevTools)

#### 2.2 - Referrer Counter Updated ✅

**צעדים:**

1. בדוק את המשתמש המפנה ב-DB:
   ```javascript
   db.users.findOne({ _id: ObjectId('<USER_ID>') });
   ```

**בדיקה:**

- [ ] `referralsCount` גדל ב-1
- [ ] אם היה 0, עכשיו 1
- [ ] אם היה N, עכשיו N+1

---

### Test 3: הגנת Self-Referral

#### 3.1 - Prevent Self-Referral ✅

**צעדים:**

1. התחבר כמשתמש קיים
2. קבל את ה-ID שלך
3. התנתק
4. פתח incognito
5. גלוש ל: `http://localhost:3001/?ref=<YOUR_OWN_ID>`
6. נסה להירשם עם אותו אימייל/טלפון

**תוצאה צפויה:**

- [ ] ההרשמה תיכשל (משתמש כבר קיים)

**אלטרנטיבה - בדיקה ישירה:**

1. ערוך את ה-DB ידנית:
   ```javascript
   db.users.updateOne(
     { email: 'test@example.com' },
     { $set: { referredBy: ObjectId('<SAME_USER_ID>') } },
   );
   ```
2. בדוק שהקוד מזהה ומנטרל:
   - [ ] `referredBy` אמור להיות null או undefined

---

### Test 4: Dashboard - Referral Card

#### 4.1 - Display Referral Link ✅

**צעדים:**

1. התחבר כמשתמש (agent/customer)
2. הוסף `<ReferralCard />` לדשבורד (אם עדיין לא)
3. רענן את הדף

**בדיקה:**

- [ ] כרטיס "חבר-מביא-חבר" מוצג
- [ ] לינק אישי מוצג: `http://localhost:3001/?ref=<YOUR_ID>`
- [ ] מספר הפניות נכון (0 או יותר)

#### 4.2 - Copy Link ✅

**צעדים:**

1. לחץ על "📋 העתק לינק"
2. הדבק במקום אחר (Notepad/Console)

**בדיקה:**

- [ ] הלינק הועתק בהצלחה
- [ ] הכפתור משתנה ל-"✓ הועתק!" למשך 2 שניות
- [ ] הלינק תקין ומכיל את ה-ID הנכון

#### 4.3 - WhatsApp Share ✅

**צעדים:**

1. לחץ על "שתף ב-WhatsApp"
2. בדוק את הקישור שנפתח

**בדיקה:**

- [ ] נפתח WhatsApp Web/App
- [ ] הטקסט כולל: "הצטרפו אליי למערכת VIPO: http://localhost:3001/?ref=..."
- [ ] הלינק מלא ותקין

---

### Test 5: Multiple Referrals

#### 5.1 - Multiple Users from Same Referrer ✅

**צעדים:**

1. קבל referral link של משתמש A
2. הרשם 3 משתמשים חדשים דרך הלינק:
   - User B
   - User C
   - User D

**בדיקה:**

- [ ] כל 3 המשתמשים נוצרו עם `referredBy` = User A
- [ ] `referralsCount` של User A = 3
- [ ] בדשבורד של User A מוצג: "סה״כ הפניות: 3"

---

### Test 6: No Referral (Normal Registration)

#### 6.1 - Registration Without Referral ✅

**צעדים:**

1. פתח incognito חדש
2. גלוש ישירות ל: `http://localhost:3001/register`
3. הירשם (ללא ?ref=)

**בדיקה:**

- [ ] ההרשמה מצליחה
- [ ] `referredBy` לא קיים או null
- [ ] אין שגיאות
- [ ] אף משתמש לא קיבל +1 ב-`referralsCount`

---

## 🔧 11.8 - API Testing with cURL

### Test 1: Join API (Cookie Creation)

```bash
# Test referral cookie creation
curl -I "http://localhost:3001/api/join?ref=<USER_ID>"
```

**בדיקה:**

- [ ] Status: 307 (Redirect)
- [ ] Location: http://localhost:3001/
- [ ] Set-Cookie: refSource=<USER_ID>; HttpOnly; SameSite=Lax

---

### Test 2: Register API with Cookie

```bash
# Step 1: Get cookie
COOKIE=$(curl -s -I "http://localhost:3001/api/join?ref=<USER_ID>" | grep -i "set-cookie" | cut -d' ' -f2)

# Step 2: Register with cookie
curl -X POST "http://localhost:3001/api/auth/register" \
  -H "Content-Type: application/json" \
  -H "Cookie: $COOKIE" \
  -d '{
    "fullName": "API Test User",
    "email": "apitest@example.com",
    "password": "test123456",
    "role": "customer"
  }'
```

**בדיקה:**

- [ ] Status: 201
- [ ] Response: `{"ok":true,"userId":"..."}`
- [ ] בדוק ב-DB שה-user נוצר עם `referredBy`

---

### Test 3: Register API with referrerId in Body

```bash
curl -X POST "http://localhost:3001/api/auth/register" \
  -H "Content-Type: "application/json" \
  -d '{
    "fullName": "Body Ref Test",
    "email": "bodyref@example.com",
    "password": "test123456",
    "role": "customer",
    "referrerId": "<USER_ID>"
  }'
```

**בדיקה:**

- [ ] Status: 201
- [ ] User נוצר עם `referredBy`

---

### Test 4: Referrals Summary API

```bash
# Login first to get JWT token
TOKEN=$(curl -s -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@vipo.local","password":"12345678A"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Get referrals summary
curl -X GET "http://localhost:3001/api/referrals/summary" \
  -H "Cookie: token=$TOKEN"
```

**בדיקה:**

- [ ] Status: 200
- [ ] Response:
  ```json
  {
    "ok": true,
    "myRefLink": "http://localhost:3001/?ref=...",
    "referrals": { "total": 0 },
    "credits": { "total": 0 }
  }
  ```

---

## ⚙️ 11.9 - ENV and Dependencies Check

### Environment Variables

בדוק `.env.local`:

```bash
cat app/.env.local | grep PUBLIC_URL
```

**בדיקה:**

- [ ] `PUBLIC_URL` מוגדר
- [ ] בפיתוח: `http://localhost:3001`
- [ ] בפרודקשן: `https://yourdomain.com`

### Dependencies

```bash
# Check if all packages are installed
npm list mongodb bcryptjs jsonwebtoken
```

**בדיקה:**

- [ ] כל החבילות מותקנות
- [ ] אין שגיאות

---

## 🛡️ 11.10 - Anti-Abuse Measures (Optional)

### Test 1: Rate Limiting (if implemented)

**צעדים:**

1. נסה להירשם 10 פעמים תוך דקה מאותו IP

**בדיקה:**

- [ ] אם יש rate limiting: בקשות נחסמות אחרי X ניסיונות
- [ ] אם אין: כל הבקשות עוברות (תיעוד לעתיד)

### Test 2: Duplicate Referrals

**צעדים:**

1. הירשם עם referral
2. נסה לעדכן `referredBy` ידנית ב-DB למשתמש אחר

**בדיקה:**

- [ ] המערכת לא מאפשרת שינוי (אם מיושם)
- [ ] או: תיעוד שצריך להוסיף הגנה

---

## 🔄 11.11 - Rollback Plan

### אם משהו לא עובד:

#### Option 1: Disable Referral Tracking

```javascript
// In register route, comment out:
// const finalReferrerId = cookieRef || referrerId || null;
// ... referral logic ...
```

#### Option 2: Disable Counter Updates

```javascript
// Comment out:
// if (doc.referredBy) {
//   await users.updateOne(...)
// }
```

#### Option 3: Hide UI Card

```javascript
// Remove <ReferralCard /> from dashboard
```

---

## ✅ 11.12 - Done Criteria

### חובה לעבור:

- [ ] משתמש שנרשם דרך לינק הפניה מקבל `referredBy` תקין
- [ ] אין self-referral
- [ ] דשבורד מציג לינק אישי
- [ ] כפתור העתקה עובד
- [ ] WhatsApp share עובד
- [ ] `/api/referrals/summary` מחזיר נתונים תקינים
- [ ] `referralsCount` מתעדכן נכון
- [ ] קוקי נמחק אחרי הרשמה
- [ ] בדיקות ידניות עברו

### Nice to Have:

- [ ] Rate limiting
- [ ] Audit logs
- [ ] Analytics dashboard

---

## 📊 Test Results Template

```markdown
**תאריך בדיקה:** **\*\***\_\_\_**\*\***
**נבדק על ידי:** **\*\***\_\_\_**\*\***
**דפדפן:** **\*\***\_\_\_**\*\***

### תוצאות:

- [ ] Test 1: Cookie Creation - PASS/FAIL
- [ ] Test 2: Registration with Referral - PASS/FAIL
- [ ] Test 3: Self-Referral Prevention - PASS/FAIL
- [ ] Test 4: Dashboard Card - PASS/FAIL
- [ ] Test 5: Multiple Referrals - PASS/FAIL
- [ ] Test 6: No Referral - PASS/FAIL
- [ ] API Tests - PASS/FAIL

### בעיות שנמצאו:

1. ***
2. ***

### הערות:

---
```

---

**Stage 11 Testing Complete!** 🎉
