/**
 * Server-side Authentication Utilities
 *
 * Functions:
 * - getUserFromCookies(): Returns user object or null (non-throwing)
 * - isAdmin(): Returns boolean
 * - requireAdmin(): For Server Components - redirects if not admin
 * - requireAuthApi(req): For API routes - throws 401 if not authenticated
 * - requireAdminApi(req): For API routes - throws 401/403 if not admin
 * - requireAgentApi(req): For API routes - throws 401/403 if not agent
 */

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

function getRawToken(store) {
  return (
    store.get('auth_token')?.value ||
    store.get('token')?.value ||
    store.get('next-auth.session-token')?.value ||
    store.get('__Secure-next-auth.session-token')?.value ||
    null
  );
}

function getTokenFromRequest(req) {
  // Try request cookies first
  if (req?.cookies?.get) {
    const token = req.cookies.get('auth_token')?.value || req.cookies.get('token')?.value;
    if (token) return token;
  }

  // Try raw cookie header
  if (req?.headers?.get) {
    const raw = req.headers.get('cookie') || '';
    const match = raw.match(/(?:^|;\s*)auth_token=([^;]+)/i);
    if (match) return decodeURIComponent(match[1]);
    const legacyMatch = raw.match(/(?:^|;\s*)token=([^;]+)/i);
    if (legacyMatch) return decodeURIComponent(legacyMatch[1]);
  }

  return null;
}

function normalizeUser(payload) {
  if (!payload) return null;

  // Support payloads like { user: {...} }
  const base = payload.user ?? payload;
  if (!base) return null;

  const id =
    base.id ||
    base._id ||
    base.userId ||
    payload.userId ||
    payload.id ||
    payload._id ||
    base.sub ||
    payload.sub ||
    null;
  const role = base.role || payload.role || null;

  if (!id) return null;
  return {
    id: String(id),
    _id: String(id),
    role: role || null,
    email: base.email || payload.email || null,
    fullName: base.fullName || payload.fullName || null,
    raw: base,
  };
}

export async function getUserFromCookies() {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const store = cookies();
    const rawToken = getRawToken(store);
    if (!rawToken) return null;

    const payload = jwt.verify(rawToken, secret);
    return normalizeUser(payload);
  } catch (error) {
    return null;
  }
}

export async function isAdmin() {
  const user = await getUserFromCookies();
  return user?.role === 'admin';
}

/**
 * For Server Components - redirects to login if not admin
 */
export async function requireAdmin() {
  const user = await getUserFromCookies();
  if (!user || user.role !== 'admin') {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }
  return user;
}

/**
 * For API routes - throws error with status if not authenticated
 * @param {Request} req - The incoming request
 * @returns {Promise<Object>} User object
 * @throws {Error} With status 401 if not authenticated
 */
export async function requireAuthApi(req) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error('Server configuration error');
    err.status = 500;
    throw err;
  }

  const token = getTokenFromRequest(req);
  if (!token) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  try {
    const payload = jwt.verify(token, secret);
    const user = normalizeUser(payload);
    if (!user) {
      const err = new Error('Unauthorized');
      err.status = 401;
      throw err;
    }
    return user;
  } catch (error) {
    if (error.status) throw error;
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
}

/**
 * For API routes - throws error with status if not admin
 * @param {Request} req - The incoming request
 * @returns {Promise<Object>} Admin user object
 * @throws {Error} With status 401/403
 */
export async function requireAdminApi(req) {
  const user = await requireAuthApi(req);
  if (user.role !== 'admin') {
    const err = new Error('Forbidden - Admin access required');
    err.status = 403;
    throw err;
  }
  return user;
}

/**
 * For API routes - throws error with status if not agent
 * @param {Request} req - The incoming request
 * @returns {Promise<Object>} Agent user object
 * @throws {Error} With status 401/403
 */
export async function requireAgentApi(req) {
  const user = await requireAuthApi(req);
  if (user.role !== 'agent' && user.role !== 'admin') {
    const err = new Error('Forbidden - Agent access required');
    err.status = 403;
    throw err;
  }
  return user;
}
