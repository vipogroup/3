// app/api/agents/[id]/stats/route.js
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectMongo } from '@/lib/mongoose';
import { getDb } from '@/lib/db';
import Sale from '@/models/Sale';
import LevelRule from '@/models/LevelRule';
import { verify } from '@/lib/auth/createToken';

export const dynamic = 'force-dynamic';

// Helper function to get user from request
async function getUserFromRequest(req) {
  const token = req.cookies.get('token')?.value || '';
  const payload = verify(token);
  if (!payload || !payload.userId || !payload.role) {
    return null;
  }
  return {
    userId: payload.userId,
    role: payload.role,
  };
}

export async function GET(req, { params }) {
  try {
    // Get user
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if user has permission to view these stats
    if (id !== user.userId && user.role !== 'admin' && user.role !== 'business_admin') {
      return NextResponse.json(
        { error: 'Forbidden: You can only view your own stats' },
        { status: 403 },
      );
    }

    await connectMongo();

    // Get date range from query params
    const url = new URL(req.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    // Build date range filter
    const dateFilter = {};
    if (from) {
      dateFilter.$gte = new Date(`${from}T00:00:00.000Z`);
    }
    if (to) {
      dateFilter.$lte = new Date(`${to}T23:59:59.999Z`);
    }

    // Build query
    const query = { agentId: new ObjectId(id) };
    if (Object.keys(dateFilter).length > 0) {
      query.createdAt = dateFilter;
    }

    // Fetch sales
    const sales = await Sale.find(query).lean();

    // Calculate aggregates
    const totalSales = sales.reduce((sum, sale) => sum + sale.salePrice, 0);
    const totalCommission = sales.reduce((sum, sale) => sum + sale.commission, 0);
    const count = sales.length;

    // Get current month stats for level determination
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const monthQuery = {
      agentId: new ObjectId(id),
      createdAt: {
        $gte: firstDayOfMonth,
        $lte: now,
      },
    };

    const monthSales = await Sale.find(monthQuery).lean();
    const amountMTD = monthSales.reduce((sum, sale) => sum + sale.salePrice, 0);
    const dealsMTD = monthSales.length;

    // Determine current level
    const levelRules = await LevelRule.find({ isActive: true }).sort({ sortOrder: -1 }).lean();

    let currentLevel = null;
    for (const rule of levelRules) {
      if (amountMTD >= rule.minSalesAmount || dealsMTD >= rule.minDeals) {
        currentLevel = {
          name: rule.name,
          boostPct: rule.commissionBoostPct,
          badgeColor: rule.badgeColor,
        };
        break;
      }
    }

    // Find next level (if any)
    let nextLevel = null;
    if (currentLevel) {
      // Find the next higher level after current level
      const currentLevelIndex = levelRules.findIndex((rule) => rule.name === currentLevel.name);
      if (currentLevelIndex > 0) {
        const nextLevelRule = levelRules[currentLevelIndex - 1]; // Higher levels have lower indices due to reverse sort
        nextLevel = {
          name: nextLevelRule.name,
          minSalesAmount: nextLevelRule.minSalesAmount,
          minDeals: nextLevelRule.minDeals,
          boostPct: nextLevelRule.commissionBoostPct,
          badgeColor: nextLevelRule.badgeColor,
        };
      }
    } else if (levelRules.length > 0) {
      // If no current level, next level is the lowest one
      const lowestLevel = levelRules[levelRules.length - 1]; // Lowest level has highest index due to reverse sort
      nextLevel = {
        name: lowestLevel.name,
        minSalesAmount: lowestLevel.minSalesAmount,
        minDeals: lowestLevel.minDeals,
        boostPct: lowestLevel.commissionBoostPct,
        badgeColor: lowestLevel.badgeColor,
      };
    }

    // Fetch visits data from MongoDB
    const db = await getDb();
    const visitsCollection = db.collection('visits');
    const usersCollection = db.collection('users');

    // Get all visits for this agent
    const visits = await visitsCollection
      .find({ agentId: new ObjectId(id) })
      .sort({ ts: -1 })
      .limit(100)
      .toArray();

    const totalVisits = visits.length;

    // Get referrals (users referred by this agent)
    const referrals = await usersCollection
      .find({ referredBy: new ObjectId(id) }, { projection: { passwordHash: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    const totalReferrals = referrals.length;

    // Calculate product stats
    const productStatsMap = {};

    visits.forEach((visit) => {
      const productId = visit.productId || 'unknown';
      if (!productStatsMap[productId]) {
        productStatsMap[productId] = {
          productId,
          productName: visit.productName || 'לא ידוע',
          visits: 0,
          purchases: 0,
          totalRevenue: 0,
        };
      }
      productStatsMap[productId].visits++;
    });

    // Add purchase data to product stats
    sales.forEach((sale) => {
      const productId = sale.productId || 'unknown';
      if (productStatsMap[productId]) {
        productStatsMap[productId].purchases++;
        productStatsMap[productId].totalRevenue += sale.salePrice;
      }
    });

    const productStats = Object.values(productStatsMap);

    return NextResponse.json({
      totalSales,
      totalCommission,
      count,
      totalVisits,
      totalReferrals,
      currentLevel,
      nextLevel,
      progress: {
        amountMTD,
        dealsMTD,
      },
      visits: visits.map((v) => ({
        ts: v.ts,
        productId: v.productId,
        productName: v.productName || 'לא ידוע',
        ip: v.ip,
        ua: v.ua,
      })),
      referrals: referrals.map((r) => ({
        _id: r._id,
        fullName: r.fullName,
        email: r.email,
        phone: r.phone,
        createdAt: r.createdAt,
      })),
      sales: sales.map((s) => ({
        _id: s._id,
        customerName: s.customerName,
        salePrice: s.salePrice,
        commission: s.commission,
        status: s.status,
        createdAt: s.createdAt,
      })),
      productStats,
    });
  } catch (error) {
    console.error('Error fetching agent stats:', error);
    return NextResponse.json({ error: 'Failed to fetch agent stats' }, { status: 500 });
  }
}
