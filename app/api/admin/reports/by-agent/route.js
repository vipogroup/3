import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth/server';
import { getByAgent } from '@/lib/reports';
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

    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const items = await getByAgent({ from, to });
    return NextResponse.json({ success: true, items, error: null });
  } catch (error) {
    const status = error?.status || 500;
    const message =
      status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Server error';
    return NextResponse.json({ error: message }, { status });
  }
}

