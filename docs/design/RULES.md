# 📏 כללי עיצוב - VIPO System

> כללים חשובים לשמירה על עקביות העיצוב במערכת

---

## 🚫 מה לא לעשות

### 1. לא להשתמש בירוק לכפתורים
```jsx
// ❌ שגוי
<button className="bg-green-600">הוסף</button>

// ✅ נכון
<button style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>הוסף</button>
```
**הסיבה:** ירוק שמור רק לסטטוס "הצלחה" ו-badges

---

### 2. לא להשתמש באדום (אלא למחיקה/שגיאות)
```jsx
// ❌ שגוי
<button className="bg-red-600">שמור</button>

// ✅ נכון - רק למחיקה
<button className="bg-red-600">מחק</button>
```

---

### 3. לא אימוג'ים - רק SVG אייקונים
```jsx
// ❌ שגוי
<span>📊 דוחות</span>

// ✅ נכון
<span className="flex items-center gap-2">
  <svg className="w-5 h-5" ...>...</svg>
  דוחות
</span>
```

---

### 4. לא ליצור עיצוב חדש
```jsx
// ❌ שגוי - צבעים שלא בפלטה
<div className="bg-pink-500">...</div>
<button className="bg-indigo-700">...</button>

// ✅ נכון - להשתמש בפלטה הקיימת
<div className="bg-cyan-50">...</div>
<button style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>...</button>
```

---

### 5. לא לשנות עיצוב ללא אישור מפורש
כל שינוי בצבעים, גרדיאנטים, או סגנונות דורש אישור מראש!

---

## ✅ מה כן לעשות

### 1. להשתמש בגרדיאנט הראשי לכפתורים
```jsx
<button 
  className="px-4 py-2 rounded-lg text-white font-medium"
  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
>
  כפתור ראשי
</button>
```

---

### 2. להשתמש בצבעי סטטוס נכונים

| סטטוס | צבע | שימוש |
|-------|-----|-------|
| הצלחה/פעיל | `#16a34a` | badges, נוריות |
| אזהרה/ממתין | `#d97706` | badges, נוריות |
| שגיאה/מחיקה | `#dc2626` | כפתורי מחיקה, שגיאות |
| פיצ'ר | `#7c3aed` | הדגשות מיוחדות |
| מידע | `#2563eb` | פעולות משניות |

---

### 3. לשמור על Responsive
```jsx
// Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

// Text
<h1 className="text-xl sm:text-2xl md:text-3xl font-bold">

// Padding
<main className="p-3 sm:p-6 md:p-8">
```

---

### 4. להשתמש ב-SVG אייקונים עקביים
```jsx
// אייקון רגיל
<svg 
  className="w-5 h-5" 
  style={{ color: '#0891b2' }} 
  fill="none" 
  stroke="currentColor" 
  viewBox="0 0 24 24"
>
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
</svg>
```

---

### 5. לשמור על RTL
```jsx
// Layout
<main dir="rtl">

// Flex
<div className="flex items-center gap-2">
  {/* הפריטים יסתדרו מימין לשמאל */}
</div>
```

---

## 📐 מבנה דף סטנדרטי

```jsx
export default function PageName() {
  return (
    <main className="min-h-screen bg-cyan-50 p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <h1 
            className="text-xl sm:text-2xl md:text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            <span className="flex items-center gap-2">
              <IconComponent className="w-6 h-6" style={{ color: '#0891b2' }} />
              כותרת הדף
            </span>
          </h1>
          
          <div className="flex items-center gap-2">
            <button 
              className="px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              פעולה
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* כרטיסים */}
        </div>

      </div>
    </main>
  );
}
```

---

## 🎨 קוד מוכן להעתקה

### גרדיאנט ראשי
```css
background: linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%);
```

### Border עם גרדיאנט
```css
border: 2px solid transparent;
background-image: linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2);
background-origin: border-box;
background-clip: padding-box, border-box;
box-shadow: 0 2px 10px rgba(8, 145, 178, 0.1);
```

### טקסט עם גרדיאנט
```css
background: linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### Spinner
```css
border: 4px solid rgba(8, 145, 178, 0.2);
border-top-color: #0891b2;
```

---

## 📋 צבעים להעתקה

### צבעים ראשיים
```
Navy Blue:  #1e3a8a
Cyan:       #0891b2
```

### צבעי סטטוס
```
Success:    #16a34a
Warning:    #d97706
Danger:     #dc2626
Feature:    #7c3aed
Info:       #2563eb
```

### צבעי רקע
```
Page:       bg-cyan-50 (#ecfeff)
Card:       white (#ffffff)
Hover:      bg-gray-50 (#f9fafb)
```

### צבעי טקסט
```
Primary:    text-gray-900 (#111827)
Secondary:  text-gray-600 (#4b5563)
Muted:      text-gray-500 (#6b7280)
Headers:    #1e3a8a
Icons:      #0891b2
```

---

## ⚠️ הערות חשובות

1. **CSS Variables לא בשימוש בדשבורד** - כל הצבעים מוגדרים inline
2. **הגרדיאנט הוא 135 מעלות** - לא 90, לא 180
3. **Shadow משתמש ב-rgba של הטורקיז** - `rgba(8, 145, 178, ...)`
4. **אבטחה היא היחידה עם אייקון אדום-כתום**
5. **ניהול עסקים ובוט צאט הם פריטים מיוחדים** - עם רקע שונה

---

## 📅 היסטוריית עדכונים

| תאריך | גרסה | שינוי |
|-------|------|-------|
| 12/01/2026 | 1.0.0 | יצירת מסמך ראשוני |
