# נוהל שחזור מהיר (Rollback)

## לפני כל שדרוג

1. **גיבוי מסד נתונים**
   - אפשרות מהירה: לחיצה כפולה על `backups/database/backup.cmd` תיכנס אוטומטית לתיקיית הפרויקט ותפעיל `npm run backup:db`.
   - לחלופין, ניתן להריץ ידנית:
     ```bash
     npm run backup:db
     ```
   כל גיבוי יוצר תיקייה חדשה תחת `backups/database/mongo-<timestamp>` עם JSON לכל אוסף וקבצי `restore.cmd/restore.ps1` לשחזור מהיר.

2. **תיוג הגרסה היציבה (GitHub)**
   ```bash
   npm run tag:stable
   ```
   הפקודה יוצרת/מעודכנת tag בשם `latest-stable` ודוחפת אותו ל-GitHub. ודא שאין שינויים לא שמורים (`git status`).

3. **(אופציונלי) Redeploy ב-Vercel**
   לאחר שהקוד מעודכן, היכנס ל-Dashboard של הפרויקט ולחץ "Redeploy" על ה-Deployment הרצוי כדי לוודא שהסביבה החיה נמצאת באותה גרסה יציבה.

## במקרה של תקלה אחרי השדרוג

1. **שחזור קוד**
   ```powershell
   .\rollback.ps1
   ```
   הסקריפט מבצע `git fetch`, חזרה ל-`latest-stable`, התקנת תלויות, build, והרצת `Start-Server.ps1` אם קיים.

2. **Redeploy ב-Vercel**
   - היכנס ל-Dashboard → Deployments.
   - בחר את הפריסה של `latest-stable` או את הפריסה הקודמת היציבה.
   - לחץ "Redeploy".

3. **שחזור נתונים (אם נדרש)**
   ```bash
   npm run restore:db -- ./backups/mongo-<timestamp>
   ```
   או:
   ```powershell
   node scripts/db/restore-from-dir.js ./backups/mongo-<timestamp>
   ```

## הערות
- שמור את קבצי ה-ENV (מקומיים ו-Vercel) במקום מאובטח; הם אינם מגובים אוטומטית.
- אפשר להעביר את תיקיית הגיבויים לענן (S3, Drive) לאחר יצירתה.
- מומלץ להריץ בדיקת smoke (`npm run verify`) אחרי Rollback לוודא שהמערכת חזרה לפעילות.
