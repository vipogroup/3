import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const isDev = () => process.env.NODE_ENV !== 'production';

async function GETHandler(req) {
  if (!isDev()) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ sub: 'dev-admin', role: 'admin' }, secret, { expiresIn: '2h' });

  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // local only
    path: '/',
    maxAge: 2 * 60 * 60,
  });
  return res;
}

export const GET = withErrorLogging(GETHandler);
