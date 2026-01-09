# מדריך התקנה - VIPO CRM

## דרישות מקדימות

לפני ההתקנה, התקיני את התוכנות הבאות:

### 1. Node.js (חובה)
- הורדה: https://nodejs.org
- בחרי בגרסת **LTS** (מומלץ)
- התקנה רגילה עם Next, Next, Next...

### 2. Docker Desktop (חובה)
- הורדה: https://www.docker.com/products/docker-desktop
- התקנה רגילה
- **חשוב:** לאחר ההתקנה, הפעילי את Docker Desktop פעם אחת

### 3. Git (אופציונלי)
- הורדה: https://git-scm.com
- שימושי לניהול גרסאות

---

## התקנה מהירה

1. העתיקי את תיקיית `vipo-crm` למחשב החדש

2. לחצי דאבל-קליק על **`setup.bat`**

3. המתיני לסיום ההתקנה

4. לחצי דאבל-קליק על **`start.bat`** להפעלת המערכת

---

## התקנה ידנית

אם הסקריפט האוטומטי לא עובד, הריצי את הפקודות הבאות ב-Terminal:

```bash
# 1. התקנת Backend
npm install

# 2. התקנת Frontend
cd frontend
npm install
cd ..

# 3. הפעלת PostgreSQL
docker run --name vipo-postgres -e POSTGRES_USER=vipo -e POSTGRES_PASSWORD=vipo123 -e POSTGRES_DB=vipo_crm -p 5432:5432 -d postgres:15

# 4. הרצת Migrations
npx prisma migrate deploy
npx prisma generate

# 5. הפעלת Backend (בטרמינל נפרד)
npm run dev

# 6. הפעלת Frontend (בטרמינל נפרד)
cd frontend
npm run dev
```

---

## כתובות גישה

| שירות | כתובת |
|-------|--------|
| Frontend (ממשק משתמש) | http://localhost:5173 |
| Backend API | http://localhost:4000 |
| Health Check | http://localhost:4000/health |

---

## פתרון בעיות

### Docker לא עובד
- ודאי ש-Docker Desktop פועל (אייקון בשורת המשימות)
- נסי להפעיל מחדש את המחשב

### Port תפוס
- אם port 4000 או 5173 תפוסים, סגרי תוכנות אחרות או שני את הפורט ב:
  - Backend: קובץ `.env` - שנה `PORT=4000`
  - Frontend: קובץ `frontend/vite.config.ts`

### שגיאת Database
- ודאי שה-Docker container פועל: `docker ps`
- אם לא, הפעילי: `docker start vipo-postgres`

---

## מבנה הפרויקט

```
vipo-crm/
├── src/                    # קוד Backend
│   ├── modules/           # מודולים (auth, leads, customers...)
│   ├── lib/               # ספריות משותפות
│   └── app.ts             # נקודת כניסה
├── frontend/              # קוד Frontend (React)
│   └── src/
│       ├── pages/         # דפים
│       ├── components/    # רכיבים
│       └── contexts/      # Context API
├── prisma/                # הגדרות Database
│   └── schema.prisma      # מבנה הטבלאות
├── .env                   # הגדרות סביבה
├── setup.bat              # סקריפט התקנה
└── start.bat              # סקריפט הפעלה
```

---

## יצירת משתמש ראשון

1. גשי ל: http://localhost:5173
2. לחצי על "הירשם עכשיו"
3. מלאי שם, אימייל וסיסמה
4. התחברי למערכת

---

## תמיכה

לשאלות או בעיות - פני למפתח המערכת.
