export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminApi } from '@/lib/auth/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';

export async function POST(req) {
  try {
    const admin = await requireAdminApi(req);
    const identifier = buildRateLimitKey(req, admin.id);
    const rateLimit = rateLimiters.admin(req, identifier);

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const db = await getDb();
    const orders = db.collection('orders');
    const users = db.collection('users');
    const now = new Date();

    // Reset all commission-related fields in orders
    const ordersResult = await orders.updateMany(
      { commissionAmount: { $gt: 0 } },
      {
        $set: {
          commissionAmount: 0,
          commissionStatus: 'cancelled',
          updatedAt: now,
        },
      }
    );

    // Reset all commission balances for users
    const usersResult = await users.updateMany(
      {
        $or: [
          { commissionBalance: { $gt: 0 } },
          { commissionOnHold: { $gt: 0 } },
        ],
      },
      {
        $set: {
          commissionBalance: 0,
          commissionOnHold: 0,
          updatedAt: now,
        },
      }
    );

    // Delete all withdrawal requests
    const withdrawals = db.collection('withdrawalRequests');
    await withdrawals.deleteMany({});

    console.log('ADMIN_RESET_ALL_COMMISSIONS:', {
      adminId: admin.id,
      ordersReset: ordersResult.modifiedCount,
      usersReset: usersResult.modifiedCount,
      timestamp: now.toISOString(),
    });

    return NextResponse.json({
      ok: true,
      ordersReset: ordersResult.modifiedCount,
      usersReset: usersResult.modifiedCount,
    });
  } catch (error) {
    console.error('ADMIN_RESET_COMMISSIONS_ERROR:', error);
    const status = error?.status || 500;
    const message =
      status === 401 ? 'unauthorized' : status === 403 ? 'forbidden' : error?.message || 'server_error';
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
