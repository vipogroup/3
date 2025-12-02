/**
 * Next.js-compatible helper: get user from cookies (used like a middleware).
 * Does NOT alter routing; existing middleware.js remains source of truth.
 */
import { cookies } from 'next/headers';

import { verifyJwt } from './createToken.js';

export function getUserFromRequest() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return null;
    const decoded = verifyJwt(token);
    if (!decoded?.userId) return null;
    return { userId: decoded.userId, role: decoded.role };
  } catch {
    return null;
  }
}

/**
 * Express-style adapter (no-op in Next):
 * Provided just to satisfy the checklist signature.
 */
export async function authMiddleware(req, res, next) {
  try {
    const token = req?.cookies?.token;
    if (token) {
      const decoded = verifyJwt(token);
      if (decoded?.userId) req.user = { userId: decoded.userId, role: decoded.role };
    }
  } catch {
    // swallow errors to avoid impacting existing behavior
  }
  return typeof next === 'function' ? next() : undefined;
}
