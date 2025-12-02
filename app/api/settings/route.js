export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import { DEFAULT_SETTINGS, withDefaultSettings } from '@/lib/settingsDefaults';

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_KEY = 'siteSettings';

function extractToken(req) {
  try {
    const tokenFromCookies =
      req.cookies?.get?.('auth_token')?.value || req.cookies?.get?.('token')?.value;
    if (tokenFromCookies) return tokenFromCookies;
  } catch (error) {
    // ignore cookies API issues
  }

  try {
    const cookieHeader = req.headers?.get?.('cookie') || '';
    const match = cookieHeader.match(/(?:^|;\s*)(auth_token|token)=([^;]+)/i);
    if (match) {
      return decodeURIComponent(match[2]);
    }
  } catch (error) {
    // ignore header parsing errors
  }

  try {
    const authHeader = req.headers?.get?.('authorization') || '';
    if (authHeader?.toLowerCase?.().startsWith('bearer ')) {
      return authHeader.slice(7).trim();
    }
  } catch (error) {
    // ignore header parsing errors
  }

  return null;
}

function sanitizeForClient(settings) {
  const sanitized = { ...settings };
  sanitized.smtpPassword = '';
  return sanitized;
}

function normalizeSettings(input = {}) {
  const allowedKeys = Object.keys(DEFAULT_SETTINGS);
  const normalized = {};

  for (const key of allowedKeys) {
    const defaultValue = DEFAULT_SETTINGS[key];
    const incoming = input[key];

    if (incoming === undefined || incoming === null) {
      normalized[key] = defaultValue;
      continue;
    }

    if (typeof defaultValue === 'boolean') {
      if (typeof incoming === 'string') {
        normalized[key] = incoming === 'true' || incoming === '1';
      } else {
        normalized[key] = Boolean(incoming);
      }
      continue;
    }

    normalized[key] = typeof incoming === 'string' ? incoming : String(incoming);
  }

  return withDefaultSettings(normalized);
}

export async function GET(req) {
  try {
    const db = await getDb();
    const collection = db.collection(SETTINGS_COLLECTION);

    const doc = await collection.findOne({ key: SETTINGS_KEY });
    const settings = withDefaultSettings(doc?.value || {});

    return NextResponse.json({
      ok: true,
      settings: sanitizeForClient(settings),
      updatedAt: doc?.updatedAt || null,
    });
  } catch (error) {
    console.error('SETTINGS_GET_ERROR', error);
    return NextResponse.json({ ok: false, error: 'settings_fetch_failed' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = extractToken(req);
    const payload = verifyJWT(token);

    if (!payload || (payload.role || payload.userRole) !== 'admin') {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 403 });
    }

    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    }

    const incoming = typeof body?.settings === 'object' ? body.settings : body;
    if (!incoming || Array.isArray(incoming) || typeof incoming !== 'object') {
      return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 });
    }

    const normalized = normalizeSettings(incoming);

    const db = await getDb();
    const collection = db.collection(SETTINGS_COLLECTION);
    const now = new Date();

    await collection.updateOne(
      { key: SETTINGS_KEY },
      {
        $set: {
          key: SETTINGS_KEY,
          value: normalized,
          updatedAt: now,
        },
      },
      { upsert: true },
    );

    return NextResponse.json({
      ok: true,
      settings: sanitizeForClient(normalized),
      updatedAt: now,
    });
  } catch (error) {
    console.error('SETTINGS_POST_ERROR', error);
    return NextResponse.json({ ok: false, error: 'settings_save_failed' }, { status: 500 });
  }
}
