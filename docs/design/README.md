# 🎨 אפיון עיצוב מערכת VIPO

> תיעוד מלא של פלטת הצבעים, רכיבי UI וסגנונות העיצוב במערכת

## 📁 מבנה התיקייה

```
docs/design/
├── README.md              # מסמך זה
├── COLOR_PALETTE.md       # פלטת צבעים מלאה
├── COMPONENTS.md          # רכיבי UI וסגנונות
├── SECTIONS.md            # צבעים לפי סקשן
└── RULES.md               # כללי עיצוב חשובים
```

## 🎯 עקרונות עיצוב

### גרדיאנט ראשי
```css
linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)
```
Navy Blue → Cyan (כחול כהה → טורקיז)

### צבעי סטטוס
- ✅ הצלחה: `#16a34a`
- ⚠️ אזהרה: `#d97706`
- ❌ שגיאה: `#dc2626`
- 🟣 פיצ'ר: `#7c3aed`

## 📅 עדכון אחרון
- **תאריך:** 12 בינואר 2026
- **גרסה:** 1.0.0

## 🔗 קבצים קשורים
- `app/globals.css` - CSS Variables
- `lib/settingsDefaults.js` - ברירות מחדל
- `app/context/ThemeContext.jsx` - ניהול Theme
