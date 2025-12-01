
# VIPO Agents — Next.js Scaffold

נוצר אוטומטית: 2025-10-26T01:18:40.124218 UTC

מערכת סוכנים + מוצרים + רכישה קבוצתית, עם:
- Next.js (App Router) + Tailwind
- MongoDB (Atlas או מקומי)
- OTP התחברות ב-SMS/WhatsApp (Stub)
- Theme דינמי (CSS Variables) + `/theme.css`
- מוצרים + עמוד מוצר כולל Group Buy (Progress + Deposit)
- API: Products, Referrals, Track (visit/order), PayPlus (stubs), Theme, QR
- PWA: `manifest.webmanifest` + `sw.js`
- דפים: `/` (מוצרים), `/p/[slug]`, `/agent`, `/admin`

## התקנה

```bash
npm i
# הגדר ENV
cp .env.example .env.local
npm run dev
```

פתח: http://localhost:3000

## משתני סביבה (`.env.local`)
- MONGODB_URI=mongodb+srv://...
- MONGODB_DB=vipo
- JWT_SECRET=change_me
- PUBLIC_URL=http://localhost:3000
- TWILIO_ACCOUNT_SID=...
- TWILIO_AUTH_TOKEN=...
- TWILIO_WHATSAPP_FROM=whatsapp:+1...
- PAYPLUS_API_KEY=...
- PAYPLUS_SECRET=...
- PAYPLUS_WEBHOOK_SECRET=...
- PAYPLUS_BASE_URL=https://restapiv2.payplus.co.il/api

> ℹ️  אם אחד הערכים חסר, ה-API יפעיל מצב fallback ויחזיר קישור תשלום מדומה (`/checkout/success`). לאחר שמגדירים את כל המשתנים, המערכת תבצע קריאות PayPlus אמיתיות ותאמת חתימות ב-webhook.

## שלבים מומלצים (Windsurf)
1) DB: צור Products ראשונים ב-POST `/api/products`
2) Theme: POST `/api/theme` עם משתני צבע (או תשתמש בברירת-מחדל)
3) צור לינק סוכן: POST `/api/referrals` (agentId, productId, baseUrl)
4) Product Page: בדוק `/p/[slug]` כולל Progress בקבוצתי
5) Track: שלח POST `/api/track/visit` ו-`/api/track/order`
6) PayPlus: חבר ל-API האמיתי, והשלם webhook
7) WhatsApp: החלף את ה-OTP והודעות ל-Twilio אמיתי
8) QR: גש ל-`/api/qr/<ref>?fmt=svg&size=360`

## הערות
- זה בסיס רץ; יש להשלים UI מתקדם, Auth מלא, Commission Engine, ודפי Dashboard מלאים.
- קבצי admin/agent הם שלד ראשוני לעיצוב והרחבה.
