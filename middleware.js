import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED_ROUTES = ['/dashboard', '/admin', '/agent'];

/**
 * Middleware that supports both legacy JWT cookies and NextAuth sessions
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check for legacy auth_token cookie
  const legacyToken = request.cookies.get('auth_token')?.value;

  // Check for NextAuth session token
  let nextAuthToken = null;
  try {
    nextAuthToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
  } catch (e) {
    // NextAuth token check failed, continue with legacy check
  }

  const isAuthenticated = !!(legacyToken || nextAuthToken);

  console.log('[MW]', pathname, 'legacy?', !!legacyToken, 'nextauth?', !!nextAuthToken);

  // Redirect authenticated users away from login page
  if (pathname === '/login') {
    if (isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect routes that require authentication
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/agent/:path*', '/login'],
};
