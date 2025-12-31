import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { requireAuthApi } from '@/lib/auth/server';

export async function PUT(req, { params }) {
  try {
    const user = await requireAuthApi(req);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = params || {};
    if (!orderId || !ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const body = await req.json();
    const { commissionAvailableAt } = body;

    if (!commissionAvailableAt) {
      return NextResponse.json({ error: 'Missing commissionAvailableAt' }, { status: 400 });
    }

    const db = await getDb();
    const ordersCol = db.collection('orders');

    const result = await ordersCol.updateOne(
      { _id: new ObjectId(orderId) },
      { 
        $set: { 
          commissionAvailableAt: new Date(commissionAvailableAt),
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Commission release date updated successfully' 
    });

  } catch (e) {
    console.error('Error updating commission date:', e);
    const status = e?.status || 500;
    return NextResponse.json(
      { error: status === 401 ? 'Unauthorized' : 'Server error' }, 
      { status }
    );
  }
}
