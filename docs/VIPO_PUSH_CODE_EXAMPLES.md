# VIPO Push Notifications - דוגמאות קוד מלאות

## חלק 2 - קוד מפורט מהמערכת

---

## 1. רכיבי UI להתראות

### 1.1 PushNotificationModal.jsx
```jsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { hasActiveSubscription, subscribeToPush, ensureNotificationPermission } from '@/app/lib/pushClient';

const MODAL_DECLINED_KEY = 'vipo_push_modal_declined';

export default function PushNotificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('customer');
  const [step, setStep] = useState('ask');

  useEffect(() => {
    async function checkAndShow() {
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.ready;
      }
      
      const res = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' });
      if (!res.ok) return;
      
      const data = await res.json();
      if (!data?.user || data.user.role === 'admin') return;
      
      setUserRole(data.user.role || 'customer');

      if (localStorage.getItem(MODAL_DECLINED_KEY)) return;
      if (!('Notification' in window)) return;

      const subscribed = await hasActiveSubscription();
      if (subscribed) return;
      if (Notification.permission === 'denied') return;

      setTimeout(() => setIsOpen(true), 15000);
    }

    setTimeout(checkAndShow, 2000);
  }, []);

  const handleEnable = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const permission = await ensureNotificationPermission();
      
      if (!permission.granted) {
        if (permission.reason === 'ios_install_required') {
          setError('ב-iPhone יש להוסיף את האתר למסך הבית תחילה');
        } else if (permission.reason === 'denied') {
          setError('ההרשאה נדחתה. ניתן לשנות בהגדרות הדפדפן');
        } else {
          setError('לא ניתן להפעיל התראות במכשיר זה');
        }
        setStep('error');
        return;
      }

      await subscribeToPush({
        tags: [userRole],
        consentAt: new Date().toISOString(),
        consentVersion: '1.0',
        consentMeta: { source: 'login_modal', role: userRole },
      });

      window.dispatchEvent(new CustomEvent('push-subscription-changed', { detail: { subscribed: true } }));
      setStep('success');
      setTimeout(() => setIsOpen(false), 1500);
    } catch (err) {
      setError('שגיאה בהפעלת התראות');
      setStep('error');
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  const handleClose = useCallback(() => {
    localStorage.setItem(MODAL_DECLINED_KEY, new Date().toISOString());
    setIsOpen(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] px-3 pb-3">
      <div className="bg-white shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-3"
           style={{ 
             border: '2px solid transparent', 
             backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', 
             backgroundOrigin: 'border-box', 
             backgroundClip: 'padding-box, border-box'
           }}>
        {step === 'ask' && (
          <>
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 flex-1">הפעל התראות לקבלת מבצעים ועדכונים</p>
            <button onClick={handleEnable} disabled={loading}
                    className="text-white text-xs font-semibold px-4 py-2 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
              {loading ? '...' : 'הפעל'}
            </button>
            <button onClick={handleClose} className="text-gray-500 text-xs px-2 py-2">לא עכשיו</button>
          </>
        )}
        {step === 'success' && <p className="text-xs text-green-600">מעולה! תקבלו התראות לנייד</p>}
        {step === 'error' && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
```

### 1.2 PushConsentModal.jsx - תוכן לפי תפקיד
```jsx
const ROLE_COPY = {
  customer: {
    title: 'התראות חכמות ללקוחות VIPO',
    lead: 'נשלח רק עדכונים חשובים שיעזרו לך לא לפספס מבצעים.',
    bullets: [
      'אישור רכישה וקבלה מיד לאחר התשלום',
      'תזכורות לפני סגירת רכישה קבוצתית',
      'התראות על מוצרים והנחות שמתאימים לך',
    ],
  },
  agent: {
    title: 'התראות חכמות לסוכני VIPO',
    lead: 'נעדכן אותך ברגע שיש פעילות דרך הקוד שלך.',
    bullets: [
      'עמלה חדשה שנרשמה עבורך',
      'דוחות יומיים על ביצועים ועמלות',
      'לקוחות שביקשו סיוע דרכך',
    ],
  },
  admin: {
    title: 'התראות ניהוליות',
    lead: 'קבל התראה מיידית על פעילות חשובה.',
    bullets: [
      'רישום משתמשים חדשים',
      'תשלומים שהתקבלו או נכשלו',
      'תקלות שדורשות התערבות',
    ],
  },
};
```

---

## 2. Service Worker מלא - public/sw.js

```javascript
const CACHE_NAME = 'vipo-static-v9';
const PRECACHE_URLS = [
  '/',
  '/products',
  '/manifest.webmanifest',
  '/icons/192.png',
  '/icons/512.png',
  '/icons/badge.png',
];

// === INSTALL ===
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE_URLS).catch(err => console.error('SW install error', err));
      await self.skipWaiting();
    })()
  );
});

// === ACTIVATE ===
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key.startsWith('vipo-static-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
      await self.clients.claim();
      
      const clients = await self.clients.matchAll();
      for (const client of clients) {
        client.postMessage({ type: 'NEW_VERSION_ACTIVATED' });
      }
    })()
  );
});

// === PUSH ===
self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (error) {
    payload = { title: event.data?.text() || 'VIPO' };
  }

  const title = payload.title || 'VIPO';
  let isIOS = false;
  try {
    isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  } catch (e) {}
  
  const options = {
    body: payload.body || 'יש לך עדכון חדש ב-VIPO',
    icon: payload.icon || '/icons/192.png',
    badge: payload.badge || '/icons/badge.png',
    tag: payload.tag || 'vipo-notification',
    renotify: true,
    silent: false,
    data: {
      url: payload.url || payload.data?.url || '/dashboard',
      templateType: payload.data?.templateType,
      timestamp: Date.now(),
    },
  };
  
  if (!isIOS) {
    options.requireInteraction = true;
    options.vibrate = [200, 100, 200];
    options.actions = [{ action: 'open', title: 'פתח', icon: '/icons/open.png' }];
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

// === NOTIFICATION CLICK ===
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/dashboard';
  
  event.waitUntil(
    (async () => {
      const windowClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
      
      for (const client of windowClients) {
        if (client.url.includes(targetUrl)) {
          await client.focus();
          return;
        }
      }
      
      if (clients.openWindow) {
        await clients.openWindow(targetUrl);
      }
    })()
  );
});

// === PUSH SUBSCRIPTION CHANGE ===
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    (async () => {
      const config = await fetch('/api/push/config', { cache: 'no-store' })
        .then(r => r.ok ? r.json() : null);
      
      if (!config?.publicKey) return;

      const newSub = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(config.publicKey),
      });

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ subscription: newSub }),
      });
    })()
  );
});

// === FETCH (Network-first) ===
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  
  const excludePaths = ['/login', '/register', '/admin', '/api', '/_next'];
  if (excludePaths.some(p => url.pathname.startsWith(p))) return;

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        
        if (request.mode === 'navigate') {
          const home = await caches.match('/');
          if (home) return home;
        }
        
        return new Response('Offline', { status: 503 });
      }
    })()
  );
});

// === MESSAGE ===
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// === AUTO UPDATE CHECK ===
setInterval(() => self.registration.update(), 30000);

function base64ToUint8Array(base64) {
  const str = String(base64 || '').trim().replace(/^['"]+|['"]+$/g, '').replace(/\s+/g, '');
  const padding = '='.repeat((4 - (str.length % 4)) % 4);
  const b64 = (str + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}
```

---

## 3. דיאגרמת זרימה

```
┌────────────────────────────────────────────────────────────────┐
│                    VAPID Keys Flow                              │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  .env ──────────────────────▶ lib/webPush.js                   │
│  WEB_PUSH_PUBLIC_KEY           setVapidDetails()               │
│  WEB_PUSH_PRIVATE_KEY                │                         │
│                                      ▼                         │
│                            /api/push/config                    │
│                            GET → { publicKey }                 │
│                                      │                         │
│                                      ▼                         │
│                            pushClient.js                       │
│                            subscribeToPush()                   │
│                            pushManager.subscribe()             │
│                                      │                         │
│                                      ▼                         │
│                            /api/push/subscribe                 │
│                            POST → MongoDB                      │
│                                      │                         │
│                                      ▼                         │
│  lib/pushSender.js ◄────── lib/pushSubscriptions.js           │
│  pushToUsers()               findByUserIds()                   │
│  pushToRoles()               findByRoles()                     │
│                                      │                         │
│                                      ▼                         │
│                            webPush.sendNotification()          │
│                                      │                         │
│                                      ▼                         │
│                            Push Service (FCM/APNs)             │
│                                      │                         │
│                                      ▼                         │
│                            sw.js (push event)                  │
│                            showNotification()                  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. Troubleshooting

### בעיה: התראות לא מגיעות
```bash
# בדוק VAPID keys
curl http://localhost:3001/api/push/config

# בדוק subscriptions ב-DB
db.pushSubscriptions.find({ revokedAt: null })
```

### בעיה: שגיאת 403/410
- Subscription לא תקף - המערכת מוחקת אוטומטית
- VAPID key השתנה - צריך re-subscribe

### בעיה: iOS לא מקבל
- ודא iOS 16.4+
- האפליקציה חייבת להיות מותקנת (Add to Home Screen)
- בדוק הגדרות Safari → Notifications

---

## 5. יצירת VAPID Keys חדשים

```bash
# התקנה
npm install web-push -g

# יצירת מפתחות
npx web-push generate-vapid-keys

# פלט:
# Public Key: BHtd6stxtIhALe2ISG8qwpvUlFwyAVSvMm2wqriM...
# Private Key: 07hvsEnfjwPqD523wdlWq83d7TqcRVOWdeDUdJzL7i4

# הוסף ל-.env
```

---

**סיום חלק 2**
