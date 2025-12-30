import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { getDb } from '@/lib/db';
import { requireAuthApi } from '@/lib/auth/server';

async function ordersCollection() {
  const db = await getDb();
  const col = db.collection('orders');
  await col.createIndex({ agentId: 1 }).catch(() => {});
  await col.createIndex({ status: 1 }).catch(() => {});
  return col;
}

export async function GET(req, { params }) {
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

    return NextResponse.json(order);
  } catch (e) {
    console.error(e);
    const status = e?.status || 500;
    return NextResponse.json({ error: status === 401 ? 'Unauthorized' : 'Server error' }, { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await requireAuthApi(req);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const col = await ordersCollection();
    const result = await col.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result?.value) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    const status = e?.status || 500;
    return NextResponse.json({ error: status === 401 ? 'Unauthorized' : 'Server error' }, { status });
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await requireAuthApi(req);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const col = await ordersCollection();
    const order = await col.findOne({ _id: new ObjectId(id) });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json();
    const { status } = body;

    const allowedStatuses = ['pending', 'paid', 'cancelled', 'completed', 'shipped'];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    const updated = await col.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, order: updated });
  } catch (e) {
    console.error(e);
    const status = e?.status || 500;
    return NextResponse.json({ error: status === 401 ? 'Unauthorized' : 'Server error' }, { status });
  }
}

export async function PATCH(req, { params }) {
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
    if (body.customer && typeof body.customer === 'object') {
      updates['customer.fullName'] = String(
        body.customer.fullName || order.customer?.fullName || '',
      ).trim();
      updates['customer.phone'] = String(body.customer.phone || order.customer?.phone || '').trim();
      updates['customer.notes'] = String(body.customer.notes || order.customer?.notes || '').trim();
    }

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    await col.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    const updated = await col.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, order: updated });
  } catch (e) {
    console.error(e);
    const status = e?.status || 500;
    return NextResponse.json({ error: status === 401 ? 'Unauthorized' : 'Server error' }, { status });
  }
}
