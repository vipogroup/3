export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth/server';
import { getAllSubscriptions, findSubscriptionsByTags } from '@/lib/pushSubscriptions';
import { sendPushNotification, getWebPushConfig } from '@/lib/webPush';

// GET - בדיקת סטטוס המנויים
export async function GET(request) {
  try {
    await requireAdminApi(request);

    const config = getWebPushConfig();
    const allSubs = await getAllSubscriptions();
    const customerSubs = await findSubscriptionsByTags(['customer']);
    const agentSubs = await findSubscriptionsByTags(['agent']);

    return NextResponse.json({
      ok: true,
      vapidConfigured: config.configured,
      publicKeyLength: config.publicKey?.length || 0,
      totalSubscriptions: allSubs.length,
      customerSubscriptions: customerSubs.length,
      agentSubscriptions: agentSubs.length,
      subscriptions: allSubs.map(sub => ({
        endpoint: sub.endpoint?.slice(0, 50) + '...',
        tags: sub.tags,
        role: sub.role,
        userId: sub.userId,
        createdAt: sub.createdAt,
        revokedAt: sub.revokedAt,
      })),
    });
  } catch (error) {
    console.error('GET /api/push/test error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error?.message || 'Failed to get subscriptions' 
    }, { status: error?.status || 500 });
  }
}

// POST - שליחת התראת בדיקה
export async function POST(request) {
  try {
    await requireAdminApi(request);

    const config = getWebPushConfig();
    if (!config.configured) {
      return NextResponse.json({ 
        ok: false, 
        error: 'VAPID keys not configured' 
      }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const targetTag = body.tag || 'customer';

    const subs = await findSubscriptionsByTags([targetTag]);
    
    if (!subs.length) {
      return NextResponse.json({ 
        ok: false, 
        error: `No subscriptions found for tag: ${targetTag}`,
        suggestion: 'המשתמש צריך ללחוץ על "הפעל התראות" בתפריט החשבון שלי'
      }, { status: 404 });
    }

    const payload = {
      title: '🔔 התראת בדיקה',
      body: 'זוהי התראת בדיקה מ-VIPO',
      icon: '/icons/192.png',
      badge: '/icons/badge.png',
      tag: 'test-notification',
      data: {
        type: 'test',
        url: '/products',
      },
    };

    const results = [];
    for (const sub of subs) {
      try {
        await sendPushNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload
        );
        results.push({ endpoint: sub.endpoint?.slice(0, 30), ok: true });
        console.log('TEST_PUSH: Success for', sub.endpoint?.slice(0, 30));
      } catch (err) {
        results.push({ endpoint: sub.endpoint?.slice(0, 30), ok: false, error: err?.message });
        console.error('TEST_PUSH: Failed for', sub.endpoint?.slice(0, 30), err?.message);
      }
    }

    return NextResponse.json({
      ok: true,
      sent: results.filter(r => r.ok).length,
      failed: results.filter(r => !r.ok).length,
      results,
    });
  } catch (error) {
    console.error('POST /api/push/test error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error?.message || 'Failed to send test notification' 
    }, { status: error?.status || 500 });
  }
}
