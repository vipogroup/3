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
const CONTACT_EMAIL = process.env.WEB_PUSH_CONTACT_EMAIL || process.env.SUPPORT_EMAIL || 'mailto:support@vipo.local';

function normalizeContact(contact) {
  if (!contact) return 'mailto:support@vipo.local';
  if (contact.startsWith('mailto:')) return contact;
  return `mailto:${contact}`;
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
  return webPush.sendNotification(subscription, body);
}

export function resetWebPushForTesting() {
  isConfigured = false;
}
