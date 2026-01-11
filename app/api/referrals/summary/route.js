import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getUserFromCookies } from '@/lib/auth/server';

async function GETHandler() {
  try {
    // Get current user from session
    const user = await getUserFromCookies();

    if (!user || !user.id) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const users = db.collection('users');

    // Get user's referral data
    const userData = await users.findOne({ _id: user.id }, { projection: { referralsCount: 1 } });

    const refCount = userData?.referralsCount || 0;

    // Build referral link
    const base = process.env.PUBLIC_URL || 'http://localhost:3001';
    const myRefLink = `${base}/?ref=${user.id}`;

    return NextResponse.json({
      ok: true,
      myRefLink,
      referrals: {
        total: refCount,
      },
      credits: {
        total: 0, // For future use
      },
    });
  } catch (err) {
    console.error('REFERRALS_SUMMARY_ERROR:', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}

export const GET = withErrorLogging(GETHandler);
