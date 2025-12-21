const CACHE_NAME = 'vipo-static-v1';
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
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((err) => console.error('SW install cache error', err)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('vipo-static-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
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
          applicationServerKey,
        });

        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

  // אל תיירט בקשות שמקורן בדומיין אחר כדי להימנע משגיאות CSP בדפדפנים ניידים
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(request, clone))
            .catch((err) => console.warn('SW cache put failed', err));
          return response;
        })
        .catch((error) => {
          console.error('SW fetch failed', error);
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          throw error;
        });
    }),
  );
});

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
    renotify: payload.renotify === true,
    requireInteraction: payload.requireInteraction === true,
    data: {
      url: payload.url || payload.data?.url || defaultUrl,
      templateType: payload.data?.templateType,
      variables: payload.data?.variables,
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
  const targetUrl = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
        return undefined;
      })
      .catch((err) => console.error('SW notificationclick error', err)),
  );
});

self.addEventListener('message', (event) => {
  const { type } = event.data || {};
  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
