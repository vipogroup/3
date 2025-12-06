import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

import { getDb } from '@/lib/db';
import { calcTotals } from '@/lib/orders/calc.js';
import { requireAuthApi } from '@/lib/auth/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';

async function ordersCollection() {
  const db = await getDb();
  const col = db.collection('orders');
  await col.createIndex({ agentId: 1 }).catch(() => {});
  await col.createIndex({ status: 1 }).catch(() => {});
  return col;
}

export async function GET(req) {
  try {
    const user = await requireAuthApi(req);
    const identifier = buildRateLimitKey(req, user.id);
    const rateLimit = rateLimiters.ordersList(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;
    const status = (searchParams.get('status') || '').trim();
    const q = (searchParams.get('q') || '').trim();

    const filter = {};
    if (user.role !== 'admin') filter.agentId = user.id;
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { 'customer.phone': { $regex: q, $options: 'i' } },
        { 'items.sku': { $regex: q, $options: 'i' } },
      ];
    }

    const col = await ordersCollection();
    const items = await col.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).toArray();
    const total = await col.countDocuments(filter);

    return NextResponse.json({ items, total, page, limit });
  } catch (e) {
    console.error(e);
    const status = e?.status || 500;
    const message =
      status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Server error';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req) {
  try {
    // 1) Auth
    const me = await requireAuthApi(req);
    const identifier = buildRateLimitKey(req, me.id);
    const rateLimit = rateLimiters.ordersCreate(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const db = await getDb();
    const usersCol = db.collection('users');
    const ordersCol = db.collection('orders');

    // 2) Parse body
    const body = await req.json();
    const { items: rawItems = [], totals: totalsPayload = {}, coupon: couponPayload = null, ...rest } =
      body || {};

    if (!Array.isArray(rawItems)) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 });
    }

    const items = rawItems.map((item = {}) => ({
      productId: item.productId,
      name: item.name ?? '',
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.unitPrice) || 0,
      totalPrice:
        Number(item.totalPrice) || Number(item.unitPrice || 0) * Number(item.quantity || 0),
      image: item.image || null,
      sku: item.sku || null,
    }));

    const { subtotal } = calcTotals(
      items.map((item) => ({ qty: item.quantity, price: item.unitPrice })),
    );

    let discountPercent = Number(totalsPayload.discountPercent) || 0;
    let discountAmount = Number(totalsPayload.discountAmount) || 0;
    let couponCode = null;
    let couponAgent = null;
    let commissionPercent = 0;
    let commissionAmount = 0;

    // 3) Read ref cookie (with safe fallback)
    let refSource = null;
    try {
      refSource = cookies().get('refSource')?.value || null;
    } catch {
      const raw = req.headers.get('cookie') || '';
      const m = raw.match(/(?:^|;\s*)refSource=([^;]+)/i);
      if (m) refSource = decodeURIComponent(m[1]);
    }

    // 4) Coupon validation (preferred over legacy referral cookie)
    if (couponPayload?.code) {
      const couponCodeInput = String(couponPayload.code).trim().toLowerCase();
      if (!couponCodeInput) {
        return NextResponse.json({ error: 'invalid_coupon' }, { status: 400 });
      }

      const couponQuery = {
        couponCode: couponCodeInput,
        role: 'agent',
        couponStatus: 'active',
      };

      if (couponPayload.agentId && ObjectId.isValid(couponPayload.agentId)) {
        couponQuery._id = new ObjectId(couponPayload.agentId);
      }

      couponAgent = await usersCol.findOne(couponQuery, {
        projection: {
          couponCode: 1,
          discountPercent: 1,
          commissionPercent: 1,
          fullName: 1,
        },
      });

      if (!couponAgent) {
        return NextResponse.json({ error: 'invalid_coupon' }, { status: 400 });
      }

      couponCode = couponAgent.couponCode;
      discountPercent = Number(couponAgent.discountPercent) || 0;
      discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
      commissionPercent = Number(couponAgent.commissionPercent) || 0;
      const baseForCommission = Math.max(0, subtotal - discountAmount);
      commissionAmount = Number(((baseForCommission * commissionPercent) / 100).toFixed(2));

      refSource = couponCode;
    }

    const subtotalDiscount =
      discountAmount || Number(((subtotal * discountPercent) / 100).toFixed(2));
    discountAmount = Math.min(subtotal, subtotalDiscount);
    const totalAmount = Math.max(0, subtotal - discountAmount);

    // 5) Legacy referral fallback (only when no coupon was provided)
    let refAgentId = null;
    let finalCommissionAmount = commissionAmount;

    if (!couponAgent) {
      let refAgent = null;
      if (refSource) {
        refAgent = await usersCol.findOne({ referralId: refSource, role: 'agent' });
        if (!refAgent) {
          refAgent = await usersCol.findOne({ referralCode: refSource, role: 'agent' });
        }
        if (!refAgent && ObjectId.isValid(refSource)) {
          const byId = await usersCol.findOne({ _id: new ObjectId(refSource) });
          if (byId?.role === 'agent') refAgent = byId;
        }
      }

      if (refAgent && String(refAgent._id) !== String(me._id)) {
        refAgentId = refAgent._id;
        finalCommissionAmount = 2;
      } else {
        refSource = null;
        finalCommissionAmount = 0;
      }
    } else {
      refAgentId = couponAgent._id;
      finalCommissionAmount = commissionAmount;
    }

    // 6) Create order (Native Driver)
    const orderDoc = {
      items,
      totals: {
        subtotal,
        discountPercent,
        discountAmount,
        totalAmount,
      },
      totalAmount,
      discountAmount,
      createdBy: me._id,
      status: 'pending',
      commissionSettled: false,
      refSource,
      refAgentId,
      commissionAmount: finalCommissionAmount,
      appliedCouponCode: couponCode,
      agentId: couponAgent?._id ?? refAgentId,
      couponCommissionPercent: commissionPercent,
      commissionPercent,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...rest,
    };

    const result = await ordersCol.insertOne(orderDoc);
    const orderId = result.insertedId;

    // Return both keys for compatibility with various tests
    return NextResponse.json(
      {
        ok: true,
        orderId,
        totals: orderDoc.totals,
        discountAmount: orderDoc.discountAmount,
        couponCode,
        refSource,
        refAgentId,
        commissionAmount: finalCommissionAmount,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error('Create order error:', err);
    const status = err?.status || 500;
    const message =
      status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Server error';
    return NextResponse.json({ error: message }, { status });
  }
}
