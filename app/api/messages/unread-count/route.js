export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { requireAuthApi } from '@/lib/auth/server';
import { connectMongo } from '@/lib/mongoose';
import Message from '@/models/Message';

export async function GET(req) {
  try {
    const user = await requireAuthApi(req);
    await connectMongo();

    const userObjectId = new ObjectId(user.id);

    // Find messages where user should see them but hasn't read
    const query = {
      $or: [
        { targetUserId: userObjectId },
        { targetRole: { $in: ['all', user.role] } },
      ],
      'readBy.userId': { $ne: userObjectId },
    };

    const count = await Message.countDocuments(query);

    return NextResponse.json({ ok: true, count });
  } catch (error) {
    console.error('UNREAD_COUNT_ERROR', error);
    const status = error?.status || 500;
    return NextResponse.json({ error: 'Server error', count: 0 }, { status });
  }
}
