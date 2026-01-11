import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

export const runtime = 'nodejs';

import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { rateLimiters } from '@/lib/rateLimit';
import { sign as signJwt } from '@/lib/auth/createToken';
import { setAuthCookie } from '@/lib/auth/requireAuth';
import { logAdminActivity } from '@/lib/auditMiddleware';

function failureResponse(message, status = 400, extraBody = {}) {
  return NextResponse.json({ success: false, message, ...extraBody }, { status });
}

function normalizePhone(value) {
  if (!value) return null;
  const str = String(value).trim();
  if (!str) return null;

  const digitsOnly = str.replace(/\D/g, '');
  if (!digitsOnly) return null;

  if (str.startsWith('+')) {
    return `+${digitsOnly}`;
  }

  return digitsOnly;
}

async function POSTHandler(req) {
  const rateLimit = rateLimiters.login(req);
  if (!rateLimit.allowed) {
    return failureResponse(rateLimit.message, 429, { error: 'TOO_MANY_REQUESTS' });
  }

  try {
    const body = await req.json();
    const identifier = body.email || body.identifier;
    const password = body.password;
    const rememberMe = Boolean(body.rememberMe);

    if (!identifier || !password) {
      return failureResponse('Missing identifier or password', 400);
    }

    const normalizedEmail = typeof identifier === 'string' ? identifier.trim().toLowerCase() : '';
    const normalizedPhone = normalizePhone(identifier);
    const normalizedPassword = typeof password === 'string' ? password : '';

    if ((!normalizedEmail && !normalizedPhone) || !normalizedPassword) {
      return failureResponse('Missing identifier or password', 400);
    }

    const db = await getDb();
    const users = db.collection('users');

    const query = [];
    if (normalizedEmail) query.push({ email: normalizedEmail });
    if (normalizedPhone) query.push({ phone: normalizedPhone });

    const user = await users.findOne({ $or: query.length ? query : [{ email: normalizedEmail }] }, {
      projection: {
        _id: 1,
        passwordHash: 1,
        role: 1,
        fullName: 1,
        email: 1,
        phone: 1,
        tenantId: 1, // Multi-Tenant support
      },
    });

    if (!user?.passwordHash) {
      return failureResponse('Invalid email or password', 401);
    }

    const passwordMatches = await bcrypt.compare(normalizedPassword, user.passwordHash);
    if (!passwordMatches) {
      return failureResponse('Invalid email or password', 401);
    }

    const userRole = user.role || 'customer';
    const jwtPayload = { 
      userId: String(user._id), 
      role: userRole,
    };
    // Multi-Tenant: Include tenantId in JWT if user belongs to a tenant
    if (user.tenantId) {
      jwtPayload.tenantId = String(user.tenantId);
    }
    const jwt = signJwt(jwtPayload, { expiresIn: rememberMe ? '7d' : '1d' });
    const response = NextResponse.json({ success: true, role: userRole, tenantId: user.tenantId || null });

    const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24;
    setAuthCookie(response, jwt, {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge,
    });

    // Log successful login
    await logAdminActivity({
      action: 'login',
      entity: 'auth',
      entityId: String(user._id),
      userId: String(user._id),
      userEmail: user.email,
      description: `התחברות למערכת: ${user.email} (${userRole})`,
      metadata: { role: userRole, rememberMe }
    });

    return response;
  } catch (err) {
    console.error('LOGIN_ERROR:', err?.message ?? err);
    return failureResponse('Server error', 500);
  }
}

export const POST = withErrorLogging(POSTHandler);
