# 🧪 Stage 14.1 - Pre-Flight E2E Testing Checklist

## תאריך בדיקה: _______________
## נבדק על ידי: _______________
## סביבה: DEV (localhost:3001)

---

## ✅ Test Matrix

### 1. הרשמה רגילה
- [ ] פתח דפדפן במצב incognito
- [ ] גלוש ל: `http://localhost:3001/register`
- [ ] מלא פרטים:
  - שם מלא: Test User
  - אימייל: testuser@example.com
  - סיסמה: test123456
  - תפקיד: לקוח
- [ ] לחץ "הרשמה"
- [ ] **תוצאה צפויה:** הרשמה מוצלחת, מופנה לדף הבית
- [ ] **סטטוס:** ✅ PASS / ❌ FAIL
- [ ] **הערות:** _______________

---

### 2. הרשמה עם Referral
- [ ] פתח incognito חדש
- [ ] קבל User ID של סוכן קיים (מ-DB או דשבורד)
- [ ] גלוש ל: `http://localhost:3001/?ref=<AGENT_ID>`
- [ ] בדוק DevTools → Application → Cookies
  - [ ] קוקי `refSource` נוצר עם הערך `<AGENT_ID>`
- [ ] גלוש ל: `/register`
- [ ] הירשם עם פרטים חדשים:
  - שם: Referred User
  - אימייל: referred@example.com
  - סיסמה: test123456
- [ ] **תוצאה צפויה:** 
  - הרשמה מוצלחת
  - בדוק ב-DB: `referredBy` מכיל את ה-AGENT_ID
  - הקוקי `refSource` נמחק
- [ ] **סטטוס:** ✅ PASS / ❌ FAIL
- [ ] **הערות:** _______________

---

### 3. עדכון referralCount
- [ ] בדוק ב-DB את הסוכן המפנה:
  ```javascript
  db.users.findOne({ _id: ObjectId("<AGENT_ID>") })
  ```
- [ ] **תוצאה צפויה:**
  - `referralCount` גדל ב-1
  - `referralsCount` גדל ב-1
- [ ] **סטטוס:** ✅ PASS / ❌ FAIL
- [ ] **הערות:** _______________

---

### 4. יצירת עסקה ועדכון commissionBalance
- [ ] התחבר כמשתמש (לקוח או סוכן)
- [ ] קבל Product ID מ-DB:
  ```javascript
  db.products.findOne({ active: true })
  ```
- [ ] צור עסקה:
  ```bash
  curl -X POST http://localhost:3001/api/transactions \
    -H "Content-Type: application/json" \
    -H "Cookie: token=<JWT>" \
    -d '{"productId":"<PRODUCT_ID>","amount":1299}'
  ```
- [ ] **תוצאה צפויה:** 
  - Status: 201 Created
  - Transaction נוצר ב-DB
- [ ] אם המשתמש נרשם דרך referral:
  - [ ] בדוק את הסוכן המפנה ב-DB
  - [ ] **תוצאה צפויה:** `commissionBalance` גדל ב-150₪
- [ ] **סטטוס:** ✅ PASS / ❌ FAIL
- [ ] **הערות:** _______________

---

### 5. נראות Admin - כל ההזמנות
- [ ] התחבר כ-admin: `admin@vipo.local` / `12345678A`
- [ ] גלוש ל: `/admin/reports/transactions` (או דף דוחות)
- [ ] **תוצאה צפויה:**
  - רואה את **כל** העסקאות של כל המשתמשים
  - יכול לפלטר לפי סטטוס ותאריך
  - רואה פרטי משתמש ומוצר
- [ ] **סטטוס:** ✅ PASS / ❌ FAIL
- [ ] **הערות:** _______________

---

### 6. נראות Agent - רק עסקאות שלו
- [ ] התחבר כ-agent (או customer)
- [ ] גלוש לדשבורד עסקאות
- [ ] **תוצאה צפויה:**
  - רואה **רק** את העסקאות שלו
  - לא רואה עסקאות של משתמשים אחרים
  - ניסיון לגשת ל-`/api/admin/transactions` → 403 Forbidden
- [ ] **סטטוס:** ✅ PASS / ❌ FAIL
- [ ] **הערות:** _______________

---

### 7. ניווט בין דפים - אין שגיאות
- [ ] פתח DevTools → Console
- [ ] נווט בין הדפים הבאים:
  - [ ] `/` - דף הבית
  - [ ] `/login` - התחברות
  - [ ] `/register` - הרשמה
  - [ ] `/agent` - דשבורד סוכן (אם מחובר)
  - [ ] `/admin` - דשבורד מנהל (אם admin)
  - [ ] `/p/<slug>` - עמוד מוצר
- [ ] **תוצאה צפויה:**
  - אין שגיאות אדומות בקונסול
  - אין 404/500 errors
  - כל הדפים נטענים תקין
- [ ] בדוק Terminal (Server logs):
  - [ ] אין ERROR logs
  - [ ] רק INFO/LOG רגילים
- [ ] **סטטוס:** ✅ PASS / ❌ FAIL
- [ ] **הערות:** _______________

---

## 📊 סיכום תוצאות

| Test | Status | Notes |
|------|--------|-------|
| 1. הרשמה רגילה | ⬜ | |
| 2. הרשמה עם Referral | ⬜ | |
| 3. עדכון referralCount | ⬜ | |
| 4. עסקה + commissionBalance | ⬜ | |
| 5. Admin - כל ההזמנות | ⬜ | |
| 6. Agent - רק שלו | ⬜ | |
| 7. ניווט ללא שגיאות | ⬜ | |

**סה״כ PASS:** _____ / 7  
**סה״כ FAIL:** _____ / 7

---

## ✅ Acceptance Criteria

- [ ] כל 7 הבדיקות עברו (PASS)
- [ ] אין ERROR בקונסול הדפדפן
- [ ] אין ERROR בלוגים של השרת
- [ ] כל הזרימות עובדות כמצופה

---

## 🐛 בעיות שנמצאו

1. _______________
2. _______________
3. _______________

---

## 📝 הערות נוספות

_______________
_______________
_______________

---

**חתימה:** _______________  
**תאריך:** _______________
