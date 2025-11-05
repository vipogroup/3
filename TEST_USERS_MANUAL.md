# 👥 משתמשי בדיקה - הוראות יצירה ידנית

## 🎯 מטרה
יצירת 3 משתמשי בדיקה לכל הדשבורדים עם סיסמה "admin"

---

## 📋 משתמשים ליצירה

### 1. 👑 Admin (מנהל)
- **שם:** Admin Test
- **אימייל:** admin@test.com
- **טלפון:** 050-1234567
- **סיסמה:** admin
- **תפקיד:** מנהל
- **דשבורד:** `/admin` או `/dashboard`

### 2. 🤝 Agent (סוכן)
- **שם:** Agent Test
- **אימייל:** agent@test.com
- **טלפון:** 050-1234568
- **סיסמה:** admin
- **תפקיד:** סוכן
- **דשבורד:** `/agent`

### 3. 🛒 Customer (לקוח)
- **שם:** Customer Test
- **אימייל:** customer@test.com
- **טלפון:** 050-1234569
- **סיסמה:** admin
- **תפקיד:** לקוח
- **דשבורד:** `/customer`

---

## 🚀 איך ליצור (ידנית)

### שלב 1: פתח דף הרשמה
```
http://localhost:3001/register
```

### שלב 2: צור Admin
1. מלא:
   - שם מלא: `Admin Test`
   - אימייל: `admin@test.com`
   - טלפון: `050-1234567`
   - סיסמה: `admin`
   - סוג משתמש: `מנהל` ⚠️
2. לחץ "הירשם עכשיו"
3. יופיע: "נרשמת בהצלחה! המתן לאישור מנהל..."

### שלב 3: צור Agent
1. פתח שוב: http://localhost:3001/register
2. מלא:
   - שם מלא: `Agent Test`
   - אימייל: `agent@test.com`
   - טלפון: `050-1234568`
   - סיסמה: `admin`
   - סוג משתמש: `סוכן` ⚠️
3. לחץ "הירשם עכשיו"

### שלב 4: צור Customer
1. פתח שוב: http://localhost:3001/register
2. מלא:
   - שם מלא: `Customer Test`
   - אימייל: `customer@test.com`
   - טלפון: `050-1234569`
   - סיסמה: `admin`
   - סוג משתמש: `לקוח` ⚠️
3. לחץ "הירשם עכשיו"
4. ✅ יתחבר אוטומטית ויעבור ל-`/customer`!

---

## 🔐 התחברות

אחרי יצירת המשתמשים, פתח: http://localhost:3001/login

### Admin Login:
- אימייל: `admin@test.com`
- סיסמה: `admin`
- → יעבור ל-`/dashboard` (דשבורד מנהל)

### Agent Login:
- אימייל: `agent@test.com`
- סיסמה: `admin`
- → יעבור ל-`/agent` (דשבורד סוכן)

### Customer Login:
- אימייל: `customer@test.com`
- סיסמה: `admin`
- → יעבור ל-`/customer` (דשבורד לקוח)

---

## 🎯 בדיקות

### בדיקה 1: Customer Dashboard
```
1. התחבר עם customer@test.com / admin
2. ✅ אמור להגיע ל-/customer
3. ✅ תראה: "שלום, Customer Test! 👋"
4. ✅ 3 כפתורים: עיין במוצרים, הזמנות, פרופיל
5. ✅ "אין הזמנות עדיין"
```

### בדיקה 2: Agent Dashboard
```
1. התחבר עם agent@test.com / admin
2. ✅ אמור להגיע ל-/agent
3. ✅ תראה דשבורד סוכן עם KPI
```

### בדיקה 3: Admin Dashboard
```
1. התחבר עם admin@test.com / admin
2. ✅ אמור להגיע ל-/dashboard
3. ✅ תראה דשבורד מנהל עם דוחות
```

---

## 🔄 הפניות אוטומטיות

המערכת תפנה אוטומטית לפי תפקיד:

```
/login → /dashboard → בדיקת תפקיד:
├── customer → /customer ✅
├── agent → /agent ✅
└── admin → /dashboard ✅
```

---

## ⚡ סקריפט אוטומטי (אופציונלי)

אם תרצה ליצור אוטומטית, פתח Console בדפדפן ב-http://localhost:3001/register והדבק:

```javascript
async function createTestUser(userData) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const result = await response.json();
  console.log(`${userData.role}: ${result.ok ? '✅ Created' : '❌ ' + result.error}`);
}

// Create all test users
await createTestUser({
  fullName: 'Admin Test',
  email: 'admin@test.com',
  phone: '050-1234567',
  password: 'admin',
  role: 'admin'
});

await createTestUser({
  fullName: 'Agent Test',
  email: 'agent@test.com', 
  phone: '050-1234568',
  password: 'admin',
  role: 'agent'
});

await createTestUser({
  fullName: 'Customer Test',
  email: 'customer@test.com',
  phone: '050-1234569', 
  password: 'admin',
  role: 'customer'
});

console.log('🎉 All test users created!');
```

---

## 📊 סיכום

אחרי יצירת המשתמשים תוכל:

1. ✅ **לבדוק דשבורד לקוחות** - customer@test.com / admin
2. ✅ **לבדוק דשבורד סוכנים** - agent@test.com / admin  
3. ✅ **לבדוק דשבורד מנהלים** - admin@test.com / admin
4. ✅ **לבדוק מערכת מוצרים** - הוסף/ערוך/מחק מוצרים
5. ✅ **לבדוק הפניות אוטומטיות** - כל תפקיד לדשבורד שלו

---

**🚀 המערכת מוכנה לבדיקה מלאה!**
