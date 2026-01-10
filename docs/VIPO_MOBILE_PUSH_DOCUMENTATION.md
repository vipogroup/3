# מערכת התראות Push ו-PWA - VIPO
## תיעוד טכני מקיף

**תאריך עדכון:** ינואר 2026 | **גרסה:** 1.0

---

## תוכן עניינים
1. [סקירה כללית](#1-סקירה-כללית)
2. [עטיפת התקנה למובייל - PWA](#2-עטיפת-התקנה-למובייל---pwa)
3. [התראות Push](#3-התראות-push)
4. [Service Worker](#4-service-worker)
5. [ניהול Cache](#5-ניהול-cache)
6. [משאבים נדרשים](#6-משאבים-נדרשים)

---

## 1. סקירה כללית

המערכת משתמשת ב-**PWA** (לא Cordova/Capacitor):
- **Next.js 14** - Framework ראשי
- **Service Worker** - Cache, התראות, התקנה
- **Web Push API** - התראות עם VAPID
- **Web App Manifest** - התקנה כ-PWA

---

## 2. עטיפת התקנה למובייל - PWA

### 2.1 Manifest - `public/manifest.webmanifest`
```json
{
  "name": "VIPO - רוכשים ביחד",
  "short_name": "VIPO",
  "display": "standalone",
  "start_url": "/products?source=pwa",
  "background_color": "#0f172a",
  "theme_color": "#1e3a8a",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### 2.2 PwaInstaller - `app/components/PwaInstaller.jsx`
```jsx
'use client';
import { useEffect } from 'react';

export default function PwaInstaller({ enabled = true }) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    
    navigator.serviceWorker.register('/sw.js', { scope: '/' });
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window.deferredPwaPrompt = e;
    });
  }, [enabled]);
  
  return null;
}
```

### 2.3 פקודות Build
```bash
npm run dev      # פיתוח (port 3001)
npm run build    # בניית ייצור
npm start        # הרצת ייצור
```

---

## 3. התראות Push

### 3.1 משתני סביבה
```env
WEB_PUSH_PUBLIC_KEY=BHtd6stxtIhALe...
WEB_PUSH_PRIVATE_KEY=07hvsEnfjwPqD...
WEB_PUSH_CONTACT_EMAIL=mailto:support@vipo.local
```

### 3.2 lib/webPush.js
```javascript
import webPush from 'web-push';

let isConfigured = false;

export function getWebPushConfig() {
  const PUBLIC_KEY = process.env.WEB_PUSH_PUBLIC_KEY;
  const PRIVATE_KEY = process.env.WEB_PUSH_PRIVATE_KEY;
  return {
    configured: Boolean(PUBLIC_KEY && PRIVATE_KEY),
    publicKey: PUBLIC_KEY,
  };
}

export function ensureWebPushConfigured() {
  if (isConfigured) return true;
  const { publicKey } = getWebPushConfig();
  webPush.setVapidDetails(
    process.env.WEB_PUSH_CONTACT_EMAIL,
    publicKey,
    process.env.WEB_PUSH_PRIVATE_KEY
  );
  isConfigured = true;
}

export async function sendPushNotification(subscription, payload) {
  ensureWebPushConfigured();
  return webPush.sendNotification(subscription, JSON.stringify(payload), {
    TTL: 3600,
    urgency: 'normal'
  });
}
```

### 3.3 lib/pushSubscriptions.js - מבנה MongoDB
```javascript
{
  endpoint: "https://fcm.googleapis.com/...",
  keys: { p256dh: "...", auth: "..." },
  userId: "507f1f77bcf86cd799439011",
  role: "customer",  // customer | agent | admin
  tags: ["customer", "promotions"],
  consentAt: ISODate("2024-01-01"),
  revokedAt: null
}
```

### 3.4 API Routes

**GET /api/push/config** - מחזיר VAPID Public Key
```javascript
export async function GET() {
  const config = getWebPushConfig();
  return NextResponse.json({
    configured: config.configured,
    publicKey: config.publicKey
  });
}
```

**POST /api/push/subscribe** - שמירת subscription
```javascript
export async function POST(req) {
  const user = await requireAuthApi(req);
  const { subscription, tags } = await req.json();
  await upsertPushSubscription({
    endpoint: subscription.endpoint,
    keys: subscription.keys,
    userId: user.id,
    role: user.role,
    tags
  });
  return NextResponse.json({ ok: true });
}
```

### 3.5 lib/pushSender.js - שליחת התראות
```javascript
export async function pushToUsers(userIds, payload) {
  const subs = await findSubscriptionsByUserIds(userIds);
  for (const sub of subs) {
    await sendPushNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload);
  }
}

export async function pushToRoles(roles, payload) {
  const subs = await findSubscriptionsByRoles(roles);
  // שליחה לכל ה-subscriptions
}

export async function pushBroadcast(payload) {
  const subs = await getAllSubscriptions();
  // שליחה לכולם
}
```

### 3.6 Client - app/lib/pushClient.js
```javascript
export async function subscribeToPush({ tags = [] }) {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('denied');
  
  const config = await fetch('/api/push/config').then(r => r.json());
  const registration = await navigator.serviceWorker.ready;
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64ToUint8Array(config.publicKey)
  });
  
  await fetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify({ subscription, tags })
  });
}
```

---

## 4. Service Worker - `public/sw.js`

### 4.1 אירועי Push
```javascript
self.addEventListener('push', (event) => {
  const payload = event.data?.json() || {};
  
  const options = {
    body: payload.body || 'עדכון חדש ב-VIPO',
    icon: '/icons/192.png',
    badge: '/icons/badge.png',
    tag: payload.tag || 'vipo-notification',
    data: { url: payload.url || '/dashboard' }
  };
  
  // iOS לא תומך ב-actions
  if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    options.actions = [{ action: 'open', title: 'פתח' }];
    options.vibrate = [200, 100, 200];
  }
  
  event.waitUntil(
    self.registration.showNotification(payload.title || 'VIPO', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(clients.openWindow(url));
});
```

### 4.2 מבנה Payload
```javascript
{
  title: "VIPO - הזמנה חדשה",
  body: "התקבלה הזמנה מלקוח",
  icon: "/icons/192.png",
  badge: "/icons/badge.png",
  tag: "order-123",
  data: {
    url: "/admin/orders/123",
    templateType: "new_order"
  }
}
```

---

## 5. ניהול Cache

### 5.1 אסטרטגיית Cache
```javascript
const CACHE_NAME = 'vipo-static-v9';
const PRECACHE_URLS = ['/', '/products', '/manifest.webmanifest'];

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const cache = caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
```

### 5.2 עדכון גרסה
```javascript
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => {
      self.clients.matchAll().then(clients =>
        clients.forEach(c => c.postMessage({ type: 'NEW_VERSION_ACTIVATED' }))
      );
    })
  );
});
```

---

## 6. משאבים נדרשים

### 6.1 תלויות npm
```json
{
  "web-push": "^3.6.7",
  "next": "14.2.35",
  "mongodb": "6.8.0"
}
```

### 6.2 קבצים נדרשים
| קובץ | מיקום | תפקיד |
|------|-------|-------|
| sw.js | public/ | Service Worker |
| manifest.webmanifest | public/ | PWA Manifest |
| 192.png, 512.png | public/icons/ | אייקונים |
| webPush.js | lib/ | VAPID config |
| pushSender.js | lib/ | שליחת התראות |
| pushSubscriptions.js | lib/ | ניהול DB |
| pushClient.js | app/lib/ | Client-side |

### 6.3 הרצת דמו
```bash
# 1. הגדר משתני סביבה
cp .env.example .env

# 2. צור VAPID keys (אם צריך)
npx web-push generate-vapid-keys

# 3. הפעל MongoDB
mongod --dbpath ./data

# 4. הרץ את המערכת
npm run dev

# 5. פתח http://localhost:3001
```

### 6.4 בדיקת התראות
```bash
# שלח התראת בדיקה
curl -X POST http://localhost:3001/api/push/send-test \
  -H "Cookie: token=..." \
  -H "Content-Type: application/json" \
  -d '{"title":"בדיקה","body":"התראה עובדת!"}'
```

---

## 7. תאימות פלטפורמות

| Platform | Push | Actions | Vibrate | Install |
|----------|------|---------|---------|---------|
| Android Chrome | ✅ | ✅ | ✅ | ✅ |
| iOS Safari 16.4+ | ✅ | ❌ | ❌ | PWA only |
| Desktop Chrome | ✅ | ✅ | ❌ | ✅ |
| Desktop Firefox | ✅ | ✅ | ❌ | ❌ |

---

**סיום מסמך**
