/**
 * API Route: /api/tenants/[id]
 * ניהול עסק ספציפי - GET, PUT, DELETE
 */

import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminGuard } from '@/lib/auth/requireAuth';
import { isSuperAdmin, isBusinessAdmin } from '@/lib/tenant';
import { ObjectId } from 'mongodb';

/**
 * GET /api/tenants/[id] - קבלת פרטי עסק
 */
async function GETHandler(request, { params }) {
  try {
    const authResult = await requireAdminGuard(request);
    if (!authResult.ok) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const user = authResult.user;
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'מזהה עסק לא תקין' }, { status: 400 });
    }
    
    const db = await getDb();
    const tenant = await db.collection('tenants').findOne({ _id: new ObjectId(id) });
    
    if (!tenant) {
      return NextResponse.json({ error: 'העסק לא נמצא' }, { status: 404 });
    }
    
    // Check permissions
    if (!isSuperAdmin(user) && String(user.tenantId) !== String(tenant._id)) {
      return NextResponse.json({ error: 'אין הרשאה לצפות בעסק זה' }, { status: 403 });
    }
    
    // Get stats
    const [ordersCount, usersCount, productsCount, totalSales] = await Promise.all([
      db.collection('orders').countDocuments({ tenantId: tenant._id }),
      db.collection('users').countDocuments({ tenantId: tenant._id }),
      db.collection('products').countDocuments({ tenantId: tenant._id }),
      db.collection('orders').aggregate([
        { $match: { tenantId: tenant._id, paymentStatus: 'success' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]).toArray(),
    ]);
    
    return NextResponse.json({
      ok: true,
      tenant: {
        ...tenant,
        stats: {
          totalOrders: ordersCount,
          totalUsers: usersCount,
          totalProducts: productsCount,
          totalSales: totalSales[0]?.total || 0,
        },
      },
    });
  } catch (error) {
    console.error('GET /api/tenants/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה בטעינת העסק' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/tenants/[id] - עדכון פרטי עסק
 */
async function PUTHandler(request, { params }) {
  try {
    const authResult = await requireAdminGuard(request);
    if (!authResult.ok) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const user = authResult.user;
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'מזהה עסק לא תקין' }, { status: 400 });
    }
    
    const db = await getDb();
    const tenant = await db.collection('tenants').findOne({ _id: new ObjectId(id) });
    
    if (!tenant) {
      return NextResponse.json({ error: 'העסק לא נמצא' }, { status: 404 });
    }
    
    // Check permissions
    const canEdit = isSuperAdmin(user) || String(user.tenantId) === String(tenant._id);
    if (!canEdit) {
      return NextResponse.json({ error: 'אין הרשאה לערוך עסק זה' }, { status: 403 });
    }
    
    const body = await request.json();
    
    // Fields that only super admin can change
    const superAdminOnlyFields = ['status', 'platformCommissionRate', 'ownerId', 'slug'];
    
    const updateData = {};
    
    // Business admin can update these fields
    const allowedFields = [
      'name', 'branding', 'contact', 'social', 'seo', 'features', 'agentSettings',
    ];
    
    // Super admin can also update these
    if (isSuperAdmin(user)) {
      allowedFields.push(...superAdminOnlyFields, 'domain', 'subdomain', 'billing', 'allowedMenus');
    }
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] === 'object' && !Array.isArray(body[field])) {
          // Merge nested objects
          updateData[field] = { ...tenant[field], ...body[field] };
        } else {
          updateData[field] = body[field];
        }
      }
    }
    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'לא נשלחו שדות לעדכון' }, { status: 400 });
    }
    
    updateData.updatedAt = new Date();
    updateData.updatedBy = user._id;
    
    // Handle status change
    if (updateData.status === 'active' && tenant.status !== 'active') {
      updateData.activatedAt = new Date();
    }
    if (updateData.status === 'suspended' && tenant.status !== 'suspended') {
      updateData.suspendedAt = new Date();
    }
    
    await db.collection('tenants').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedTenant = await db.collection('tenants').findOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({
      ok: true,
      tenant: updatedTenant,
      message: 'העסק עודכן בהצלחה',
    });
  } catch (error) {
    console.error('PUT /api/tenants/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה בעדכון העסק' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tenants/[id] - עדכון חלקי (למשל allowedMenus)
 */
async function PATCHHandler(request, { params }) {
  return PUTHandler(request, { params });
}

/**
 * DELETE /api/tenants/[id] - מחיקת עסק וכל הנתונים הקשורים (רק Super Admin)
 */
async function DELETEHandler(request, { params }) {
  try {
    const authResult = await requireAdminGuard(request);
    if (!authResult.ok) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const user = authResult.user;
    const { id } = params;
    
    if (!isSuperAdmin(user)) {
      return NextResponse.json({ error: 'רק Super Admin יכול למחוק עסקים' }, { status: 403 });
    }
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'מזהה עסק לא תקין' }, { status: 400 });
    }
    
    const db = await getDb();
    const tenant = await db.collection('tenants').findOne({ _id: new ObjectId(id) });
    
    if (!tenant) {
      return NextResponse.json({ error: 'העסק לא נמצא' }, { status: 404 });
    }
    
    const tenantId = tenant._id;
    
    // מחיקת כל הנתונים הקשורים לעסק
    const deleteResults = await Promise.allSettled([
      // הזמנות
      db.collection('orders').deleteMany({ tenantId }),
      // מוצרים
      db.collection('products').deleteMany({ tenantId }),
      // עמלות
      db.collection('commissions').deleteMany({ tenantId }),
      // בקשות משיכה
      db.collection('withdrawals').deleteMany({ tenantId }),
      // עסקאות
      db.collection('transactions').deleteMany({ tenantId }),
      // קופונים
      db.collection('coupons').deleteMany({ tenantId }),
      // התראות
      db.collection('notifications').deleteMany({ tenantId }),
      // רמות גיימיפיקציה
      db.collection('gamificationlevels').deleteMany({ tenantId }),
      // לידים CRM
      db.collection('leads').deleteMany({ tenantId }),
      // הודעות CRM
      db.collection('messages').deleteMany({ tenantId }),
      // משימות CRM
      db.collection('tasks').deleteMany({ tenantId }),
      // אוטומציות CRM
      db.collection('automations').deleteMany({ tenantId }),
      // תבניות הודעות
      db.collection('templates').deleteMany({ tenantId }),
      // קטגוריות
      db.collection('categories').deleteMany({ tenantId }),
      // הגדרות
      db.collection('settings').deleteMany({ tenantId }),
    ]);
    
    // מחיקת משתמשים השייכים לעסק
    await db.collection('users').deleteMany({ tenantId });
    
    // מחיקת העסק עצמו
    await db.collection('tenants').deleteOne({ _id: tenantId });
    
    // סיכום המחיקות
    const deletedCounts = {};
    const collections = [
      'orders', 'products', 'commissions', 'withdrawals', 'transactions',
      'coupons', 'notifications', 'gamificationlevels', 'leads', 'messages',
      'tasks', 'automations', 'templates', 'categories', 'settings'
    ];
    deleteResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value?.deletedCount) {
        deletedCounts[collections[index]] = result.value.deletedCount;
      }
    });
    
    console.log(`Tenant ${tenant.name} (${tenantId}) deleted with all related data:`, deletedCounts);
    
    return NextResponse.json({
      ok: true,
      message: 'העסק וכל הנתונים הקשורים נמחקו בהצלחה',
      deletedCounts,
    });
  } catch (error) {
    console.error('DELETE /api/tenants/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה במחיקת העסק' },
      { status: 500 }
    );
  }
}

export const GET = withErrorLogging(GETHandler);
export const PUT = withErrorLogging(PUTHandler);
export const PATCH = withErrorLogging(PATCHHandler);
export const DELETE = withErrorLogging(DELETEHandler);
