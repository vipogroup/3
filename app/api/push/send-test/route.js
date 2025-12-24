export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/auth/server';
import { findSubscriptionsByUserIds } from '@/lib/pushSubscriptions';
import { sendPushNotification, getWebPushConfig } from '@/lib/webPush';

// POST - שליחת התראת בדיקה למשתמש המחובר
export async function POST(request) {
  try {
    console.log('SEND_TEST: Starting...');
    const user = await requireAuthApi(request);
    console.log('SEND_TEST: User authenticated', { userId: user.id, role: user.role });

    const config = getWebPushConfig();
    console.log('SEND_TEST: VAPID configured:', config.configured, 'publicKey length:', config.publicKey?.length);
    
    if (!config.configured) {
      return NextResponse.json({ 
        ok: false, 
        error: 'VAPID keys not configured - בדוק את משתני הסביבה WEB_PUSH_PUBLIC_KEY ו-WEB_PUSH_PRIVATE_KEY' 
      }, { status: 400 });
    }

    // Find subscriptions for this user
    console.log('SEND_TEST: Looking for subscriptions for userId:', user.id);
    const subs = await findSubscriptionsByUserIds([user.id]);
    console.log('SEND_TEST: Found subscriptions:', subs?.length || 0);
    
    if (subs.length > 0) {
      console.log('SEND_TEST: First subscription:', JSON.stringify({
        endpoint: subs[0].endpoint?.slice(0, 80),
        hasKeys: !!subs[0].keys,
        tags: subs[0].tags,
        revokedAt: subs[0].revokedAt
      }));
    }
    
    if (!subs.length) {
      return NextResponse.json({ 
        ok: false, 
        error: 'לא נמצאו התקנים רשומים להתראות. נסה לכבות ולהפעיל מחדש את ההתראות.',
        hint: 'לחץ על "התראות מופעלות" לכיבוי, ואז שוב על "אפשר התראות דחיפה" להפעלה'
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
        console.log('SEND_TEST: Sending to endpoint', sub.endpoint?.slice(0, 80));
        console.log('SEND_TEST: Keys present:', !!sub.keys, 'auth:', !!sub.keys?.auth, 'p256dh:', !!sub.keys?.p256dh);
        await sendPushNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload
        );
        results.push({ ok: true, endpoint: sub.endpoint?.slice(0, 30) });
        console.log('SEND_TEST: SUCCESS');
      } catch (err) {
        console.error('SEND_TEST: FAILED', err?.message, err?.statusCode || err?.status);
        results.push({ ok: false, error: err?.message, statusCode: err?.statusCode || err?.status, endpoint: sub.endpoint?.slice(0, 30) });
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
