/**
 * PayPlus Payment Integration Client
 *
 * All configuration is read from environment variables:
 * - PAYPLUS_API_KEY: API key for authentication
 * - PAYPLUS_SECRET: API secret for authentication
 * - PAYPLUS_WEBHOOK_SECRET: Secret for verifying webhook signatures
 * - PAYPLUS_BASE_URL: Base URL for PayPlus API (defaults to production)
 * - PAYPLUS_CALLBACK_URL: (Optional) Override callback URL for webhooks
 *
 * The client gracefully handles missing configuration by returning
 * a fallback response instead of crashing.
 */

import crypto from 'crypto';

// Required ENV keys for PayPlus to work
const REQUIRED_ENV_KEYS = ['PAYPLUS_API_KEY', 'PAYPLUS_SECRET'];

// Optional but recommended: PAYPLUS_WEBHOOK_SECRET, PAYPLUS_BASE_URL, PAYPLUS_CALLBACK_URL

/**
 * Build PayPlus configuration from environment variables
 * @returns {Object} Configuration object
 */
function buildConfig() {
  return {
    apiKey: process.env.PAYPLUS_API_KEY || '',
    apiSecret: process.env.PAYPLUS_SECRET || '',
    webhookSecret: process.env.PAYPLUS_WEBHOOK_SECRET || '',
    baseUrl:
      process.env.PAYPLUS_BASE_URL?.replace(/\/$/, '') || 'https://restapiv2.payplus.co.il/api',
    callbackUrl: process.env.PAYPLUS_CALLBACK_URL || '',
  };
}

/**
 * Get PayPlus configuration with validation
 * @param {Object} options
 * @param {boolean} options.strict - If true, throws on missing required keys
 * @returns {Object} Configuration with missing keys list
 */
export function getPayPlusConfig({ strict = true } = {}) {
  const cfg = buildConfig();

  // Check required keys
  const missing = REQUIRED_ENV_KEYS.filter((key) => {
    const value = process.env[key];
    return !value || value.trim() === '';
  });

  if (missing.length && strict) {
    const errorMsg = `PayPlus configuration error: Missing required environment variables: ${missing.join(', ')}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return { ...cfg, missing, isConfigured: missing.length === 0 };
}

/**
 * Check if PayPlus is properly configured
 * @returns {boolean}
 */
export function isPayPlusConfigured() {
  const { isConfigured } = getPayPlusConfig({ strict: false });
  return isConfigured;
}

/**
 * Validate PayPlus configuration and return detailed status
 * @returns {{ ok: boolean, missing: string[], message: string }}
 */
export function validatePayPlusConfig() {
  const { missing, isConfigured } = getPayPlusConfig({ strict: false });

  if (isConfigured) {
    return { ok: true, missing: [], message: 'PayPlus is configured' };
  }

  return {
    ok: false,
    missing,
    message: `Payment service not configured. Missing: ${missing.join(', ')}`,
  };
}

async function callPayPlusAPI(endpoint, payload, cfg) {
  const url = new URL(endpoint, cfg.baseUrl).toString();
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
      'X-API-SECRET': cfg.apiSecret,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPlus API error (${res.status}): ${text}`);
  }

  return res.json();
}

export async function createPayPlusSession({ order, successUrl, cancelUrl }) {
  const cfg = getPayPlusConfig({ strict: false });
  const fallbackUrl = successUrl || `/checkout/success?orderId=${order._id}`;

  if (cfg.missing.length) {
    console.warn('PAYPLUS_CONFIG_MISSING', cfg.missing, 'falling back to local checkout.');
    return {
      provider: 'fallback',
      isFallback: true,
      paymentUrl: fallbackUrl,
      sessionId: null,
    };
  }

  const payload = {
    orderId: String(order._id),
    amount: Number(order.totalAmount || order.total?.total || 0),
    currency: 'ILS',
    customer: {
      name: order.customerName || '',
      phone: order.customerPhone || '',
      email: order.customerEmail || '',
    },
    returnUrls: {
      success: successUrl || fallbackUrl,
      cancel: cancelUrl || `/checkout/cancel?orderId=${order._id}`,
    },
    metadata: {
      refAgentId: order.refAgentId ? String(order.refAgentId) : null,
    },
  };

  try {
    const response = await callPayPlusAPI('/v1/payments', payload, cfg);
    return {
      provider: 'payplus',
      isFallback: false,
      paymentUrl: response?.paymentPageUrl || response?.redirectUrl || fallbackUrl,
      sessionId: response?.id || response?.transactionId || null,
      raw: response,
    };
  } catch (err) {
    console.error('PAYPLUS_CREATE_SESSION_FAILED', err.message);
    return {
      provider: 'fallback',
      isFallback: true,
      paymentUrl: fallbackUrl,
      sessionId: null,
      error: err.message,
    };
  }
}

export function verifyPayPlusSignature(rawBody, signatureHeader) {
  const cfg = getPayPlusConfig({ strict: false });

  if (!cfg.webhookSecret) {
    return { valid: false, reason: 'missing_secret' };
  }

  if (!signatureHeader) {
    return { valid: false, reason: 'missing_header' };
  }

  const provided = signatureHeader.startsWith('sha256=')
    ? signatureHeader.slice(7)
    : signatureHeader;

  const digest = crypto.createHmac('sha256', cfg.webhookSecret).update(rawBody).digest('hex');

  let received;
  try {
    received = Buffer.from(provided, 'hex');
  } catch {
    received = Buffer.from(provided, 'utf8');
  }

  const expected = Buffer.from(digest, 'hex');

  if (expected.length !== received.length) {
    return { valid: false, reason: 'length_mismatch' };
  }

  const valid = crypto.timingSafeEqual(expected, received);
  return { valid, reason: valid ? null : 'mismatch' };
}
