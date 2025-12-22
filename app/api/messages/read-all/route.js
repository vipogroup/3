export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { requireAuthApi } from '@/lib/auth/server';
import { connectMongo } from '@/lib/mongoose';
import Message from '@/models/Message';

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

    return NextResponse.json({ ok: true, updated: updates.length });
  } catch (error) {
    console.error('MESSAGES_MARK_READ_ERROR', error);
    const status = error?.status || 500;
    return NextResponse.json({ error: 'Server error' }, { status });
  }
}
