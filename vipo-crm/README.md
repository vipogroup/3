# VIPO Multi-Tenant CRM

מערכת CRM רב-עסקית לניהול לידים, לקוחות, שיחות ומעקב אחר משימות, בהתאמה לפלטפורמת הרכישה הקבוצתית של VIPO. המערכת כוללת תמיכה בהפרדה מלאה בין עסקים (multi-tenant), מנגנון הרשאות מתקדם, Inbox אחוד לערוצים שונים, ומעקב אחר סוכנים ועמלות.

## בחירת טכנולוגיות
- **Backend**: Node.js + TypeScript (Express) עבור API גמיש ומהיר לפיתוח.
- **ORM**: Prisma (עם PostgreSQL בסביבה פרודקשן, SQLite/PG מקומי לפיתוח).
- **אימות**: JWT session tokens, עם אפשרות להרחבה ל-SSO במידת הצורך.
- **תזמון תהליכים**: BullMQ / cron בעתיד (ל־SLA Jobs).
- **תשתיות**: מבנה תיקיות מודולרי (`src/modules/*`), בדיקות יחידה ב-Jest.

## אבני דרך מתוכננות
1. תשתית פרויקט (TypeScript, Linting, Docker dev).
2. מודל נתונים (Prisma) לישותי Business, Users, Agents, Leads, Customers, Conversations, Tasks, Audit.
3. שכבת Auth + RBAC + Business Context Switcher.
4. API ל-Inbox ו-Conversations (סטטוסים, משימות, Follow-up).
5. מודול סוכנים וייחוס לידים (Attribution).
6. חיבור לפניות אתר (Webhook) ועדכון לידים.
7. דוחות ו-KPI בסיסיים.
8. תשתיות SLA והתראות.

## הרצה מקומית (כשתוגדר)
```bash
npm install
npm run db:migrate
npm run dev
```

> ⚠️ הקבצים עדיין בשלבי הקמה. בהתאם להתקדמות נוסיף הנחיות סביבתיות, Docker Compose ל-DB, וסקריפטים נוספים.
