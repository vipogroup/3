# 🔍 Stage 15.1 - Build Audit & Dependencies

## תאריך: 2025-11-01
## סטטוס: In Progress

---

## 📋 משימות

### ✅ 1. בדיקת package.json
**תוצאה:** קובץ נקרא בהצלחה

**תלויות ייצור (dependencies):**
- bcrypt: ^6.0.0
- bcryptjs: 2.4.3
- chart.js: ^4.5.1
- cloudinary: ^2.8.0
- clsx: 2.1.1
- cookie: 0.6.0
- dayjs: 1.11.13
- jose: ^6.1.0
- jsonwebtoken: ^9.0.2
- mongodb: 6.8.0
- mongoose: ^8.19.2
- next: 14.2.5
- pdfkit: ^0.17.2
- qrcode: 1.5.4
- react: 18.3.1
- react-dom: 18.3.1
- sharp: 0.33.5
- uuid: 9.0.1
- zod: 3.23.8

**תלויות פיתוח (devDependencies):**
- @playwright/test: ^1.56.1
- autoprefixer: 10.4.19
- cross-env: ^10.1.0
- dotenv: ^17.2.3
- eslint: ^8.57.0
- eslint-config-next: 14.2.5
- postcss: 8.4.47
- supertest: ^7.1.4
- tailwindcss: 3.4.13
- vitest: ^4.0.5

---

### ⚠️ 2. npm ci - בעיית הרשאות
**בעיה:** 
```
EPERM: operation not permitted, unlink 'node_modules\@next\swc-win32-x64-msvc\next-swc.win32-x64-msvc.node'
```

**סיבה אפשרית:**
- קובץ נעול על ידי תהליך אחר (Next.js dev server, VS Code, Antivirus)
- חוסר הרשאות

**פתרון מומלץ:**
1. סגור את כל תהליכי Node.js הפעילים
2. סגור VS Code
3. הרץ כ-Administrator:
   ```bash
   npm ci
   ```
4. או השתמש ב-`npm install` במקום `npm ci`

---

### 🔄 3. npm run build - ממתין להתקנת תלויות
**סטטוס:** לא ניתן להריץ ללא node_modules

**צעדים הבאים:**
1. התקן תלויות: `npm install`
2. הרץ build: `npm run build`
3. תקן אזהרות ושגיאות

---

### 🔒 4. npm audit - ממתין להתקנת תלויות
**סטטוס:** טרם הורץ

**צעדים מתוכננים:**
```bash
# בדיקת אבטחה
npm audit --production

# תיקון אוטומטי
npm audit fix

# תיקון כולל breaking changes
npm audit fix --force

# דוח מפורט
npm audit --json > audit-report.json
```

---

## 📊 ממצאים ראשוניים

### תלויות שעשויות להיות מיותרות:
1. **bcrypt** + **bcryptjs** - יש שתיים! צריך רק אחת
   - המלצה: השאר רק `bcryptjs` (pure JS, cross-platform)
   - הסר את `bcrypt` (native, בעיות compilation)

2. **jose** + **jsonwebtoken** - שתי ספריות JWT
   - המלצה: השאר רק אחת
   - `jose` - מודרני יותר, built-in Next.js
   - `jsonwebtoken` - ותיק, יציב

### תלויות שחסרות (אם נדרשות):
- **@types/node** - אם משתמשים ב-TypeScript
- **@types/react** - אם משתמשים ב-TypeScript
- **eslint-plugin-react** - לכללי ESLint של React

---

## 🎯 תוכנית פעולה

### שלב 1: ניקוי תלויות כפולות
```bash
# הסר bcrypt (השאר bcryptjs)
npm uninstall bcrypt

# בחר JWT library אחת
# אם משתמשים ב-jose בקוד:
npm uninstall jsonwebtoken
# אם משתמשים ב-jsonwebtoken בקוד:
npm uninstall jose
```

### שלב 2: עדכון תלויות
```bash
# בדוק עדכונים
npm outdated

# עדכן תלויות minor/patch
npm update

# עדכן Next.js (אם צריך)
npm install next@latest react@latest react-dom@latest
```

### שלב 3: Build & Audit
```bash
# התקן תלויות נקיות
npm ci

# Build
npm run build

# Security audit
npm audit --production
npm audit fix
```

### שלב 4: תיעוד
- צלם screenshots של warnings/errors
- תעד כל שגיאה ופתרון
- צור PR: "15.1 – Build & Security Dependencies Cleanup"

---

## 🐛 בעיות ידועות

### 1. EPERM on Windows
**תיאור:** Windows נועל קבצים בשימוש

**פתרונות:**
- סגור כל תהליכי Node.js
- הרץ Terminal כ-Administrator
- השתמש ב-`npm install` במקום `npm ci`
- נסה `rimraf node_modules && npm install`

### 2. bcrypt compilation
**תיאור:** bcrypt דורש Python + Visual Studio Build Tools

**פתרון:** השתמש ב-bcryptjs במקום

### 3. Sharp on Windows
**תיאור:** Sharp עשוי לדרוש dependencies נוספות

**פתרון:** 
```bash
npm install --platform=win32 --arch=x64 sharp
```

---

## 📝 הערות

### תלויות קריטיות לבדיקה:
1. **mongoose** - וודא תאימות עם MongoDB version
2. **next** - בדוק changelog ל-breaking changes
3. **sharp** - תלות native, בדוק platform support
4. **bcryptjs** - וודא שכל הקוד משתמש בזה ולא ב-bcrypt

### Security Best Practices:
- הרץ `npm audit` לפני כל deployment
- עדכן תלויות באופן קבוע
- השתמש ב-`npm ci` ב-CI/CD
- נעל גרסאות ב-package-lock.json

---

## ✅ Acceptance Criteria

- [ ] `npm ci` רץ ללא שגיאות
- [ ] `npm run build` מצליח
- [ ] אין warnings בקונסול
- [ ] `npm audit --production` מראה 0 vulnerabilities (או מתועדות)
- [ ] תלויות כפולות הוסרו
- [ ] package.json נקי ומסודר
- [ ] PR נוצר עם כל השינויים

---

## 🔄 Status Updates

**2025-11-01 01:57:**
- ✅ package.json נקרא
- ⚠️ npm ci נכשל (EPERM)
- ⏳ ממתין לפתרון בעיית הרשאות
- 📝 תיעוד נוצר

**הצעד הבא:**
1. המשתמש יסגור תהליכים פעילים
2. ינסה שוב `npm install` או `npm ci`
3. נמשיך עם Build & Audit

---

**נוצר:** 2025-11-01 01:57  
**עודכן:** 2025-11-01 01:57  
**סטטוס:** 🟡 In Progress - Waiting for user action
