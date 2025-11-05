import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PROTECTED_PREFIXES = ['/app', '/admin', '/agent', '/api/private', '/dashboard', '/customer'];
const PUBLIC_PATHS = ['/admin/login', '/login'];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public paths even if they match protected prefixes
  if (PUBLIC_PATHS.some(p => pathname === p)) {
    return NextResponse.next();
  }

  const needsAuth = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const cookie = req.headers.get('cookie') || '';
  const token = cookie.split('; ').find(s => s.startsWith('token='))?.split('=')[1];
  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    '/app/:path*',
    '/admin/:path*',
    '/agent/:path*',
    '/api/private/:path*',
    '/dashboard/:path*',
    '/customer/:path*',
  ],
};
