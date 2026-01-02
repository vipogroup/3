/**
 * Admin API - Priority Status
 * GET /api/admin/priority/status - סטטוס חיבור לפריוריטי
 */

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getPriorityClient, isPriorityConfigured } from '@/lib/priority/client';
import { validatePriorityConfig } from '@/lib/priority/config';
import dbConnect from '@/lib/dbConnect';
import IntegrationSyncMap from '@/models/IntegrationSyncMap';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const configStatus = validatePriorityConfig();
    
    if (!configStatus.ok) {
      return NextResponse.json({
        ok: false,
        configured: false,
        missing: configStatus.missing,
        message: 'Priority not configured',
      });
    }

    // Test connection
    const client = getPriorityClient();
    let connectionTest = { connected: false, message: 'Client unavailable' };
    
    if (client) {
      connectionTest = await client.testConnection();
    }

    // Get sync stats
    await dbConnect();
    const syncStats = await IntegrationSyncMap.aggregate([
      {
        $group: {
          _id: '$syncStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = syncStats.reduce((acc, s) => {
      acc[s._id] = s.count;
      return acc;
    }, {});

    // Recent errors
    const recentErrors = await IntegrationSyncMap.find({
      syncStatus: 'failed',
    })
      .sort({ lastSyncAttempt: -1 })
      .limit(10)
      .select('orderId syncStatus lastSyncAttempt errorLog')
      .lean();

    return NextResponse.json({
      ok: true,
      configured: true,
      connected: connectionTest.connected,
      connectionMessage: connectionTest.message,
      environment: process.env.PRIORITY_ENV || 'sandbox',
      companyCode: process.env.PRIORITY_COMPANY_CODE || 'N/A',
      stats: {
        synced: stats.synced || 0,
        pending: stats.pending || 0,
        failed: stats.failed || 0,
        partial: stats.partial || 0,
      },
      recentErrors: recentErrors.map(e => ({
        orderId: e.orderId,
        status: e.syncStatus,
        lastAttempt: e.lastSyncAttempt,
        lastError: e.errorLog?.slice(-1)[0],
      })),
    });

  } catch (err) {
    console.error('[ADMIN_PRIORITY_STATUS]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await req.json();

    if (action === 'test_connection') {
      const client = getPriorityClient(true); // Force new client
      if (!client) {
        return NextResponse.json({
          ok: false,
          message: 'Priority not configured',
        });
      }

      const result = await client.testConnection();
      return NextResponse.json({
        ok: result.connected,
        message: result.message,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (err) {
    console.error('[ADMIN_PRIORITY_STATUS_ACTION]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
