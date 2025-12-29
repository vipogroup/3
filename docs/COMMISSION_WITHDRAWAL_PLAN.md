# תוכנית פיתוח: מערכת מימוש עמלות לסוכנים

**תאריך יצירה:** 29/12/2024  
**סטטוס:** ממתין לאישור

---

## תוכן עניינים

1. [סקירת מצב קיים](#סקירת-מצב-קיים)
2. [דרישות עסקיות](#דרישות-עסקיות)
3. [ארכיטקטורה](#ארכיטקטורה)
4. [שלבי פיתוח](#שלבי-פיתוח)
5. [קבצים ליצירה ועדכון](#קבצים-ליצירה-ועדכון)
6. [עיצוב](#עיצוב)
7. [תרשימי זרימה](#תרשימי-זרימה)

---

## סקירת מצב קיים

| רכיב | סטטוס | הערות |
|------|-------|-------|
| מודל `Order` | קיים | חסרים שדות למעקב תאריכים |
| מודל `User` | קיים | יש `commissionBalance`, `commissionOnHold` |
| מודל `Product` | קיים | יש `purchaseType: regular/group` |
| מודל `WithdrawalRequest` | קיים | מלא ומוכן |
| מודל `GroupPurchase` | חסר | צריך ליצור |
| API `/api/withdrawals` | קיים | POST/GET לסוכנים |
| API מנהל למשיכות | חסר | צריך ליצור |
| דשבורד סוכן | קיים | חסר כפתור מימוש |
| דשבורד מנהל | קיים | חסר ניהול משיכות |

---

## דרישות עסקיות

### סוגי רכישות ותקופות המתנה

| סוג רכישה | תקופת המתנה | פירוט |
|-----------|-------------|-------|
| **רגילה (מלאי בישראל)** | 14 יום | מתאריך הספקה ללקוח |
| **קבוצתית** | ~118 יום | סגירה (30) + משלוח (60) + הספקה (14) + ביטול (14) |

### מדיניות עמלות

1. **עמלה נרשמת** ברגע שלקוח מבצע רכישה
2. **עמלה ממתינה** - הסוכן רואה אותה אבל לא יכול למשוך
3. **עמלה זמינה** - לאחר תקופת ההמתנה, ניתן למשוך
4. **עמלה נמשכה** - לאחר אישור מנהל והעברה בפועל

---

## ארכיטקטורה

### שדות חדשים בהזמנה (Order)

```javascript
{
  // סוג הזמנה
  orderType: {
    type: String,
    enum: ['regular', 'group'],
    default: 'regular'
  },

  // מעקב תאריכים לעמלות
  deliveredAt: { type: Date, default: null },
  commissionAvailableAt: { type: Date, default: null },
  commissionStatus: {
    type: String,
    enum: ['pending', 'available', 'claimed', 'cancelled'],
    default: 'pending'
  },

  // קישור לרכישה קבוצתית
  groupPurchaseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'GroupPurchase', 
    default: null 
  },
}
```

### מודל רכישה קבוצתית (GroupPurchase)

```javascript
{
  name: String,
  status: {
    type: String,
    enum: ['open', 'closed', 'shipped', 'arrived', 'delivering', 'completed'],
    default: 'open'
  },
  
  // תאריכים אמיתיים
  openedAt: Date,
  closedAt: Date,
  shippedAt: Date,
  arrivedAt: Date,
  deliveryCompletedAt: Date,
  commissionReleaseDate: Date,
  
  // הגדרות ברירת מחדל (ימים)
  settings: {
    closingDays: { type: Number, default: 30 },
    shippingDays: { type: Number, default: 60 },
    deliveryDays: { type: Number, default: 14 },
    cancelPeriodDays: { type: Number, default: 14 }
  },
  
  // סטטיסטיקות
  totalOrders: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  totalCommission: { type: Number, default: 0 },
}
```

### לוגיקת חישוב תאריך זמינות עמלה

```javascript
function calculateCommissionAvailableDate(order, groupPurchase = null) {
  const CANCEL_PERIOD_DAYS = 14;
  
  if (order.orderType === 'regular') {
    // רכישה רגילה: 14 יום מהספקה
    if (!order.deliveredAt) return null;
    return addDays(order.deliveredAt, CANCEL_PERIOD_DAYS);
  }
  
  if (order.orderType === 'group' && groupPurchase) {
    // רכישה קבוצתית: חישוב מורכב
    if (groupPurchase.deliveryCompletedAt) {
      return addDays(groupPurchase.deliveryCompletedAt, CANCEL_PERIOD_DAYS);
    }
    
    // חישוב משוער מתאריך סגירה
    if (groupPurchase.closedAt) {
      const { shippingDays, deliveryDays, cancelPeriodDays } = groupPurchase.settings;
      return addDays(groupPurchase.closedAt, shippingDays + deliveryDays + cancelPeriodDays);
    }
  }
  
  return null;
}
```

---

## שלבי פיתוח

### שלב 1: הרחבת מודל Order

**קובץ:** `models/Order.js`

**שדות להוספה:**
- `orderType` - סוג הזמנה (regular/group)
- `deliveredAt` - תאריך הספקה
- `commissionAvailableAt` - תאריך שחרור עמלה
- `commissionStatus` - סטטוס עמלה (pending/available/claimed/cancelled)
- `groupPurchaseId` - קישור לרכישה קבוצתית

---

### שלב 2: יצירת מודל GroupPurchase

**קובץ חדש:** `models/GroupPurchase.js`

מודל לניהול רכישות קבוצתיות עם מעקב תאריכים וסטטוסים.

---

### שלב 3: יצירת API לניהול משיכות (מנהל)

**קובץ:** `app/api/admin/withdrawals/route.js`

```
GET /api/admin/withdrawals
  Query: ?status=pending&page=1&limit=20
  Response: { ok, withdrawals: [...], pagination, stats }
```

**קובץ:** `app/api/admin/withdrawals/[id]/route.js`

```
GET /api/admin/withdrawals/[id]
  Response: { ok, withdrawal, agent }

PATCH /api/admin/withdrawals/[id]
  Body: { action: 'approve' | 'reject' | 'complete', adminNotes: string }
```

**לוגיקה לפי action:**
- `approve`: status → 'approved', הסכום נשאר ב-onHold
- `reject`: status → 'rejected', onHold → balance (החזרה)
- `complete`: status → 'completed', onHold -= amount

---

### שלב 4: יצירת API לעמלות סוכן

**קובץ חדש:** `app/api/agent/commissions/route.js`

```
GET /api/agent/commissions
Response: {
  ok: true,
  summary: {
    availableBalance: number,
    pendingCommissions: number,
    onHold: number,
    totalEarned: number
  },
  commissions: [...]
}
```

---

### שלב 5: יצירת Job לשחרור עמלות אוטומטי

**קובץ חדש:** `app/api/cron/release-commissions/route.js`

**לוגיקה:**
1. מצא הזמנות עם `commissionStatus = 'pending'` ו-`commissionAvailableAt <= now`
2. עדכן `commissionStatus = 'available'`
3. עדכן `user.commissionBalance += commissionAmount`

**הפעלה:** Cron job יומי

---

### שלב 6: ממשק סוכן - מימוש עמלות

**קבצים חדשים:**
- `app/dashboard/agent/components/WithdrawalModal.jsx`
- `app/dashboard/agent/components/CommissionsSection.jsx`

**עדכון:**
- `app/dashboard/agent/page.jsx`

**תכולת WithdrawalModal:**
- כותרת + אייקון
- סיכום עמלות (זמין/ממתין/נעול)
- שדה סכום
- שדה הערות
- כפתורי שלח/ביטול

**תכולת CommissionsSection:**
- כרטיסי סיכום (זמין/ממתין)
- כפתור "ממש עמלות"
- טבלת עמלות מפורטת
- היסטוריית בקשות משיכה

---

### שלב 7: ממשק מנהל - ניהול משיכות

**קבצים חדשים:**
- `app/admin/withdrawals/page.jsx`
- `app/admin/withdrawals/components/WithdrawalActionModal.jsx`

**תכולה:**
- כרטיסי סטטיסטיקות (ממתינות/לתשלום/שולם)
- פילטרים לפי סטטוס
- טבלת בקשות עם כפתורי פעולה
- מודאל טיפול בבקשה

---

### שלב 8: ממשק מנהל - ניהול רכישות קבוצתיות

**קבצים חדשים:**
- `app/admin/group-purchases/page.jsx`
- `app/admin/group-purchases/[id]/page.jsx`

**תכולה:**
- רשימת רכישות קבוצתיות
- ציר זמן אינטראקטיבי לכל רכישה
- עדכון סטטוסים ותאריכים
- רשימת הזמנות בקבוצה

---

### שלב 9: עדכון דשבורד מנהל

**קובץ:** `app/admin/components/AdminDashboardClient.jsx`

**שינויים:**
- הוספת לינק "בקשות משיכה" בסקשן "כספים ודוחות"
- הוספת badge לכמות בקשות ממתינות
- הוספת לינק "רכישות קבוצתיות"

---

## קבצים ליצירה ועדכון

### קבצים חדשים (10)

| # | קובץ | תיאור |
|---|------|-------|
| 1 | `models/GroupPurchase.js` | מודל רכישה קבוצתית |
| 2 | `app/api/admin/withdrawals/route.js` | API רשימת משיכות למנהל |
| 3 | `app/api/admin/withdrawals/[id]/route.js` | API עדכון משיכה |
| 4 | `app/api/agent/commissions/route.js` | API עמלות סוכן |
| 5 | `app/api/cron/release-commissions/route.js` | Job שחרור עמלות |
| 6 | `app/dashboard/agent/components/WithdrawalModal.jsx` | מודאל משיכה לסוכן |
| 7 | `app/dashboard/agent/components/CommissionsSection.jsx` | סקשן עמלות בדשבורד סוכן |
| 8 | `app/admin/withdrawals/page.jsx` | דף ניהול משיכות למנהל |
| 9 | `app/admin/withdrawals/components/WithdrawalActionModal.jsx` | מודאל טיפול בבקשה |
| 10 | `app/admin/group-purchases/page.jsx` | דף ניהול רכישות קבוצתיות |

### קבצים לעדכון (3)

| # | קובץ | שינוי |
|---|------|-------|
| 1 | `models/Order.js` | הוספת שדות עמלה ומעקב |
| 2 | `app/dashboard/agent/page.jsx` | חיבור סקשן עמלות |
| 3 | `app/admin/components/AdminDashboardClient.jsx` | לינקים חדשים |

---

## עיצוב

### סטנדרט עיצוב המערכת

| רכיב | הגדרה |
|------|-------|
| **צבע ראשי** | גרדיאנט כחול-טורקיז `#1e3a8a → #0891b2` |
| **כפתורים** | גרדיאנט כחול-טורקיז |
| **אייקונים** | SVG בלבד, **ללא אימוג'ים** |
| **גבולות כרטיסים** | Border gradient |
| **טקסט עברי** | RTL מלא |
| **Responsive** | טבלאות → כרטיסים במובייל |

### Badges סטטוס

| סטטוס | צבע | תרגום |
|-------|-----|-------|
| pending | כתום | ממתין |
| available | ירוק | זמין |
| approved | כחול | אושר |
| completed | ירוק | הושלם |
| rejected | אדום | נדחה |

### מיקום בממשק

**דשבורד סוכן:**
- כפתור "ממש עמלות" בכרטיס "יתרת עמלות" (שורה עליונה)
- סקשן חדש "פירוט עמלות" מתחת לכרטיסים

**דשבורד מנהל:**
- לינק "בקשות משיכה" בסקשן "כספים ודוחות"
- Badge אדום עם מספר בקשות ממתינות

---

## תרשימי זרימה

### תרחיש רכישה רגילה

```
יום 0:   לקוח רוכש מוצר
         ↓
         עמלה נרשמת (סטטוס: pending)
         ↓
יום 3:   לקוח מקבל מוצר (deliveredAt מתעדכן)
         ↓
         commissionAvailableAt = deliveredAt + 14 ימים
         ↓
יום 17:  Cron Job רץ
         ↓
         commissionStatus → 'available'
         user.commissionBalance += commissionAmount
         ↓
יום 17+: סוכן לוחץ "ממש עמלות"
         ↓
         מנהל מאשר → מעביר כסף → מסמן "הושלם"
```

### תרחיש רכישה קבוצתית

```
יום 0:    לקוח רוכש במסגרת רכישה קבוצתית
          ↓
          עמלה נרשמת (סטטוס: pending)
          groupPurchaseId מקושר
          ↓
יום 30:   מנהל מסמן "קבוצה נסגרה" (closedAt)
          ↓
יום 90:   מנהל מסמן "מכולה הגיעה" (arrivedAt)
          ↓
יום 104:  מנהל מסמן "הספקה הושלמה" (deliveryCompletedAt)
          ↓
          commissionAvailableAt = deliveryCompletedAt + 14 ימים
          ↓
יום 118:  Cron Job רץ
          ↓
          commissionStatus → 'available'
          ↓
יום 118+: סוכן יכול למשוך את העמלה
```

### זרימת בקשת משיכה

```
סוכן לוחץ "ממש עמלות"
    ↓
מזין סכום (max = availableBalance)
    ↓
POST /api/withdrawals
    ↓
[DB] בקשה נוצרת (status: pending)
[DB] user.commissionBalance -= amount
[DB] user.commissionOnHold += amount
    ↓
מנהל רואה בקשה בדשבורד
    ↓
┌──────────────────────────────────────────┐
│  אישור          │  דחייה                 │
├──────────────────────────────────────────┤
│  status=approved│  status=rejected       │
│  (כסף ב-onHold) │  onHold → balance      │
└──────────────────────────────────────────┘
    ↓                    ↓
מנהל מעביר כסף      סוכן מקבל הודעה
(בנק/ביט)           הכסף חוזר ליתרה
    ↓
מנהל מסמן "הושלם"
    ↓
status=completed
onHold -= amount
```

---

## סדר ביצוע מומלץ

```
שלב 1-2: מודלים (Order + GroupPurchase)
    ↓
שלב 3-4: APIs (admin + agent)
    ↓
שלב 5: Cron Job
    ↓
שלב 6: ממשק סוכן
    ↓
שלב 7-8: ממשק מנהל
    ↓
שלב 9: עדכון דשבורד מנהל
    ↓
בדיקות ו-QA
```

---

## הערות נוספות

1. **אבטחה:** סוכן יכול לבקש רק מהיתרה הזמינה שלו
2. **מניעת כפילויות:** לא ניתן לפתוח בקשת משיכה חדשה כשיש אחת פעילה
3. **נעילת כספים:** ברגע שנשלחת בקשה, הסכום עובר ל-onHold
4. **ביטול:** אם מנהל דוחה, הכסף חוזר ל-balance
5. **מעקב:** כל הפעולות מתועדות עם timestamps

---

**מסמך זה מהווה את תוכנית הפיתוח המלאה. יש לאשר לפני תחילת הפיתוח.**
