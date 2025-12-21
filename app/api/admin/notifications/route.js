import { NextResponse } from 'next/server';

import { requireAdminApi } from '@/lib/auth/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';
import { listNotificationTemplates } from '@/lib/notifications/templates';
import { listScheduledNotifications } from '@/lib/notifications/scheduler';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const admin = await requireAdminApi(req);
    const identifier = buildRateLimitKey(req, admin.id);
    const rateLimit = rateLimiters.admin(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    }

    const templates = await listNotificationTemplates();
    const scheduled = await listScheduledNotifications({ status: ['pending', 'paused'] });

    return NextResponse.json({ ok: true, templates, scheduled });
  } catch (error) {
    const status = error?.status || 500;
    const message = status === 401 ? 'unauthorized' : status === 403 ? 'forbidden' : 'server_error';
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

