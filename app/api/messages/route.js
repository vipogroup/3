export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { requireAuthApi } from '@/lib/auth/server';
import { connectMongo } from '@/lib/mongoose';
import Message from '@/models/Message';
import { pushToUsers, pushToTags, pushBroadcast } from '@/lib/pushSender';
import { getDb } from '@/lib/db';

const ADMIN_ALLOWED_TARGETS = ['agent', 'customer', 'admin', 'all', 'direct'];

function normalizeObjectId(value) {
  if (!value || !ObjectId.isValid(value)) return null;
  return new ObjectId(value);
}

function getTruncatedBody(text) {
  if (!text) return '';
  return text.length > 120 ? `${text.slice(0, 117)}...` : text;
}

async function notifyRecipients(doc) {
  const payload = {
    title: 'הודעה חדשה ב-VIPO',
    body: getTruncatedBody(doc.message),
    data: {
      messageId: String(doc._id),
      targetRole: doc.targetRole,
    },
    url: doc.targetRole === 'business_admin' ? '/business' : '/dashboard',
  };

  try {
    if (doc.targetUserId) {
      await pushToUsers([String(doc.targetUserId)], payload);
    } else if (doc.targetRole === 'all') {
      await pushBroadcast(payload);
    } else if (doc.targetRole === 'admin') {
      await pushToTags(['admin'], payload);
    } else if (doc.targetRole === 'business_admin' && doc.tenantId) {
      // Multi-Tenant: For business_admin, use pushToRoles with tenantId filter
      const { pushToRoles } = await import('@/lib/pushSender');
      await pushToRoles(['business_admin'], payload, String(doc.tenantId));
    } else {
      await pushToTags([doc.targetRole], payload);
    }
  } catch (error) {
    console.warn('PUSH_NOTIFY_FAILED', error?.message || error);
  }
}

export async function GET(req) {
  try {
    const user = await requireAuthApi(req);
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 50));
    const participantId = searchParams.get('userId');
    const participantObjectId = normalizeObjectId(participantId);

    let query = {};

    const userObjectId = normalizeObjectId(user.id);

    const isSystemAdmin = user.role === 'admin' || user.role === 'super_admin';
    const isBusinessAdmin = user.role === 'business_admin';

    if (isSystemAdmin) {
      if (participantId && participantObjectId) {
        // Admin viewing specific user's conversation
        query = {
          $or: [
            { senderId: participantObjectId },
            { targetUserId: participantObjectId },
          ],
        };
      } else {
        // Admin viewing their own messages - only messages targeted to admin role
        // NOT messages targeted to business_admin (those go to business owners)
        query = {
          $or: [
            { senderId: userObjectId },
            { targetUserId: userObjectId },
            { targetRole: 'admin' },
            { targetRole: 'all' },
          ],
        };
      }
    } else if (isBusinessAdmin && user.tenantId) {
      // Business admin sees messages from their tenant's customers
      // Support both ObjectId and String tenantId in messages
      const tenantObjectId = normalizeObjectId(user.tenantId);
      const tenantString = String(user.tenantId);
      console.log('[MESSAGES_GET] Business admin query:', { 
        userId: user.id, 
        tenantId: user.tenantId,
        tenantObjectId: tenantObjectId ? String(tenantObjectId) : null 
      });
      query = {
        $or: [
          { senderId: userObjectId },
          { targetUserId: userObjectId },
          { tenantId: tenantObjectId, targetRole: 'business_admin' },
          { tenantId: tenantString, targetRole: 'business_admin' },
        ],
      };
    } else {
      if (!userObjectId) {
        return NextResponse.json({ error: 'user_id_invalid' }, { status: 400 });
      }
      
      // Get user creation date to filter messages
      const db = await getDb();
      const usersCol = db.collection('users');
      const userData = await usersCol.findOne(
        { _id: userObjectId },
        { projection: { createdAt: 1 } }
      );
      const userCreatedAt = userData?.createdAt || new Date(0);
      
      query = {
        $and: [
          {
            $or: [
              { senderId: userObjectId },
              { targetUserId: userObjectId },
              { targetRole: { $in: ['all', user.role] } },
            ],
          },
          // Only show messages created after user registration
          { createdAt: { $gte: userCreatedAt } },
        ],
      };
    }

    const docs = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const items = docs.map((doc) => ({
      id: String(doc._id),
      senderId: String(doc.senderId),
      senderRole: doc.senderRole,
      targetRole: doc.targetRole,
      targetUserId: doc.targetUserId ? String(doc.targetUserId) : null,
      message: doc.message,
      readBy: (doc.readBy || []).map((entry) => ({
        userId: String(entry.userId),
        readAt: entry.readAt,
      })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return NextResponse.json({ ok: true, items });
  } catch (error) {
    console.error('MESSAGES_GET_ERROR', error);
    const status = error?.status || 500;
    const message = status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Server error';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req) {
  try {
    const user = await requireAuthApi(req);
    await connectMongo();

    console.log('[MESSAGES_POST] User:', { id: user.id, role: user.role, tenantId: user.tenantId });

    const body = await req.json().catch(() => ({}));
    const text = String(body?.message || '').trim();
    if (!text) {
      return NextResponse.json({ error: 'message_required' }, { status: 400 });
    }
    if (text.length > 2000) {
      return NextResponse.json({ error: 'message_too_long' }, { status: 400 });
    }

    const senderObjectId = normalizeObjectId(user.id);
    if (!senderObjectId) {
      return NextResponse.json({ error: 'sender_invalid' }, { status: 400 });
    }

    let targetRole = 'admin';
    let targetUserId = null;

    const isSystemAdmin = user.role === 'admin' || user.role === 'super_admin';
    const isBusinessAdmin = user.role === 'business_admin';
    let tenantId = null;

    if (isSystemAdmin || isBusinessAdmin) {
      const requestedRole = body?.targetRole || 'all';
      if (!ADMIN_ALLOWED_TARGETS.includes(requestedRole)) {
        return NextResponse.json({ error: 'invalid_target_role' }, { status: 400 });
      }
      targetRole = requestedRole;
      if (requestedRole === 'direct') {
        targetUserId = normalizeObjectId(body?.targetUserId);
        if (!targetUserId) {
          return NextResponse.json({ error: 'target_user_required' }, { status: 400 });
        }
      } else if (requestedRole === 'admin') {
        targetUserId = null;
      } else {
        targetUserId = null;
      }
      // Business admin messages are tenant-scoped
      if (isBusinessAdmin && user.tenantId) {
        tenantId = normalizeObjectId(user.tenantId);
      }
    } else {
      // Regular user - if they belong to a tenant, send to business_admin
      if (user.tenantId) {
        targetRole = 'business_admin';
        tenantId = normalizeObjectId(user.tenantId);
      } else {
        targetRole = 'admin';
      }
      targetUserId = null;
    }

    // Ensure senderRole is valid
    const validRoles = ['admin', 'super_admin', 'business_admin', 'agent', 'customer'];
    const senderRole = validRoles.includes(user.role) ? user.role : 'customer';

    console.log('[MESSAGES_POST] Creating message:', { senderRole, targetRole, tenantId: tenantId ? String(tenantId) : null });

    const messageDoc = await Message.create({
      senderId: senderObjectId,
      senderRole,
      targetRole,
      targetUserId,
      tenantId,
      message: text,
      readBy: [
        {
          userId: senderObjectId,
          readAt: new Date(),
        },
      ],
    });

    console.log('[MESSAGES_POST] Message created:', messageDoc._id);
    notifyRecipients(messageDoc).catch(() => {});

    return NextResponse.json({
      ok: true,
      item: {
        id: String(messageDoc._id),
        senderId: String(messageDoc.senderId),
        senderRole: messageDoc.senderRole,
        targetRole: messageDoc.targetRole,
        targetUserId: messageDoc.targetUserId ? String(messageDoc.targetUserId) : null,
        message: messageDoc.message,
        readBy: messageDoc.readBy.map((entry) => ({
          userId: String(entry.userId),
          readAt: entry.readAt,
        })),
        createdAt: messageDoc.createdAt,
        updatedAt: messageDoc.updatedAt,
      },
    });
  } catch (error) {
    console.error('MESSAGES_POST_ERROR', error);
    const status = error?.status || 500;
    const message = status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Server error';
    return NextResponse.json({ error: message }, { status });
  }
}
