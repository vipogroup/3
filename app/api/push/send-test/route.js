export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/auth/server';
import { findSubscriptionsByUserIds, getAllSubscriptions, removePushSubscription } from '@/lib/pushSubscriptions';
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

    // Get ALL subscriptions for debugging (including revoked)
    const allSubs = await getAllSubscriptions(true);
    console.log('SEND_TEST: Total subscriptions in DB:', allSubs?.length || 0);
    
    // Log all subscriptions for debugging
    allSubs.forEach((s, i) => {
      console.log(`SEND_TEST: Sub[${i}]:`, JSON.stringify({
        userId: s.userId,
        endpoint: s.endpoint?.slice(0, 60),
        revokedAt: s.revokedAt,
        tags: s.tags
      }));
    });

    // Find subscriptions for this user
    console.log('SEND_TEST: Looking for subscriptions for userId:', user.id, 'type:', typeof user.id);
    const subs = await findSubscriptionsByUserIds([user.id]);
    console.log('SEND_TEST: Found subscriptions for user:', subs?.length || 0);
    
    if (subs.length > 0) {
      console.log('SEND_TEST: First subscription:', JSON.stringify({
        endpoint: subs[0].endpoint?.slice(0, 80),
        hasKeys: !!subs[0].keys,
        tags: subs[0].tags,
        revokedAt: subs[0].revokedAt,
        userId: subs[0].userId,
        userObjectId: subs[0].userObjectId?.toString()
      }));
    }
    
    if (!subs.length) {
      // Check if user has any subscription (even revoked)
      const userSubsIncludingRevoked = allSubs.filter(s => 
        String(s.userId) === String(user.id) || 
        (s.userObjectId && String(s.userObjectId) === String(user.id))
      );
      
      // Return debug info
      const debugInfo = allSubs.slice(0, 10).map(s => ({
        oderId: s.userId,
        endpointPrefix: s.endpoint?.slice(0, 40),
        revokedAt: s.revokedAt ? 'YES' : 'NO',
        tags: s.tags,
        role: s.role
      }));
      
      let hint = 'לחץ על "אפשר התראות דחיפה" בתפריט החשבון שלי';
      if (userSubsIncludingRevoked.length > 0) {
        hint = 'נמצאו מנויים מבוטלים. לחץ על "אפשר התראות דחיפה" להפעלה מחדש';
      }
      
      return NextResponse.json({ 
        ok: false, 
        error: `לא נמצאו התקנים רשומים למשתמש`,
        hint,
        totalSubsInDb: allSubs.length,
        userSubsFound: userSubsIncludingRevoked.length,
        debug: debugInfo
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
        const statusCode = err?.statusCode || err?.status;
        const errorBody = err?.body || err?.response?.body || '';
        const errorHeaders = err?.headers || err?.response?.headers || {};
        console.error('SEND_TEST: FAILED', {
          message: err?.message,
          statusCode,
          body: errorBody,
          endpoint: sub.endpoint?.slice(0, 80),
          isApple: sub.endpoint?.includes('apple'),
        });
        
        // מחיקת subscriptions פגות (403 = VAPID mismatch, 410 = Gone)
        if (statusCode === 403 || statusCode === 410) {
          console.log('SEND_TEST: Removing invalid subscription:', sub.endpoint?.slice(0, 50));
          await removePushSubscription(sub.endpoint).catch(() => {});
        }
        
        results.push({ ok: false, error: err?.message, statusCode, body: errorBody, endpoint: sub.endpoint?.slice(0, 30) });
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
