/**
 * API Route: /api/admin/tenant-stats
 * סטטיסטיקות מכירות לפי tenant - Super Admin בלבד
 */

import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminGuard } from '@/lib/auth/requireAuth';
import { isSuperAdmin } from '@/lib/tenant';
import { ObjectId } from 'mongodb';

async function GETHandler(request) {
  try {
    const authResult = await requireAdminGuard(request);
    if (!authResult.ok) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    
    const user = authResult.user;
    
    // Only super admin can see all tenant stats
    if (!isSuperAdmin(user)) {
      return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
    }
    
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // day, week, month, year, all
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = null;
    }
    
    // Get all tenants
    const tenants = await db.collection('tenants').find({ status: 'active' }).toArray();
    
    // Calculate stats for each tenant
    const tenantStats = await Promise.all(tenants.map(async (tenant) => {
      const matchQuery = { 
        tenantId: tenant._id,
        paymentStatus: 'success',
      };
      
      if (startDate) {
        matchQuery.createdAt = { $gte: startDate };
      }
      
      // Get sales stats
      const salesAgg = await db.collection('orders').aggregate([
        { $match: matchQuery },
        { 
          $group: {
            _id: null,
            totalSales: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
            avgOrderValue: { $avg: '$totalAmount' },
          }
        }
      ]).toArray();
      
      const stats = salesAgg[0] || { totalSales: 0, orderCount: 0, avgOrderValue: 0 };
      
      // Calculate platform commission (5%)
      const platformCommission = stats.totalSales * (tenant.platformCommissionRate || 5) / 100;
      const tenantEarnings = stats.totalSales - platformCommission;
      
      return {
        tenantId: tenant._id,
        tenantName: tenant.name,
        tenantSlug: tenant.slug,
        domain: tenant.domain || tenant.subdomain,
        platformCommissionRate: tenant.platformCommissionRate || 5,
        totalSales: Math.round(stats.totalSales * 100) / 100,
        orderCount: stats.orderCount,
        avgOrderValue: Math.round(stats.avgOrderValue * 100) / 100,
        platformCommission: Math.round(platformCommission * 100) / 100,
        tenantEarnings: Math.round(tenantEarnings * 100) / 100,
        pendingBalance: tenant.billing?.pendingBalance || 0,
        totalPaid: tenant.billing?.totalPaid || 0,
      };
    }));
    
    // Calculate totals
    const totals = {
      totalSales: tenantStats.reduce((sum, t) => sum + t.totalSales, 0),
      totalOrders: tenantStats.reduce((sum, t) => sum + t.orderCount, 0),
      totalPlatformCommission: tenantStats.reduce((sum, t) => sum + t.platformCommission, 0),
      totalTenantEarnings: tenantStats.reduce((sum, t) => sum + t.tenantEarnings, 0),
      totalPendingBalance: tenantStats.reduce((sum, t) => sum + t.pendingBalance, 0),
      activeTenants: tenants.length,
    };
    
    return NextResponse.json({
      ok: true,
      period,
      startDate,
      tenants: tenantStats,
      totals,
    });
  } catch (error) {
    console.error('GET /api/admin/tenant-stats error:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הסטטיסטיקות' },
      { status: 500 }
    );
  }
}

export const GET = withErrorLogging(GETHandler);
