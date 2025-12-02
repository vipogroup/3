export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/db';
import { setAuthCookie } from '@/lib/auth/requireAuth';
import { rateLimiters } from '@/lib/rateLimit';

function log(tag, obj) {
  try {
    console.log(`[LOGIN_DEBUG] ${tag}`, typeof obj === 'string' ? obj : JSON.stringify(obj));
  } catch {
    console.log(`[LOGIN_DEBUG] ${tag}`, obj);
  }
}

export async function POST(request) {
  // Rate limiting: 5 requests per 5 minutes
  const rateLimit = rateLimiters.login(request);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'TOO_MANY_REQUESTS', message: rateLimit.message },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    );
  }

  if (!process.env.JWT_SECRET) {
    return NextResponse.json({ error: 'SERVER_MISCONFIG_JWT' }, { status: 500 });
  }

  const startedAt = Date.now();
  try {
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      log('body-parse-failed', String(e));
      return NextResponse.json({ error: 'BAD_JSON' }, { status: 400 });
    }

    const identifier = body.identifier || body.email || '';
    const password = body.password || '';
    log('input', { identifier, hasPwd: !!password });

    if (!identifier || !password) {
      return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection('users');

    const user = await users.findOne({
      $or: [{ email: identifier.toLowerCase().trim() }, { phone: identifier }],
    });
    log('user-found', { exists: !!user, id: user?._id });

    const storedHash = user?.passwordHash || user?.password;
    if (!storedHash) {
      return NextResponse.json({ error: 'BAD_CREDENTIALS' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, storedHash);
    log('bcrypt-cmp', { ok });

    if (!ok) {
      return NextResponse.json({ error: 'BAD_CREDENTIALS' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret || typeof secret !== 'string' || !secret.length) {
      log('jwt-secret-missing', true);
      return NextResponse.json({ error: 'SERVER_MISCONFIG_JWT' }, { status: 500 });
    }

    const token = jwt.sign(
      {
        sub: String(user._id),
        userId: String(user._id),
        role: user.role || 'user',
        email: user.email,
        fullName: user.fullName || user.email,
        phone: user.phone,
      },
      secret,
      { expiresIn: '7d' },
    );

    const res = NextResponse.json({ success: true, role: user.role || 'admin' }, { status: 200 });
    setAuthCookie(res, token);

    log('set-cookie', { ok: true, elapsedMs: Date.now() - startedAt });
    return res;
  } catch (err) {
    log('fatal', String(err?.stack || err));
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
