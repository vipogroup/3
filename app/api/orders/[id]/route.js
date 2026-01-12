import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { getDb } from '@/lib/db';
import { requireAuthApi } from '@/lib/auth/server';
import { isSuperAdmin } from '@/lib/tenant/tenantMiddleware';
import {
  ORDER_STATUS,
  ORDER_STATUS_VALUES,
  coercePaymentStatusForOrderStatus,
  normalizeOrderStatus,
  assertOrderStatusInvariant,
  canTransitionOrderStatus,
} from '@/lib/orders/status';

async function ordersCollection() {
  const db = await getDb();
  const col = db.collection('orders');
  await col.createIndex({ agentId: 1 }).catch(() => {});
  await col.createIndex({ status: 1 }).catch(() => {});
  return col;
}

async function GETHandler(req, { params }) {
  try {
    const user = await requireAuthApi(req);

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const col = await ordersCollection();
    const order = await col.findOne({ _id: new ObjectId(id) });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Check access: admin, order owner (createdBy), or agent
    const isAdmin = user.role === 'admin';
    const isOwner = String(order.createdBy) === String(user.id) || 
                   (user.email && order.customer?.email === user.email);
    const isAgent = String(order.agentId) === String(user.id);
    
    if (!isAdmin && !isOwner && !isAgent) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If order has tenantId, fetch tenant slug for redirect purposes
    let tenantSlug = null;
    if (order.tenantId) {
      const db = await getDb();
      const tenant = await db.collection('tenants').findOne(
        { _id: new ObjectId(order.tenantId) },
        { projection: { slug: 1 } }
      );
      tenantSlug = tenant?.slug || null;
    }

    return NextResponse.json({ ...order, tenantSlug });
  } catch (e) {
    console.error(e);
    const status = e?.status || 500;
    return NextResponse.json({ error: status === 401 ? 'Unauthorized' : 'Server error' }, { status });
  }
}

async function DELETEHandler(req, { params }) {
  try {
    const user = await requireAuthApi(req);
    if (user.role !== 'admin' && user.role !== 'business_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const col = await ordersCollection();
    
    // Multi-Tenant: Verify order belongs to admin's tenant before deleting
    const order = await col.findOne({ _id: new ObjectId(id) });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    if (!isSuperAdmin(user) && user.tenantId) {
      const orderTenantId = order.tenantId?.toString();
      const userTenantId = user.tenantId?.toString();
      if (orderTenantId && orderTenantId !== userTenantId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
    
    const result = await col.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: true });
  } catch (e) {
    console.error(e);
    const status = e?.status || 500;
    return NextResponse.json({ error: status === 401 ? 'Unauthorized' : 'Server error' }, { status });
  }
}

async function PUTHandler(req, { params }) {
  try {
    const user = await requireAuthApi(req);
    if (user.role !== 'admin' && user.role !== 'business_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const col = await ordersCollection();
    const order = await col.findOne({ _id: new ObjectId(id) });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    // Multi-Tenant: Verify order belongs to admin's tenant
    if (!isSuperAdmin(user) && user.tenantId) {
      const orderTenantId = order.tenantId?.toString();
      const userTenantId = user.tenantId?.toString();
      if (orderTenantId && orderTenantId !== userTenantId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const body = await req.json();
    const { status, paymentStatus } = body;

    if (!status) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const normalizedStatus = normalizeOrderStatus(status);
    if (!ORDER_STATUS_VALUES.includes(normalizedStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // TODO: allow explicit admin override once ADMIN_PERMISSIONS.OVERRIDE_ORDER_TRANSITIONS is implemented
    if (!canTransitionOrderStatus(order.status, normalizedStatus, { actorRole: user.role })) {
      return NextResponse.json(
        {
          error: `Transition from "${order.status}" to "${normalizedStatus}" is not allowed`,
        },
        { status: 400 },
      );
    }

    const coercedPaymentStatus = coercePaymentStatusForOrderStatus(normalizedStatus, paymentStatus);

    try {
      assertOrderStatusInvariant(normalizedStatus, coercedPaymentStatus);
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const updateSet = {
      status: normalizedStatus,
      paymentStatus: coercedPaymentStatus,
      updatedAt: new Date(),
    };

    // When order is paid, mark commission as settled so it can be released by cron
    if (normalizedStatus === ORDER_STATUS.PAID && order.commissionAmount > 0 && !order.commissionSettled) {
      updateSet.commissionSettled = true;
    }

    await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateSet }
    );

    const updated = await col.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, order: updated });
  } catch (e) {
    console.error(e);
    const status = e?.status || 500;
    return NextResponse.json({ error: status === 401 ? 'Unauthorized' : 'Server error' }, { status });
  }
}

async function PATCHHandler(req, { params }) {
  try {
    const user = await requireAuthApi(req);

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const col = await ordersCollection();
    const order = await col.findOne({ _id: new ObjectId(id) });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isOwner = String(order.agentId) === String(user.id) ||
                   String(order.createdBy) === String(user.id);
    if (!(user.role === 'admin' || isOwner)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const updates = {};
    let normalizedStatus;
    let coercedPaymentStatus;

    if (body.customer && typeof body.customer === 'object') {
      updates['customer.fullName'] = String(
        body.customer.fullName || order.customer?.fullName || '',
      ).trim();
      updates['customer.phone'] = String(body.customer.phone || order.customer?.phone || '').trim();
      updates['customer.notes'] = String(body.customer.notes || order.customer?.notes || '').trim();
    }

    if (body.status) {
      normalizedStatus = normalizeOrderStatus(body.status);
      if (!ORDER_STATUS_VALUES.includes(normalizedStatus)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }

      // TODO: allow explicit admin override once ADMIN_PERMISSIONS.OVERRIDE_ORDER_TRANSITIONS is implemented
      if (!canTransitionOrderStatus(order.status, normalizedStatus, { actorRole: user.role })) {
        return NextResponse.json(
          {
            error: `Transition from "${order.status}" to "${normalizedStatus}" is not allowed`,
          },
          { status: 400 },
        );
      }

      coercedPaymentStatus = coercePaymentStatusForOrderStatus(normalizedStatus, body.paymentStatus);

      try {
        assertOrderStatusInvariant(normalizedStatus, coercedPaymentStatus);
      } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }

      updates.status = normalizedStatus;
      updates.paymentStatus = coercedPaymentStatus;

      if (normalizedStatus === ORDER_STATUS.PAID && order.commissionAmount > 0 && !order.commissionSettled) {
        updates.commissionSettled = true;
      }
    } else if (body.paymentStatus) {
      // Allow updating paymentStatus alone while keeping consistency
      coercedPaymentStatus = coercePaymentStatusForOrderStatus(order.status, body.paymentStatus);

      try {
        assertOrderStatusInvariant(order.status, coercedPaymentStatus);
      } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }

      updates.paymentStatus = coercedPaymentStatus;
    }

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    updates.updatedAt = new Date();

    await col.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    const updated = await col.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, order: updated });
  } catch (e) {
    console.error(e);
    const status = e?.status || 500;
    return NextResponse.json({ error: status === 401 ? 'Unauthorized' : 'Server error' }, { status });
  }
}

export const GET = withErrorLogging(GETHandler);
export const DELETE = withErrorLogging(DELETEHandler);
export const PUT = withErrorLogging(PUTHandler);
export const PATCH = withErrorLogging(PATCHHandler);
