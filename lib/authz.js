/**
 * Stage 13.4 - Authorization Utilities
 * Helper functions for authentication and authorization
 */

import { getUserFromCookies } from '@/lib/auth/server';

/**
 * Require authenticated user
 * @throws {Error} 401 if not authenticated
 * @returns {Promise<Object>} user object
 */
export async function requireAuth() {
  const user = await getUserFromCookies();
  if (!user || !user.id) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
  return user;
}

/**
 * Require admin role
 * @throws {Error} 401 if not authenticated, 403 if not admin
 * @returns {Promise<Object>} admin user object
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return user;
}

/**
 * Get user from session (non-throwing version)
 * @returns {Promise<Object|null>} user object or null
 */
export async function getUserFromSession() {
  try {
    return await getUserFromCookies();
  } catch (err) {
    return null;
  }
}
