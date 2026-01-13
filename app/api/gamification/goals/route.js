// app/api/gamification/goals/route.js
import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectMongo } from '@/lib/mongoose';
import AgentGoal from '@/models/AgentGoal';
import { verify } from '@/lib/auth/createToken';
import { getDb } from '@/lib/db';
import { 
  isSuperAdmin, 
  withTenantQuery,
  resolveTenantId
} from '@/lib/tenant/tenantMiddleware';

export const dynamic = 'force-dynamic';

// Helper function to get user from request
async function getUserFromRequest(req) {
  const token = req.cookies.get('token')?.value || req.cookies.get('auth_token')?.value || '';
  const payload = verify(token);
  if (!payload || !payload.userId || !payload.role) {
    return null;
  }
  
  // Get full user with tenantId
  const db = await getDb();
  const user = await db.collection('users').findOne({ _id: new ObjectId(payload.userId) });
  return user;
}

async function GETHandler(req) {
  try {
    // Get user
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();

    const url = new URL(req.url);
    const month = url.searchParams.get('month') ? parseInt(url.searchParams.get('month')) : null;
    const year = url.searchParams.get('year') ? parseInt(url.searchParams.get('year')) : null;
    const agentId = url.searchParams.get('agentId');
    const includeAll = url.searchParams.get('all') === '1';

    // Build query
    const query = {};

    // Filter by isActive unless all=1
    if (!includeAll) {
      query.isActive = true;
    }

    // Filter by month/year if provided
    if (month && month >= 1 && month <= 12) {
      query.month = month;
    }

    if (year && year >= 2020) {
      query.year = year;
    }

    // Filter by agentId
    if (agentId === 'self') {
      // User can only see their own goals
      query.agentId = new ObjectId(user.userId);
    } else if (agentId) {
      // Admin/Business Admin can see any agent's goals (within their tenant)
      if (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'business_admin') {
        return NextResponse.json(
          { error: "Forbidden: Admin access required to view other agents' goals" },
          { status: 403 },
        );
      }
      query.agentId = new ObjectId(agentId);
    } else if (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'business_admin') {
      // Non-admin users can only see their own goals
      query.agentId = new ObjectId(user.userId);
    }

    // Multi-Tenant: Add tenant filter (Super Admin sees all)
    const tenantQuery = await withTenantQuery({ 
      user, 
      request: req, 
      query, 
      allowGlobal: isSuperAdmin(user) 
    });

    // Fetch goals
    const goals = await AgentGoal.find(tenantQuery)
      .sort({ year: -1, month: -1 })
      .populate('agentId', 'fullName')
      .lean();

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

async function POSTHandler(req) {
  try {
    const user = await getUserFromRequest(req);
    
    // Check if user is admin
    if (!user || (user.role !== 'admin' && user.role !== 'business_admin')) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const {
      agentId,
      month,
      year,
      targetSalesAmount,
      targetDeals,
      bonusOnHit,
      isActive = true,
    } = body;

    // Validate required fields
    if (
      !agentId ||
      !month ||
      month < 1 ||
      month > 12 ||
      !year ||
      year < 2020 ||
      typeof targetSalesAmount !== 'number' ||
      targetSalesAmount < 0 ||
      typeof targetDeals !== 'number' ||
      targetDeals < 0
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Validate bonusOnHit
    if (
      !bonusOnHit ||
      ((!bonusOnHit.fixedAmount || bonusOnHit.fixedAmount < 0) &&
        (!bonusOnHit.percentBoostPct || bonusOnHit.percentBoostPct < 0))
    ) {
      return NextResponse.json({ error: 'Invalid bonus configuration' }, { status: 400 });
    }

    await connectMongo();

    // Check if a goal already exists for this agent/month/year
    const existingGoal = await AgentGoal.findOne({
      agentId,
      month,
      year,
    });

    if (existingGoal) {
      return NextResponse.json(
        {
          error: 'A goal already exists for this agent in the specified month/year',
        },
        { status: 409 },
      );
    }

    // Multi-Tenant: Get tenantId for the new goal
    const tenantId = await resolveTenantId(user, req);

    // Create new goal with tenantId
    const goal = await AgentGoal.create({
      agentId,
      month,
      year,
      targetSalesAmount,
      targetDeals,
      bonusOnHit,
      isActive,
      ...(tenantId && { tenantId: new ObjectId(tenantId) }),
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}

export const GET = withErrorLogging(GETHandler);
export const POST = withErrorLogging(POSTHandler);
