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

async function POSTHandler(req, { params }) {
  try {
    const user = await requireAuthApi(req);
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'business_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const body = await req.json();
    const { status: requestedStatus, note } = body;
    if (!requestedStatus || typeof requestedStatus !== 'string') {
      return NextResponse.json({ error: 'חובה לציין סטטוס יעד' }, { status: 400 });
    }

    const normalizedStatus = normalizeOrderStatus(requestedStatus);
    if (!ORDER_STATUS_VALUES.includes(normalizedStatus)) {
      return NextResponse.json({ error: 'סטטוס לא מוכר' }, { status: 400 });
    }

    const col = await ordersCollection();
    const order = await col.findOne({ _id: new ObjectId(id) });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Multi-Tenant: Verify order belongs to user's tenant
    if (!isSuperAdmin(user) && user.tenantId) {
      const orderTenantId = order.tenantId?.toString();
      const userTenantId = user.tenantId?.toString();
      if (orderTenantId && orderTenantId !== userTenantId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    if (!canTransitionOrderStatus(order.status, normalizedStatus, { actorRole: user.role })) {
      return NextResponse.json(
        {
          error: `Transition from "${order.status}" to "${normalizedStatus}" is not allowed`,
        },
        { status: 400 },
      );
    }

    const coercedPaymentStatus = coercePaymentStatusForOrderStatus(normalizedStatus, body.paymentStatus);

    try {
      assertOrderStatusInvariant(normalizedStatus, coercedPaymentStatus);
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const update = {
      status: normalizedStatus,
      paymentStatus: coercedPaymentStatus,
      updatedAt: new Date(),
    };

    if (normalizedStatus === ORDER_STATUS.PAID && order.commissionAmount > 0 && !order.commissionSettled) {
      update.commissionSettled = true;
    }

    const oldStatus = order.status;
    const oldPaymentStatus = order.paymentStatus;

    await col.updateOne({ _id: order._id }, { $set: update });
    const updated = await col.findOne({ _id: order._id });

    return NextResponse.json({
      success: true,
      oldStatus,
      newStatus: updated.status,
      oldPaymentStatus,
      newPaymentStatus: updated.paymentStatus,
      order: updated,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const POST = withErrorLogging(POSTHandler);
