import Transaction from '@/models/Transaction';
import { getDb } from '@/lib/db';
import { requireAuth } from '@/lib/authz';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

/**
 * PATCH /api/transactions/[id]
 * Update transaction status
 * - Regular user: can only update their own transactions to "paid"
 * - Admin: can update any transaction to any status
 */
export async function PATCH(req, { params }) {
  try {
    await getDb();
    const user = await requireAuth();
    const id = params.id;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body || {};

    const allowed = ['paid', 'shipped', 'completed'];

    if (!allowed.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const db = await getDb();
    const transactions = db.collection('transactions');

    // Find transaction
    const tx = await transactions.findOne({ _id: new ObjectId(id) });

    if (!tx) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Authorization checks
    const isAdmin = user.role === 'admin';
    const isOwner = String(tx.userId) === String(user.id);

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Regular users can only set to "paid"
    if (!isAdmin && status !== 'paid') {
      return NextResponse.json(
        {
          error: 'Forbidden: Only admin can set status to shipped/completed',
        },
        { status: 403 },
      );
    }

    // Update transaction
    const result = await transactions.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    // Get updated transaction
    const updated = await transactions.findOne({ _id: new ObjectId(id) });

    console.log('TRANSACTION_STATUS_UPDATED', {
      transactionId: id,
      userId: String(user.id),
      oldStatus: tx.status,
      newStatus: status,
      updatedBy: user.role,
    });

    return NextResponse.json({
      ok: true,
      item: {
        _id: String(updated._id),
        userId: String(updated.userId),
        productId: String(updated.productId),
        amount: updated.amount,
        status: updated.status,
        referredBy: updated.referredBy ? String(updated.referredBy) : null,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (err) {
    console.error('UPDATE_TRANSACTION_ERROR:', err);

    if (err.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (err.status === 403) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
