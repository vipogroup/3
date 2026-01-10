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

    // Validate user.id before creating ObjectId
    if (!user.id || !ObjectId.isValid(user.id)) {
      return NextResponse.json({ ok: true, count: 0 });
    }
    const userObjectId = new ObjectId(user.id);

    const isSystemAdmin = user.role === 'admin' || user.role === 'super_admin';
    const isBusinessAdmin = user.role === 'business_admin';

    let query;

    if (isSystemAdmin) {
      // System admin sees messages targeted to admin role
      query = {
        $or: [
          { targetUserId: userObjectId },
          { targetRole: 'admin' },
          { targetRole: 'all' },
        ],
        'readBy.userId': { $ne: userObjectId },
      };
    } else if (isBusinessAdmin && user.tenantId) {
      // Business admin sees messages from their tenant only
      const tenantObjectId = ObjectId.isValid(user.tenantId) ? new ObjectId(user.tenantId) : null;
      const tenantString = String(user.tenantId);
      query = {
        $or: [
          { targetUserId: userObjectId },
          { tenantId: tenantObjectId, targetRole: 'business_admin' },
          { tenantId: tenantString, targetRole: 'business_admin' },
        ],
        'readBy.userId': { $ne: userObjectId },
      };
    } else {
      // Regular user - messages targeted to them or their role
      query = {
        $or: [
          { targetUserId: userObjectId },
          { targetRole: { $in: ['all', user.role] } },
        ],
        'readBy.userId': { $ne: userObjectId },
      };
    }

    const count = await Message.countDocuments(query);

    return NextResponse.json({ ok: true, count });
  } catch (error) {
    console.error('UNREAD_COUNT_ERROR', error);
    const status = error?.status || 500;
    return NextResponse.json({ error: 'Server error', count: 0 }, { status });
  }
}
