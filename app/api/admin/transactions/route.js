export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import Transaction from '@/models/Transaction';
import { getDb } from '@/lib/db';
import { requireAdminApi } from '@/lib/auth/server';
import { NextResponse } from 'next/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';

/**
 * GET /api/admin/transactions
 * Admin-only: Get all transactions with filters
 */
export async function GET(req) {
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
    const transactions = db.collection('transactions');

    // Build query
    const query = {};
    if (status) query.status = status;
    if (since) query.createdAt = { $gte: new Date(since) };

    // Get transactions
    const items = await transactions.find(query).sort({ createdAt: -1 }).toArray();

    // Get user and product details
    const userIds = [...new Set(items.map((t) => t.userId).filter(Boolean))];
    const productIds = [...new Set(items.map((t) => t.productId).filter(Boolean))];

    const users = await db
      .collection('users')
      .find({ _id: { $in: userIds } })
      .project({ fullName: 1, email: 1, role: 1 })
      .toArray();

    const products = await db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .project({ title: 1, price: 1, slug: 1 })
      .toArray();

    // Create maps
    const userMap = {};
    users.forEach((u) => {
      userMap[String(u._id)] = u;
    });

    const productMap = {};
    products.forEach((p) => {
      productMap[String(p._id)] = p;
    });

    // Enrich transactions
    const enrichedItems = items.map((t) => ({
      _id: String(t._id),
      userId: String(t.userId),
      user: userMap[String(t.userId)] || null,
      productId: String(t.productId),
      product: productMap[String(t.productId)] || null,
      amount: t.amount,
      status: t.status,
      referredBy: t.referredBy ? String(t.referredBy) : null,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    // Calculate summary
    const totalAmount = items.reduce((sum, t) => sum + (t.amount || 0), 0);

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

