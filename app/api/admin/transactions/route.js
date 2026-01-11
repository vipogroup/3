import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getDb } from '@/lib/db';
import { requireAdminApi } from '@/lib/auth/server';
import { NextResponse } from 'next/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';
import { isSuperAdmin } from '@/lib/tenant/tenantMiddleware';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/transactions
 * Admin-only: Get all transactions with filters
 */
async function GETHandler(req) {
  try {
    if (process.env.NEXT_PHASE === 'phase-export') {
      return NextResponse.json({ success: false, skip: true });
    }

    await getDb();

    // Verify admin access
    const admin = await requireAdminApi(req);
    const identifier = buildRateLimitKey(req, admin.id);
    const rateLimit = rateLimiters.admin(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // optional
    const since = searchParams.get('since'); // ISO optional

    const db = await getDb();
    const orders = db.collection('orders');

    // Build query - read from orders collection
    const query = {};
    
    // Multi-Tenant: Filter by tenantId for business admins
    if (!isSuperAdmin(admin) && admin.tenantId) {
      query.tenantId = new ObjectId(admin.tenantId);
    }
    
    if (status) query.status = status;
    if (since) query.createdAt = { $gte: new Date(since) };

    // Get orders as transactions
    const items = await orders.find(query).sort({ createdAt: -1 }).toArray();

    // Get user details (createdBy and agentId)
    const userIds = [...new Set([
      ...items.map((t) => t.createdBy).filter(Boolean),
      ...items.map((t) => t.agentId).filter(Boolean),
    ])];

    const users = await db
      .collection('users')
      .find({ _id: { $in: userIds } })
      .project({ fullName: 1, email: 1, role: 1, phone: 1 })
      .toArray();

    // Create user map
    const userMap = {};
    users.forEach((u) => {
      userMap[String(u._id)] = u;
    });

    // Enrich orders as transactions
    const enrichedItems = items.map((order) => {
      const firstItem = order.items?.[0] || {};
      return {
        _id: String(order._id),
        userId: order.createdBy ? String(order.createdBy) : null,
        user: order.createdBy ? userMap[String(order.createdBy)] : null,
        agentId: order.agentId ? String(order.agentId) : null,
        agent: order.agentId ? userMap[String(order.agentId)] : null,
        productId: firstItem.productId ? String(firstItem.productId) : null,
        product: firstItem ? { title: firstItem.name, price: firstItem.unitPrice || firstItem.price } : null,
        amount: order.totalAmount || 0,
        status: order.status,
        itemsCount: order.items?.length || 0,
        customer: order.customer || { fullName: order.customerName, phone: order.customerPhone },
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    });

    // Calculate summary
    const totalAmount = items.reduce((sum, t) => sum + (t.totalAmount || 0), 0);

    return NextResponse.json({
      ok: true,
      count: items.length,
      totalAmount,
      items: enrichedItems,
    });
  } catch (err) {
    console.error('ADMIN_TRANSACTIONS_ERROR:', err);

    const status = err?.status || 500;
    const message =
      status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Server error';
    return NextResponse.json({ error: message }, { status });
  }
}

export const GET = withErrorLogging(GETHandler);
