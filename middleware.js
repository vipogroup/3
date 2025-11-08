import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PROTECTED_PREFIXES = ['/app', '/admin', '/agent', '/api/private', '/dashboard', '/customer'];
const PUBLIC_PATHS = ['/admin/login', '/login'];
const AGENT_ONLY = [/^\/agent(\/|$)/];

export async function middleware(req) {
  const url = req.nextUrl;
  const token = req.cookies.get('auth_token')?.value;

  if (process.env.NODE_ENV === 'development') {
    console.log('[LOGIN_DEBUG] middleware', { path: url.pathname, hasToken: !!token });
  }

  if (PUBLIC_PATHS.some(p => url.pathname === p)) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  const needsAuth = PROTECTED_PREFIXES.some(p => url.pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  if (!token) {
    url.searchParams.set('next', url.pathname);
    return NextResponse.redirect(new URL(`/login?${url.searchParams}`, req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    const { payload } = await jwtVerify(token, secret);

    const isAgentPath = AGENT_ONLY.some((rx) => rx.test(url.pathname));
    if (isAgentPath) {
      const isAgent = Boolean(payload?.isAgent || payload?.role === 'agent' || payload?.role === 'admin');
      if (!isAgent) {
        url.searchParams.set('next', url.pathname);
        return NextResponse.redirect(new URL(`/login?${url.searchParams}`, req.url));
      }
    }

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
