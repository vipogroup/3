import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import crypto from 'crypto';
import { getDb } from './db';

export function signJWT(payload, expiresIn = '7d') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

export function verifyJWT(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return null;
  }
}

const OTP_COLLECTION = 'otp_codes';
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const OTP_RESEND_INTERVAL_MS = 30 * 1000;
const OTP_MAX_ATTEMPTS = 5;

let otpIndexesEnsured = false;
let twilioClientCache;
let twilioInitAttempted = false;

function normalizePhone(raw = '') {
  const trimmed = String(raw).trim().replace(/\s+/g, '');
  return trimmed.replace(/^whatsapp:/i, '');
}

function isWhatsappMode() {
  return (process.env.TWILIO_FROM_NUMBER || '').startsWith('whatsapp:');
}

function formatDestination(phone) {
  const target = normalizePhone(phone);
  if (!target) return target;
  if (isWhatsappMode()) {
    return target.startsWith('whatsapp:') ? target : `whatsapp:${target}`;
  }
  return target;
}

async function getOtpCollection() {
  const db = await getDb();
  const collection = db.collection(OTP_COLLECTION);

  if (!otpIndexesEnsured && collection?.createIndex) {
    otpIndexesEnsured = true;
    try {
      await Promise.allSettled([
        collection.createIndex({ phone: 1 }, { unique: true }),
        collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      ]);
    } catch (err) {
      console.warn('[OTP] Failed to ensure indexes:', err?.message || err);
    }
  }

  return collection;
}

function getTwilioClient() {
  if (twilioClientCache || twilioInitAttempted) {
    return twilioClientCache;
  }

  twilioInitAttempted = true;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    console.warn('[OTP] Twilio credentials missing – SMS/WhatsApp will be mocked.');
    return null;
  }

  try {
    twilioClientCache = twilio(accountSid, authToken);
  } catch (err) {
    twilioClientCache = null;
    console.error('[OTP] Failed to initialize Twilio client:', err?.message || err);
  }

  return twilioClientCache;
}

function generateOtpCode() {
  // Use crypto for secure random OTP generation
  return String(100000 + crypto.randomInt(900000));
}

export async function sendOTP(rawPhone) {
  const phone = normalizePhone(rawPhone);
  if (!phone) {
    throw new Error('Invalid phone number');
  }

  const collection = await getOtpCollection();
  const now = Date.now();
  const existing = await collection.findOne({ phone });
  if (existing && existing.expiresAt instanceof Date) {
    const nextAllowed = existing.createdAt?.getTime
      ? existing.createdAt.getTime() + OTP_RESEND_INTERVAL_MS
      : now;
    if (nextAllowed > now) {
      const waitSeconds = Math.ceil((nextAllowed - now) / 1000);
      throw new Error(`OTP recently sent. Try again in ${waitSeconds} seconds.`);
    }
  }

  const code = generateOtpCode();
  const expiresAt = new Date(now + OTP_EXPIRY_MS);
  const createdAt = new Date(now);

  await collection.updateOne(
    { phone },
    {
      $set: {
        phone,
        code,
        attempts: 0,
        expiresAt,
        createdAt,
        channel: isWhatsappMode() ? 'whatsapp' : 'sms',
      },
    },
    { upsert: true },
  );

  const client = getTwilioClient();
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = formatDestination(phone);
  const body = `קוד האימות שלך ל-VIPO הוא ${code}. הקוד תקף ל-5 דקות.`;

  if (client && from && to) {
    try {
      await client.messages.create({ from, to, body });
      console.log(`[OTP] Sent code via Twilio to ${to}`);
    } catch (err) {
      console.error('[OTP] Twilio send failed:', err?.message || err);
      console.log(`[OTP] Use fallback code for ${phone}: ${code}`);
    }
  } else {
    console.log(`[OTP] Twilio not configured. Code for ${phone}: ${code}`);
  }

  return true;
}

export async function verifyOTP(rawPhone, code) {
  const phone = normalizePhone(rawPhone);
  if (!phone) return false;

  const collection = await getOtpCollection();
  const record = await collection.findOne({ phone });
  if (!record) return false;

  const now = Date.now();
  if (record.expiresAt && record.expiresAt.getTime && record.expiresAt.getTime() < now) {
    await collection.deleteOne({ phone });
    return false;
  }

  if (record.code !== code) {
    const attempts = (record.attempts || 0) + 1;
    if (attempts >= OTP_MAX_ATTEMPTS) {
      await collection.deleteOne({ phone });
    } else {
      await collection.updateOne({ phone }, { $set: { attempts } });
    }
    return false;
  }

  await collection.deleteOne({ phone });
  return true;
}

export async function ensureUser(phone, options = {}) {
  const normalizedPhone = normalizePhone(phone);
  const { role = 'customer', defaults = {} } = options;
  const db = await getDb();
  const users = db.collection('users');

  const existing = await users.findOne({ phone: normalizedPhone });
  if (existing) {
    return existing;
  }

  const newUser = {
    phone: normalizedPhone,
    role,
    status: 'active',
    createdAt: new Date(),
    providers: ['otp'],
    ...defaults,
  };

  const result = await users.insertOne(newUser);
  return { ...newUser, _id: result.insertedId };
}
