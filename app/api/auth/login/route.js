export const dynamic = 'force-dynamic';

export const runtime = 'nodejs';

import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { rateLimiters } from '@/lib/rateLimit';
import { sign as signJwt } from '@/lib/auth/createToken';
import { setAuthCookie } from '@/lib/auth/requireAuth';

function failureResponse(message, status = 400, extraBody = {}) {
  return NextResponse.json({ success: false, message, ...extraBody }, { status });
}

export async function POST(req) {
  const rateLimit = rateLimiters.login(req);
  if (!rateLimit.allowed) {
    return failureResponse(rateLimit.message, 429, { error: 'TOO_MANY_REQUESTS' });
  }

  try {
    const body = await req.json();
    console.log('[LOGIN BODY]', body);
    const email = body.email || body.identifier;
    const password = body.password;
    const rememberMe = Boolean(body.rememberMe);

    if (!email || !password) {
      return failureResponse('Missing email or password', 400);
    }

    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedPassword = typeof password === 'string' ? password : '';

    if (!normalizedEmail || !normalizedPassword) {
      return failureResponse('Missing email or password', 400);
    }

    console.log('LOGIN BODY:', { email: normalizedEmail });

    const db = await getDb();
    const users = db.collection('users');

    const user = await users.findOne({ email: normalizedEmail }, {
      projection: {
        _id: 1,
        passwordHash: 1,
        role: 1,
        fullName: 1,
        email: 1,
        phone: 1,
      },
    });

    if (!user?.passwordHash) {
      return failureResponse('Invalid email or password', 401);
    }

    console.log('LOGIN_DEBUG_USER', {
      _id: String(user._id),
      hasPasswordHash: Boolean(user.passwordHash),
      role: user.role,
    });

    const passwordMatches = await bcrypt.compare(normalizedPassword, user.passwordHash);
    if (!passwordMatches) {
      return failureResponse('Invalid email or password', 401);
    }

    const jwt = signJwt({ userId: String(user._id), role: user.role }, { expiresIn: rememberMe ? '7d' : '1d' });
    const response = NextResponse.json({ success: true, role: user.role });

    const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24;
    setAuthCookie(response, jwt, {
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge,
    });

    console.log('[LOGIN_DEBUG] set auth_token cookie for user', String(user._id));

    return response;
  } catch (err) {
    console.error('LOGIN_ERROR:', err?.message ?? err);
    return failureResponse('Server error', 500);
  }
}
