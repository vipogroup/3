# 🌥️ הגדרת Cloudinary למערכת VIPO

## שלב 1: יצירת חשבון Cloudinary

1. גלוש ל: https://cloudinary.com/users/register/free
2. הירשם עם אימייל (או Google/GitHub)
3. אשר את האימייל
4. היכנס ל-Dashboard

## שלב 2: העתקת פרטי ההתחברות

בדף ה-Dashboard תמצא:

```
Cloud name: your_cloud_name
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz123
```

## שלב 3: הוספה ל-.env.local

הוסף את השורות הבאות לקובץ `app/.env.local`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
```

**החלף את הערכים בפרטים האמיתיים מה-Dashboard שלך!**

## שלב 4: וידוא .gitignore

ודא שהקובץ `.gitignore` כולל:

```
.env.local
.env*.local
```

זה מבטיח שהסודות לא יועלו ל-Git.

## ✅ בדיקה

אחרי ההוספה, הפעל מחדש את השרת:

```bash
npm run dev
```

אם אין שגיאות - המשתנים נטענו בהצלחה!

---

## 📝 הערות חשובות

- **אל תשתף** את ה-API Secret עם אף אחד
- **אל תעלה** את .env.local ל-Git
- **ב-Production** (Render/Vercel) - הוסף את המשתנים בממשק הניהול
- **Free tier** של Cloudinary מספיק ל-25GB storage ו-25GB bandwidth בחודש

---

## 🔄 הבא

אחרי שהוספת את המשתנים, המשך לשלב 9.2 - התקנת הספרייה.
