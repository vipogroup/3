/**
 * Tenant Context Utilities
 * פונקציות עזר לזיהוי tenant מתוך המשתמש
 */

import mongoose from 'mongoose';

/**
 * מחזיר את ה-tenantId מתוך אובייקט המשתמש
 * @param {Object} user - אובייקט המשתמש
 * @returns {ObjectId} - מזהה ה-tenant
 */
export function getTenantId(user) {
  if (!user) {
    throw new Error('User is required to get tenant ID');
  }

  // אם למשתמש יש tenantId ישיר
  if (user.tenantId) {
    // המרה ל-ObjectId אם צריך
    if (typeof user.tenantId === 'string') {
      return new mongoose.Types.ObjectId(user.tenantId);
    }
    return user.tenantId;
  }

  // אם זה super_admin ללא tenant ספציפי, נחזיר null
  if (user.role === 'super_admin') {
    return null;
  }

  throw new Error('User does not have a tenant ID');
}

/**
 * בודק אם המשתמש שייך ל-tenant מסוים
 * @param {Object} user - אובייקט המשתמש
 * @param {ObjectId|string} tenantId - מזהה ה-tenant לבדיקה
 * @returns {boolean}
 */
export function belongsToTenant(user, tenantId) {
  if (!user || !tenantId) return false;
  
  // Super admin יכול לגשת לכל tenant
  if (user.role === 'super_admin') return true;
  
  const userTenantId = user.tenantId?.toString();
  const checkTenantId = tenantId.toString();
  
  return userTenantId === checkTenantId;
}

/**
 * מוסיף סינון tenant לשאילתה
 * @param {Object} query - שאילתת MongoDB
 * @param {Object} user - אובייקט המשתמש
 * @returns {Object} - שאילתה עם סינון tenant
 */
export function withTenantFilter(query, user) {
  const tenantId = getTenantId(user);
  if (tenantId) {
    return { ...query, tenantId };
  }
  return query;
}

/**
 * מחזיר פילטר tenant מהמשתמש
 * @param {Object} user - אובייקט המשתמש
 * @returns {Object} - פילטר tenant
 */
export function getTenantFilter(user) {
  const tenantId = getTenantId(user);
  if (tenantId) {
    return { tenantId };
  }
  return {};
}
