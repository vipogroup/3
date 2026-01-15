import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const isDev = () => !process.env.VERCEL && process.env.NODE_ENV !== 'production';

function getDevMagicLoginSecret() {
  return process.env.DEV_MAGIC_LOGIN_SECRET || null;
}

function isAuthorized(req) {
  const secret = getDevMagicLoginSecret();
  if (!secret) {
    return { ok: false, status: 404 };
  }

  const url = new URL(req.url);
  const provided = req.headers.get('x-dev-magic-login-secret') || url.searchParams.get('secret');
  if (!provided || provided !== secret) {
    return { ok: false, status: 401 };
  }

  return { ok: true };
}

async function GETHandler(req) {
  if (!isDev()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const auth = isAuthorized(req);
  if (!auth.ok) {
    const message = auth.status === 401 ? 'Unauthorized' : 'Not found';
    return NextResponse.json({ error: message }, { status: auth.status });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 503 });
  }

  const token = jwt.sign({ sub: 'dev-admin', role: 'admin' }, jwtSecret, { expiresIn: '2h' });

  const res = NextResponse.redirect(new URL('/', req.url));

  const url = new URL(req.url);
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: url.protocol === 'https:',
    path: '/',
    maxAge: 2 * 60 * 60,
  };

  res.cookies.set('auth_token', token, cookieOptions);
  res.cookies.set('token', token, cookieOptions);
  return res;
}

export const GET = withErrorLogging(GETHandler);
