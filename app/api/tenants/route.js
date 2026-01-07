/**
 * API Route: /api/tenants
 * ניהול עסקים (tenants) - רק Super Admin
 */

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminGuard } from '@/lib/auth/requireAuth';
import { isSuperAdmin } from '@/lib/tenant';
import { ObjectId } from 'mongodb';

/**
 * GET /api/tenants - קבלת רשימת כל העסקים
 * רק Super Admin יכול לראות את כל העסקים
 */
export async function GET(request) {
  try {
    const authResult = await requireAdminGuard(request);
    if (!authResult.ok) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const user = authResult.user;
    
    // Only super admin can list all tenants
    if (!isSuperAdmin(user)) {
      return NextResponse.json(
        { error: 'אין הרשאה לצפות בעסקים' },
        { status: 403 }
      );
    }
    
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    
    // Build query
    const query = {};
    const status = searchParams.get('status');
    if (status) {
      query.status = status;
    }
    
    const tenants = await db.collection('tenants')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    // Calculate stats for each tenant
    const tenantsWithStats = await Promise.all(
      tenants.map(async (tenant) => {
        const [ordersCount, usersCount, productsCount] = await Promise.all([
          db.collection('orders').countDocuments({ tenantId: tenant._id }),
          db.collection('users').countDocuments({ tenantId: tenant._id }),
          db.collection('products').countDocuments({ tenantId: tenant._id }),
        ]);
        
        return {
          ...tenant,
          stats: {
            ...tenant.stats,
            totalOrders: ordersCount,
            totalUsers: usersCount,
            totalProducts: productsCount,
          },
        };
      })
    );
    
    return NextResponse.json({
      ok: true,
      tenants: tenantsWithStats,
      total: tenantsWithStats.length,
    });
  } catch (error) {
    console.error('GET /api/tenants error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה בטעינת העסקים' },
      { status: error.message?.includes('הרשאה') ? 403 : 500 }
    );
  }
}

/**
 * POST /api/tenants - יצירת עסק חדש
 * רק Super Admin יכול ליצור עסקים
 */
export async function POST(request) {
  try {
    const authResult = await requireAdminGuard(request);
    if (!authResult.ok) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const user = authResult.user;
    
    if (!isSuperAdmin(user)) {
      return NextResponse.json(
        { error: 'אין הרשאה ליצור עסקים' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { name, slug, domain, subdomain, ownerId, platformCommissionRate = 5 } = body;
    
    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'שם ו-slug הם שדות חובה' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    
    // Check for duplicate slug
    const existingSlug = await db.collection('tenants').findOne({ slug: slug.toLowerCase() });
    if (existingSlug) {
      return NextResponse.json(
        { error: 'קיים כבר עסק עם slug זהה' },
        { status: 400 }
      );
    }
    
    // Check for duplicate domain/subdomain
    if (domain) {
      const existingDomain = await db.collection('tenants').findOne({ domain: domain.toLowerCase() });
      if (existingDomain) {
        return NextResponse.json(
          { error: 'קיים כבר עסק עם דומיין זהה' },
          { status: 400 }
        );
      }
    }
    
    if (subdomain) {
      const existingSubdomain = await db.collection('tenants').findOne({ subdomain: subdomain.toLowerCase() });
      if (existingSubdomain) {
        return NextResponse.json(
          { error: 'קיים כבר עסק עם subdomain זהה' },
          { status: 400 }
        );
      }
    }
    
    // Create tenant
    const newTenant = {
      name: name.trim(),
      slug: slug.toLowerCase().trim(),
      domain: domain ? domain.toLowerCase().trim() : null,
      subdomain: subdomain ? subdomain.toLowerCase().trim() : null,
      ownerId: ownerId ? new ObjectId(ownerId) : null,
      status: 'pending',
      platformCommissionRate: Math.min(100, Math.max(0, platformCommissionRate)),
      branding: {
        logo: null,
        favicon: null,
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#10B981',
      },
      contact: {
        email: null,
        phone: null,
        whatsapp: null,
        address: null,
      },
      social: {},
      seo: {},
      features: {
        registration: true,
        groupPurchase: true,
        notifications: true,
        darkMode: false,
        agentSystem: true,
        coupons: true,
      },
      agentSettings: {
        defaultCommissionPercent: 12,
        defaultDiscountPercent: 10,
        commissionHoldDays: 30,
        groupPurchaseHoldDays: 100,
      },
      billing: {
        pendingBalance: 0,
        totalPaid: 0,
        lastPaymentAt: null,
        paymentMethod: null,
        bankDetails: {},
      },
      stats: {
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalAgents: 0,
        totalCustomers: 0,
      },
      createdAt: new Date(),
      createdBy: user._id,
    };
    
    const result = await db.collection('tenants').insertOne(newTenant);
    
    // If ownerId provided, update user to be business_admin
    if (ownerId) {
      await db.collection('users').updateOne(
        { _id: new ObjectId(ownerId) },
        { 
          $set: { 
            tenantId: result.insertedId,
            role: 'admin',
          } 
        }
      );
    }
    
    return NextResponse.json({
      ok: true,
      tenant: { ...newTenant, _id: result.insertedId },
      message: 'העסק נוצר בהצלחה',
    });
  } catch (error) {
    console.error('POST /api/tenants error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה ביצירת העסק' },
      { status: 500 }
    );
  }
}
