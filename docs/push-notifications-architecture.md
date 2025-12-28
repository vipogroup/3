# מערכת Push Notifications - ארכיטקטורה מלאה

## סקירה כללית

מסמך זה מתאר את שרשרת ה-Push Notifications המלאה במערכת VIPO, כולל חיבור מפתחות VAPID לשרת והלקוח.

---

## 1. משתני סביבה (הגדרות VAPID)

**קובץ:** `.env` / `.env.example`

```env
# WEB PUSH / VAPID KEYS
WEB_PUSH_PUBLIC_KEY=BHtd6stxtIhALe2ISG8qwpvUlFwyAVSvMm2wqriM_uyBeuQAeFrItwfBltihNrlcZEh1ImuL69oz4C6hv6i7fTw
WEB_PUSH_PRIVATE_KEY=07hvsEnfjwPqD523wdlWq83d7TqcRVOWdeDUdJzL7i4
WEB_PUSH_CONTACT_EMAIL=mailto:support@vipo.local
```

### הסבר:
- **PUBLIC_KEY** - מפתח ציבורי שנשלח ללקוח ומשמש ליצירת subscription
- **PRIVATE_KEY** - מפתח פרטי שנשמר בשרת בלבד ומשמש לחתימה על הודעות
- **CONTACT_EMAIL** - כתובת מייל ליצירת קשר (נדרש על ידי פרוטוקול VAPID)

---

## 2. ספריית השרת - `lib/webPush.js`

**קובץ:** `lib/webPush.js`

### תפקיד:
קריאת מפתחות VAPID מה-env והגדרת ספריית `web-push`

### קוד מלא:

```javascript
import webPush from 'web-push';

let isConfigured = false;

function sanitizeBase64Key(rawValue) {
  if (!rawValue) return '';
  const trimmed = String(rawValue).trim();
  const withoutWrappingQuotes = trimmed.replace(/^['"]+|['"]+$/g, '');
  return withoutWrappingQuotes.replace(/\s+/g, '');
}

const PUBLIC_KEY = sanitizeBase64Key(process.env.WEB_PUSH_PUBLIC_KEY || process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || '');
const PRIVATE_KEY = sanitizeBase64Key(process.env.WEB_PUSH_PRIVATE_KEY || '');
const CONTACT_EMAIL = (process.env.WEB_PUSH_CONTACT_EMAIL || process.env.SUPPORT_EMAIL || 'mailto:support@vipo.local').trim().replace(/[\r\n]/g, '');

function normalizeContact(contact) {
  if (!contact) return 'mailto:support@vipo.local';
  const cleaned = String(contact).trim().replace(/[\r\n]/g, '');
  if (cleaned.startsWith('mailto:')) return cleaned;
  return `mailto:${cleaned}`;
}

export function getWebPushConfig() {
  const configured = Boolean(PUBLIC_KEY && PRIVATE_KEY);
  return {
    configured,
    publicKey: PUBLIC_KEY,
    contact: normalizeContact(CONTACT_EMAIL),
  };
}

export function ensureWebPushConfigured() {
  if (isConfigured) return true;

  const { configured, publicKey, contact } = getWebPushConfig();
  if (!configured) {
    throw new Error('WEB_PUSH_NOT_CONFIGURED');
  }

  webPush.setVapidDetails(contact, publicKey, PRIVATE_KEY);
  isConfigured = true;
  return true;
}

export async function sendPushNotification(subscription, payload = {}) {
  ensureWebPushConfigured();

  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  
  const options = {
    TTL: 60 * 60, // 1 hour
    urgency: 'normal',
  };
  
  return webPush.sendNotification(subscription, body, options);
}
```

### פונקציות מיוצאות:

| פונקציה | תפקיד |
|---------|-------|
| `getWebPushConfig()` | מחזיר את הגדרות VAPID |
| `ensureWebPushConfigured()` | מוודא שספריית web-push מוגדרת |
| `sendPushNotification()` | שולח התראה ל-subscription |

---

## 3. נקודות API

### 3.1 `/api/push/config` - מחזיר Public VAPID Key

**קובץ:** `app/api/push/config/route.js`

```javascript
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getWebPushConfig } from '@/lib/webPush';

export async function GET() {
  const config = getWebPushConfig();

  if (!config.configured) {
    return NextResponse.json({ ok: false, configured: false }, { status: 200 });
  }

  return NextResponse.json({
    ok: true,
    configured: true,
    publicKey: config.publicKey,  // ← הלקוח מקבל את המפתח הציבורי
    contact: config.contact,
  });
}
```

### 3.2 `/api/push/subscribe` - שמירת/מחיקת Subscription

**קובץ:** `app/api/push/subscribe/route.js`

```javascript
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/auth/server';
import { upsertPushSubscription, removePushSubscription } from '@/lib/pushSubscriptions';
import { getWebPushConfig } from '@/lib/webPush';

// POST - שמירת subscription חדש
export async function POST(req) {
  const config = getWebPushConfig();
  if (!config.configured) {
    return NextResponse.json({ ok: false, error: 'web_push_not_configured' }, { status: 503 });
  }

  const user = await requireAuthApi(req);  // דורש התחברות
  const payload = await req.json();

  await upsertPushSubscription({
    endpoint: payload.subscription.endpoint,
    keys: payload.subscription.keys,  // p256dh + auth
    userId: user.id,
    role: user.role,
    tags: payload.tags || [user.role],
  });

  return NextResponse.json({ ok: true });
}

// DELETE - מחיקת subscription
export async function DELETE(req) {
  const user = await requireAuthApi(req);
  const { endpoint } = await req.json();
  
  await removePushSubscription(endpoint);
  
  return NextResponse.json({ ok: true });
}
```

---

## 4. ניהול Subscriptions - `lib/pushSubscriptions.js`

**קובץ:** `lib/pushSubscriptions.js`

### פונקציות עיקריות:

```javascript
// שמירת/עדכון subscription
export async function upsertPushSubscription({
  endpoint,
  keys,
  userId,
  role,
  tags,
  userAgent,
  ip,
  consentAt,
  consentVersion,
  consentMeta,
})

// סימון subscription כמבוטל (soft delete)
export async function removePushSubscription(endpoint)

// חיפוש subscriptions לפי משתמשים
export async function findSubscriptionsByUserIds(userIds)

// חיפוש לפי תגיות
export async function findSubscriptionsByTags(tags)

// חיפוש לפי תפקידים
export async function findSubscriptionsByRoles(roles)

// קבלת כל ה-subscriptions
export async function getAllSubscriptions(includeRevoked = false)

// מחיקה מוחלטת של כל ה-subscriptions של משתמש
export async function deleteAllUserSubscriptions(userId)
```

### מבנה ה-Subscription ב-MongoDB:

```javascript
{
  endpoint: "https://fcm.googleapis.com/fcm/send/...",
  keys: {
    p256dh: "...",
    auth: "..."
  },
  userId: "507f1f77bcf86cd799439011",
  userObjectId: ObjectId("507f1f77bcf86cd799439011"),
  role: "customer",
  tags: ["customer", "promotions"],
  userAgent: "Mozilla/5.0...",
  ip: "192.168.1.1",
  consentAt: ISODate("2024-01-01T00:00:00Z"),
  consentVersion: "1.0",
  lastConsentAction: "accepted",
  revokedAt: null,
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}
```

---

## 5. Service Worker - `public/sw.js`

**קובץ:** `public/sw.js`

### אירועים עיקריים:

#### 5.1 אירוע `push` - קבלת התראה

```javascript
self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : {};

  const title = payload.title || 'VIPO';
  
  const options = {
    body: payload.body || 'יש לך עדכון חדש ב-VIPO',
    icon: payload.icon || '/icons/192.png',
    badge: payload.badge || '/icons/badge.png',
    tag: payload.tag || 'vipo-notification',
    renotify: true,
    silent: false,
    data: {
      url: payload.url || '/dashboard',
      templateType: payload.data?.templateType,
      variables: payload.data?.variables,
      timestamp: new Date().getTime(),
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
```

#### 5.2 אירוע `notificationclick` - לחיצה על התראה

```javascript
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const targetUrl = event.notification.data?.url || '/dashboard';
  
  event.waitUntil(
    clients.openWindow(targetUrl)
  );
});
```

#### 5.3 אירוע `pushsubscriptionchange` - חידוש אוטומטי

```javascript
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    (async () => {
      // 1. מביא את ה-VAPID key מהשרת
      const config = await fetch('/api/push/config').then(r => r.json());
      
      // 2. יוצר subscription חדש
      const newSubscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(config.publicKey),
      });
      
      // 3. שולח לשרת
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ subscription: newSubscription }),
      });
    })()
  );
});
```

---

## 6. צד לקוח - `app/lib/pushClient.js`

**קובץ:** `app/lib/pushClient.js`

### פונקציות מיוצאות:

| פונקציה | תפקיד |
|---------|-------|
| `ensureNotificationPermission()` | בקשת הרשאה מהמשתמש |
| `subscribeToPush()` | יצירת subscription ושליחה לשרת |
| `unsubscribeFromPush()` | ביטול מנוי |
| `hasActiveSubscription()` | בדיקה אם יש מנוי פעיל |

### זרימת `subscribeToPush`:

```javascript
export async function subscribeToPush({
  tags = [],
  consentAt = null,
  consentVersion = null,
  consentMeta = null,
  forcePrompt = false
} = {}) {
  // 1. בדיקת הרשאות
  const permission = await ensureNotificationPermission();
  if (!permission.granted) {
    throw new Error(permission.reason || 'permission_denied');
  }

  // 2. קבלת VAPID key מהשרת
  const config = await fetch('/api/push/config').then(r => r.json());
  if (!config?.configured || !config.publicKey) {
    throw new Error('web_push_not_configured');
  }

  // 3. קבלת SW מוכן
  const registration = await getReadyServiceWorkerRegistration();
  
  // 4. בדיקה אם יש subscription קיים
  let subscription = await registration.pushManager.getSubscription();

  // 5. יצירת subscription חדש אם צריך
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(config.publicKey),
    });
  }

  // 6. שליחה לשרת לשמירה
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ subscription, tags, consentAt, consentVersion, consentMeta }),
  });

  return { ok: true, subscription };
}
```

---

## 7. שליחת התראות מהשרת - `lib/pushSender.js`

**קובץ:** `lib/pushSender.js`

```javascript
import { findSubscriptionsByUserIds, findSubscriptionsByTags, findSubscriptionsByRoles, getAllSubscriptions } from '@/lib/pushSubscriptions';
import { sendPushNotification } from '@/lib/webPush';

// שליחה למשתמשים ספציפיים
export async function pushToUsers(userIds = [], payload) {
  const subs = await findSubscriptionsByUserIds(userIds);
  return deliverToSubscriptions(subs, payload);
}

// שליחה לפי תגיות
export async function pushToTags(tags = [], payload) {
  const subs = await findSubscriptionsByTags(tags);
  return deliverToSubscriptions(subs, payload);
}

// שליחה לפי תפקיד (customer/agent/admin)
export async function pushToRoles(roles = [], payload) {
  const subs = await findSubscriptionsByRoles(roles);
  return deliverToSubscriptions(subs, payload);
}

// שליחה לכולם
export async function pushBroadcast(payload) {
  const subs = await getAllSubscriptions();
  return deliverToSubscriptions(subs, payload);
}
```

---

## 8. רכיבי UI

### 8.1 `PwaInstaller.jsx`

**תפקיד:** רישום Service Worker וטיפול ב-install prompt

**מיקום:** `app/components/PwaInstaller.jsx`

```javascript
'use client';

import { useEffect } from 'react';

export default function PwaInstaller({ enabled = true }) {
  useEffect(() => {
    if (!enabled) return;
    
    const registerServiceWorker = async () => {
      await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    };

    registerServiceWorker();
    
    // טיפול ב-beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      window.deferredPwaPrompt = event;
    });
  }, [enabled]);

  return null;
}
```

### 8.2 `PushNotificationModal.jsx`

**תפקיד:** מודאל בקשת הרשאות להתראות

**מיקום:** `app/components/PushNotificationModal.jsx`

מופעל אוטומטית כשמשתמש מתחבר ועדיין לא נרשם להתראות.

### 8.3 `PushNotificationsToggle.jsx`

**תפקיד:** Toggle להפעלה/כיבוי התראות בהגדרות

**מיקום:** `app/components/PushNotificationsToggle.jsx`

---

## 9. דיאגרמת זרימה מלאה

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VAPID Keys Flow                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  .env                                                                        │
│  ┌────────────────────────┐                                                 │
│  │ WEB_PUSH_PUBLIC_KEY    │                                                 │
│  │ WEB_PUSH_PRIVATE_KEY   │────┐                                            │
│  │ WEB_PUSH_CONTACT_EMAIL │    │                                            │
│  └────────────────────────┘    │                                            │
│                                ▼                                            │
│  lib/webPush.js               ┌─────────────────────┐                       │
│  ┌─────────────────────┐      │ webPush.setVapidDetails(contact,            │
│  │ getWebPushConfig()  │──────│                    publicKey, privateKey)   │
│  │ sendPushNotification│      └─────────────────────┘                       │
│  └─────────────────────┘                │                                   │
│            │                            │                                   │
│            ▼                            ▼                                   │
│  /api/push/config              /api/push/subscribe                          │
│  ┌─────────────────────┐       ┌─────────────────────┐                      │
│  │ GET → { publicKey } │       │ POST → upsert DB    │                      │
│  └─────────────────────┘       │ DELETE → revoke     │                      │
│            │                   └─────────────────────┘                      │
│            │                            │                                   │
│            ▼                            ▼                                   │
│  pushClient.js                 lib/pushSubscriptions.js                     │
│  ┌─────────────────────┐       ┌─────────────────────┐                      │
│  │ subscribeToPush()   │◄──────│ upsertPushSubscription()                   │
│  │ - fetch publicKey   │       │ removePushSubscription()                   │
│  │ - pushManager.subscribe()   │ findSubscriptionsByUserIds()               │
│  │ - POST to server    │       └─────────────────────┘                      │
│  └─────────────────────┘                                                    │
│            │                                                                │
│            ▼                                                                │
│  sw.js (Service Worker)        lib/pushSender.js                            │
│  ┌─────────────────────┐       ┌─────────────────────┐                      │
│  │ push event →        │◄──────│ pushToUsers()       │                      │
│  │ showNotification()  │       │ pushToRoles()       │                      │
│  │                     │       │ pushBroadcast()     │                      │
│  │ notificationclick → │       │                     │                      │
│  │ openWindow()        │       │ → sendPushNotification()                   │
│  └─────────────────────┘       └─────────────────────┘                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. איך VAPID עובד - הסבר טכני

### שלב 1: הגדרת המפתחות
המפתחות נוצרים פעם אחת (באמצעות `web-push generate-vapid-keys`) ונשמרים ב-`.env`

### שלב 2: הלקוח מקבל את המפתח הציבורי
הלקוח קורא ל-`/api/push/config` ומקבל את ה-PUBLIC KEY

### שלב 3: יצירת Subscription
הלקוח משתמש ב-`pushManager.subscribe()` עם המפתח הציבורי:
```javascript
subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: base64ToUint8Array(publicKey),
});
```

זה יוצר אובייקט subscription שמכיל:
- `endpoint` - URL ייחודי לשליחת הודעות (מספק Push Service של הדפדפן)
- `keys.p256dh` - מפתח הצפנה
- `keys.auth` - מפתח אימות

### שלב 4: שמירת Subscription בשרת
הלקוח שולח את ה-subscription ל-`/api/push/subscribe` לשמירה ב-MongoDB

### שלב 5: שליחת התראה
כששרת רוצה לשלוח התראה:
1. מביא את ה-subscription מה-DB
2. חותם על ההודעה עם ה-PRIVATE KEY (VAPID)
3. שולח את ההודעה המוצפנת ל-endpoint

### שלב 6: קבלה והצגה
1. ה-Push Service של הדפדפן מקבל את ההודעה
2. מוודא שהחתימה תואמת למפתח הציבורי
3. מעביר את ההודעה ל-Service Worker
4. ה-SW מציג את ההתראה למשתמש

---

## 11. היכן נקראות הפונקציות

### `subscribeToPush`:
- `PushNotificationModal.jsx` - כשמשתמש לוחץ "כן, אני רוצה לקבל עדכונים"
- `PushNotificationsToggle.jsx` - כשמשתמש מפעיל התראות בהגדרות
- `PushNotificationBanner.jsx` - כשמשתמש לוחץ על באנר ההרשמה

### `requestPwaInstallPrompt`:
- `PwaInstaller.jsx` - מגדיר את הפונקציה על window
- `UserHeader.jsx` - כפתור התקנת האפליקציה

### `getReadyServiceWorkerRegistration`:
- `pushClient.js` - בכל פעולה שדורשת SW מוכן

---

## 12. טיפים ובעיות נפוצות

### בעיה: ההתראות לא מגיעות
**פתרון:** בדוק ש:
1. מפתחות VAPID מוגדרים נכון ב-`.env`
2. יש subscription פעיל ב-DB (לא revoked)
3. ה-Service Worker רשום ופעיל

### בעיה: שגיאת 403/410 בשליחה
**פתרון:** ה-subscription לא תקף יותר. המערכת מסירה אותו אוטומטית.

### בעיה: iOS לא מקבל התראות
**פתרון:** iOS דורש:
1. התקנת האפליקציה למסך הבית
2. גרסת Safari 16.4+
3. אישור התראות בהגדרות

---

*מסמך זה נוצר אוטומטית - עודכן לאחרונה: ${new Date().toLocaleDateString('he-IL')}*
