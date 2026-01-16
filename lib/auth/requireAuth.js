import { cookies as nextCookies } from 'next/headers';
import { verify as verifyJwt } from '@/lib/auth/createToken';
import { logSecurityEvent } from '@/lib/securityEvents';

export const AUTH_COOKIE_NAME = 'auth_token';
const LEGACY_AUTH_COOKIE_NAME = 'token';

const defaultCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7,
};

export function setAuthCookie(response, token, options = {}) {
  const finalOptions = { ...defaultCookieOptions, ...options };
  response.cookies.set(AUTH_COOKIE_NAME, token, finalOptions);
  response.cookies.set(LEGACY_AUTH_COOKIE_NAME, token, finalOptions);
}

export function clearAuthCookie(response) {
  const clearOptions = { ...defaultCookieOptions, maxAge: 0 };
  response.cookies.set(AUTH_COOKIE_NAME, '', clearOptions);
  response.cookies.set(LEGACY_AUTH_COOKIE_NAME, '', clearOptions);
}

export function getAuthToken(req) {
  let token = null;

  try {
    token =
      req?.cookies?.get?.(AUTH_COOKIE_NAME)?.value ??
      req?.cookies?.get?.(LEGACY_AUTH_COOKIE_NAME)?.value ??
      null;
  } catch {}

  if (!token) {
    try {
      const cookiesStore = nextCookies();
      token =
        cookiesStore.get(AUTH_COOKIE_NAME)?.value ??
        cookiesStore.get(LEGACY_AUTH_COOKIE_NAME)?.value ??
        null;
    } catch {}
  }

  if (!token && req?.headers?.get) {
    const raw = req.headers.get('cookie') || '';
    const tokenMatch = raw.match(/(?:^|;\s*)auth_token=([^;]+)/i);
    const legacyMatch = raw.match(/(?:^|;\s*)token=([^;]+)/i);
    if (tokenMatch) {
      token = decodeURIComponent(tokenMatch[1]);
    } else if (legacyMatch) {
      token = decodeURIComponent(legacyMatch[1]);
    }
  }

  return token;
}

/**
 * Verifies JWT from cookie `token` and returns minimal user context.
 * Falls back gracefully between Next headers and Request cookies.
 * Returns null if unauthenticated.
 */
async function resolveUserFromRequest(req) {
  const token = getAuthToken(req);

  const payload = verifyJwt(token);
  if (!payload) return null;

  const userId = payload.userId || payload.id || payload._id || null;
  const role = payload.role || null;
  if (!userId || !role) return null;

  // Include tenantId and other important fields from JWT
  return { 
    _id: userId, 
    role,
    tenantId: payload.tenantId || null,
    email: payload.email || null,
    impersonating: payload.impersonating || false,
  };
}

export async function requireAuth(req) {
  return resolveUserFromRequest(req);
}

export async function requireAdminGuard(req) {
  try {
    const user = await resolveUserFromRequest(req);
    if (!user) {
      await logSecurityEvent({
        action: 'admin_access_unauthorized',
        message: 'Admin API access blocked: unauthorized',
        severity: 'high',
        req,
        details: { statusCode: 401 },
      });
      return { ok: false, status: 401, error: 'Unauthorized' };
    }
    // Allow admin, super_admin, and business_admin roles
    const adminRoles = ['admin', 'super_admin', 'business_admin'];
    if (!adminRoles.includes(user.role)) {
      await logSecurityEvent({
        action: 'admin_access_block',
        message: 'Admin API access blocked: insufficient role',
        severity: 'high',
        req,
        user,
        details: { statusCode: 403, role: user.role },
      });
      return { ok: false, status: 403, error: 'Forbidden' };
    }
    return { ok: true, status: 200, user };
  } catch (error) {
    return {
      ok: false,
      status: error?.status || 500,
      error: error?.message || 'Failed to verify authentication',
    };
  }
}
