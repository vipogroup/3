# 🧩 רכיבי UI - VIPO Admin Dashboard

> אפיון מדויק של כל רכיבי ה-UI וסגנונות העיצוב במערכת

---

## 🔘 כפתורים (Buttons)

### כפתור ראשי (Primary)
```jsx
<button 
  className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
>
  לחץ כאן
</button>
```

### כפתור משני (Secondary)
```jsx
<button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 text-sm font-medium transition-all hover:bg-gray-300">
  ביטול
</button>
```

### כפתור מחיקה (Danger)
```jsx
<button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium transition-all hover:bg-red-700">
  מחק
</button>
```

### כפתור Ghost (Outline)
```jsx
<button 
  className="px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all hover:opacity-90"
  style={{ borderColor: '#0891b2', color: '#0891b2', background: 'white' }}
>
  פעולה משנית
</button>
```

### כפתור עם אייקון
```jsx
<button 
  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
  הוסף חדש
</button>
```

---

## 📦 כרטיסים (Cards)

### כרטיס רגיל
```jsx
<div className="bg-white rounded-xl shadow-md p-6">
  {/* תוכן */}
</div>
```

### כרטיס עם Border גרדיאנט
```jsx
<div 
  className="rounded-xl overflow-hidden"
  style={{ 
    border: '2px solid transparent',
    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)',
  }}
>
  {/* תוכן */}
</div>
```

### כרטיס Hover
```jsx
<div 
  className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
>
  {/* תוכן */}
</div>
```

### כרטיס מיוחד (Feature)
```jsx
<div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all border border-purple-200">
  {/* תוכן */}
</div>
```

---

## 📋 אקורדיון (Accordion)

### כותרת אקורדיון
```jsx
<button 
  onClick={() => toggleCategory('category')}
  className="w-full flex items-center justify-between p-4 text-right transition-all hover:bg-gray-50"
>
  <div className="flex items-center gap-3">
    {/* אייקון בריבוע */}
    <span 
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white"
      style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
    >
      <IconComponent className="w-5 h-5" />
    </span>
    {/* כותרת */}
    <span className="text-base font-bold" style={{ color: '#1e3a8a' }}>
      שם הקטגוריה
    </span>
  </div>
  {/* חץ */}
  <svg 
    className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
    style={{ color: '#0891b2' }}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
</button>
```

### תוכן אקורדיון
```jsx
{isOpen && (
  <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 gap-3">
    {/* פריטים */}
  </div>
)}
```

---

## 🏷️ תגיות (Badges)

### Badge הצלחה
```jsx
<span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
  פעיל
</span>
```

### Badge אזהרה
```jsx
<span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
  ממתין
</span>
```

### Badge שגיאה
```jsx
<span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
  מושהה
</span>
```

### Badge פיצ'ר
```jsx
<span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
  חדש
</span>
```

### Badge מידע
```jsx
<span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
  מידע
</span>
```

---

## 🔴 נוריות סטטוס (Status Indicators)

### נורית ירוקה (מחובר)
```jsx
<span className="w-2 h-2 rounded-full bg-green-500"></span>
```

### נורית כתומה (אזהרה)
```jsx
<span className="w-2 h-2 rounded-full bg-amber-500"></span>
```

### נורית אדומה (שגיאה)
```jsx
<span className="w-2 h-2 rounded-full bg-red-500"></span>
```

### נורית אפורה (לא פעיל)
```jsx
<span className="w-2 h-2 rounded-full bg-gray-300"></span>
```

---

## 📊 Progress Bar

### Progress Bar רגיל
```jsx
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className="h-2 rounded-full bg-green-500"
    style={{ width: `${progress}%` }}
  ></div>
</div>
```

### Progress Bar דינמי (לפי ציון)
```jsx
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className={`h-2 rounded-full ${
      score >= 85 ? 'bg-green-500' : 
      score >= 70 ? 'bg-amber-500' : 
      'bg-red-500'
    }`}
    style={{ width: `${score}%` }}
  ></div>
</div>
```

---

## ⏳ Loading Spinner

### Spinner גדול
```jsx
<div 
  className="animate-spin rounded-full h-16 w-16"
  style={{
    border: '4px solid rgba(8, 145, 178, 0.2)',
    borderTopColor: '#0891b2',
  }}
></div>
```

### Spinner קטן
```jsx
<div 
  className="w-8 h-8 rounded-full animate-spin"
  style={{ 
    border: '3px solid rgba(8, 145, 178, 0.2)', 
    borderTopColor: '#0891b2' 
  }}
></div>
```

---

## 📝 כותרות (Headers)

### כותרת ראשית עם גרדיאנט
```jsx
<h1 className="text-2xl sm:text-3xl font-bold">
  <span
    className="flex items-center gap-2 sm:gap-3"
    style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}
  >
    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#0891b2' }} />
    כותרת הדף
  </span>
</h1>
```

### כותרת קטגוריה
```jsx
<span className="text-base font-bold" style={{ color: '#1e3a8a' }}>
  שם הקטגוריה
</span>
```

### כותרת משנית
```jsx
<h2 className="text-lg font-bold text-gray-900">
  כותרת משנית
</h2>
```

---

## 🔗 קישורים (Links)

### קישור בתפריט
```jsx
<Link 
  href="/path"
  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all"
>
  <IconComponent className="w-5 h-5" style={{ color: '#0891b2' }} />
  <span className="text-sm font-medium text-gray-900">טקסט הקישור</span>
</Link>
```

### קישור עם חץ
```jsx
<Link 
  href="/path"
  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
  חזרה
</Link>
```

---

## 🖼️ אייקונים (Icons)

### אייקון בריבוע (קטגוריה)
```jsx
<span 
  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white"
  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {/* ... */}
  </svg>
</span>
```

### אייקון רגיל (בתפריט)
```jsx
<svg className="w-5 h-5" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
  {/* ... */}
</svg>
```

### אייקון צבעוני (סטטוס)
```jsx
// ירוק - הושלם
<svg className="w-5 h-5" style={{ color: '#16a34a' }} ...>

// כתום - ממתין
<svg className="w-5 h-5" style={{ color: '#d97706' }} ...>

// אדום - באג
<svg className="w-5 h-5" style={{ color: '#dc2626' }} ...>

// סגול - פיצ'ר
<svg className="w-5 h-5" style={{ color: '#7c3aed' }} ...>

// כחול - מידע
<svg className="w-5 h-5" style={{ color: '#2563eb' }} ...>
```

---

## 📱 Responsive Classes

### Grid Responsive
```jsx
// 2 עמודות במובייל, 3 בדסקטופ
<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

// 1 עמודה במובייל, 2 בטאבלט
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

// 1 עמודה במובייל, 2 בדסקטופ גדול
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
```

### Text Responsive
```jsx
// כותרת ראשית
<h1 className="text-xl sm:text-2xl md:text-3xl font-bold">

// כותרת משנית
<h2 className="text-base sm:text-lg font-bold">
```

### Padding Responsive
```jsx
<main className="min-h-screen p-3 sm:p-6 md:p-8">
```

---

## 📋 סיכום קוד מוכן

### Layout בסיסי לדף
```jsx
<main className="min-h-screen bg-cyan-50 p-3 sm:p-6 md:p-8">
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="mb-4 sm:mb-6 flex items-center justify-between">
      <h1 style={{...}}>כותרת</h1>
      <div className="flex items-center gap-2">
        {/* כפתורים */}
      </div>
    </div>
    
    {/* Content */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      {/* כרטיסים */}
    </div>
  </div>
</main>
```
