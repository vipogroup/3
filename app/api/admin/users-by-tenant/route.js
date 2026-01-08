export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminApi } from '@/lib/auth/server';
import { isSuperAdmin } from '@/lib/tenant/tenantMiddleware';

export async function GET(req) {
  try {
    const admin = await requireAdminApi(req);
    
    // Only super admins can see users grouped by tenant
    // isSuperAdmin expects user object, not email
    if (!isSuperAdmin(admin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = await getDb();
    const users = db.collection('users');
    const tenants = db.collection('tenants');

    // Get all tenants
    const allTenants = await tenants.find({}).toArray();
    
    // Get all users (excluding password)
    const allUsers = await users.find({}, { 
      projection: { passwordHash: 0, password: 0 } 
    }).toArray();

    // Separate users: system users (no tenantId) vs tenant users
    const systemUsers = allUsers.filter(u => !u.tenantId);
    
    // Group users by tenant
    const usersByTenant = {};
    for (const tenant of allTenants) {
      const tenantId = String(tenant._id);
      usersByTenant[tenantId] = {
        tenant: {
          _id: tenantId,
          name: tenant.name,
          slug: tenant.slug,
          status: tenant.status,
        },
        users: allUsers.filter(u => u.tenantId && String(u.tenantId) === tenantId).map(u => ({
          ...u,
          _id: String(u._id),
          tenantId: String(u.tenantId),
        })),
      };
    }

    return NextResponse.json({
      systemUsers: systemUsers.map(u => ({
        ...u,
        _id: String(u._id),
      })),
      tenantGroups: Object.values(usersByTenant),
      totalUsers: allUsers.length,
      totalSystemUsers: systemUsers.length,
      totalTenantUsers: allUsers.length - systemUsers.length,
    });
  } catch (error) {
    console.error('GET /api/admin/users-by-tenant error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
