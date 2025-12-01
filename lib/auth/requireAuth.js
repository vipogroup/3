import { cookies as nextCookies } from 'next/headers';
import { verify as verifyJwt } from '@/lib/auth/createToken';

/**
 * Verifies JWT from cookie `token` and returns minimal user context.
 * Falls back gracefully between Next headers and Request cookies.
 * Returns null if unauthenticated.
 */
async function resolveUserFromRequest(req) {
  let token = null;

  // Try Route Handler request cookies API
  try {
    token = req?.cookies?.get?.('token')?.value || null;
  } catch {}

  // Fallback: next/headers cookies
  if (!token) {
    try {
      token = nextCookies().get('token')?.value || null;
    } catch {}
  }

  // Fallback: raw Cookie header
  if (!token && req?.headers?.get) {
    const raw = req.headers.get('cookie') || '';
    const m = raw.match(/(?:^|;\s*)token=([^;]+)/i);
    if (m) token = decodeURIComponent(m[1]);
  }

  const payload = verifyJwt(token);
  if (!payload) return null;

  const userId = payload.userId || payload.id || payload._id || null;
  const role = payload.role || null;
  if (!userId || !role) return null;

  return { _id: userId, role };
}

export async function requireAuth(req) {
  return resolveUserFromRequest(req);
}

export async function requireAdminGuard(req) {
  try {
    const user = await resolveUserFromRequest(req);
    if (!user) {
      return { ok: false, status: 401, error: 'Unauthorized' };
    }
    if (user.role !== 'admin') {
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
