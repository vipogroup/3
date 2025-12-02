import { NextResponse } from 'next/server';

import { requireAdminGuard } from '@/lib/auth/requireAuth';
import { connectMongo } from '@/lib/mongoose';
import Notification from '@/models/Notification';

export async function GET(req) {
  const auth = await requireAdminGuard(req);
  if (!auth?.ok) {
    return NextResponse.json(
      { error: auth?.error || 'Unauthorized' },
      { status: auth?.status || 401 },
    );
  }

  await connectMongo();
  const items = await Notification.find({}).sort({ createdAt: -1 }).limit(50).lean();

  return NextResponse.json({ success: true, items });
}
