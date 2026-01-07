/**
 * Tenant Middleware - Multi-Tenant Support
 * זיהוי tenant לפי דומיין/subdomain והוספה לבקשה
 */

import Tenant from '@/models/Tenant';
import { getDb } from '@/lib/db';

/**
 * מזהה את ה-tenant לפי הדומיין או subdomain
 * @param {string} host - הדומיין המלא (e.g., shop1.vipo.co.il)
 * @returns {Promise<Object|null>} - אובייקט tenant או null
 */
export async function getTenantByHost(host) {
  if (!host) return null;
  
  try {
    const db = await getDb();
    const hostname = host.toLowerCase().split(':')[0]; // Remove port if exists
    
    // Try to find by exact domain match first
    let tenant = await db.collection('tenants').findOne({
      domain: hostname,
      status: 'active',
    });
    
    if (tenant) return tenant;
    
    // Try subdomain match
    const baseDomain = process.env.BASE_DOMAIN || 'vipo.co.il';
    if (hostname.endsWith(`.${baseDomain}`)) {
      const subdomain = hostname.replace(`.${baseDomain}`, '');
      tenant = await db.collection('tenants').findOne({
        subdomain: subdomain,
        status: 'active',
      });
    }
    
    return tenant;
  } catch (error) {
    console.error('getTenantByHost error:', error);
    return null;
  }
}

/**
 * מזהה את ה-tenant לפי slug
 * @param {string} slug - מזהה ה-tenant
 * @returns {Promise<Object|null>}
 */
export async function getTenantBySlug(slug) {
  if (!slug) return null;
  
  try {
    const db = await getDb();
    return await db.collection('tenants').findOne({
      slug: slug.toLowerCase(),
      status: 'active',
    });
  } catch (error) {
    console.error('getTenantBySlug error:', error);
    return null;
  }
}

/**
 * מזהה את ה-tenant לפי ID
 * @param {string} tenantId - מזהה ה-tenant
 * @returns {Promise<Object|null>}
 */
export async function getTenantById(tenantId) {
  if (!tenantId) return null;
  
  try {
    const db = await getDb();
    const { ObjectId } = await import('mongodb');
    return await db.collection('tenants').findOne({
      _id: new ObjectId(tenantId),
      status: 'active',
    });
  } catch (error) {
    console.error('getTenantById error:', error);
    return null;
  }
}

/**
 * בודק אם המשתמש שייך ל-tenant מסוים
 * @param {Object} user - אובייקט המשתמש
 * @param {string} tenantId - מזהה ה-tenant
 * @returns {boolean}
 */
export function userBelongsToTenant(user, tenantId) {
  if (!user || !tenantId) return false;
  
  // Super admins can access all tenants
  if (user.role === 'admin' && !user.tenantId) return true;
  
  // Check if user's tenantId matches
  return String(user.tenantId) === String(tenantId);
}

/**
 * מחזיר את ה-tenant הנוכחי מהבקשה
 * @param {Request} request - אובייקט הבקשה
 * @returns {Promise<Object|null>}
 */
export async function getCurrentTenant(request) {
  // Try to get from header first (set by middleware)
  const tenantId = request.headers.get('x-tenant-id');
  if (tenantId) {
    return await getTenantById(tenantId);
  }
  
  // Try to get from URL query parameter (for localhost development)
  try {
    const url = new URL(request.url);
    const tenantSlug = url.searchParams.get('tenant');
    if (tenantSlug) {
      return await getTenantBySlug(tenantSlug);
    }
  } catch {
    // Ignore URL parsing errors
  }
  
  // Try to get from host
  const host = request.headers.get('host');
  return await getTenantByHost(host);
}

/**
 * מוסיף פילטר tenant לשאילתה
 * @param {Object} query - שאילתה קיימת
 * @param {string} tenantId - מזהה ה-tenant
 * @returns {Object} - שאילתה עם פילטר tenant
 */
export function addTenantFilter(query = {}, tenantId) {
  if (!tenantId) return query;
  
  const { ObjectId } = require('mongodb');
  return {
    ...query,
    tenantId: new ObjectId(tenantId),
  };
}

/**
 * מוסיף tenantId לנתונים חדשים
 * @param {Object} data - נתונים ליצירה
 * @param {string} tenantId - מזהה ה-tenant
 * @returns {Object} - נתונים עם tenantId
 */
export function addTenantToData(data = {}, tenantId) {
  if (!tenantId) return data;
  
  const { ObjectId } = require('mongodb');
  return {
    ...data,
    tenantId: new ObjectId(tenantId),
  };
}

/**
 * בודק אם המשתמש הוא Super Admin (ללא tenant)
 * @param {Object} user - אובייקט המשתמש
 * @returns {boolean}
 */
export function isSuperAdmin(user) {
  return user?.role === 'admin' && !user?.tenantId;
}

/**
 * בודק אם המשתמש הוא Business Admin (עם tenant)
 * @param {Object} user - אובייקט המשתמש
 * @returns {boolean}
 */
export function isBusinessAdmin(user) {
  return user?.role === 'admin' && !!user?.tenantId;
}

const tenantMiddleware = {
  getTenantByHost,
  getTenantBySlug,
  getTenantById,
  userBelongsToTenant,
  getCurrentTenant,
  addTenantFilter,
  addTenantToData,
  isSuperAdmin,
  isBusinessAdmin,
};

export default tenantMiddleware;
