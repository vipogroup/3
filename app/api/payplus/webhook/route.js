import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { verifyPayPlusSignature } from '@/lib/payplus/client';
import { logSecurityAlert } from '@/lib/observability';

async function creditCommission(db, order) {
  if (!order?.refAgentId || !order?.commissionAmount || order.commissionAmount <= 0) {
    return;
  }

  await db.collection('users').updateOne(
    { _id: new ObjectId(order.refAgentId) },
    {
      $inc: {
        commissionBalance: Number(order.commissionAmount) || 0,
        totalSales: 1,
      },
      $set: { updatedAt: new Date() },
    },
  );
}

export async function POST(req) {
  const rawBody = await req.text();
  let payload;
  try {
    payload = JSON.parse(rawBody || '{}');
  } catch (err) {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const signature = req.headers.get('x-payplus-signature') || req.headers.get('payplus-signature');
  const verification = verifyPayPlusSignature(rawBody, signature);
  if (!verification.valid) {
    logSecurityAlert('payplus.webhook_invalid_signature', {
      reason: verification.reason,
      hasSignature: Boolean(signature),
    });
    return Response.json({ error: 'invalid_signature' }, { status: 401 });
  }

  if (!payload?.orderId) {
    return Response.json({ error: 'missing_order' }, { status: 400 });
  }

  const db = await getDb();
  const orders = db.collection('orders');
  const orderId = new ObjectId(payload.orderId);
  const order = await orders.findOne({ _id: orderId });
  if (!order) {
    return Response.json({ error: 'order_not_found' }, { status: 404 });
  }

  const status = payload?.status?.toLowerCase();
  if (status === 'paid' || status === 'approved') {
    await orders.updateOne(
      { _id: orderId },
      {
        $set: {
          status: 'paid',
          'payplus.transactionId': payload?.txId || payload?.transactionId || null,
          'payplus.raw': payload,
          updatedAt: new Date(),
        },
      },
    );

    await creditCommission(db, order);
  } else if (status === 'failed' || status === 'canceled') {
    await orders.updateOne(
      { _id: orderId },
      {
        $set: {
          status: 'failed',
          'payplus.transactionId': payload?.txId || payload?.transactionId || null,
          'payplus.raw': payload,
          updatedAt: new Date(),
        },
      },
    );
  }

  return Response.json({ ok: true });
}
