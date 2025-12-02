import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { getDb } from '@/lib/db';
import { verifyJwt } from '@/src/lib/auth/createToken.js';
import { calcTotals } from '@/lib/orders/calc.js';

async function ordersCollection() {
  const db = await getDb();
  const col = db.collection('orders');
  await col.createIndex({ agentId: 1 }).catch(() => {});
  await col.createIndex({ status: 1 }).catch(() => {});
  return col;
}

export async function PATCH(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value || '';
    const decoded = verifyJwt(token);
    if (!decoded?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const col = await ordersCollection();
    const order = await col.findOne({ _id: new ObjectId(id) });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isOwner = String(order.agentId) === String(decoded.userId);
    if (!(decoded.role === 'admin' || isOwner)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const items = Array.isArray(body?.items) ? body.items : [];
    const discount = Number(body?.discount ?? order.discount ?? 0);

    const { subtotal, total } = calcTotals(items, discount);
    await col.updateOne(
      { _id: order._id },
      { $set: { items, discount, subtotal, total, updatedAt: new Date() } },
    );
    const updated = await col.findOne({ _id: order._id });
    return NextResponse.json({ success: true, order: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
