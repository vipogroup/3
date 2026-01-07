# VIPO Emergency Backup
# גיבוי חירום - מערכת VIPO
# תאריך עדכון: 7.1.2026, 0:16:04

## קבצים בגיבוי:
- database-backup.json - גיבוי מסד הנתונים (24 קולקציות, 630 מסמכים)
- env-backup.txt - משתני סביבה (.env.local)

## שלבי הקמת מערכת חדשה:

### שלב 1: יצירת חשבונות
- Vercel: https://vercel.com
- MongoDB Atlas: https://cloud.mongodb.com
- Cloudinary: https://cloudinary.com

### שלב 2: שכפול הקוד
git clone https://github.com/vipogroup/vipo-agents-test.git
cd vipo-agents-test
npm install

### שלב 3: הגדרת משתני סביבה
1. העתק את env-backup.txt ל-.env.local
2. עדכן MONGODB_URI לכתובת MongoDB החדשה
3. עדכן NEXTAUTH_URL לכתובת האתר החדשה

### שלב 4: הפעלה מקומית
npm run dev

### שלב 5: שחזור מסד נתונים
1. היכנס ל-http://localhost:3001/admin/backups
2. לחץ על "שחזור גיבוי"
3. בחר את קובץ database-backup.json
4. המתן לסיום השחזור

### שלב 6: העלאה ל-Vercel
vercel login
vercel --prod

## שירותים נדרשים:
- GitHub: https://github.com/vipogroup/vipo-agents-test
- Vercel: https://vercel.com
- MongoDB Atlas: https://cloud.mongodb.com
- Cloudinary: https://cloudinary.com
- PayPlus: https://payplus.co.il
- Google Cloud Console: https://console.cloud.google.com
- Twilio: https://console.twilio.com

## זמן משוער להקמה: 30 דקות
