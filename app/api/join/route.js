export const dynamic = 'force-dynamic';

// app/api/join/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  const url = new URL(req.url);
  const ref = url.searchParams.get('ref');

  // בונים כתובת הפניה אבסולוטית (נדרש ב-Next 14)
  const base =
    process.env.PUBLIC_URL && process.env.PUBLIC_URL.startsWith('http')
      ? process.env.PUBLIC_URL
      : url.origin; // fallback ללוקאל

  const redirectUrl = new URL('/', base);

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
