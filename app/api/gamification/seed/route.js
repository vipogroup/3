// app/api/gamification/seed/route.js
import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import LevelRule from '@/models/LevelRule';
import BonusRule from '@/models/BonusRule';
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

// Check if user is admin
async function isAdmin(req) {
  const user = await getUserFromRequest(req);
  return user && user.role === 'admin';
}

export async function POST(req) {
  try {
    // Check if user is admin
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    await connectMongo();

    // Check if levels already exist
    const existingLevels = await LevelRule.countDocuments();
    const existingBonuses = await BonusRule.countDocuments();

    const results = {
      levels: { created: 0 },
      bonuses: { created: 0 },
    };

    // Seed default levels if none exist
    if (existingLevels === 0) {
      const defaultLevels = [
        {
          name: 'Bronze',
          minSalesAmount: 10000,
          minDeals: 3,
          commissionBoostPct: 0.005,
          badgeColor: 'bronze',
          sortOrder: 1,
          isActive: true,
        },
        {
          name: 'Silver',
          minSalesAmount: 30000,
          minDeals: 6,
          commissionBoostPct: 0.01,
          badgeColor: 'silver',
          sortOrder: 2,
          isActive: true,
        },
        {
          name: 'Gold',
          minSalesAmount: 60000,
          minDeals: 12,
          commissionBoostPct: 0.015,
          badgeColor: 'gold',
          sortOrder: 3,
          isActive: true,
        },
        {
          name: 'Platinum',
          minSalesAmount: 100000,
          minDeals: 20,
          commissionBoostPct: 0.02,
          badgeColor: 'platinum',
          sortOrder: 4,
          isActive: true,
        },
      ];

      await LevelRule.insertMany(defaultLevels);
      results.levels.created = defaultLevels.length;
    }

    // Seed default bonuses if none exist
    if (existingBonuses === 0) {
      const defaultBonuses = [
        {
          name: 'BigDeal',
          type: 'sale',
          condition: {
            minSaleAmount: 15000,
          },
          reward: {
            percentBoostPct: 0.005,
          },
          isActive: true,
        },
        {
          name: 'Streak5',
          type: 'monthly',
          condition: {
            everyNthDeal: 5,
          },
          reward: {
            fixedAmount: 250,
          },
          isActive: true,
        },
      ];

      await BonusRule.insertMany(defaultBonuses);
      results.bonuses.created = defaultBonuses.length;
    }

    return NextResponse.json({
      success: true,
      message: 'Default gamification rules seeded successfully',
      results,
    });
  } catch (error) {
    console.error('Error seeding gamification rules:', error);
    return NextResponse.json({ error: 'Failed to seed gamification rules' }, { status: 500 });
  }
}
