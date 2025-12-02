# ✅ Stage 9 - QA Checklist: Cloud Images & CDN

## 🎯 מטרה

בדיקות קבלה מקיפות לשלב 9 - העלאת תמונות ל-Cloudinary

---

## 📋 Pre-Flight Checklist

### הגדרות סביבה:

- [ ] `CLOUDINARY_CLOUD_NAME` מוגדר ב-.env.local
- [ ] `CLOUDINARY_API_KEY` מוגדר ב-.env.local
- [ ] `CLOUDINARY_API_SECRET` מוגדר ב-.env.local
- [ ] .env.local לא מועלה ל-Git (.gitignore מכיל אותו)
- [ ] `npm list cloudinary` מציג את החבילה מותקנת
- [ ] השרת רץ ללא שגיאות dotenv

---

## 🧪 1. Upload Flow Tests

### 1.1 העלאה מוצלחת

**צעדים:**

1. פתח Admin → New Product (או Edit Product)
2. בחר תמונה תקינה (PNG/JPEG/WebP, < 5MB)
3. המתן לתצוגה מקדימה
4. שמור את המוצר

**תוצאה צפויה:**

- ✅ POST /api/upload מחזיר 200
- ✅ Response מכיל `{ url: "https://res.cloudinary.com/..." }`
- ✅ תצוגה מקדימה מוצגת
- ✅ המוצר נשמר עם `imageUrl` במסד הנתונים

**בדיקה:**

```bash
# Check network tab
POST /api/upload
Status: 200
Response: { "url": "https://res.cloudinary.com/...", ... }

# Check DB
db.products.findOne({ _id: ObjectId("...") })
# Should have: imageUrl: "https://res.cloudinary.com/..."
```

---

### 1.2 העלאה עם קובץ לא תקין

#### Test A: קובץ לא נתמך (.txt)

**צעדים:**

1. נסה להעלות קובץ .txt
2. בדוק תגובה

**תוצאה צפויה:**

- ✅ Status: 415 (Unsupported Media Type)
- ✅ Error: "Unsupported media type"

#### Test B: קובץ גדול מדי (>5MB)

**צעדים:**

1. נסה להעלות תמונה >5MB
2. בדוק תגובה

**תוצאה צפויה:**

- ✅ Status: 413 (Payload Too Large)
- ✅ Error: "File too large"

#### Test C: ללא קובץ

**צעדים:**

1. שלח POST /api/upload ללא קובץ
2. בדוק תגובה

**תוצאה צפויה:**

- ✅ Status: 400 (Bad Request)
- ✅ Error: "No file provided"

---

## 🖼️ 2. Image Rendering Tests

### 2.1 רשימת מוצרים

**צעדים:**

1. גלוש לרשימת מוצרים
2. בדוק שהתמונות מ-Cloudinary מוצגות

**תוצאה צפויה:**

- ✅ תמונות נטענות מ-`res.cloudinary.com`
- ✅ Next/Image עובד ללא אזהרות
- ✅ תמונות נטענות מהר (CDN)

**בדיקה:**

```javascript
// In browser console
document.querySelectorAll('img').forEach((img) => {
  console.log(img.src);
  // Should include: res.cloudinary.com
});
```

---

### 2.2 עמוד מוצר בודד

**צעדים:**

1. גלוש לעמוד מוצר בודד
2. בדוק תמונה ראשית

**תוצאה צפויה:**

- ✅ תמונה מוצגת מ-Cloudinary
- ✅ איכות תמונה טובה
- ✅ זמן טעינה מהיר

---

## 🔄 3. Backward Compatibility Tests

### 3.1 מוצרים ישנים עם imagePath

**צעדים:**

1. מצא מוצר עם `imagePath` בלבד (ללא `imageUrl`)
2. גלוש לעמוד המוצר

**תוצאה צפויה:**

- ✅ התמונה עדיין מוצגת (fallback ל-imagePath)
- ✅ אין שגיאות בקונסול

**בדיקה:**

```javascript
// Check product data
{
  imagePath: "public/uploads/old-image.jpg",
  imageUrl: "" // or missing
}
// Should still render the image
```

---

### 3.2 אחרי מיגרציה

**צעדים:**

1. הרץ: `node scripts/migrate-images-to-cloudinary.cjs`
2. בדוק שמוצרים ישנים קיבלו `imageUrl`

**תוצאה צפויה:**

- ✅ סקריפט רץ ללא שגיאות
- ✅ מוצרים עם `imagePath` קיבלו `imageUrl`
- ✅ תמונות מוצגות מ-Cloudinary

**בדיקה:**

```bash
# Check migration output
✅ Migrated: 5
⚠️  Skipped: 2
❌ Failed: 0
📝 Total: 7

# Check DB
db.products.find({ imageUrl: { $exists: true, $ne: "" } }).count()
# Should match migrated count
```

---

## 🚫 4. Security & Validation Tests

### 4.1 גודל קובץ

**צעדים:**

1. נסה להעלות תמונה 6MB
2. בדוק שנדחית

**תוצאה צפויה:**

- ✅ Status: 413
- ✅ הודעת שגיאה ברורה

---

### 4.2 סוג קובץ

**צעדים:**

1. נסה להעלות .exe / .pdf / .txt
2. בדוק שנדחית

**תוצאה צפויה:**

- ✅ Status: 415
- ✅ הודעת שגיאה ברורה

---

### 4.3 אין כתיבה מקומית

**צעדים:**

1. חפש בקוד: `grep -r "public/uploads" app/`
2. ודא שאין קוד שכותב לתיקייה מקומית

**תוצאה צפויה:**

- ✅ אין קוד שכותב ל-public/uploads
- ✅ כל ההעלאות דרך Cloudinary בלבד

---

## ⚡ 5. Performance Tests

### 5.1 זמן טעינה

**צעדים:**

1. פתח DevTools → Network
2. טען עמוד מוצרים
3. בדוק זמן טעינת תמונות

**תוצאה צפויה:**

- ✅ תמונות נטענות < 500ms
- ✅ CDN headers נוכחים (cf-cache-status, x-cache)
- ✅ תמונות ממוטבות (q_auto, f_auto)

---

### 5.2 טרנספורמציות

**צעדים:**

1. בדוק URL של תמונה בכרטיס מוצר
2. ודא שיש טרנספורמציות

**תוצאה צפויה:**

- ✅ URL כולל: `w_400,h_400,c_fill,q_auto:good,f_auto`
- ✅ גודל קובץ קטן יותר מהמקור

---

## 🔧 6. Error Handling Tests

### 6.1 Cloudinary לא זמין

**צעדים:**

1. שנה זמנית את CLOUDINARY_API_KEY לערך שגוי
2. נסה להעלות תמונה

**תוצאה צפויה:**

- ✅ Status: 500
- ✅ הודעת שגיאה ברורה
- ✅ לוג בשרת מציג את השגיאה

---

### 6.2 רשת איטית

**צעדים:**

1. DevTools → Network → Throttle to "Slow 3G"
2. נסה להעלות תמונה

**תוצאה צפויה:**

- ✅ הודעת "מעלה תמונה..." מוצגת
- ✅ העלאה מסתיימת בהצלחה (אם כי לוקח זמן)
- ✅ אין timeout errors

---

## 📱 7. Mobile & Responsive Tests

### 7.1 מובייל

**צעדים:**

1. פתח DevTools → Toggle device toolbar
2. בחר iPhone/Android
3. נסה להעלות תמונה

**תוצאה צפויה:**

- ✅ העלאה עובדת
- ✅ תצוגה מקדימה מוצגת נכון
- ✅ כפתורים נגישים

---

## 🎨 8. UI/UX Tests

### 8.1 תצוגה מקדימה

**צעדים:**

1. בחר תמונה
2. בדוק תצוגה מקדימה

**תוצאה צפויה:**

- ✅ תצוגה מקדימה מוצגת מיד אחרי העלאה
- ✅ גודל תצוגה סביר (200x200px)
- ✅ כפתור "הסר תמונה" עובד

---

### 8.2 הודעות משתמש

**צעדים:**

1. העלה תמונה
2. בדוק הודעות

**תוצאה צפויה:**

- ✅ "מעלה תמונה..." בזמן העלאה
- ✅ הודעת שגיאה ברורה בעברית במקרה של כשלון
- ✅ אין הודעות טכניות מבלבלות

---

## 📊 Summary Checklist

### Must Pass (Critical):

- [ ] העלאה מוצלחת עובדת
- [ ] תמונות מוצגות מ-Cloudinary
- [ ] ולידציה חוסמת קבצים לא תקינים
- [ ] אין כתיבה מקומית ל-public/uploads
- [ ] backward compatibility עובד

### Should Pass (Important):

- [ ] מיגרציה עובדת
- [ ] טרנספורמציות מיושמות
- [ ] Error handling תקין
- [ ] Mobile responsive

### Nice to Have (Enhancement):

- [ ] זמן טעינה < 500ms
- [ ] תצוגה מקדימה מהירה
- [ ] הודעות משתמש ברורות

---

## 🚀 Final Sign-Off

**Stage 9 is ready for production when:**

- ✅ All "Must Pass" tests pass
- ✅ At least 80% of "Should Pass" tests pass
- ✅ No critical bugs found
- ✅ Documentation is complete

**Tested by:** **\*\***\_\_\_**\*\***  
**Date:** **\*\***\_\_\_**\*\***  
**Status:** [ ] PASS / [ ] FAIL  
**Notes:** **\*\***\_\_\_**\*\***

---

## 🔄 Next Steps

אחרי שכל הבדיקות עוברות:

1. עדכן את ה-README עם הוראות Cloudinary
2. הוסף את המשתנים ל-Production (Render/Vercel)
3. הרץ מיגרציה ב-Production
4. עקוב אחרי לוגים ב-24 השעות הראשונות

---

**Stage 9 Complete!** 🎉
