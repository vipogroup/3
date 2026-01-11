import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

import Transaction from '@/models/Transaction';
import { getDb } from '@/lib/db';
import { getUserFromSession } from '@/lib/authz';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

/**
 * GET /api/transactions
 * Get current user's transactions
 */
async function GETHandler() {
  try {
    await getDb();
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const transactions = db.collection('transactions');

    // Find user's transactions with product details
    const tx = await transactions.find({ userId: user.id }).sort({ createdAt: -1 }).toArray();

    // Populate product details
    const productIds = tx.map((t) => t.productId).filter(Boolean);
    const products = await db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    const productMap = {};
    products.forEach((p) => {
      productMap[String(p._id)] = p;
    });

    const items = tx.map((t) => ({
      _id: String(t._id),
      userId: String(t.userId),
      productId: String(t.productId),
      product: productMap[String(t.productId)] || null,
      amount: t.amount,
      status: t.status,
      referredBy: t.referredBy ? String(t.referredBy) : null,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return NextResponse.json({ ok: true, items });
  } catch (err) {
    console.error('GET_TRANSACTIONS_ERROR:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/transactions
 * Create new transaction
 */
async function POSTHandler(req) {
  try {
    await getDb();
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, amount } = body || {};

    if (!productId || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (amount < 0) {
      return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    const db = await getDb();
    const transactions = db.collection('transactions');

    const doc = {
      userId: user.id,
      productId: new ObjectId(productId),
      amount,
      status: 'pending',
      referredBy: user.referredBy ? new ObjectId(user.referredBy) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await transactions.insertOne(doc);

    console.log('TRANSACTION_CREATED', {
      transactionId: String(result.insertedId),
      userId: String(user.id),
      productId,
      amount,
    });

    return NextResponse.json(
      {
        ok: true,
        item: {
          _id: String(result.insertedId),
          ...doc,
          userId: String(doc.userId),
          productId: String(doc.productId),
          referredBy: doc.referredBy ? String(doc.referredBy) : null,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error('CREATE_TRANSACTION_ERROR:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const GET = withErrorLogging(GETHandler);
export const POST = withErrorLogging(POSTHandler);
