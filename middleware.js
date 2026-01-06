import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { jwtVerify } from 'jose';

const PROTECTED_ROUTES = ['/dashboard', '/admin', '/agent'];

/**
 * Validate legacy JWT token
 */
async function validateLegacyToken(token) {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

/**
 * Middleware that supports both legacy JWT cookies and NextAuth sessions
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check for legacy auth_token cookie and validate it
  const legacyToken = request.cookies.get('auth_token')?.value;
  const isLegacyValid = await validateLegacyToken(legacyToken);

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

  const isAuthenticated = !!(isLegacyValid || nextAuthToken);

  // Debug logging only in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[MW]', pathname, 'legacy?', isLegacyValid, 'nextauth?', !!nextAuthToken);
  }

  // Redirect authenticated users away from login page
  if (pathname === '/login') {
    if (isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    // Clear invalid legacy token if it exists but is not valid
    if (legacyToken && !isLegacyValid) {
      const response = NextResponse.next();
      response.cookies.delete('auth_token');
      return response;
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
