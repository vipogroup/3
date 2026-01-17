import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

import { sendTemplateNotification } from '@/lib/notifications/dispatcher';
import { pushToUsers } from '@/lib/pushSender';
import { requireAuthApi } from '@/lib/auth/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';

/**
 * @deprecated Use POST /api/orders instead - this endpoint will be removed in future versions
 */
async function POSTHandler(req) {
  try {
    // Auth + Rate Limit
    const me = await requireAuthApi(req);
    const identifier = buildRateLimitKey(req, me.id);
    const rateLimit = rateLimiters.ordersCreate(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const {
      productId,
      quantity = 1,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      paymentMethod = 'credit_card',
    } = body;

    // Validation
    if (!productId || !customerName || (!customerPhone && !customerEmail)) {
      return NextResponse.json({ ok: false, error: 'missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    const products = db.collection('products');
    const orders = db.collection('orders');
    const users = db.collection('users');

    // Get product
    const product = await products.findOne({ _id: new ObjectId(productId) });
    if (!product) {
      return NextResponse.json({ ok: false, error: 'product not found' }, { status: 404 });
    }

    // Check stock for online products
    if (product.type === 'online' && product.stockCount < quantity) {
      return NextResponse.json({ ok: false, error: 'insufficient stock' }, { status: 400 });
    }

    // Calculate total
    const itemPrice = product.price || 0;
    const totalAmount = itemPrice * quantity;
    const commissionRate = 0.1; // 10% commission
    const commissionAmount = totalAmount * commissionRate;

    // Get referrer ID from cookie
    const cookieStore = cookies();
    const refSource = cookieStore.get('refSource')?.value || null;
    let refAgentId = null;

    if (refSource) {
      try {
        const agentObjectId = new ObjectId(refSource);
        const agent = await users.findOne(
          { _id: agentObjectId, role: 'agent' },
          { projection: { _id: 1 } },
        );
        if (agent) {
          refAgentId = agent._id;
        }
      } catch (err) {
        console.log('Invalid refSource:', refSource);
      }
    }

    // Create order document
    const now = new Date();
    const orderType = 'regular'; // This route is for regular orders
    
    // Commission hold period: 30 days for regular purchases
    const holdDays = 30;
    const commissionAvailableAt = new Date(now.getTime() + holdDays * 24 * 60 * 60 * 1000);
    const finalCommissionAmount = refAgentId ? commissionAmount : 0;
    
    // Multi-Tenant: Get tenantId from user or product
    const tenantId = me.tenantId || product.tenantId || null;
    
    const orderDoc = {
      productId: new ObjectId(productId),
      productName: product.name,
      quantity,
      itemPrice,
      totalAmount,
      customerName,
      ...(tenantId && { tenantId: new ObjectId(tenantId) }),
      customerPhone: customerPhone || null,
      customerEmail: customerEmail || null,
      shippingAddress: shippingAddress || null,
      paymentMethod,
      status: 'pending',
      orderType,
      commissionStatus: 'pending',
      commissionSettled: false,
      commissionAvailableAt: finalCommissionAmount > 0 ? commissionAvailableAt : null,
      refSource: refSource || null,
      refAgentId: refAgentId || null,
      commissionAmount: finalCommissionAmount,
      createdAt: now,
      updatedAt: now,
    };

    // Insert order
    const result = await orders.insertOne(orderDoc);
    const orderId = result.insertedId;

    // Send notifications
    try {
      // 1. Admin notification about new order
      // Multi-Tenant: If order has tenantId, send to business_admin of that tenant only
      await sendTemplateNotification({
        templateType: 'order_new',
        variables: {
          order_id: String(orderId),
          customer_name: customerName || 'לקוח',
          total_amount: totalAmount.toLocaleString('he-IL'),
        },
        audienceRoles: tenantId ? ['business_admin'] : ['admin'],
        payloadOverrides: {
          url: tenantId ? `/business/orders` : `/admin/orders/${orderId}`,
          data: {
            orderId: String(orderId),
            totalAmount,
            customerName,
          },
        },
        tenantId: tenantId ? String(tenantId) : null,
      });

      // 2. Order confirmation to customer
      await sendTemplateNotification({
        templateType: 'order_confirmation',
        variables: {
          order_id: String(orderId),
        },
        audienceUserIds: [String(me.id)],
        payloadOverrides: {
          url: `/orders/${orderId}`,
          data: { type: 'order_confirmation', orderId: String(orderId) },
        },
        tenantId: tenantId ? String(tenantId) : null,
      });

      // 3. If order has agent referral - notify agent
      if (refAgentId && commissionAmount > 0) {
        // קבלת שם העסק להתראה
        let businessNameText = '';
        if (tenantId) {
          try {
            const tenantDoc = await db.collection('tenants').findOne(
              { _id: new ObjectId(tenantId) },
              { projection: { name: 1 } }
            );
            if (tenantDoc?.name) {
              businessNameText = ` בעסק "${tenantDoc.name}"`;
            }
          } catch (e) {
            console.warn('Failed to get tenant name for notification:', e.message);
          }
        }

        await sendTemplateNotification({
          templateType: 'agent_commission_awarded',
          variables: {
            commission_percent: '10',
            commission_amount: String(commissionAmount.toFixed(2)),
            business_name: businessNameText,
          },
          audienceUserIds: [String(refAgentId)],
          payloadOverrides: {
            url: '/agent',
            data: { type: 'agent_commission_awarded', orderId: String(orderId), commission: commissionAmount, tenantId: tenantId ? String(tenantId) : null },
          },
          tenantId: tenantId ? String(tenantId) : null,
        });

        // 4. Admin notification about agent sale
        // Multi-Tenant: Send to business_admin if tenant order
        await sendTemplateNotification({
          templateType: 'admin_agent_sale',
          variables: {
            agent_name: 'סוכן',
            order_id: String(orderId),
          },
          audienceRoles: tenantId ? ['business_admin'] : ['admin'],
          payloadOverrides: {
            url: tenantId ? `/business/orders` : `/admin/orders/${orderId}`,
            data: {
              orderId: String(orderId),
              agentId: String(refAgentId),
              commission: commissionAmount,
            },
          },
          tenantId: tenantId ? String(tenantId) : null,
        });
      }
    } catch (notifyErr) {
      console.warn('ORDER_PUSH_NOTIFY_FAILED', notifyErr?.message || notifyErr);
    }

    // Update product stock for online products
    if (product.type === 'online') {
      await products.updateOne(
        { _id: new ObjectId(productId) },
        {
          $inc: { stockCount: -quantity },
          $set: { updatedAt: new Date() },
        },
      );
    }

    // Update group purchase quantity for group products
    if (product.type === 'group') {
      await products.updateOne(
        { _id: new ObjectId(productId) },
        {
          $inc: { groupCurrentQuantity: quantity },
          $set: { updatedAt: new Date() },
        },
      );
    }

    // Update agent commission if referral exists
    if (refAgentId) {
      try {
        await users.updateOne(
          { _id: refAgentId },
          {
            $inc: {
              commissionBalance: commissionAmount,
              totalSales: 1,
            },
            $set: { updatedAt: new Date() },
          },
        );

        console.log('COMMISSION_ADDED', {
          orderId: String(orderId),
          agentId: String(refAgentId),
          amount: commissionAmount,
          orderTotal: totalAmount,
        });
      } catch (commErr) {
        console.error('COMMISSION_UPDATE_FAILED', {
          orderId: String(orderId),
          agentId: String(refAgentId),
          error: commErr.message,
        });
      }
    }

    // Clear refSource cookie after order
    const response = NextResponse.json(
      {
        ok: true,
        orderId: String(orderId),
        totalAmount,
        commissionAmount: refAgentId ? commissionAmount : 0,
      },
      { status: 201 },
    );

    response.cookies.set('refSource', '', { path: '/', maxAge: 0 });

    return response;
  } catch (error) {
    console.error('ORDER_CREATE_ERROR:', error);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}

export const POST = withErrorLogging(POSTHandler);
