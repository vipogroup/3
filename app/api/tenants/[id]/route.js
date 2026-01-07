/**
 * API Route: /api/tenants/[id]
 * ניהול עסק ספציפי - GET, PUT, DELETE
 */

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminGuard } from '@/lib/auth/requireAuth';
import { isSuperAdmin, isBusinessAdmin } from '@/lib/tenant';
import { ObjectId } from 'mongodb';

/**
 * GET /api/tenants/[id] - קבלת פרטי עסק
 */
export async function GET(request, { params }) {
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
export async function PUT(request, { params }) {
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
      allowedFields.push(...superAdminOnlyFields, 'domain', 'subdomain', 'billing');
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
 * DELETE /api/tenants/[id] - מחיקת עסק (רק Super Admin)
 */
export async function DELETE(request, { params }) {
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
    
    // Check if tenant has data
    const hasData = await db.collection('orders').findOne({ tenantId: tenant._id });
    if (hasData) {
      return NextResponse.json(
        { error: 'לא ניתן למחוק עסק עם נתונים קיימים. יש להשהות אותו במקום.' },
        { status: 400 }
      );
    }
    
    // Delete tenant
    await db.collection('tenants').deleteOne({ _id: new ObjectId(id) });
    
    // Remove tenantId from associated users
    await db.collection('users').updateMany(
      { tenantId: tenant._id },
      { $unset: { tenantId: '' } }
    );
    
    return NextResponse.json({
      ok: true,
      message: 'העסק נמחק בהצלחה',
    });
  } catch (error) {
    console.error('DELETE /api/tenants/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה במחיקת העסק' },
      { status: 500 }
    );
  }
}
