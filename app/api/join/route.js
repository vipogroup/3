export const dynamic = 'force-dynamic';

// app/api/join/route.js
import { NextResponse } from 'next/server';

function resolveRedirectBase(req, requestUrl) {
  const fallback = 'http://localhost:3001';
  const envBase = process.env.PUBLIC_URL;
  const baseCandidate = envBase && envBase.startsWith('http') ? envBase : requestUrl?.origin || fallback;

  try {
    const parsed = new URL(baseCandidate);
    if (parsed.hostname === '0.0.0.0' || parsed.hostname === '::' || parsed.hostname === '::1') {
      parsed.hostname = 'localhost';
    }
    parsed.pathname = parsed.pathname.replace(/\/$/, '');
    return parsed.toString();
  } catch {
    return fallback;
  }
}

export async function GET(req) {
  const url = new URL(req.url);
  const ref = url.searchParams.get('ref');

  const redirectUrl = new URL('/products', resolveRedirectBase(req, url));

  if (ref) {
    // מפנים ומצמידים קוקי הפניה ל-30 יום
    const res = NextResponse.redirect(redirectUrl);
    res.cookies.set('refSource', ref, {
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      sameSite: 'lax',
      // secure מומלץ בפרודקשן
      secure: redirectUrl.protocol === 'https:',
    });
    return res;
  }

  // ללא ref – פשוט מפנים לדף הבית
  return NextResponse.redirect(redirectUrl);
}
