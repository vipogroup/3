const CACHE_NAME = 'vipo-static-v5';
const PRECACHE_URLS = [
  '/',
  '/products',
  '/manifest.webmanifest',
  '/icons/192.png',
  '/icons/512.png',
  '/icons/badge.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // קודם נוסיף את הקבצים החיוניים
      await cache.addAll(PRECACHE_URLS).catch(err => console.error('SW install cache error', err));
      // מיד נפעיל את ה-Service Worker החדש
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // מחיקת גרסאות ישנות מהמטמון
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith('vipo-static-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );

      // תפיסת שליטה על כל הלקוחות הפתוחים
      await self.clients.claim();

      // שליחת הודעה ללקוחות שיש עדכון
      const clients = await self.clients.matchAll();
      for (const client of clients) {
        client.postMessage({ type: 'NEW_VERSION_ACTIVATED' });
      }
    })()
  );
});

self.addEventListener('notificationclose', (event) => {
  // יכולה להיות הרחבה עתידית לרישום אנליטיקס על סגירת התראה
  if (event.notification && event.notification.data?.templateType) {
    // השארנו לוג לצורכי פיתוח; ניתן להחליף במשלוח Analytics בעתיד
    console.debug('notification_closed', event.notification.data.templateType);
  }
});

self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const applicationServerKey = await fetch('/api/push/config', { cache: 'no-store' })
          .then((res) => (res.ok ? res.json() : null))
          .then((config) => (config?.publicKey ? config.publicKey : null));
        if (!applicationServerKey) {
          console.warn('pushsubscriptionchange: VAPID key missing, cannot resubscribe');
          return;
        }

        const registration = await self.registration;
        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64ToUint8Array(applicationServerKey),
        });

        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ subscription: newSubscription, tags: [] }),
        });
      } catch (error) {
        console.error('pushsubscriptionchange_error', error);
      }
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const requestUrl = new URL(request.url);

  // אל תיירט בקשות שמקורן בדומיין אחר
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  // בדיקה אם זה קובץ חיוני
  const isEssential = PRECACHE_URLS.includes(requestUrl.pathname);

  event.respondWith(
    (async () => {
      try {
        // נסה קודם להביא מהרשת
        const networkResponse = await fetch(request);
        
        // אם הצליח, שמור במטמון
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        // אם נכשל, נסה להביא מהמטמון
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;

        // אם זה ניווט, חזור לדף הבית
        if (request.mode === 'navigate') {
          return caches.match('/');
        }

        throw error;
      }
    })()
  );
});

// בדיקת עדכונים כל 30 שניות
setInterval(() => {
  self.registration.update();
}, 30000);

function base64ToUint8Array(base64String) {
  const trimmed = String(base64String || '').trim().replace(/^['"]+|['"]+$/g, '').replace(/\s+/g, '');
  const padding = '='.repeat((4 - (trimmed.length % 4)) % 4);
  const base64 = (trimmed + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function normalizePayload(event) {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (error) {
    const text = event.data ? event.data.text() : '';
    payload = { title: text };
  }
  return payload;
}

self.addEventListener('push', (event) => {
  const payload = normalizePayload(event);

  const title = payload.title || 'VIPO';
  const defaultUrl = '/dashboard';
  const options = {
    body: payload.body || 'יש לך עדכון חדש ב-VIPO',
    icon: payload.icon || '/icons/192.png',
    badge: payload.badge || '/icons/badge.png',
    image: payload.image,
    tag: payload.tag,
    renotify: true,  // תמיד להציג התראה חדשה
    requireInteraction: true,  // להשאיר את ההתראה עד שהמשתמש ילחץ עליה
    silent: false,  // לאפשר צליל התראה
    vibrate: [200, 100, 200],  // להוסיף רטט במובייל
    actions: [
      {
        action: 'open',
        title: 'פתח',
        icon: '/icons/open.png'
      }
    ],
    data: {
      url: payload.url || payload.data?.url || defaultUrl,
      templateType: payload.data?.templateType,
      variables: payload.data?.variables,
      timestamp: new Date().getTime(),
      ...payload.data,
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options).catch((err) => {
      console.error('sw_showNotification_error', err);
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // טיפול בלחיצה על כפתורים בהתראה
  if (event.action === 'open') {
    const targetUrl = event.notification.data?.url || '/dashboard';
    event.waitUntil(
      (async () => {
        // ניסיון למצוא חלון פתוח של האפליקציה
        const windowClients = await clients.matchAll({
          type: 'window',
          includeUncontrolled: true
        });

        // אם יש חלון פתוח, ננסה להשתמש בו
        for (const client of windowClients) {
          if (client.url.includes(targetUrl)) {
            await client.focus();
            if (client.navigate) {
              await client.navigate(targetUrl);
            }
            return;
          }
        }

        // אם אין חלון פתוח, נפתח חדש
        if (clients.openWindow) {
          await clients.openWindow(targetUrl);
        }
      })()
    );
    return;
  }

  // טיפול בלחיצה על ההתראה עצמה
  const targetUrl = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    (async () => {
      try {
        const windowClients = await clients.matchAll({
          type: 'window',
          includeUncontrolled: true
        });

        // אם יש חלון פתוח, נשתמש בו
        for (const client of windowClients) {
          if (client.url.includes(targetUrl)) {
            await client.focus();
            if (client.navigate) {
              await client.navigate(targetUrl);
            }
            return;
          }
        }

        // אם אין חלון פתוח, נפתח חדש
        if (clients.openWindow) {
          await clients.openWindow(targetUrl);
        }
      } catch (err) {
        console.error('SW notificationclick error', err);
      }
    })()
  );
});

self.addEventListener('message', (event) => {
  const { type } = event.data || {};
  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
