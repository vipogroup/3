export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';

/**
 * POST /api/referral/track
 * Track a referral click by ref code (coupon code or agent ID)
 * Body: { refCode, url, action }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { refCode, url, action = 'click' } = body;

    if (!refCode) {
      return NextResponse.json({ ok: false, error: 'refCode required' }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection('users');
    const referralLogs = db.collection('referral_logs');

    // Find agent by ref code - could be couponCode, referralId, or ObjectId
    let agent = null;

    // First try to find by couponCode
    agent = await users.findOne({ couponCode: refCode, role: 'agent' });

    // If not found, try referralId
    if (!agent) {
      agent = await users.findOne({ referralId: refCode, role: 'agent' });
    }

    // If still not found, try as ObjectId
    if (!agent) {
      try {
        const objectId = new ObjectId(refCode);
        agent = await users.findOne({ _id: objectId, role: 'agent' });
      } catch {
        // Not a valid ObjectId, ignore
      }
    }

    if (!agent) {
      // Agent not found, but still return ok to not expose info
      console.log('Referral track: agent not found for code:', refCode);
      return NextResponse.json({ ok: true, tracked: false });
    }

    // Get request headers for tracking
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    const referer = headersList.get('referer') || null;

    // Create log document
    const logDoc = {
      agentId: agent._id,
      refCode,
      ip: ip.split(',')[0].trim(),
      userAgent,
      referer,
      url: url || null,
      action,
      createdAt: new Date(),
    };

    await referralLogs.insertOne(logDoc);

    console.log('Referral click logged for agent:', agent._id, 'refCode:', refCode);

    return NextResponse.json({ ok: true, tracked: true });
  } catch (error) {
    console.error('REFERRAL_TRACK_ERROR:', error);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}
