export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/auth/server';
import { findSubscriptionsByUserIds, getAllSubscriptions, deleteAllUserSubscriptions } from '@/lib/pushSubscriptions';
import { getWebPushConfig } from '@/lib/webPush';

// GET - מידע דיבוג על ההתראות
export async function GET(request) {
  try {
    const user = await requireAuthApi(request);
    
    const config = getWebPushConfig();
    const allSubs = await getAllSubscriptions();
    const userSubs = await findSubscriptionsByUserIds([user.id]);
    
    // בדיקת iOS subscriptions
    const iosSubs = allSubs.filter(s => 
      s.endpoint?.includes('web.push.apple.com') || 
      s.userAgent?.includes('iPhone') || 
      s.userAgent?.includes('iPad')
    );
    
    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        role: user.role
      },
      vapid: {
        configured: config.configured,
        publicKeyLength: config.publicKey?.length || 0,
        publicKeyPreview: config.publicKey?.slice(0, 30) + '...',
        contact: config.contact
      },
      subscriptions: {
        total: allSubs.length,
        forCurrentUser: userSubs.length,
        iosTotal: iosSubs.length,
        userSubscriptions: userSubs.map(s => ({
          endpoint: s.endpoint?.slice(0, 60),
          hasKeys: !!s.keys,
          hasAuth: !!s.keys?.auth,
          hasP256dh: !!s.keys?.p256dh,
          tags: s.tags,
          revokedAt: s.revokedAt,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          isIOS: s.endpoint?.includes('web.push.apple.com')
        }))
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      error: error?.message || 'server_error' 
    }, { status: error?.status || 500 });
  }
}

// DELETE - מחיקת כל ה-subscriptions של המשתמש
export async function DELETE(request) {
  try {
    const user = await requireAuthApi(request);
    
    console.log('DEBUG_DELETE: Deleting all subscriptions for user:', user.id);
    const result = await deleteAllUserSubscriptions(user.id);
    
    return NextResponse.json({
      ok: true,
      deletedCount: result.deletedCount,
      message: `נמחקו ${result.deletedCount} subscriptions. עכשיו כבה והפעל מחדש את ההתראות.`
    });
  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      error: error?.message || 'server_error' 
    }, { status: error?.status || 500 });
  }
}
