'use server';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { getDb } from '@/lib/db';
import { requireAuthApi } from '@/lib/auth/server';

export async function POST(req) {
  try {
    const user = await requireAuthApi(req);
    const body = await req.json().catch(() => null);
    const orderId = body?.orderId;

    if (!orderId || !ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: 'order_id_required' }, { status: 400 });
    }

    const db = await getDb();
    const ordersCol = db.collection('orders');
    const orderObjectId = new ObjectId(orderId);
    const order = await ordersCol.findOne({ _id: orderObjectId });
    if (!order) {
      return NextResponse.json({ error: 'order_not_found' }, { status: 404 });
    }

    const userObjectId = ObjectId.isValid(user.id) ? new ObjectId(user.id) : null;
    const isCreator =
      userObjectId && order.createdBy && String(order.createdBy) === userObjectId.toString();
    const isAgent =
      order.agentId && ObjectId.isValid(order.agentId) && String(order.agentId) === user.id;
    const isAdmin = user.role === 'admin';

    if (!(isCreator || isAgent || isAdmin)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    await ordersCol.updateOne(
      { _id: orderObjectId },
      {
        $set: {
          status: 'paid',
          commissionSettled: order.commissionSettled ?? true,
          demoPayment: true,
          updatedAt: new Date(),
          'payplus.demoCompletedAt': new Date(),
        },
      },
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('ORDER_DEMO_COMPLETE_ERROR', err);
    const status = err?.status || 500;
    return NextResponse.json({ error: 'server_error' }, { status });
  }
}
