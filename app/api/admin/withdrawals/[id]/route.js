export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { requireAdminApi } from '@/lib/auth/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';
import { processWithdrawalViaPriority, completeWithdrawal } from '@/lib/priority/agentPayoutService.js';
import { isPriorityConfigured } from '@/lib/priority/client.js';

const ACTIONS = ['approve', 'reject', 'complete', 'pay_via_priority'];

function invalidIdResponse() {
  return NextResponse.json({ error: 'Invalid withdrawal id' }, { status: 400 });
}

function normalizeNotes(notes) {
  if (!notes) return '';
  if (typeof notes !== 'string') return '';
  return notes.trim();
}

function mapWithdrawal(doc, user) {
  return {
    id: String(doc._id),
    userId: String(doc.userId),
    amount: doc.amount,
    status: doc.status,
    notes: doc.notes ?? '',
    adminNotes: doc.adminNotes ?? '',
    snapshotBalance: doc.snapshotBalance ?? 0,
    snapshotOnHold: doc.snapshotOnHold ?? 0,
    processedBy: doc.processedBy ? String(doc.processedBy) : null,
    processedAt: doc.processedAt || null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    user,
  };
}

export async function GET(req, { params }) {
  try {
    const { id } = params || {};
    if (!id || !ObjectId.isValid(id)) {
      return invalidIdResponse();
    }

    const db = await getDb();
    const admin = await requireAdminApi(req);
    const identifier = buildRateLimitKey(req, admin.id);
    const rateLimit = rateLimiters.admin(req, identifier);

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const withdrawalId = new ObjectId(id);
    const withdrawals = db.collection('withdrawalRequests');
    const users = db.collection('users');

    const doc = await withdrawals.findOne({ _id: withdrawalId });
    if (!doc) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    const userDoc = await users
      .find({ _id: doc.userId })
      .project({ fullName: 1, email: 1, phone: 1, role: 1, commissionBalance: 1, commissionOnHold: 1 })
      .limit(1)
      .toArray();

    const user = userDoc[0]
      ? {
          id: String(userDoc[0]._id),
          fullName: userDoc[0].fullName || '',
          email: userDoc[0].email || '',
          phone: userDoc[0].phone || '',
          role: userDoc[0].role || 'agent',
          commissionBalance: userDoc[0].commissionBalance || 0,
          commissionOnHold: userDoc[0].commissionOnHold || 0,
        }
      : null;

    return NextResponse.json({ ok: true, withdrawal: mapWithdrawal(doc, user) });
  } catch (err) {
    console.error('ADMIN_WITHDRAWAL_GET_ERROR:', err);
    const status = err?.status || 500;
    const message = status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Server error';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = params || {};
    if (!id || !ObjectId.isValid(id)) {
      return invalidIdResponse();
    }

    const body = await req.json();
    const action = body?.action;
    const adminNotes = normalizeNotes(body?.adminNotes);

    if (!ACTIONS.includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const db = await getDb();
    const admin = await requireAdminApi(req);
    const identifier = buildRateLimitKey(req, admin.id);
    const rateLimit = rateLimiters.admin(req, identifier);

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const adminId = new ObjectId(admin.id);
    const withdrawalId = new ObjectId(id);
    const withdrawals = db.collection('withdrawalRequests');
    const users = db.collection('users');

    const existing = await withdrawals.findOne({ _id: withdrawalId });
    if (!existing) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    const now = new Date();
    let updatedDoc = null;

    if (action === 'approve') {
      if (existing.status !== 'pending') {
        return NextResponse.json({ error: 'Cannot approve in current status' }, { status: 409 });
      }

      const result = await withdrawals.findOneAndUpdate(
        { _id: withdrawalId, status: 'pending' },
        {
          $set: {
            status: 'approved',
            adminNotes,
            processedBy: adminId,
            processedAt: now,
            updatedAt: now,
          },
        },
        { returnDocument: 'after' },
      );
      if (!result.value) {
        return NextResponse.json({ error: 'Withdrawal already processed' }, { status: 409 });
      }
      updatedDoc = result.value;
    }

    if (action === 'reject') {
      if (existing.status === 'completed' || existing.status === 'rejected') {
        return NextResponse.json({ error: 'Withdrawal already finalized' }, { status: 409 });
      }

      const session = db.client.startSession();
      try {
        await session.withTransaction(async () => {
          const rejectResult = await withdrawals.findOneAndUpdate(
            { _id: withdrawalId, status: { $in: ['pending', 'approved'] } },
            {
              $set: {
                status: 'rejected',
                adminNotes,
                processedBy: adminId,
                processedAt: now,
                updatedAt: now,
              },
            },
            { returnDocument: 'after', session },
          );

          if (!rejectResult.value) {
            throw new Error('ALREADY_PROCESSED');
          }

          const revertResult = await users.findOneAndUpdate(
            { _id: rejectResult.value.userId },
            {
              $inc: {
                commissionBalance: rejectResult.value.amount,
                commissionOnHold: -rejectResult.value.amount,
              },
              $set: { updatedAt: now },
            },
            { session, returnDocument: 'after' },
          );

          if (!revertResult.value) {
            throw new Error('USER_NOT_FOUND');
          }

          updatedDoc = rejectResult.value;
        });
      } catch (transactionError) {
        if (transactionError.message === 'ALREADY_PROCESSED') {
          await session.endSession();
          return NextResponse.json({ error: 'Withdrawal already processed' }, { status: 409 });
        }
        console.error('ADMIN_WITHDRAWAL_REJECT_TRANSACTION_ERROR:', transactionError);
        await session.endSession();
        throw transactionError;
      }
      await session.endSession();
    }

    if (action === 'complete') {
      if (existing.status !== 'approved') {
        return NextResponse.json({ error: 'Only approved withdrawals can be completed' }, { status: 409 });
      }

      const session = db.client.startSession();
      try {
        await session.withTransaction(async () => {
          const completeResult = await withdrawals.findOneAndUpdate(
            { _id: withdrawalId, status: 'approved' },
            {
              $set: {
                status: 'completed',
                adminNotes,
                processedBy: adminId,
                processedAt: now,
                updatedAt: now,
              },
            },
            { returnDocument: 'after', session },
          );

          if (!completeResult.value) {
            throw new Error('ALREADY_PROCESSED');
          }

          const decResult = await users.findOneAndUpdate(
            { _id: completeResult.value.userId },
            {
              $inc: {
                commissionOnHold: -completeResult.value.amount,
              },
              $set: { updatedAt: now },
            },
            { session, returnDocument: 'after' },
          );

          if (!decResult.value) {
            throw new Error('USER_NOT_FOUND');
          }

          updatedDoc = completeResult.value;
        });
      } catch (transactionError) {
        if (transactionError.message === 'ALREADY_PROCESSED') {
          await session.endSession();
          return NextResponse.json({ error: 'Withdrawal already processed' }, { status: 409 });
        }
        console.error('ADMIN_WITHDRAWAL_COMPLETE_TRANSACTION_ERROR:', transactionError);
        await session.endSession();
        throw transactionError;
      }
      await session.endSession();
    }

    // === Pay via Priority ERP ===
    if (action === 'pay_via_priority') {
      if (!isPriorityConfigured()) {
        return NextResponse.json({ error: 'Priority ERP לא מוגדר במערכת' }, { status: 400 });
      }

      if (existing.status !== 'approved') {
        return NextResponse.json({ error: 'רק בקשות מאושרות ניתנות לתשלום' }, { status: 409 });
      }

      // Process payment via Priority
      const paymentResult = await processWithdrawalViaPriority(id);
      
      if (!paymentResult.success) {
        return NextResponse.json({ 
          error: `שגיאה ביצירת תשלום Priority: ${paymentResult.reason}` 
        }, { status: 500 });
      }

      // Get updated withdrawal
      updatedDoc = await withdrawals.findOne({ _id: withdrawalId });

      return NextResponse.json({ 
        ok: true, 
        message: 'מסמך תשלום נוצר בהצלחה ב-Priority',
        priorityPaymentId: paymentResult.paymentId,
        withdrawal: mapWithdrawal(updatedDoc, null)
      });
    }

    const usersCollection = db.collection('users');
    const userDoc = await usersCollection
      .find({ _id: updatedDoc.userId })
      .project({ fullName: 1, email: 1, phone: 1, role: 1, commissionBalance: 1, commissionOnHold: 1 })
      .limit(1)
      .toArray();

    const user = userDoc[0]
      ? {
          id: String(userDoc[0]._id),
          fullName: userDoc[0].fullName || '',
          email: userDoc[0].email || '',
          phone: userDoc[0].phone || '',
          role: userDoc[0].role || 'agent',
          commissionBalance: userDoc[0].commissionBalance || 0,
          commissionOnHold: userDoc[0].commissionOnHold || 0,
        }
      : null;

    return NextResponse.json({ ok: true, withdrawal: mapWithdrawal(updatedDoc, user) });
  } catch (err) {
    console.error('ADMIN_WITHDRAWAL_PATCH_ERROR:', err);
    const status = err?.status || 500;
    const message = status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Server error';
    return NextResponse.json({ error: message }, { status });
  }
}
