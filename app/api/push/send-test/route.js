export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/auth/server';
import { findSubscriptionsByUserIds } from '@/lib/pushSubscriptions';
import { sendPushNotification, getWebPushConfig } from '@/lib/webPush';

// POST - שליחת התראת בדיקה למשתמש המחובר
export async function POST(request) {
  try {
    const user = await requireAuthApi(request);
    console.log('SEND_TEST: User authenticated', { userId: user.id, role: user.role });

    const config = getWebPushConfig();
    if (!config.configured) {
      return NextResponse.json({ 
        ok: false, 
        error: 'VAPID keys not configured' 
      }, { status: 400 });
    }

    // Find subscriptions for this user
    const subs = await findSubscriptionsByUserIds([user.id]);
    console.log('SEND_TEST: Found subscriptions', subs?.length || 0);
    
    if (!subs.length) {
      return NextResponse.json({ 
        ok: false, 
        error: 'No subscriptions found for your user',
        hint: 'לחץ על "אפשר התראות דחיפה" בתפריט החשבון שלי'
      }, { status: 404 });
    }

    const payload = {
      title: '🔔 התראת בדיקה',
      body: 'זוהי התראת בדיקה מ-VIPO - התראות עובדות!',
      icon: '/icons/192.png',
      badge: '/icons/badge.png',
      tag: 'test-notification-' + Date.now(),
      data: {
        type: 'test',
        url: '/products',
        timestamp: Date.now(),
      },
    };

    const results = [];
    for (const sub of subs) {
      try {
        console.log('SEND_TEST: Sending to endpoint', sub.endpoint?.slice(0, 50));
        await sendPushNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload
        );
        results.push({ ok: true, endpoint: sub.endpoint?.slice(0, 30) });
        console.log('SEND_TEST: SUCCESS');
      } catch (err) {
        console.error('SEND_TEST: FAILED', err?.message);
        results.push({ ok: false, error: err?.message, endpoint: sub.endpoint?.slice(0, 30) });
      }
    }

    const successCount = results.filter(r => r.ok).length;
    const failCount = results.filter(r => !r.ok).length;

    return NextResponse.json({
      ok: successCount > 0,
      sent: successCount,
      failed: failCount,
      results,
      message: successCount > 0 
        ? `נשלחו ${successCount} התראות בהצלחה!` 
        : 'לא הצלחנו לשלוח התראות',
    });
  } catch (error) {
    console.error('SEND_TEST: Error', error);
    const status = error?.status || 500;
    const message = status === 401 ? 'unauthorized' : error?.message || 'server_error';
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
