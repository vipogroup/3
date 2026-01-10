# WhatsApp Server - שרת וואטסאפ

שרת נפרד לחיבור וואטסאפ למערכת CRM.

## התקנה והרצה

```bash
# התקנת dependencies (אם לא הותקנו)
cd whatsapp-server
npm install

# הרצה
npm start
```

## סריקת QR

1. הפעל את השרת
2. לך לממשק הניהול: `/admin/crm/whatsapp`
3. סרוק את ה-QR עם וואטסאפ בטלפון
4. מוכן לשימוש!

## API Endpoints

| נתיב | שיטה | תיאור |
|------|------|--------|
| `/status` | GET | סטטוס החיבור |
| `/qr` | GET | קבלת QR code לסריקה |
| `/send` | POST | שליחת הודעה |
| `/logout` | POST | התנתקות |
| `/restart` | POST | הפעלה מחדש |
| `/health` | GET | בדיקת תקינות |

## שליחת הודעה

```bash
curl -X POST http://localhost:3001/send \
  -H "Content-Type: application/json" \
  -d '{"to": "0501234567", "message": "שלום!"}'
```

## הערות

- השרת צריך לרוץ 24/7 כדי לקבל הודעות
- ה-session נשמר ב-`.wwebjs_auth` - לא למחוק!
- בהרצה ראשונה צריך לסרוק QR
