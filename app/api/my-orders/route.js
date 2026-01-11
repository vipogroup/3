import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/auth/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

/**
 * GET /api/my-orders
 * Returns orders where the current user is the CUSTOMER (not as agent)
 */
async function GETHandler(req) {
  let user;
  try {
    user = await requireAuthApi(req);
  } catch (authErr) {
    return NextResponse.json({ error: authErr.message }, { status: authErr.status || 401 });
  }

  try {
    const db = await getDb();
    const ordersCol = db.collection('orders');

    // Build query to find orders where user is the customer
    const customerCriteria = [];
    
    if (ObjectId.isValid(user.id)) {
      customerCriteria.push({ customerId: new ObjectId(user.id) });
      customerCriteria.push({ userId: new ObjectId(user.id) });
    }
    
    if (user.email) {
      customerCriteria.push({ customerEmail: user.email });
      customerCriteria.push({ 'customer.email': user.email });
    }
    
    if (user.phone) {
      customerCriteria.push({ customerPhone: user.phone });
      customerCriteria.push({ 'customer.phone': user.phone });
    }

    if (customerCriteria.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    const orders = await ordersCol
      .find({ $or: customerCriteria })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ ok: true, orders });
  } catch (err) {
    console.error('MY_ORDERS_ERROR', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export const GET = withErrorLogging(GETHandler);
