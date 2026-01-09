import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { jwtVerify } from 'jose';

const PROTECTED_ROUTES = ['/dashboard', '/admin', '/agent', '/business'];

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
 * Get tenant from hostname
 */
function getTenantFromHost(host) {
  if (!host) return null;
  
  const hostname = host.toLowerCase().split(':')[0];
  const baseDomain = process.env.BASE_DOMAIN || 'vipo.co.il';
  
  // Skip main domain and localhost
  if (hostname === baseDomain || hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }
  
  // Check for subdomain
  if (hostname.endsWith(`.${baseDomain}`)) {
    return hostname.replace(`.${baseDomain}`, '');
  }
  
  // Custom domain - will need to lookup in DB (handled by API)
  return { customDomain: hostname };
}

/**
 * Middleware that supports both legacy JWT cookies and NextAuth sessions
 * Also handles multi-tenant domain detection
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host');
  
  // Multi-Tenant: Detect tenant from subdomain/domain
  const tenantInfo = getTenantFromHost(host);
  
  // Create response with tenant header if detected
  const response = NextResponse.next();
  if (tenantInfo) {
    if (typeof tenantInfo === 'string') {
      // Subdomain tenant
      response.headers.set('x-tenant-slug', tenantInfo);
    } else if (tenantInfo.customDomain) {
      // Custom domain tenant
      response.headers.set('x-tenant-domain', tenantInfo.customDomain);
    }
  }

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
      url.pathname = '/';
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
  matcher: ['/admin/:path*', '/dashboard/:path*', '/agent/:path*', '/business/:path*', '/login'],
};
