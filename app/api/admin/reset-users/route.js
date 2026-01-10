export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminGuard } from '@/lib/auth/requireAuth';
import { isSuperAdminUser } from '@/lib/superAdmins';

/**
 * DELETE /api/admin/reset-users - מחיקת כל המשתמשים והנתונים הקשורים (רק Super Admin)
 * ⚠️ זהירות! פעולה זו בלתי הפיכה ומוחקת את כל המשתמשים!
 */
export async function DELETE(request) {
  try {
    const authResult = await requireAdminGuard(request);
    if (!authResult.ok) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    
    const user = authResult.user;
    
    if (!isSuperAdminUser(user)) {
      return NextResponse.json({ error: 'רק Super Admin יכול לבצע איפוס' }, { status: 403 });
    }
    
    const db = await getDb();
    
    // מחיקת כל הנתונים הקשורים למשתמשים
    const deleteResults = await Promise.allSettled([
      // הזמנות
      db.collection('orders').deleteMany({}),
      // עמלות
      db.collection('commissions').deleteMany({}),
      // בקשות משיכה
      db.collection('withdrawals').deleteMany({}),
      // עסקאות
      db.collection('transactions').deleteMany({}),
      // קופונים
      db.collection('coupons').deleteMany({}),
      // התראות
      db.collection('notifications').deleteMany({}),
      // לידים CRM
      db.collection('leads').deleteMany({}),
      // הודעות CRM
      db.collection('messages').deleteMany({}),
      // משימות CRM
      db.collection('tasks').deleteMany({}),
      // מנויי התראות
      db.collection('pushsubscriptions').deleteMany({}),
    ]);
    
    // מחיקת משתמשים - הגנה על מנהלים ראשיים מוגנים
    const PROTECTED_ADMINS = ['0587009938@gmail.com'];
    const usersDeleted = await db.collection('users').deleteMany({ 
      $and: [
        { role: { $ne: 'super_admin' } },
        { email: { $nin: PROTECTED_ADMINS } },
        { protected: { $ne: true } }
      ]
    });
    
    // סיכום המחיקות
    const deletedCounts = {
      users: usersDeleted.deletedCount,
    };
    
    const collections = [
      'orders', 'commissions', 'withdrawals', 'transactions', 'coupons',
      'notifications', 'leads', 'messages', 'tasks', 'pushsubscriptions'
    ];
    
    deleteResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value?.deletedCount) {
        deletedCounts[collections[index]] = result.value.deletedCount;
      }
    });
    
    console.log(`🗑️ RESET USERS: All users deleted by ${user.email || user._id}:`, deletedCounts);
    
    return NextResponse.json({
      ok: true,
      message: `נמחקו ${usersDeleted.deletedCount} משתמשים וכל הנתונים הקשורים`,
      deletedCounts,
    });
    
  } catch (error) {
    console.error('DELETE /api/admin/reset-users error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה באיפוס המשתמשים' },
      { status: 500 }
    );
  }
}
