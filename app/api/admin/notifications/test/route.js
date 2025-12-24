import { NextResponse } from 'next/server';

import { requireAdminApi } from '@/lib/auth/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';
import { getNotificationTemplate } from '@/lib/notifications/templates';
import { pushToUsers } from '@/lib/pushSender';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const admin = await requireAdminApi(req);
    const identifier = buildRateLimitKey(req, admin.id);
    const rateLimit = rateLimiters.admin(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    }

    const body = await req.json();
    const { templateType, title, body: messageBody } = body;

    if (!templateType) {
      return NextResponse.json({ ok: false, error: 'template_type_required' }, { status: 400 });
    }

    const template = await getNotificationTemplate(templateType);
    if (!template) {
      return NextResponse.json({ ok: false, error: 'template_not_found' }, { status: 404 });
    }

    const payload = {
      title: title || template.title || 'התראת בדיקה',
      body: messageBody || template.body || 'זוהי התראת בדיקה מדף ניהול ההתראות',
      data: {
        templateType: template.type,
        isTest: true,
      },
    };

    const result = await pushToUsers([admin.id], payload);

    return NextResponse.json({
      ok: true,
      message: 'test_notification_sent',
      sentTo: admin.email,
      deliveryCount: result?.length || 0,
    });
  } catch (error) {
    console.error('Test notification error:', error);
    const status = error?.status || 500;
    const message = status === 401 ? 'unauthorized' : status === 403 ? 'forbidden' : 'server_error';
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
