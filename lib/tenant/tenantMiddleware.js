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

/**
 * מחזיר את tenantId מהמשתמש או מהבקשה
 * @param {Object} user - אובייקט המשתמש
 * @param {Request} request - אובייקט הבקשה
 * @returns {Promise<string|null>}
 */
export async function resolveTenantId(user, request) {
  // Super admin לא מוגבל ל-tenant ספציפי
  if (isSuperAdmin(user)) {
    // אם יש tenant בבקשה, השתמש בו
    const tenant = await getCurrentTenant(request);
    return tenant?._id ? String(tenant._id) : null;
  }
  
  // משתמש רגיל - השתמש ב-tenantId שלו
  if (user?.tenantId) {
    return String(user.tenantId);
  }
  
  // נסה לקבל מהבקשה
  const tenant = await getCurrentTenant(request);
  return tenant?._id ? String(tenant._id) : null;
}

/**
 * Wrapper לשאילתות עם סינון tenant אוטומטי
 * @param {Object} options
 * @param {Object} options.user - המשתמש המחובר
 * @param {Request} options.request - הבקשה
 * @param {Object} options.query - שאילתה בסיסית
 * @param {boolean} options.allowGlobal - האם לאפשר שאילתה גלובלית ל-Super Admin
 * @returns {Promise<Object>} - שאילתה עם פילטר tenant
 */
export async function withTenantQuery({ user, request, query = {}, allowGlobal = false }) {
  const tenantId = await resolveTenantId(user, request);
  
  // Super admin יכול לראות הכל אם allowGlobal = true
  if (isSuperAdmin(user) && allowGlobal) {
    return query;
  }
  
  // אחרת, סנן לפי tenant
  if (tenantId) {
    return addTenantFilter(query, tenantId);
  }
  
  return query;
}

/**
 * מוסיף tenantId לנתונים חדשים לפי המשתמש והבקשה
 * @param {Object} options
 * @param {Object} options.user - המשתמש המחובר
 * @param {Request} options.request - הבקשה
 * @param {Object} options.data - הנתונים ליצירה
 * @returns {Promise<Object>} - נתונים עם tenantId
 */
export async function withTenantData({ user, request, data = {} }) {
  const tenantId = await resolveTenantId(user, request);
  
  if (tenantId) {
    return addTenantToData(data, tenantId);
  }
  
  return data;
}

/**
 * בודק אם למשתמש יש הרשאה לגשת לנתונים של tenant מסוים
 * @param {Object} user - אובייקט המשתמש
 * @param {string} resourceTenantId - ה-tenantId של המשאב
 * @returns {boolean}
 */
export function canAccessTenant(user, resourceTenantId) {
  // Super admin יכול לגשת לכל tenant
  if (isSuperAdmin(user)) return true;
  
  // אם למשאב אין tenantId, כולם יכולים לגשת
  if (!resourceTenantId) return true;
  
  // בדוק שהמשתמש שייך ל-tenant
  return userBelongsToTenant(user, resourceTenantId);
}

/**
 * מחזיר הגדרות tenant או ברירת מחדל
 * @param {Object} tenant - אובייקט ה-tenant
 * @param {string} settingPath - נתיב ההגדרה (e.g., 'agentSettings.defaultCommissionPercent')
 * @param {*} defaultValue - ערך ברירת מחדל
 * @returns {*}
 */
export function getTenantSetting(tenant, settingPath, defaultValue) {
  if (!tenant) return defaultValue;
  
  const parts = settingPath.split('.');
  let value = tenant;
  
  for (const part of parts) {
    if (value === undefined || value === null) return defaultValue;
    value = value[part];
  }
  
  return value !== undefined && value !== null ? value : defaultValue;
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
  resolveTenantId,
  withTenantQuery,
  withTenantData,
  canAccessTenant,
  getTenantSetting,
};

export default tenantMiddleware;
