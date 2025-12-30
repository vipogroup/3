export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { requireAuthApi } from '@/lib/auth/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';

const COMMISSION_STATUSES = ['pending', 'available', 'claimed', 'cancelled'];

function inferStatusLabel(status) {
  switch (status) {
    case 'pending':
      return 'ממתין לשחרור';
    case 'available':
      return 'זמין למשיכה';
    case 'claimed':
      return 'נמשך';
    case 'cancelled':
      return 'בוטל';
    default:
      return 'לא ידוע';
  }
}

function inferOrderTypeLabel(type) {
  if (type === 'group') return 'רכישה קבוצתית';
  return 'רכישה רגילה';
}

export async function GET(req) {
  try {
    const user = await requireAuthApi(req);
    
    // Validate user object exists
    if (!user || !user.id) {
      console.error('COMMISSIONS_AUTH_ERROR: No user or user.id', { user });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const identifier = buildRateLimitKey(req, user.id);
    const rateLimit = rateLimiters.agentStats(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const db = await getDb();
    
    // Validate user.id is valid ObjectId
    if (!ObjectId.isValid(user.id)) {
      console.error('COMMISSIONS_INVALID_ID:', user.id);
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    const userId = new ObjectId(user.id);

    const usersCollection = db.collection('users');
    const ordersCollection = db.collection('orders');
    const groupPurchasesCollection = db.collection('grouppurchases');

    const [userDoc, orders] = await Promise.all([
      usersCollection
        .find({ _id: userId })
        .project({ commissionBalance: 1, commissionOnHold: 1, commissionOnHoldManual: 1 })
        .limit(1)
        .toArray(),
      ordersCollection
        .find({ 
          $or: [{ agentId: userId }, { refAgentId: userId }], 
          commissionAmount: { $gt: 0 },
          status: { $in: ['paid', 'completed', 'shipped'] }  // Only show commissions for paid orders
        })
        .project({
          commissionAmount: 1,
          commissionStatus: 1,
          commissionAvailableAt: 1,
          orderType: 1,
          deliveredAt: 1,
          createdAt: 1,
          customerName: 1,
          groupPurchaseId: 1,
          totalAmount: 1,
        })
        .sort({ createdAt: -1 })
        .toArray(),
    ]);

    if (!userDoc[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const commissionBalance = Number(userDoc[0].commissionBalance || 0);
    const commissionOnHold = Number(userDoc[0].commissionOnHold || 0);

    let pendingCommissions = 0;
    let totalEarned = 0;

    const groupPurchaseIds = orders
      .filter((order) => order.groupPurchaseId)
      .map((order) => order.groupPurchaseId);

    let groupPurchaseMap = new Map();
    if (groupPurchaseIds.length > 0) {
      const uniqueGroupIds = [...new Set(groupPurchaseIds.map((id) => id.toString()))].map(
        (id) => new ObjectId(id),
      );
      if (uniqueGroupIds.length > 0) {
        const groupDocs = await groupPurchasesCollection
          .find({ _id: { $in: uniqueGroupIds } })
          .project({
            name: 1,
            status: 1,
            commissionReleaseDate: 1,
            closedAt: 1,
            shippedAt: 1,
            arrivedAt: 1,
            deliveryCompletedAt: 1,
          })
          .toArray();

        groupPurchaseMap = new Map(
          groupDocs.map((doc) => [doc._id.toString(), { ...doc, id: doc._id.toString() }]),
        );
      }
    }

    const commissions = orders.map((order) => {
      const status = order.commissionStatus || 'pending';
      const amount = Number(order.commissionAmount || 0);
      totalEarned += amount;

      if (status === 'pending') {
        pendingCommissions += amount;
      }

      const groupInfo = order.groupPurchaseId
        ? groupPurchaseMap.get(order.groupPurchaseId.toString()) || null
        : null;

      return {
        orderId: order._id ? order._id.toString() : null,
        orderType: order.orderType || 'regular',
        orderTypeLabel: inferOrderTypeLabel(order.orderType),
        amount,
        status,
        statusLabel: inferStatusLabel(status),
        availableAt: order.commissionAvailableAt || null,
        deliveredAt: order.deliveredAt || null,
        customerName: order.customerName || '',
        totalAmount: order.totalAmount || 0,
        createdAt: order.createdAt,
        groupPurchase: groupInfo
          ? {
              id: groupInfo.id,
              name: groupInfo.name || '',
              status: groupInfo.status || 'open',
              commissionReleaseDate: groupInfo.commissionReleaseDate || null,
              closedAt: groupInfo.closedAt || null,
              shippedAt: groupInfo.shippedAt || null,
              arrivedAt: groupInfo.arrivedAt || null,
              deliveryCompletedAt: groupInfo.deliveryCompletedAt || null,
            }
          : null,
      };
    });

    return NextResponse.json({
      ok: true,
      summary: {
        availableBalance: commissionBalance,
        pendingCommissions,
        onHold: commissionOnHold,
        totalEarned,
      },
      commissions,
    });
  } catch (err) {
    console.error('AGENT_COMMISSIONS_GET_ERROR:', err);
    const status = err?.status || 500;
    const message = status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Server error';
    return NextResponse.json({ error: message }, { status });
  }
}
