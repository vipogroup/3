import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentTenant } from '@/lib/tenant';

/**
 * Cleanup messages that have been read by all intended recipients
 * Can be called via cron job or manually by admin
 */
async function POSTHandler(req) {
  try {
    // Verify cron secret or admin auth
    const cronSecret = req.headers.get('x-cron-secret');
    const expectedSecret = process.env.CRON_SECRET || 'vipo-cron-secret';
    
    if (cronSecret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenant = await getCurrentTenant(req);
    const tenantId = tenant?._id || null;
    const tenantFilter = tenantId
      ? { tenantId: { $in: [tenantId, String(tenantId)] } }
      : { tenantId: { $in: [null, undefined] } };

    const db = await getDb();
    const usersCol = db.collection('users');
    const messagesCol = db.collection('messages');

    // Get all messages
    const messages = await messagesCol.find(tenantFilter).toArray();
    
    let deletedCount = 0;
    const deletedIds = [];

    for (const msg of messages) {
      const readByUserIds = (msg.readBy || []).map((r) => String(r.userId));
      
      // Skip if no one has read it yet
      if (readByUserIds.length === 0) continue;

      let shouldDelete = false;

      if (msg.targetRole === 'direct' && msg.targetUserId) {
        // Direct message: delete if target user has read it
        const targetRead = readByUserIds.includes(String(msg.targetUserId));
        shouldDelete = targetRead;
      } else if (msg.targetRole === 'all') {
        // Broadcast: delete if message is older than 7 days and has been read by at least 10 users
        const isOld = new Date() - new Date(msg.createdAt) > 7 * 24 * 60 * 60 * 1000;
        shouldDelete = isOld && readByUserIds.length >= 10;
      } else {
        // Role-based message (admin/agent/customer)
        // Get count of users with that role
        const roleCount = await usersCol.countDocuments({ role: msg.targetRole, ...tenantFilter });
        
        // Delete if at least 80% of target role has read it
        const readPercentage = roleCount > 0 ? (readByUserIds.length / roleCount) * 100 : 0;
        shouldDelete = readPercentage >= 80;
      }

      if (shouldDelete) {
        await messagesCol.deleteOne({ _id: msg._id, ...tenantFilter });
        deletedCount++;
        deletedIds.push(String(msg._id));
      }
    }

    console.log('MESSAGES_CLEANUP', { deletedCount, deletedIds });

    return NextResponse.json({
      ok: true,
      deletedCount,
      deletedIds,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('MESSAGES_CLEANUP_ERROR', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * GET endpoint to check cleanup stats without deleting
 */
async function GETHandler(req) {
  try {
    const cronSecret = req.headers.get('x-cron-secret');
    const expectedSecret = process.env.CRON_SECRET || 'vipo-cron-secret';
    
    if (cronSecret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenant = await getCurrentTenant(req);
    const tenantId = tenant?._id || null;
    const tenantFilter = tenantId ? { tenantId: { $in: [tenantId, String(tenantId)] } } : { tenantId: { $in: [null, undefined] } };

    const db = await getDb();
    const usersCol = db.collection('users');
    const messagesCol = db.collection('messages');

    const messages = await messagesCol.find(tenantFilter).toArray();
    
    let eligibleForDeletion = 0;
    const stats = {
      total: messages.length,
      direct: { total: 0, readByTarget: 0 },
      broadcast: { total: 0, oldAndRead: 0 },
      roleBased: { total: 0, mostlyRead: 0 },
    };

    for (const msg of messages) {
      const readByUserIds = (msg.readBy || []).map((r) => String(r.userId));

      if (msg.targetRole === 'direct' && msg.targetUserId) {
        stats.direct.total++;
        if (readByUserIds.includes(String(msg.targetUserId))) {
          stats.direct.readByTarget++;
          eligibleForDeletion++;
        }
      } else if (msg.targetRole === 'all') {
        stats.broadcast.total++;
        const isOld = new Date() - new Date(msg.createdAt) > 7 * 24 * 60 * 60 * 1000;
        if (isOld && readByUserIds.length >= 10) {
          stats.broadcast.oldAndRead++;
          eligibleForDeletion++;
        }
      } else {
        stats.roleBased.total++;
        const roleCount = await usersCol.countDocuments({ role: msg.targetRole, ...tenantFilter });
        const readPercentage = roleCount > 0 ? (readByUserIds.length / roleCount) * 100 : 0;
        if (readPercentage >= 80) {
          stats.roleBased.mostlyRead++;
          eligibleForDeletion++;
        }
      }
    }

    return NextResponse.json({
      ok: true,
      stats,
      eligibleForDeletion,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('MESSAGES_CLEANUP_STATS_ERROR', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const POST = withErrorLogging(POSTHandler);
export const GET = withErrorLogging(GETHandler);
