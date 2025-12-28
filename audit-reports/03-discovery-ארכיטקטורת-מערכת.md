# 🔍 דוח Discovery - ארכיטקטורת מערכת VIPO

**תאריך:** 27 בדצמבר 2025  
**סוג בדיקה:** System Discovery & Architecture Mapping

---

## 1. סקירת המערכת

### סיווג המערכת

| היבט | סיווג |
|------|-------|
| **סוג ראשי** | E-Commerce היברידי + שוק סוכנים |
| **מודל עסקי** | פלטפורמת מכירות מבוססת סוכנים |
| **ארכיטקטורה** | Full-Stack Monolith (Next.js) |

### מטרה עסקית

**VIPO היא פלטפורמת מסחר אלקטרוני מבוססת סוכנים** המשלבת:

1. **חנות מקוונת** - מכירת מוצרים ישירה ללקוחות
2. **רשת סוכנים** - מערכת הפניות ועמלות רב-שכבתית
3. **רכישה קבוצתית** - יכולות קנייה בכמויות
4. **שיווק שותפים** - מעקב סוכנים באמצעות קופונים

---

## 2. טכנולוגיות

### Frontend Stack

| טכנולוגיה | גרסה | מטרה |
|-----------|------|------|
| Next.js | 14.2.5 | Framework |
| React | 18.3.1 | ספריית UI |
| Tailwind CSS | 3.4.13 | עיצוב |
| Chart.js | 4.5.1 | ויזואליזציה |

### Backend Stack

| טכנולוגיה | גרסה | מטרה |
|-----------|------|------|
| Node.js | - | Runtime |
| MongoDB | 6.8.0 | Database driver |
| Mongoose | 8.19.2 | ODM |
| bcryptjs | 2.4.3 | הצפנת סיסמאות |
| jsonwebtoken | 9.0.2 | אימות JWT |

---

## 3. שירותים חיצוניים

| שירות | מטרה | סטטוס |
|-------|------|-------|
| **MongoDB Atlas** | מסד נתונים | קריטי |
| **Vercel** | אחסון | קריטי |
| **PayPlus** | תשלומים | חשוב - צריך ENV |
| **Cloudinary** | תמונות/מדיה | חשוב - צריך ENV |
| **SendGrid** | Email | אופציונלי - צריך ENV |
| **Twilio** | OTP/SMS | אופציונלי - צריך ENV |
| **WhatsApp API** | הודעות | אופציונלי - צריך ENV |
| **Web Push (VAPID)** | התראות | מוגדר |
| **GitHub Pages** | דף בית סטטי | פעיל |

---

## 4. מבנה דפים (44 דפים)

### דפים ציבוריים (ללא הרשאה)
- `/` - דף בית
- `/products` - קטלוג מוצרים
- `/products/[id]` - פרטי מוצר
- `/cart` - סל קניות
- `/checkout` - תהליך תשלום
- `/login`, `/register` - אימות
- `/join` - הצטרפות כסוכן
- `/contact`, `/privacy`, `/terms` - דפי מידע

### דפים מוגנים
- `/dashboard` - דשבורד משתמש
- `/profile` - פרופיל
- `/my-orders` - היסטוריית הזמנות

### דפי סוכן (role: agent)
- `/agent` - דשבורד סוכן
- `/agent/marketing` - כלי שיווק
- `/sales`, `/reports` - מעקב מכירות

### דפי מנהל (role: admin)
- `/admin` - דשבורד מנהל
- `/admin/analytics` - אנליטיקס
- `/admin/products/*` - ניהול מוצרים
- `/admin/agents/*` - ניהול סוכנים
- `/admin/notifications` - התראות
- `/admin/transactions` - טרנזקציות

---

## 5. מודלי נתונים

| ישות | מטרה |
|------|------|
| **User** | משתמשים (admin/agent/customer) |
| **Product** | מוצרים |
| **Order** | הזמנות |
| **Transaction** | טרנזקציות פיננסיות |
| **Message** | הודעות |
| **Catalog** | קטגוריות |
| **ReferralLog** | לוגי הפניות |
| **Sale** | מכירות |
| **WithdrawalRequest** | בקשות משיכה |

---

## 6. היררכיית תפקידים

```
ADMIN (מנהל)
├── גישה מלאה למערכת
├── ניהול מוצרים, משתמשים, הזמנות
├── אישור משיכות
└── שליחת התראות

AGENT (סוכן)
├── דשבורד אישי
├── לינקים וקופונים להפניות
├── מעקב עמלות
└── כלי שיווק

CUSTOMER (לקוח)
├── גלישה ורכישת מוצרים
├── היסטוריית הזמנות
└── ניהול פרופיל
```

---

## 7. אבטחה

| מנגנון | מימוש |
|--------|-------|
| אחסון סיסמאות | bcrypt hash (10 rounds) |
| טוקן סשן | JWT (HS256) |
| מיקום טוקן | HTTP-only cookie |
| תפוגת טוקן | 7 ימים |
| הגנת נתיבים | Next.js Middleware |
| הגנת API | `requireAuthApi()` / `requireAdminApi()` |

---

## 8. משתני ENV נדרשים

| קטגוריה | משתנים |
|---------|--------|
| **מסד נתונים** | `MONGODB_URI`, `MONGODB_DB` |
| **אימות** | `JWT_SECRET` |
| **תשלומים** | `PAYPLUS_API_KEY`, `PAYPLUS_SECRET`, `PAYPLUS_WEBHOOK_SECRET` |
| **Email** | `SENDGRID_API_KEY` |
| **SMS/OTP** | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` |
| **מדיה** | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| **Push** | `WEB_PUSH_PUBLIC_KEY`, `WEB_PUSH_PRIVATE_KEY` |

---

## 9. מאפיינים ייחודיים

1. **מערכת עמלות סוכנים** - מעקב הפניות רב-שכבתי עם חישוב עמלות אוטומטי
2. **שיוך מבוסס קופונים** - לכל סוכן קוד קופון ייחודי למעקב מכירות
3. **רכישה קבוצתית** - תמיכה בקמפיינים של קנייה בכמויות
4. **גיימיפיקציה** - מטרות סוכנים, רמות וכללי בונוסים
