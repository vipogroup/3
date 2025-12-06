# Hardening Stage 2 – Rate Limit, ENV, PayPlus (Dec 4, 2025)

## Rate Limit Policy

- **Auth (login/register/OTP):** strict – existing protections retained from Stage 1 (5 req/5min login, 3 req/10min register, 3 req/5min OTP).
- **Orders (create/list):** medium – 30 creations / 60 listings per 5 minutes per user/IP.
- **Withdrawals:** strict – 5 requests per 10 minutes per user/IP.
- **Admin APIs:** strict – 60 requests per 5 minutes per admin/IP.
- **PayPlus session/create:** strict – 10 requests per 10 minutes per user/order+IP.
- **PayPlus webhook:** no rate limit (provider must be able to retry freely).

## Rate Limit – Applied Endpoints

- **POST /api/orders** – `rateLimiters.ordersCreate` (30 req / 5 min per user/IP).
- **GET /api/orders** – `rateLimiters.ordersList` (60 req / 5 min per user/IP).
- **POST /api/withdrawals** – `rateLimiters.withdrawals` (5 req / 10 min per user/IP).
- **GET /api/withdrawals** – `rateLimiters.withdrawals` (5 req / 10 min per user/IP).
- **/api/admin/dashboard** – `rateLimiters.admin` (60 req / 5 min per admin/IP).
- **/api/admin/notifications** (GET & PATCH) – `rateLimiters.admin` (60 req / 5 min per admin/IP).
- **/api/admin/reports/*** (overview/by-agent/by-product) – `rateLimiters.admin` (60 req / 5 min per admin/IP).
- **/api/admin/transactions** – `rateLimiters.admin` (60 req / 5 min per admin/IP).
- **POST /api/payplus/create-checkout** – `rateLimiters.payplusSession` (10 req / 10 min per user/order+IP).

## ENV – Required Variables

### Database
- `MONGODB_URI` – required connection string (production & dev).
- `MONGODB_DB` – optional override (defaults to `vipo`).
- `USE_MOCK_DB` – dev flag only (must be `false` in production).

### Authentication
- `JWT_SECRET` – required for JWT issuing/verification.
- `NEXTAUTH_SECRET` – required for NextAuth cookies.
- `NEXTAUTH_URL` – required in production for callback URLs.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_PASS` / `ADMIN_PHONE` – used by seeding/reset scripts.

### Public / Frontend URLs
- `PUBLIC_URL` – canonical base used by APIs.
- `NEXT_PUBLIC_BASE_URL` / `NEXT_PUBLIC_HOME_URL` – browser-side base URLs.
- `NEXT_PUBLIC_MANAGER_WHATSAPP` – phone link for support CTA.
- `NEXT_PUBLIC_COMPANY_NAME` – branding in quotes/PDFs.

### PayPlus
- `PAYPLUS_API_KEY` – required in production.
- `PAYPLUS_SECRET` – required in production.
- `PAYPLUS_WEBHOOK_SECRET` – required for webhook verification.
- `PAYPLUS_BASE_URL` – API base (e.g. https://restapiv2.payplus.co.il/api).
- `PAYPLUS_CALLBACK_URL` – optional override.
- `PAYPLUS_MOCK_ENABLED` – dev only, forbidden in production.

### OTP / Messaging
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` – OTP/SMS/WhatsApp channel.
- `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID` – WhatsApp Business API.

### Email / SMTP
- `SMTP_HOST`/`SMTP_SERVER`, `SMTP_PORT`, `SMTP_SECURE` – transport settings.
- `SMTP_USER`/`SMTP_USERNAME`, `SMTP_PASS`/`SMTP_PASSWORD` – credentials.
- `EMAIL_FROM` – default sender.

### Media / Misc
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` – asset uploads.
- `QUOTE_FONT_PATH` – PDF font path.
- `BASE_URL`, `ANALYZE`, `NEXT_PHASE`, `NODE_ENV`, `NODE_OPTIONS` – tooling/build flags.

## PayPlus – Hardening Changes

- Added `getPayPlusConfig({ strict })` in `lib/payplus/config.js` with full validation.
- Production now requires all PayPlus ENV vars; mock mode blocked in production.
- `createPayPlusSession` fails fast when config is invalid (no fallback to local).
- Webhook verifies signature and returns 400 on mismatch.
- Orders now include `commissionSettled`; webhook credits commission only once (paid/approved).
- Idempotent updates prevent double-crediting; failures just update status without payouts.

## Interim checks (Rate Limit wiring)

- `npm run lint` – ✅
- `npm run build` – ✅

## Final checks (post-ENV & PayPlus hardening)

- `npm run lint` – _(pending)_
- `npm run typecheck` – _(pending)_
- `npm run build` – _(pending)_
