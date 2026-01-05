export const dynamic = 'force-dynamic';

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
    
    // Validate user object exists
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const identifier = buildRateLimitKey(req, user.id);
    const rateLimit = rateLimiters.withdrawals(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const { amount, notes, paymentDetails } = body;

    // Validation
    if (!amount || typeof amount !== 'number' || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection('users');
    const withdrawals = db.collection('withdrawalRequests');
    const orders = db.collection('orders');
    
    // Validate user.id before creating ObjectId
    if (!user.id || !ObjectId.isValid(user.id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
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

    // Get user's current balance AND calculate available commissions from orders
    // This matches the calculation in /api/agent/commissions
    const [userData, availableOrders] = await Promise.all([
      users.findOne(
        { _id: userObjectId },
        { projection: { commissionBalance: 1, commissionOnHold: 1 } },
      ),
      orders.find({
        $or: [{ agentId: userObjectId }, { refAgentId: userObjectId }],
        commissionAmount: { $gt: 0 },
        commissionStatus: { $in: ['available', 'pending'] }, // pending treated as available
        status: { $in: ['paid', 'completed', 'shipped'] }
      }).project({ commissionAmount: 1 }).toArray()
    ]);

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate available balance from orders (same as UI shows)
    const availableFromOrders = availableOrders.reduce((sum, order) => sum + Number(order.commissionAmount || 0), 0);
    
    // Use the available from orders as the source of truth (matches UI)
    const balance = availableFromOrders;
    const currentDbBalance = Number(userData.commissionBalance || 0);

    console.log('WITHDRAWAL_BALANCE_CHECK', {
      userId: user.id,
      requestedAmount: amount,
      availableFromOrders,
      currentDbBalance,
      ordersFound: availableOrders.length,
      orders: availableOrders.map(o => ({ id: o._id?.toString(), amount: o.commissionAmount }))
    });

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

    // Sync DB commissionBalance with actual available from orders
    // This ensures the atomic lock will work correctly
    const syncResult = await users.findOneAndUpdate(
      { _id: userObjectId },
      { 
        $set: { 
          commissionBalance: balance, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );

    // Handle both old (.value) and new (direct) MongoDB driver response formats
    const syncedDoc = syncResult?.value || syncResult;
    
    console.log('WITHDRAWAL_SYNC', {
      userId: user.id,
      syncedBalance: syncedDoc?.commissionBalance,
      targetBalance: balance
    });

    // Atomically lock funds: move from balance to onHold
    const lockResult = await users.findOneAndUpdate(
      { _id: userObjectId, commissionBalance: { $gte: amount } },
      {
        $inc: { commissionBalance: -amount, commissionOnHold: amount },
      },
      { returnDocument: 'after' },
    );

    // Handle both old (.value) and new (direct) MongoDB driver response formats
    const lockedDoc = lockResult?.value || lockResult;

    if (!lockedDoc || !lockedDoc._id) {
      // Log the issue for debugging
      console.error('WITHDRAWAL_LOCK_FAILED', { 
        userId: user.id, 
        amount, 
        balance, 
        currentDbBalance,
        syncedBalance: syncedDoc?.commissionBalance,
        lockResult: lockResult
      });
      return NextResponse.json(
        {
          error: 'Insufficient balance',
          balance,
          requested: amount,
        },
        { status: 400 },
      );
    }

    const snapshotBalance = lockedDoc.commissionBalance ?? 0;
    const snapshotOnHold = lockedDoc.commissionOnHold ?? 0;

    // Create withdrawal request
    const doc = {
      userId: userObjectId,
      amount,
      notes: notes || '',
      paymentDetails: paymentDetails || null,
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
    
    // Validate user object exists
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const identifier = buildRateLimitKey(req, user.id);
    const rateLimit = rateLimiters.withdrawals(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const db = await getDb();
    const withdrawals = db.collection('withdrawalRequests');
    
    // Validate user.id is valid ObjectId
    if (!ObjectId.isValid(user.id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
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
