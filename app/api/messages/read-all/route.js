export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { requireAuthApi } from '@/lib/auth/server';
import { connectMongo } from '@/lib/mongoose';
import Message from '@/models/Message';
import { getDb } from '@/lib/db';

/**
 * Cleanup messages that have been read by all intended recipients
 */
async function cleanupReadMessages() {
  const db = await getDb();
  const usersCol = db.collection('users');
  const messages = await Message.find({}).lean();
  
  let deletedCount = 0;

  for (const msg of messages) {
    const readByUserIds = (msg.readBy || []).map((r) => String(r.userId));
    if (readByUserIds.length === 0) continue;

    let shouldDelete = false;

    if (msg.targetRole === 'direct' && msg.targetUserId) {
      // Direct message: delete if target user has read it
      shouldDelete = readByUserIds.includes(String(msg.targetUserId));
    } else if (msg.targetRole === 'all') {
      // Broadcast: delete if older than 7 days and read by at least 10 users
      const isOld = new Date() - new Date(msg.createdAt) > 7 * 24 * 60 * 60 * 1000;
      shouldDelete = isOld && readByUserIds.length >= 10;
    } else {
      // Role-based: delete if 80% of target role has read it
      const roleCount = await usersCol.countDocuments({ role: msg.targetRole });
      const readPercentage = roleCount > 0 ? (readByUserIds.length / roleCount) * 100 : 0;
      shouldDelete = readPercentage >= 80;
    }

    if (shouldDelete) {
      await Message.deleteOne({ _id: msg._id });
      deletedCount++;
    }
  }

  if (deletedCount > 0) {
    console.log('MESSAGES_AUTO_CLEANUP', { deletedCount });
  }
  
  return deletedCount;
}

function normalizeObjectId(value) {
  if (!value || !ObjectId.isValid(value)) return null;
  return new ObjectId(value);
}

export async function POST(req) {
  try {
    const user = await requireAuthApi(req);
    await connectMongo();

    const userObjectId = normalizeObjectId(user.id);
    if (!userObjectId) {
      return NextResponse.json({ error: 'invalid_user' }, { status: 400 });
    }

    const roleTargets = ['all'];
    if (user.role) {
      roleTargets.push(user.role);
    }

    const query = {
      $or: [
        { senderId: userObjectId },
        { targetUserId: userObjectId },
        { targetRole: { $in: roleTargets } },
      ],
    };

    const docs = await Message.find(query, { _id: 1, readBy: 1 }).lean();

    const updates = [];
    const now = new Date();

    docs.forEach((doc) => {
      const alreadyRead = (doc.readBy || []).some((entry) => entry.userId && entry.userId.equals(userObjectId));
      if (!alreadyRead) {
        updates.push({
          updateOne: {
          filter: { _id: doc._id },
            update: {
              $push: {
                readBy: {
                  userId: userObjectId,
                  readAt: now,
                },
              },
            },
          },
        });
      }
    });

    if (updates.length > 0) {
      await Message.bulkWrite(updates, { ordered: false });
    }

    // Trigger async cleanup of fully-read messages
    cleanupReadMessages().catch((err) => {
      console.warn('CLEANUP_TRIGGER_FAILED', err?.message || err);
    });

    return NextResponse.json({ ok: true, updated: updates.length });
  } catch (error) {
    console.error('MESSAGES_MARK_READ_ERROR', error);
    const status = error?.status || 500;
    return NextResponse.json({ error: 'Server error' }, { status });
  }
}
