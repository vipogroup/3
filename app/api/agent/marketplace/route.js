export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { requireAuthApi } from '@/lib/auth/server';

/**
 * GET /api/agent/marketplace
 * Get all available businesses an agent can join
 */
export async function GET(req) {
  try {
    const user = await requireAuthApi(req);
    
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const agentId = new ObjectId(user.id);

    // Get all visible tenants (active, pending, or no status for backwards compatibility)
    // Exclude only suspended/inactive businesses
    const tenants = await db.collection('tenants')
      .find({ 
        status: { $nin: ['suspended', 'inactive'] }
      })
      .project({ 
        name: 1, 
        slug: 1, 
        logo: 1, 
        description: 1,
        defaultCommission: 1,
        allowAgentJoin: 1, // אם העסק מאפשר הצטרפות חופשית
      })
      .toArray();

    // Get agent's existing connections
    const connections = await db.collection('agentbusinesses')
      .find({ agentId })
      .project({ tenantId: 1, status: 1 })
      .toArray();

    const connectionMap = new Map(
      connections.map(c => [c.tenantId.toString(), c.status])
    );

    // Get products count per tenant
    const productCounts = await db.collection('products').aggregate([
      { $match: { active: true, tenantId: { $exists: true } } },
      { $group: { _id: '$tenantId', count: { $sum: 1 } } }
    ]).toArray();

    const productCountMap = new Map(
      productCounts.map(p => [p._id.toString(), p.count])
    );

    // Build response
    const businesses = tenants
      .filter(t => t.allowAgentJoin !== false) // אם לא הוגדר, ברירת מחדל = מאפשר
      .map(tenant => {
        const tenantIdStr = tenant._id.toString();
        const connectionStatus = connectionMap.get(tenantIdStr);
        
        return {
          id: tenantIdStr,
          name: tenant.name,
          slug: tenant.slug,
          logo: tenant.logo || null,
          description: tenant.description || '',
          commissionPercent: tenant.defaultCommission || 12,
          productsCount: productCountMap.get(tenantIdStr) || 0,
          isJoined: connectionStatus === 'active',
          isPending: connectionStatus === 'pending',
          wasBlocked: connectionStatus === 'blocked',
          canJoin: !connectionStatus || connectionStatus === 'left',
        };
      });

    return NextResponse.json({ ok: true, businesses });
  } catch (err) {
    console.error('AGENT_MARKETPLACE_GET_ERROR:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
