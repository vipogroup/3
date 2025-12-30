export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { requireAdminApi } from '@/lib/auth/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';

/**
 * GET /api/admin/commissions
 * Admin endpoint to get all commissions data with agent details
 */
export async function GET(req) {
  try {
    const admin = await requireAdminApi(req);
    const identifier = buildRateLimitKey(req, admin.id);
    const rateLimit = rateLimiters.admin(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const db = await getDb();
    const ordersCol = db.collection('orders');
    const usersCol = db.collection('users');

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');
    const status = searchParams.get('status');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Build query for orders with commissions
    const query = { commissionAmount: { $gt: 0 } };
    
    if (agentId && ObjectId.isValid(agentId)) {
      query.$or = [
        { agentId: new ObjectId(agentId) },
        { refAgentId: new ObjectId(agentId) }
      ];
    }
    
    if (status) {
      query.commissionStatus = status;
    }
    
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    // Get all orders with commissions
    const orders = await ordersCol
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Get unique agent IDs
    const agentIds = [...new Set([
      ...orders.map(o => o.agentId?.toString()).filter(Boolean),
      ...orders.map(o => o.refAgentId?.toString()).filter(Boolean)
    ])];

    // Fetch agent details
    const agents = agentIds.length > 0 
      ? await usersCol
          .find({ _id: { $in: agentIds.map(id => new ObjectId(id)) } })
          .project({ fullName: 1, email: 1, phone: 1, commissionBalance: 1, commissionOnHold: 1, couponCode: 1 })
          .toArray()
      : [];

    const agentMap = new Map(agents.map(a => [a._id.toString(), a]));

    // Calculate summary stats
    const summary = {
      totalPending: 0,
      totalAvailable: 0,
      totalClaimed: 0,
      totalCancelled: 0,
      totalAmount: 0,
      ordersCount: orders.length
    };

    // Build commission records
    const commissions = orders.map(order => {
      const agentIdStr = (order.agentId || order.refAgentId)?.toString();
      const agent = agentIdStr ? agentMap.get(agentIdStr) : null;
      const amount = Number(order.commissionAmount || 0);
      const status = order.commissionStatus || 'pending';

      // Update summary
      summary.totalAmount += amount;
      if (status === 'pending') summary.totalPending += amount;
      if (status === 'available') summary.totalAvailable += amount;
      if (status === 'claimed') summary.totalClaimed += amount;
      if (status === 'cancelled') summary.totalCancelled += amount;

      return {
        orderId: order._id.toString(),
        orderDate: order.createdAt,
        orderType: order.orderType || 'regular',
        orderTotal: order.totalAmount || 0,
        commissionAmount: amount,
        commissionStatus: status,
        commissionAvailableAt: order.commissionAvailableAt,
        deliveredAt: order.deliveredAt,
        customerName: order.customer?.fullName || order.customerName || 'לא ידוע',
        customerPhone: order.customer?.phone || order.customerPhone || '',
        agent: agent ? {
          id: agent._id.toString(),
          fullName: agent.fullName,
          email: agent.email,
          phone: agent.phone,
          couponCode: agent.couponCode
        } : null
      };
    });

    // Get agents summary (grouped by agent)
    const agentsSummary = await ordersCol.aggregate([
      { $match: { commissionAmount: { $gt: 0 } } },
      {
        $group: {
          _id: { $ifNull: ['$agentId', '$refAgentId'] },
          totalCommissions: { $sum: '$commissionAmount' },
          pendingAmount: {
            $sum: {
              $cond: [{ $eq: ['$commissionStatus', 'pending'] }, '$commissionAmount', 0]
            }
          },
          availableAmount: {
            $sum: {
              $cond: [{ $eq: ['$commissionStatus', 'available'] }, '$commissionAmount', 0]
            }
          },
          claimedAmount: {
            $sum: {
              $cond: [{ $eq: ['$commissionStatus', 'claimed'] }, '$commissionAmount', 0]
            }
          },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { totalCommissions: -1 } }
    ]).toArray();

    // Enrich agents summary with user details
    const enrichedAgentsSummary = agentsSummary
      .filter(a => a._id)
      .map(a => {
        const agent = agentMap.get(a._id.toString());
        return {
          agentId: a._id.toString(),
          fullName: agent?.fullName || 'לא ידוע',
          email: agent?.email || '',
          phone: agent?.phone || '',
          couponCode: agent?.couponCode || '',
          currentBalance: agent?.commissionBalance || 0,
          onHold: agent?.commissionOnHold || 0,
          totalEarned: a.totalCommissions,
          pendingAmount: a.pendingAmount,
          availableAmount: a.availableAmount,
          claimedAmount: a.claimedAmount,
          ordersCount: a.ordersCount
        };
      });

    return NextResponse.json({
      ok: true,
      summary,
      commissions,
      agentsSummary: enrichedAgentsSummary,
      agents: agents.map(a => ({
        id: a._id.toString(),
        fullName: a.fullName,
        couponCode: a.couponCode
      }))
    });
  } catch (err) {
    console.error('ADMIN_COMMISSIONS_ERROR:', err);
    const status = err?.status || 500;
    const message = status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Server error';
    return NextResponse.json({ error: message }, { status });
  }
}
