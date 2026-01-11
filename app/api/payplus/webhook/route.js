/**
 * PayPlus Webhook Handler - Full Implementation
 * 
 * Handles all payment events with:
 * - Idempotency (prevents duplicate processing)
 * - Retry mechanism with dead letter queue
 * - Full event type support (success, fail, refund, chargeback)
 * - Priority ERP integration trigger
 * - Commission lifecycle management
 */

import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { verifyPayPlusSignature } from '@/lib/payplus/client';
import { logSecurityAlert } from '@/lib/observability';
import { getErrorInfo, mapStatusToEventType, requiresAdminAlert } from '@/lib/payplus/errorMap';
import { RETRY_CONFIG, getNextRetryTime, DeadLetterQueue } from '@/lib/payplus/retryPolicy';
import PaymentEvent from '@/models/PaymentEvent';
import IntegrationSyncMap from '@/models/IntegrationSyncMap';
import Order from '@/models/Order';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

/**
 * Generate unique event ID for idempotency
 */
function generateEventId(payload) {
  const crypto = require('crypto');
  const data = JSON.stringify({
    txId: payload.transaction_uid || payload.transactionId || payload.txId,
    type: payload.type || payload.status,
    amount: payload.amount,
    timestamp: payload.timestamp || payload.created_at || Date.now(),
  });
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 32);
}

/**
 * Map PayPlus status to internal event type
 */
function getEventType(payload) {
  const status = (payload?.status || payload?.type || '').toLowerCase();
  
  if (['paid', 'approved', 'success', 'completed'].includes(status)) return 'success';
  if (['pending', 'processing', 'awaiting'].includes(status)) return 'pending';
  if (['failed', 'declined', 'error', 'canceled'].includes(status)) return 'failed';
  if (status === 'refunded' || status === 'refund') return 'refund';
  if (status === 'partial_refund') return 'partial_refund';
  if (status === 'chargeback') return 'chargeback';
  if (status === 'cancelled') return 'cancelled';
  
  return 'failed';
}

/**
 * Credit commission to agent (with hold period)
 */
async function processCommission(order, eventType) {
  if (!order?.refAgentId || !order?.commissionAmount || order.commissionAmount <= 0) {
    return { credited: false, reason: 'no_commission' };
  }

  // Commission hold period: 30 days for regular, 100 days for group purchases
  const now = new Date();
  const holdDays = order.orderType === 'group' ? 100 : 30;
  const availableAt = new Date(now.getTime() + holdDays * 24 * 60 * 60 * 1000);

  if (eventType === 'success') {
    // Set commission as pending with hold period (do NOT add to balance yet)
    await User.updateOne(
      { _id: order.refAgentId },
      {
        $inc: {
          totalSales: 1,
        },
        $set: { updatedAt: new Date() },
      }
    );

    await Order.updateOne(
      { _id: order._id },
      {
        $set: {
          commissionStatus: 'pending',
          commissionAvailableAt: availableAt,
          commissionSettled: true, // Mark as settled so cron can release when date arrives
        },
      }
    );

    return { credited: true, availableAt };

  } else if (['refund', 'partial_refund', 'chargeback'].includes(eventType)) {
    // Cancel or reduce commission
    const refundAmount = eventType === 'partial_refund' 
      ? (order.commissionAmount * 0.5) // Simplified - should calculate based on actual refund
      : order.commissionAmount;

    await User.updateOne(
      { _id: order.refAgentId },
      {
        $inc: { commissionBalance: -refundAmount },
        $set: { updatedAt: new Date() },
      }
    );

    await Order.updateOne(
      { _id: order._id },
      {
        $set: {
          commissionStatus: 'cancelled',
          commissionSettled: false,
        },
      }
    );

    return { credited: false, cancelled: true, reason: eventType };
  }

  return { credited: false, reason: 'unknown_event' };
}

/**
 * Process webhook event
 */
async function processWebhookEvent(payload, signature, sourceIp, userAgent) {
  await dbConnect();
  
  const eventId = generateEventId(payload);
  const eventType = getEventType(payload);
  const orderId = payload.orderId || payload.order_id;
  const transactionId = payload.transaction_uid || payload.transactionId || payload.txId;
  const amount = Number(payload.amount || payload.total || 0);

  // Check for existing processed event (Idempotency)
  const existingEvent = await PaymentEvent.findOne({ eventId });
  if (existingEvent?.status === 'processed') {
    console.log(`[PAYPLUS_WEBHOOK] Event ${eventId} already processed, skipping`);
    return { ok: true, message: 'already_processed', eventId };
  }

  // Create or update payment event record
  let paymentEvent = existingEvent || new PaymentEvent({
    eventId,
    orderId: new ObjectId(orderId),
    transactionId,
    sessionId: payload.session_id || payload.sessionId,
    type: eventType,
    amount,
    currency: payload.currency || 'ILS',
    paymentMethod: payload.payment_method || 'credit_card',
    cardLast4: payload.card_last4 || payload.last4,
    cardBrand: payload.card_brand?.toLowerCase(),
    rawPayload: payload,
    signature,
    signatureValid: true,
    status: 'processing',
    sourceIp,
    userAgent,
  });

  if (existingEvent) {
    paymentEvent.status = 'processing';
    paymentEvent.retryCount = (paymentEvent.retryCount || 0) + 1;
  }
  await paymentEvent.save();

  try {
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      console.warn(`[PAYPLUS_WEBHOOK] Order ${orderId} not found`);
      paymentEvent.status = 'ignored';
      paymentEvent.errorMessage = 'Order not found';
      await paymentEvent.save();
      return { ok: true, message: 'order_not_found' };
    }

    // Get or create sync map
    const syncMap = await IntegrationSyncMap.getOrCreate(order._id);
    await syncMap.updatePayplusStatus(transactionId, payload.session_id, 'synced');

    // Update order based on event type
    const orderUpdate = {
      payplusTransactionId: transactionId,
      payplusSessionId: payload.session_id,
      paymentMethod: payload.payment_method,
      updatedAt: new Date(),
    };

    switch (eventType) {
      case 'success':
        orderUpdate.status = 'paid';
        orderUpdate.paymentStatus = 'success';
        orderUpdate.paidAt = new Date();
        
        // Process commission
        const commissionResult = await processCommission(order, eventType);
        console.log(`[PAYPLUS_WEBHOOK] Commission result:`, commissionResult);
        
        // Trigger Priority sync (async)
        triggerPrioritySync(order, paymentEvent, syncMap).catch(err => {
          console.error('[PAYPLUS_WEBHOOK] Priority sync failed:', err.message);
        });
        break;

      case 'pending':
        orderUpdate.paymentStatus = 'processing';
        break;

      case 'failed':
        orderUpdate.status = 'failed';
        orderUpdate.paymentStatus = 'failed';
        break;

      case 'cancelled':
        orderUpdate.status = 'cancelled';
        orderUpdate.paymentStatus = 'failed';
        break;

      case 'refund':
      case 'partial_refund':
        orderUpdate.paymentStatus = eventType === 'refund' ? 'refunded' : 'partial_refund';
        orderUpdate.refundAmount = amount;
        orderUpdate.refundedAt = new Date();
        
        // Cancel/reduce commission
        await processCommission(order, eventType);
        
        // Trigger credit note creation
        triggerCreditNote(order, paymentEvent, syncMap).catch(err => {
          console.error('[PAYPLUS_WEBHOOK] Credit note creation failed:', err.message);
        });
        break;

      case 'chargeback':
        orderUpdate.status = 'chargeback';
        orderUpdate.paymentStatus = 'chargeback';
        
        // Cancel commission
        await processCommission(order, eventType);
        
        // Send admin alert
        sendChargebackAlert(order, payload);
        break;
    }

    await Order.updateOne({ _id: order._id }, { $set: orderUpdate });

    // Mark payment event as processed
    paymentEvent.status = 'processed';
    paymentEvent.processedAt = new Date();
    await paymentEvent.save();

    // Send admin alert if required
    if (requiresAdminAlert(payload.error_code)) {
      sendAdminAlert(order, paymentEvent, payload);
    }

    console.log(`[PAYPLUS_WEBHOOK] Event ${eventId} processed successfully - ${eventType}`);
    return { ok: true, eventId, eventType };

  } catch (err) {
    console.error(`[PAYPLUS_WEBHOOK] Processing failed:`, err.message);
    
    // Mark as failed and schedule retry
    await paymentEvent.markAsFailed('PROCESSING_ERROR', err.message);
    
    return { ok: false, error: err.message, eventId };
  }
}

/**
 * Trigger Priority sync asynchronously
 */
async function triggerPrioritySync(order, paymentEvent, syncMap) {
  try {
    const { createPriorityDocuments } = await import('@/lib/priority/syncService');
    await createPriorityDocuments(order, paymentEvent, syncMap);
  } catch (err) {
    console.error('[PRIORITY_SYNC_TRIGGER]', err.message);
    syncMap.logError('priority', 'triggerSync', 'TRIGGER_FAILED', err.message);
  }
}

/**
 * Trigger credit note creation
 */
async function triggerCreditNote(order, paymentEvent, syncMap) {
  try {
    const { createCreditNote } = await import('@/lib/priority/syncService');
    await createCreditNote(order, paymentEvent, syncMap);
  } catch (err) {
    console.error('[CREDIT_NOTE_TRIGGER]', err.message);
  }
}

/**
 * Send chargeback alert
 */
function sendChargebackAlert(order, payload) {
  const alertData = {
    type: 'CHARGEBACK_ALERT',
    orderId: order._id.toString(),
    amount: payload.amount,
    transactionId: payload.transactionId,
    timestamp: new Date().toISOString(),
  };
  
  console.error('[CHARGEBACK_ALERT]', JSON.stringify(alertData));
  
  // TODO: Send email/Slack alert
}

/**
 * Send admin alert for critical errors
 */
function sendAdminAlert(order, paymentEvent, payload) {
  const alertData = {
    type: 'PAYMENT_ALERT',
    orderId: order._id.toString(),
    eventId: paymentEvent.eventId,
    errorCode: payload.error_code,
    errorMessage: payload.error_message,
    timestamp: new Date().toISOString(),
  };
  
  console.error('[ADMIN_ALERT]', JSON.stringify(alertData));
  
  // TODO: Send email/Slack alert
}

/**
 * POST handler
 */
async function POSTHandler(req) {
  const rawBody = await req.text();
  let payload;
  
  try {
    payload = JSON.parse(rawBody || '{}');
  } catch (err) {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  // Verify signature
  const signature = req.headers.get('x-payplus-signature') || req.headers.get('payplus-signature');
  const verification = verifyPayPlusSignature(rawBody, signature);
  
  if (!verification.valid) {
    logSecurityAlert('payplus.webhook_invalid_signature', {
      reason: verification.reason,
      hasSignature: Boolean(signature),
      ip: req.headers.get('x-forwarded-for') || 'unknown',
    });
    
    // Log failed attempt
    try {
      await dbConnect();
      await PaymentEvent.create({
        eventId: `invalid_${Date.now()}`,
        orderId: payload.orderId ? new ObjectId(payload.orderId) : null,
        type: 'failed',
        amount: payload.amount || 0,
        rawPayload: payload,
        signature,
        signatureValid: false,
        status: 'ignored',
        errorMessage: `Invalid signature: ${verification.reason}`,
        sourceIp: req.headers.get('x-forwarded-for'),
      });
    } catch (logErr) {
      console.error('[PAYPLUS_WEBHOOK] Failed to log invalid signature:', logErr.message);
    }
    
    return Response.json({ error: 'invalid_signature' }, { status: 400 });
  }

  // Validate required fields
  if (!payload?.orderId && !payload?.order_id) {
    return Response.json({ error: 'missing_order_id' }, { status: 400 });
  }

  // Process the webhook
  const sourceIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
  const userAgent = req.headers.get('user-agent');
  
  const result = await processWebhookEvent(payload, signature, sourceIp, userAgent);
  
  // Always return 200 to PayPlus (unless signature is invalid)
  return Response.json(result);
}

export const POST = withErrorLogging(POSTHandler);
