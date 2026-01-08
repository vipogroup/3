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
import { ObjectId } from 'mongodb';

import { getDb } from '@/lib/db';

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

async function hydrateUserFromDb(user) {
  if (!user?.id) return user;
  try {
    const db = await getDb();
    const usersCol = db.collection('users');
    const objectId = ObjectId.isValid(user.id) ? new ObjectId(user.id) : null;
    if (!objectId) return user;

    const doc = await usersCol.findOne(
      { _id: objectId },
      {
        projection: {
          _id: 1,
          role: 1,
          email: 1,
          fullName: 1,
          phone: 1,
          showPushButtons: 1,
          tenantId: 1, // Multi-Tenant: Include tenantId
        },
      },
    );
    if (!doc) return user;

    return {
      ...user,
      role: doc.role || user.role,
      email: doc.email || user.email,
      fullName: doc.fullName || user.fullName,
      phone: doc.phone || user.phone,
      showPushButtons: doc.showPushButtons,
      tenantId: doc.tenantId || null, // Multi-Tenant: Add tenantId to user object
      raw: { ...(user.raw || {}), db: doc },
    };
  } catch (err) {
    console.error('hydrateUserFromDb_error', err.message);
    return user;
  }
}

export async function getUserFromCookies() {
  try {
    const store = cookies();
    
    // Try legacy JWT first
    const secret = process.env.JWT_SECRET;
    if (secret) {
      const rawToken = getRawToken(store);
      if (rawToken) {
        try {
          const payload = jwt.verify(rawToken, secret);
          const user = normalizeUser(payload);
          if (user) {
            return hydrateUserFromDb(user);
          }
        } catch (e) {
          // Legacy token invalid, try NextAuth
        }
      }
    }

    // Try NextAuth token
    try {
      const { getToken } = await import('next-auth/jwt');
      const allCookies = store.getAll();
      const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');
      
      const req = {
        headers: {
          cookie: cookieHeader,
        },
        cookies: Object.fromEntries(allCookies.map(c => [c.name, c.value])),
      };
      
      const nextAuthToken = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      
      if (nextAuthToken) {
        const user = {
          id: nextAuthToken.userId || nextAuthToken.sub,
          _id: nextAuthToken.userId || nextAuthToken.sub,
          role: nextAuthToken.role || 'agent',
          email: nextAuthToken.email,
          fullName: nextAuthToken.fullName || nextAuthToken.name,
        };
        if (user.id) {
          return hydrateUserFromDb(user);
        }
      }
    } catch (e) {
      // NextAuth token check failed
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function isAdmin() {
  const user = await getUserFromCookies();
  return user?.role === 'admin';
}

/**
 * For Server Components - redirects to login if not Super Admin
 * Business admins are redirected to /business
 */
export async function requireAdmin() {
  const user = await getUserFromCookies();
  if (!user) {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }
  // Business admin should go to /business, not /admin
  if (user.role === 'business_admin') {
    const { redirect } = await import('next/navigation');
    redirect('/business');
  }
  if (user.role !== 'admin') {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }
  return user;
}

/**
 * For API routes - throws error with status if not authenticated
 * Supports both legacy JWT and NextAuth tokens
 * @param {Request} req - The incoming request
 * @returns {Promise<Object>} User object
 * @throws {Error} With status 401 if not authenticated
 */
export async function requireAuthApi(req) {
  // Try legacy JWT first
  const legacyToken = getTokenFromRequest(req);
  if (legacyToken && process.env.JWT_SECRET) {
    try {
      const payload = jwt.verify(legacyToken, process.env.JWT_SECRET);
      const user = normalizeUser(payload);
      if (user) {
        return hydrateUserFromDb(user);
      }
    } catch (e) {
      // Legacy token invalid, try NextAuth
    }
  }

  // Try NextAuth token
  try {
    const { getToken } = await import('next-auth/jwt');
    const nextAuthToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    if (nextAuthToken) {
      const user = {
        id: nextAuthToken.userId || nextAuthToken.sub,
        _id: nextAuthToken.userId || nextAuthToken.sub,
        role: nextAuthToken.role || 'agent',
        email: nextAuthToken.email,
        fullName: nextAuthToken.fullName || nextAuthToken.name,
      };
      if (user.id) {
        return hydrateUserFromDb(user);
      }
    }
  } catch (e) {
    // NextAuth token check failed
  }

  const err = new Error('Unauthorized');
  err.status = 401;
  throw err;
}

/**
 * For API routes - throws error with status if not admin or business_admin
 * @param {Request} req - The incoming request
 * @returns {Promise<Object>} Admin user object
 * @throws {Error} With status 401/403
 */
export async function requireAdminApi(req) {
  const user = await requireAuthApi(req);
  if (user.role !== 'admin' && user.role !== 'business_admin') {
    const err = new Error('Forbidden - Admin access required');
    err.status = 403;
    throw err;
  }
  return user;
}

/**
 * For API routes - throws error if not Super Admin (admin only, NOT business_admin)
 * Use this for Super Admin only routes like tenant management
 * @param {Request} req - The incoming request
 * @returns {Promise<Object>} Super Admin user object
 * @throws {Error} With status 401/403
 */
export async function requireSuperAdminApi(req) {
  const user = await requireAuthApi(req);
  if (user.role !== 'admin') {
    const err = new Error('Forbidden - Super Admin access required');
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
