// app/api/gamification/levels/route.js
import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import LevelRule from '@/models/LevelRule';
import { verify } from '@/lib/auth/createToken';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { 
  getCurrentTenant, 
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

// Check if user is admin
async function isAdmin(req) {
  const user = await getUserFromRequest(req);
  return user && (user.role === 'admin' || user.role === 'business_admin');
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

    // Fetch level rules
    const levelRules = await LevelRule.find(query).sort({ sortOrder: 1 }).lean();

    return NextResponse.json(levelRules);
  } catch (error) {
    console.error('Error fetching level rules:', error);
    return NextResponse.json({ error: 'Failed to fetch level rules' }, { status: 500 });
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
    const {
      name,
      minSalesAmount,
      minDeals,
      commissionBoostPct,
      badgeColor,
      sortOrder,
      isActive = true,
    } = body;

    // Validate required fields
    if (
      !name?.trim() ||
      typeof minSalesAmount !== 'number' ||
      minSalesAmount < 0 ||
      typeof minDeals !== 'number' ||
      minDeals < 0 ||
      typeof commissionBoostPct !== 'number' ||
      commissionBoostPct < 0 ||
      !badgeColor ||
      !['bronze', 'silver', 'gold', 'platinum'].includes(badgeColor) ||
      typeof sortOrder !== 'number'
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    await connectMongo();

    // Multi-Tenant: Get tenantId for the new rule
    const tenantId = await resolveTenantId(user, req);

    // Create new level rule with tenantId
    const levelRule = await LevelRule.create({
      name: name.trim(),
      minSalesAmount,
      minDeals,
      commissionBoostPct,
      badgeColor,
      sortOrder,
      isActive,
      ...(tenantId && { tenantId: new ObjectId(tenantId) }),
    });

    return NextResponse.json(levelRule, { status: 201 });
  } catch (error) {
    console.error('Error creating level rule:', error);
    return NextResponse.json({ error: 'Failed to create level rule' }, { status: 500 });
  }
}

export const GET = withErrorLogging(GETHandler);
export const POST = withErrorLogging(POSTHandler);
