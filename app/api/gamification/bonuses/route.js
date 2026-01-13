// app/api/gamification/bonuses/route.js
import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import BonusRule from '@/models/BonusRule';
import { verify } from '@/lib/auth/createToken';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
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
    const user = await getUserFromRequest(req);
    
    // Check if user is admin
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'business_admin')) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    await connectMongo();

    // Check if we should include inactive rules
    const url = new URL(req.url);
    const includeAll = url.searchParams.get('all') === '1';

    // Build query with tenant filter
    let query = includeAll ? {} : { isActive: true };
    
    // Multi-Tenant: Filter by tenant (Super Admin sees all)
    query = await withTenantQuery({ 
      user, 
      request: req, 
      query, 
      allowGlobal: isSuperAdmin(user) 
    });

    // Fetch bonus rules
    const bonusRules = await BonusRule.find(query).sort({ name: 1 }).lean();

    return NextResponse.json(bonusRules);
  } catch (error) {
    console.error('Error fetching bonus rules:', error);
    return NextResponse.json({ error: 'Failed to fetch bonus rules' }, { status: 500 });
  }
}

async function POSTHandler(req) {
  try {
    const user = await getUserFromRequest(req);
    
    // Check if user is admin
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'business_admin')) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { name, type, condition, reward, isActive = true } = body;

    // Validate required fields
    if (!name?.trim() || !type || !['sale', 'monthly'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid payload: name and type are required' },
        { status: 400 },
      );
    }

    // Validate condition based on type
    if (type === 'sale' && (!condition?.minSaleAmount || condition.minSaleAmount < 0)) {
      return NextResponse.json(
        { error: 'Sale bonus requires valid minSaleAmount' },
        { status: 400 },
      );
    }

    if (type === 'monthly' && (!condition?.everyNthDeal || condition.everyNthDeal < 1)) {
      return NextResponse.json(
        { error: 'Monthly bonus requires valid everyNthDeal' },
        { status: 400 },
      );
    }

    // Validate reward
    if (
      (!reward?.fixedAmount && !reward?.percentBoostPct) ||
      (reward.fixedAmount && reward.fixedAmount < 0) ||
      (reward.percentBoostPct && reward.percentBoostPct < 0)
    ) {
      return NextResponse.json({ error: 'Invalid reward configuration' }, { status: 400 });
    }

    await connectMongo();

    // Multi-Tenant: Get tenantId for the new rule
    const tenantId = await resolveTenantId(user, req);

    // Create new bonus rule with tenantId
    const bonusRule = await BonusRule.create({
      name: name.trim(),
      type,
      condition,
      reward,
      isActive,
      ...(tenantId && { tenantId: new ObjectId(tenantId) }),
    });

    return NextResponse.json(bonusRule, { status: 201 });
  } catch (error) {
    console.error('Error creating bonus rule:', error);
    return NextResponse.json({ error: 'Failed to create bonus rule' }, { status: 500 });
  }
}

export const GET = withErrorLogging(GETHandler);
export const POST = withErrorLogging(POSTHandler);
