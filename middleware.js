import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/admin'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  console.log('[MW]', pathname, 'token?', !!token);

  if (pathname === '/login') {
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login'],
};
