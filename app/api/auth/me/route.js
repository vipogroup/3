import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/auth/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

async function GETHandler(req) {
  try {
    const user = await requireAuthApi(req);
    
    if (!user) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    // Get tenant slug if user has tenantId
    let tenantSlug = null;
    if (user.tenantId) {
      try {
        const db = await getDb();
        const tenantObjectId = ObjectId.isValid(user.tenantId) ? new ObjectId(user.tenantId) : null;
        if (tenantObjectId) {
          const tenant = await db.collection('tenants').findOne(
            { _id: tenantObjectId },
            { projection: { slug: 1 } }
          );
          tenantSlug = tenant?.slug || null;
        }
      } catch (e) {
        console.error('Error fetching tenant slug:', e);
      }
    }

    return NextResponse.json({
      ok: true,
      user: {
        _id: user._id || user.id,
        email: user.email,
        fullName: user.fullName || user.email,
        phone: user.phone,
        role: user.role || 'customer',
        name: user.fullName || user.email,
        showPushButtons: user.showPushButtons !== false,
        permissions: user.permissions,
        tenantId: user.tenantId ? String(user.tenantId) : null,
        tenantSlug: tenantSlug,
        // Impersonation support - pass through from JWT
        impersonating: user.impersonating || false,
        originalRole: user.originalRole || null,
      },
    });
  } catch (e) {
    const status = e.status || 401;
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status });
  }
}

export const GET = withErrorLogging(GETHandler);
