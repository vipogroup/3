import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth/server';
import { connectMongo } from '@/lib/mongoose';
import Notification from '@/models/Notification';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const admin = await requireAdminApi(req);
    const identifier = buildRateLimitKey(req, admin.id);
    const rateLimit = rateLimiters.admin(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    await connectMongo();
    const items = await Notification.find({}).sort({ createdAt: -1 }).limit(50).lean();

    return NextResponse.json({ success: true, items });
  } catch (error) {
    const status = error?.status || 500;
    const message =
      status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Server error';
    return NextResponse.json({ error: message }, { status });
  }
}

