import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

/**
 * GET /api/agent/stats?agentId=xxx
 * Get agent statistics - referrals, sales, commissions, clicks, etc.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return NextResponse.json({ ok: false, error: 'agentId required' }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection('users');
    const orders = db.collection('orders');
    const referralLogs = db.collection('referral_logs');

    // Get agent
    const agent = await users.findOne(
      { _id: new ObjectId(agentId), role: 'agent' },
      {
        projection: {
          referralsCount: 1,
          totalSales: 1,
          commissionBalance: 1,
          fullName: 1,
          email: 1,
        },
      },
    );

    if (!agent) {
      return NextResponse.json({ ok: false, error: 'agent not found' }, { status: 404 });
    }

    // Get total sales
    const totalSales = await orders.countDocuments({
      refAgentId: new ObjectId(agentId),
    });

    // Get total commission earned
    const commissionResult = await orders
      .aggregate([
        { $match: { refAgentId: new ObjectId(agentId) } },
        {
          $group: {
            _id: null,
            totalCommission: { $sum: '$commissionAmount' },
            totalOrderValue: { $sum: '$totalAmount' },
          },
        },
      ])
      .toArray();

    const totalCommission = commissionResult[0]?.totalCommission || 0;
    const totalOrderValue = commissionResult[0]?.totalOrderValue || 0;

    // Get clicks/views from referral logs
    const clicksResult = await referralLogs
      .aggregate([
        { $match: { agentId: new ObjectId(agentId) } },
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const clicks = clicksResult.find((r) => r._id === 'click')?.count || 0;
    const views = clicksResult.find((r) => r._id === 'view')?.count || 0;

    // Calculate conversion rate
    const conversionRate = clicks > 0 ? ((totalSales / clicks) * 100).toFixed(1) : 0;

    return NextResponse.json({
      ok: true,
      agentId: String(agent._id),
      agentName: agent.fullName,
      agentEmail: agent.email,
      stats: {
        totalReferrals: agent.referralsCount || 0,
        totalSales: totalSales || agent.totalSales || 0,
        commissionBalance: agent.commissionBalance || 0,
        totalCommissionEarned: totalCommission,
        totalOrderValue,
        clicks,
        views,
        conversionRate: parseFloat(conversionRate),
      },
    });
  } catch (error) {
    console.error('AGENT_STATS_ERROR:', error);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}
