import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { verifyPayPlusSignature } from '@/lib/payplus/client';
import { logSecurityAlert } from '@/lib/observability';

async function creditCommission(db, order) {
  if (!order?.refAgentId || !order?.commissionAmount || order.commissionAmount <= 0) {
    return false;
  }

  const result = await db.collection('users').updateOne(
    { _id: new ObjectId(order.refAgentId) },
    {
      $inc: {
        commissionBalance: Number(order.commissionAmount) || 0,
        totalSales: 1,
      },
      $set: { updatedAt: new Date() },
    },
  );

  return result.modifiedCount > 0;
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
    return Response.json({ error: 'invalid_signature' }, { status: 400 });
  }

  if (!payload?.orderId) {
    return Response.json({ error: 'missing_order' }, { status: 400 });
  }

  const db = await getDb();
  const orders = db.collection('orders');
  const orderId = new ObjectId(payload.orderId);
  const order = await orders.findOne({ _id: orderId });
  if (!order) {
    console.warn('PAYPLUS_WEBHOOK_ORDER_MISSING', payload.orderId);
    return Response.json({ ok: true });
  }

  const status = payload?.status?.toLowerCase();
  const isSuccess = status === 'paid' || status === 'approved';
  const isFailure = status === 'failed' || status === 'canceled';

  const update = {
    $set: {
      'payplus.transactionId': payload?.txId || payload?.transactionId || null,
      'payplus.raw': payload,
      updatedAt: new Date(),
    },
  };

  if (isSuccess) {
    update.$set.status = 'paid';
    if (!order.commissionSettled) {
      const credited = await creditCommission(db, order);
      if (credited) {
        update.$set.commissionSettled = true;
      }
    }
  } else if (isFailure) {
    update.$set.status = 'failed';
  }

  await orders.updateOne({ _id: orderId }, update);

  return Response.json({ ok: true });
}
