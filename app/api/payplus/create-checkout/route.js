import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { createPayPlusSession, createPayPlusSessionForTenant, validatePayPlusConfig } from '@/lib/payplus/client';
import { requireAuthApi } from '@/lib/auth/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';

async function POSTHandler(req) {
  try {
    const body = await req.json();
    if (!body?.orderId) {
      return Response.json({ error: 'order_id_required' }, { status: 400 });
    }

    let requester = null;
    try {
      requester = await requireAuthApi(req);
    } catch (authError) {
      if (!authError?.status || authError.status !== 401) {
        throw authError;
      }
    }

    const rateLimitIdentifier = buildRateLimitKey(req, requester?.id || body.orderId);
    const rateLimit = rateLimiters.payplusSession(req, rateLimitIdentifier);
    if (!rateLimit.allowed) {
      return Response.json({ error: 'Too many requests' }, { status: 429 });
    }

    const db = await getDb();
    const orders = db.collection('orders');
    const order = await orders.findOne({ _id: new ObjectId(body.orderId) });
    if (!order) {
      return Response.json({ error: 'order_not_found' }, { status: 404 });
    }

    // Multi-Tenant: Get tenant-specific PayPlus config if order has tenantId
    let tenant = null;
    if (order.tenantId) {
      tenant = await db.collection('tenants').findOne({ _id: new ObjectId(order.tenantId) });
    }

    // Check payment mode - 'platform' = use global config, 'independent' = use tenant config
    // Default is 'platform' (payments go through main admin)
    const paymentMode = tenant?.paymentMode || 'platform';
    
    // Check if we should use tenant config (independent mode with valid PayPlus setup)
    const hasTenantConfig = paymentMode === 'independent' && 
      tenant?.payplus?.enabled && 
      tenant.payplus.apiKey && 
      tenant.payplus.secretKey;
    
    if (!hasTenantConfig) {
      // Use platform (global) config - either because paymentMode is 'platform' 
      // or because independent mode doesn't have valid PayPlus config
      const configStatus = validatePayPlusConfig();
      if (!configStatus.ok) {
        console.error('PAYPLUS_NOT_CONFIGURED:', configStatus.message);
        return Response.json(
          {
            ok: false,
            error: 'payment_not_configured',
            message: 'שירות התשלום אינו זמין כרגע. אנא פנה לתמיכה.',
            fallback: true,
          },
          { status: 503 },
        );
      }
    }

    const url = new URL(req.url);
    const successUrl = `${url.origin}/checkout/success?orderId=${order._id}`;
    const cancelUrl = `${url.origin}/checkout/cancel?orderId=${order._id}`;

    // Use tenant-specific or global PayPlus session
    const session = hasTenantConfig
      ? await createPayPlusSessionForTenant({ order, successUrl, cancelUrl, tenant })
      : await createPayPlusSession({ order, successUrl, cancelUrl });

    const setFields = {
      paymentProvider: session.provider,
      paymentSessionId: session.sessionId,
      paymentUrl: session.paymentUrl,
      paymentFallback: !!session.isFallback,
      updatedAt: new Date(),
    };

    if (session.raw) {
      setFields['payplus.session'] = session.raw;
    }

    await orders.updateOne(
      { _id: order._id },
      {
        $set: setFields,
      },
    );

    return Response.json({
      ok: true,
      provider: session.provider,
      fallback: session.isFallback,
      paymentUrl: session.paymentUrl,
      sessionId: session.sessionId,
      error: session.error || null,
    });
  } catch (error) {
    console.error('PAYPLUS_CHECKOUT_ERROR', error);
    const status = error?.status || 500;
    const message =
      status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'server_error';
    return Response.json({ error: message }, { status });
  }
}

export const POST = withErrorLogging(POSTHandler);
