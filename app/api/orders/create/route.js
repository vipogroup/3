export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      productId,
      quantity = 1,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      paymentMethod = 'credit_card',
    } = body;

    // Validation
    if (!productId || !customerName || (!customerPhone && !customerEmail)) {
      return NextResponse.json({ ok: false, error: 'missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    const products = db.collection('products');
    const orders = db.collection('orders');
    const users = db.collection('users');

    // Get product
    const product = await products.findOne({ _id: new ObjectId(productId) });
    if (!product) {
      return NextResponse.json({ ok: false, error: 'product not found' }, { status: 404 });
    }

    // Check stock for online products
    if (product.type === 'online' && product.stockCount < quantity) {
      return NextResponse.json({ ok: false, error: 'insufficient stock' }, { status: 400 });
    }

    // Calculate total
    const itemPrice = product.price || 0;
    const totalAmount = itemPrice * quantity;
    const commissionRate = 0.1; // 10% commission
    const commissionAmount = totalAmount * commissionRate;

    // Get referrer ID from cookie
    const cookieStore = cookies();
    const refSource = cookieStore.get('refSource')?.value || null;
    let refAgentId = null;

    if (refSource) {
      try {
        const agentObjectId = new ObjectId(refSource);
        const agent = await users.findOne(
          { _id: agentObjectId, role: 'agent' },
          { projection: { _id: 1 } },
        );
        if (agent) {
          refAgentId = agent._id;
        }
      } catch (err) {
        console.log('Invalid refSource:', refSource);
      }
    }

    // Create order document
    const orderDoc = {
      productId: new ObjectId(productId),
      productName: product.name,
      quantity,
      itemPrice,
      totalAmount,
      customerName,
      customerPhone: customerPhone || null,
      customerEmail: customerEmail || null,
      shippingAddress: shippingAddress || null,
      paymentMethod,
      status: 'pending',
      refSource: refSource || null,
      refAgentId: refAgentId || null,
      commissionAmount: refAgentId ? commissionAmount : 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert order
    const result = await orders.insertOne(orderDoc);
    const orderId = result.insertedId;

    // Update product stock for online products
    if (product.type === 'online') {
      await products.updateOne(
        { _id: new ObjectId(productId) },
        {
          $inc: { stockCount: -quantity },
          $set: { updatedAt: new Date() },
        },
      );
    }

    // Update group purchase quantity for group products
    if (product.type === 'group') {
      await products.updateOne(
        { _id: new ObjectId(productId) },
        {
          $inc: { groupCurrentQuantity: quantity },
          $set: { updatedAt: new Date() },
        },
      );
    }

    // Update agent commission if referral exists
    if (refAgentId) {
      try {
        await users.updateOne(
          { _id: refAgentId },
          {
            $inc: {
              commissionBalance: commissionAmount,
              totalSales: 1,
            },
            $set: { updatedAt: new Date() },
          },
        );

        console.log('COMMISSION_ADDED', {
          orderId: String(orderId),
          agentId: String(refAgentId),
          amount: commissionAmount,
          orderTotal: totalAmount,
        });
      } catch (commErr) {
        console.error('COMMISSION_UPDATE_FAILED', {
          orderId: String(orderId),
          agentId: String(refAgentId),
          error: commErr.message,
        });
      }
    }

    // Clear refSource cookie after order
    const response = NextResponse.json(
      {
        ok: true,
        orderId: String(orderId),
        totalAmount,
        commissionAmount: refAgentId ? commissionAmount : 0,
      },
      { status: 201 },
    );

    response.cookies.set('refSource', '', { path: '/', maxAge: 0 });

    return response;
  } catch (error) {
    console.error('ORDER_CREATE_ERROR:', error);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}
