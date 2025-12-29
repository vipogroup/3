export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

import { getDb } from '@/lib/db';
import { calcTotals } from '@/lib/orders/calc.js';
import { requireAuthApi } from '@/lib/auth/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';
import { sendTemplateNotification } from '@/lib/notifications/dispatcher';
import { pushToUsers } from '@/lib/pushSender';

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
    const criteria = [];

    if (user.role === 'admin') {
      // no additional filter
    } else if (user.role === 'agent') {
      if (!ObjectId.isValid(user.id)) {
        return NextResponse.json({ error: 'invalid_agent_id' }, { status: 400 });
      }
      const agentObjectId = new ObjectId(user.id);
      criteria.push({ $or: [{ agentId: agentObjectId }, { refAgentId: agentObjectId }] });
    } else {
      const customerCriteria = [];
      if (ObjectId.isValid(user.id)) {
        const objectId = new ObjectId(user.id);
        customerCriteria.push({ createdBy: objectId });
      }
      customerCriteria.push({ createdBy: user.id });
      if (user.email) {
        customerCriteria.push({ 'customer.email': user.email });
      }
      criteria.push({ $or: customerCriteria });
    }
    if (status) criteria.push({ status });
    if (q) {
      criteria.push({
        $or: [
        { 'customer.phone': { $regex: q, $options: 'i' } },
        { 'items.sku': { $regex: q, $options: 'i' } },
        ],
      });
    }
    if (criteria.length > 0) {
      filter.$and = criteria;
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
    const productsCol = db.collection('products');

    // 2) Parse body
    const body = await req.json();
    const { items: rawItems = [], totals: totalsPayload = {}, coupon: couponPayload = null, ...rest } =
      body || {};

    if (!Array.isArray(rawItems)) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 });
    }

    if (rawItems.length === 0) {
      return NextResponse.json({ error: 'cart_empty' }, { status: 400 });
    }

    const parsedItems = [];
    const objectIdKeys = [];
    const slugKeys = new Set();
    for (const item of rawItems) {
      const productIdInput = item?.productId || item?._id;
      const quantity = Number(item?.quantity) || 0;
      if (!productIdInput) {
        return NextResponse.json({ error: 'invalid_product_id' }, { status: 400 });
      }
      if (quantity <= 0) {
        return NextResponse.json({ error: 'invalid_quantity' }, { status: 400 });
      }

      if (ObjectId.isValid(productIdInput)) {
        const objectId = new ObjectId(productIdInput);
        parsedItems.push({ lookup: { type: 'objectId', value: objectId }, quantity });
        objectIdKeys.push(objectId);
      } else {
        const slug = String(productIdInput).trim();
        if (!slug) {
          return NextResponse.json({ error: 'invalid_product_id' }, { status: 400 });
        }
        parsedItems.push({ lookup: { type: 'slug', value: slug }, quantity });
        slugKeys.add(slug);
      }
    }

    const projection = {
      name: 1,
      price: 1,
      images: 1,
      sku: 1,
      slug: 1,
      legacyId: 1,
    };

    const [docsById, docsBySlug] = await Promise.all([
      objectIdKeys.length
        ? productsCol.find({ _id: { $in: objectIdKeys } }).project(projection).toArray()
        : [],
      slugKeys.size
        ? productsCol
            .find({
              $or: [
                { slug: { $in: Array.from(slugKeys) } },
                { legacyId: { $in: Array.from(slugKeys) } },
              ],
            })
            .project(projection)
            .toArray()
        : [],
    ]);

    const productMapById = new Map();
    docsById.forEach((doc) => productMapById.set(doc._id.toHexString(), doc));

    const buildStringKey = (value) => String(value).trim().toLowerCase();
    const productMapBySlug = new Map();
    docsBySlug.forEach((doc) => {
      if (doc.slug) {
        productMapBySlug.set(buildStringKey(doc.slug), doc);
      }
      if (doc.legacyId) {
        productMapBySlug.set(buildStringKey(doc.legacyId), doc);
      }
    });

    const missingProducts = [];
    const items = parsedItems.map(({ lookup, quantity }) => {
      let product;
      if (lookup.type === 'objectId') {
        product = productMapById.get(lookup.value.toHexString());
      } else {
        const normalizedKey = buildStringKey(lookup.value);
        product =
          productMapBySlug.get(normalizedKey) ||
          productMapBySlug.get(lookup.value) ||
          null;
      }

      if (!product) {
        missingProducts.push(lookup.value);
        return null;
      }

      const unitPrice = Number(product?.price) || 0;
      return {
        productId: product._id,
        name: product?.name || 'Product',
        quantity,
        unitPrice,
        totalPrice: Number((unitPrice * quantity).toFixed(2)),
        image: product?.images?.[0] || null,
        sku: product?.sku || null,
        slug: product?.slug || null,
      };
    });

    if (missingProducts.length > 0) {
      return NextResponse.json({ error: 'product_not_found', products: missingProducts }, { status: 400 });
    }

    const { subtotal } = calcTotals(items.map((item) => ({ qty: item.quantity, price: item.unitPrice })));

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
        role: 'agent',
        couponStatus: 'active',
        $expr: {
          $eq: [{ $toLower: '$couponCode' }, couponCodeInput],
        },
      };

      if (couponPayload.agentId && ObjectId.isValid(couponPayload.agentId)) {
        couponQuery._id = new ObjectId(couponPayload.agentId);
      }

      couponAgent = await usersCol.findOne(couponQuery, {
        projection: {
          _id: 1,
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
        refAgent = await usersCol.findOne(
          { referralId: refSource, role: 'agent' },
          { projection: { _id: 1, commissionPercent: 1 } }
        );
        if (!refAgent) {
          refAgent = await usersCol.findOne(
            { referralCode: refSource, role: 'agent' },
            { projection: { _id: 1, commissionPercent: 1 } }
          );
        }
        if (!refAgent && ObjectId.isValid(refSource)) {
          const byId = await usersCol.findOne(
            { _id: new ObjectId(refSource) },
            { projection: { _id: 1, role: 1, commissionPercent: 1 } }
          );
          if (byId?.role === 'agent') refAgent = byId;
        }
      }

      if (refAgent && String(refAgent._id) !== String(me._id)) {
        refAgentId = refAgent._id;
        const agentCommissionPercent = Number(refAgent.commissionPercent) || 12;
        finalCommissionAmount = Number(((totalAmount * agentCommissionPercent) / 100).toFixed(2));
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

    // Send notifications
    try {
      // 1. Admin notification about new order
      await sendTemplateNotification({
        templateType: 'order_new',
        variables: {
          order_id: String(orderId),
          customer_name: String(rest?.customer?.name || rest?.customerName || me?.fullName || 'לקוח'),
          total_amount: totalAmount.toLocaleString('he-IL'),
        },
        audienceRoles: ['admin'],
        payloadOverrides: {
          url: `/admin/orders/${orderId}`,
          data: {
            orderId: String(orderId),
            totalAmount,
            items: items.length,
          },
        },
      });

      // 2. Order confirmation to customer
      await pushToUsers([String(me._id)], {
        title: 'ההזמנה שלך התקבלה!',
        body: `תודה על הרכישה! סכום: ${totalAmount.toLocaleString('he-IL')} ₪`,
        icon: '/icons/192.png',
        url: `/orders/${orderId}`,
        data: { type: 'order_confirmation', orderId: String(orderId) },
      });

      // 3. If order has agent referral - notify agent about commission
      if (refAgentId && finalCommissionAmount > 0) {
        await pushToUsers([String(refAgentId)], {
          title: 'עמלה חדשה!',
          body: `בוצעה רכישה דרך הקופון שלך. עמלה: ${finalCommissionAmount.toLocaleString('he-IL')} ₪`,
          icon: '/icons/192.png',
          url: '/agent',
          data: { type: 'agent_commission_awarded', orderId: String(orderId), commission: finalCommissionAmount },
        });

        // 4. Admin notification about agent sale
        await sendTemplateNotification({
          templateType: 'admin_agent_sale',
          variables: {
            agent_name: couponAgent?.fullName || 'סוכן',
            order_id: String(orderId),
          },
          audienceRoles: ['admin'],
          payloadOverrides: {
            url: `/admin/orders/${orderId}`,
            data: {
              orderId: String(orderId),
              agentId: String(refAgentId),
              commission: finalCommissionAmount,
            },
          },
        });
      }
    } catch (notifyErr) {
      console.warn('ORDER_PUSH_NOTIFY_FAILED', notifyErr?.message || notifyErr);
    }

    if (refAgentId && finalCommissionAmount) {
      try {
        await usersCol.updateOne(
          { _id: refAgentId },
          {
            $inc: {
              commissionBalance: finalCommissionAmount,
              totalSales: 1,
            },
            $set: { updatedAt: new Date() },
          },
        );
      } catch (commissionErr) {
        console.error('ORDER_COMMISSION_UPDATE_FAILED', {
          orderId: String(orderId),
          agentId: String(refAgentId),
          error: commissionErr?.message,
        });
      }
    }

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
