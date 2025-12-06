import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { requireAuthApi } from '@/lib/auth/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';

/**
 * POST /api/withdrawals
 * Create a new withdrawal request
 */
export async function POST(req) {
  try {
    // Get current user
    const user = await requireAuthApi(req);
    const identifier = buildRateLimitKey(req, user.id);
    const rateLimit = rateLimiters.withdrawals(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const { amount, notes } = body;

    // Validation
    if (!amount || typeof amount !== 'number' || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection('users');
    const withdrawals = db.collection('withdrawalRequests');
    const userObjectId = new ObjectId(user.id);

    // Prevent multiple pending/approved requests
    const openRequest = await withdrawals.findOne({
      userId: userObjectId,
      status: { $in: ['pending', 'approved'] },
    });
    if (openRequest) {
      return NextResponse.json(
        {
          error: 'קיימת בקשת משיכה פעילה. המתן לאישור מנהל לפני פתיחת בקשה נוספת.',
          requestId: String(openRequest._id),
          status: openRequest.status,
        },
        { status: 409 },
      );
    }

    // Get user's current balance
    const userData = await users.findOne(
      { _id: userObjectId },
      { projection: { commissionBalance: 1, commissionOnHold: 1 } },
    );

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const balance = Number(userData.commissionBalance || 0);

    if (amount > balance) {
      return NextResponse.json(
        {
          error: 'Insufficient balance',
          balance,
          requested: amount,
        },
        { status: 400 },
      );
    }

    // Atomically lock funds: move from balance to onHold
    const lockResult = await users.findOneAndUpdate(
      { _id: userObjectId, commissionBalance: { $gte: amount } },
      {
        $inc: { commissionBalance: -amount, commissionOnHold: amount },
      },
      { returnDocument: 'after' },
    );

    if (!lockResult.value) {
      return NextResponse.json(
        {
          error: 'Insufficient balance',
          balance,
          requested: amount,
        },
        { status: 400 },
      );
    }

    const snapshotBalance = lockResult.value.commissionBalance ?? 0;
    const snapshotOnHold = lockResult.value.commissionOnHold ?? 0;

    // Create withdrawal request
    const doc = {
      userId: userObjectId,
      amount,
      notes: notes || '',
      status: 'pending',
      adminNotes: '',
      snapshotBalance,
      snapshotOnHold,
      autoSettled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await withdrawals.insertOne(doc);

    console.log('WITHDRAWAL_REQUESTED', {
      userId: String(user.id),
      amount,
      requestId: String(result.insertedId),
    });

    return NextResponse.json(
      {
        ok: true,
        requestId: String(result.insertedId),
        amount,
        status: 'pending',
      },
      { status: 201 },
    );
  } catch (err) {
    console.error('WITHDRAWAL_REQUEST_ERROR:', err);
    const status = err?.status || 500;
    const message =
      status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Server error';
    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * GET /api/withdrawals
 * Get user's withdrawal requests
 */
export async function GET(req) {
  try {
    const user = await requireAuthApi(req);
    const identifier = buildRateLimitKey(req, user.id);
    const rateLimit = rateLimiters.withdrawals(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const db = await getDb();
    const withdrawals = db.collection('withdrawalRequests');
    const userObjectId = new ObjectId(user.id);

    const requests = await withdrawals
      .find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      ok: true,
      requests: requests.map((r) => ({
        _id: String(r._id),
        amount: r.amount,
        status: r.status,
        notes: r.notes,
        adminNotes: r.adminNotes,
        createdAt: r.createdAt,
        processedAt: r.processedAt,
      })),
    });
  } catch (err) {
    console.error('WITHDRAWAL_LIST_ERROR:', err);
    const status = err?.status || 500;
    const message =
      status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Server error';
    return NextResponse.json({ error: message }, { status });
  }
}
