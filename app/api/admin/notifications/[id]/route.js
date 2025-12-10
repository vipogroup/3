import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { requireAdminApi } from '@/lib/auth/server';
import { connectMongo } from '@/lib/mongoose';
import Notification from '@/models/Notification';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';

export async function PATCH(req, { params }) {
  try {
    const admin = await requireAdminApi(req);
    const identifier = buildRateLimitKey(req, admin.id);
    const rateLimit = rateLimiters.admin(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    await connectMongo();
    const { id } = params || {};
    if (!id) {
      return NextResponse.json({ error: 'Missing notification id' }, { status: 400 });
    }

    const doc = await Notification.findByIdAndUpdate(id, { read: true }, { new: true }).lean();
    if (!doc) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: doc });
  } catch (error) {
    const status = error?.status || 500;
    const message =
      status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Server error';
    return NextResponse.json({ error: message }, { status });
  }
}
