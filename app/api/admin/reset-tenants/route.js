import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminGuard } from '@/lib/auth/requireAuth';
import { isSuperAdminUser } from '@/lib/superAdmins';

/**
 * DELETE /api/admin/reset-tenants - מחיקת כל העסקים והנתונים הקשורים (רק Super Admin)
 * [WARN] זהירות! פעולה זו בלתי הפיכה ומוחקת את כל העסקים!
 */
async function DELETEHandler(request) {
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
    
    // מציאת כל ה-tenantIds
    const tenants = await db.collection('tenants').find({}).toArray();
    const tenantIds = tenants.map(t => t._id);
    
    if (tenantIds.length === 0) {
      return NextResponse.json({
        ok: true,
        message: 'אין עסקים למחיקה',
        deletedCounts: {},
      });
    }
    
    // מחיקת כל הנתונים הקשורים לעסקים
    const deleteResults = await Promise.allSettled([
      // הזמנות
      db.collection('orders').deleteMany({ tenantId: { $in: tenantIds } }),
      // מוצרים
      db.collection('products').deleteMany({ tenantId: { $in: tenantIds } }),
      // עמלות
      db.collection('commissions').deleteMany({ tenantId: { $in: tenantIds } }),
      // בקשות משיכה
      db.collection('withdrawals').deleteMany({ tenantId: { $in: tenantIds } }),
      // עסקאות
      db.collection('transactions').deleteMany({ tenantId: { $in: tenantIds } }),
      // קופונים
      db.collection('coupons').deleteMany({ tenantId: { $in: tenantIds } }),
      // התראות
      db.collection('notifications').deleteMany({ tenantId: { $in: tenantIds } }),
      // רמות גיימיפיקציה
      db.collection('gamificationlevels').deleteMany({ tenantId: { $in: tenantIds } }),
      db.collection('levelrules').deleteMany({ tenantId: { $in: tenantIds } }),
      // לידים CRM
      db.collection('leads').deleteMany({ tenantId: { $in: tenantIds } }),
      // הודעות CRM
      db.collection('messages').deleteMany({ tenantId: { $in: tenantIds } }),
      // משימות CRM
      db.collection('tasks').deleteMany({ tenantId: { $in: tenantIds } }),
      // אוטומציות CRM
      db.collection('automations').deleteMany({ tenantId: { $in: tenantIds } }),
      // תבניות הודעות
      db.collection('templates').deleteMany({ tenantId: { $in: tenantIds } }),
      // קטגוריות
      db.collection('categories').deleteMany({ tenantId: { $in: tenantIds } }),
      // הגדרות
      db.collection('settings').deleteMany({ tenantId: { $in: tenantIds } }),
    ]);
    
    // מחיקת משתמשים השייכים לעסקים (לא כולל super_admin)
    const usersDeleted = await db.collection('users').deleteMany({ 
      tenantId: { $in: tenantIds },
      role: { $ne: 'super_admin' }
    });
    
    // מחיקת כל העסקים
    const tenantsDeleted = await db.collection('tenants').deleteMany({});
    
    // סיכום המחיקות
    const deletedCounts = {
      tenants: tenantsDeleted.deletedCount,
      users: usersDeleted.deletedCount,
    };
    
    const collections = [
      'orders', 'products', 'commissions', 'withdrawals', 'transactions',
      'coupons', 'notifications', 'gamificationlevels', 'levelrules', 'leads', 
      'messages', 'tasks', 'automations', 'templates', 'categories', 'settings'
    ];
    
    deleteResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value?.deletedCount) {
        deletedCounts[collections[index]] = result.value.deletedCount;
      }
    });
    
    console.log(`[DEL] RESET: All tenants deleted by ${user.email}:`, deletedCounts);
    
    return NextResponse.json({
      ok: true,
      message: `נמחקו ${tenantsDeleted.deletedCount} עסקים וכל הנתונים הקשורים`,
      deletedCounts,
    });
    
  } catch (error) {
    console.error('DELETE /api/admin/reset-tenants error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה באיפוס העסקים' },
      { status: 500 }
    );
  }
}

export const DELETE = withErrorLogging(DELETEHandler);
