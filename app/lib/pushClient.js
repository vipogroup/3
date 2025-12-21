'use client';

const CONFIG_ENDPOINT = '/api/push/config';
const SUBSCRIBE_ENDPOINT = '/api/push/subscribe';

function sanitizeBase64Input(value) {
  if (!value) return '';
  const trimmed = String(value).trim();
  const withoutQuotes = trimmed.replace(/^['"]+|['"]+$/g, '');
  return withoutQuotes.replace(/\s+/g, '');
}

function base64ToUint8Array(base64String) {
  if (!base64String) {
    console.error('VAPID_ERROR: Empty base64String provided');
    throw new Error('invalid_vapid_public_key');
  }

  const normalized = sanitizeBase64Input(base64String);
  if (!normalized) {
    console.error('VAPID_ERROR: Sanitization resulted in empty string', { original: base64String });
    throw new Error('invalid_vapid_public_key');
  }

  const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
  const base64 = (normalized + padding).replace(/-/g, '+').replace(/_/g, '/');

  let rawData;
  try {
    rawData = atob(base64);
  } catch (error) {
    console.error('VAPID_ERROR: atob failed', { 
      original: base64String,
      normalized: normalized,
      final: base64,
      error: error.message 
    });
    throw new Error('invalid_vapid_public_key');
  }
  
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

async function getPushConfig() {
  const res = await fetch(CONFIG_ENDPOINT, { cache: 'no-store' });
  if (!res.ok) return { ok: false };
  return res.json();
}

async function postSubscription(body, method = 'POST') {
  const res = await fetch(SUBSCRIBE_ENDPOINT, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'subscription_failed');
  }
  return res.json();
}

export async function ensureNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { granted: false, reason: 'unsupported' };
  }

  const permission = Notification.permission;
  if (permission === 'granted') {
    return { granted: true };
  }
  if (permission === 'denied') {
    return { granted: false, reason: 'denied' };
  }

  const result = await Notification.requestPermission();
  return { granted: result === 'granted', reason: result };
}

export async function subscribeToPush({
  tags = [],
  consentAt = null,
  consentVersion = null,
  consentMeta = null,
} = {}) {
  if (typeof window === 'undefined') {
    throw new Error('client_only');
  }
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('unsupported');
  }

  const permission = await ensureNotificationPermission();
  if (!permission.granted) {
    throw new Error(permission.reason || 'permission_denied');
  }

  const config = await getPushConfig();
  if (!config?.configured || !config.publicKey) {
    throw new Error('web_push_not_configured');
  }

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(config.publicKey),
    });
  }

  await postSubscription({
    subscription,
    tags,
    consentAt,
    consentVersion,
    consentMeta,
  });

  return { ok: true, subscription };
}

export async function unsubscribeFromPush() {
  if (typeof window === 'undefined') {
    return { ok: false, error: 'client_only' };
  }
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { ok: false, error: 'unsupported' };
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    return { ok: true, unsubscribed: false };
  }

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe().catch(() => {});

  try {
    await postSubscription({ endpoint }, 'DELETE');
  } catch (err) {
    console.warn('Failed to remove subscription server-side', err);
  }

  return { ok: true, unsubscribed: true };
}

export async function hasActiveSubscription() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return Boolean(subscription);
}
