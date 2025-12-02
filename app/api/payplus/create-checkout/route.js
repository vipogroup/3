import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { createPayPlusSession, validatePayPlusConfig } from '@/lib/payplus/client';

export async function POST(req) {
  try {
    // Check PayPlus configuration first
    const configStatus = validatePayPlusConfig();
    if (!configStatus.ok) {
      console.error('PAYPLUS_NOT_CONFIGURED:', configStatus.message);
      // Return 503 Service Unavailable with clear message
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

    const body = await req.json();
    if (!body?.orderId) {
      return Response.json({ error: 'order_id_required' }, { status: 400 });
    }

    const db = await getDb();
    const orders = db.collection('orders');
    const order = await orders.findOne({ _id: new ObjectId(body.orderId) });
    if (!order) {
      return Response.json({ error: 'order_not_found' }, { status: 404 });
    }

    const url = new URL(req.url);
    const successUrl = `${url.origin}/checkout/success?orderId=${order._id}`;
    const cancelUrl = `${url.origin}/checkout/cancel?orderId=${order._id}`;

    const session = await createPayPlusSession({
      order,
      successUrl,
      cancelUrl,
    });

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
    return Response.json({ error: 'server_error' }, { status: 500 });
  }
}
