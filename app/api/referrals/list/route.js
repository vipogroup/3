import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getUserFromCookies } from '@/lib/auth/server';

/**
 * GET /api/referrals/list
 * Returns list of users referred by the current user
 */
export async function GET() {
  try {
    // Get current user from session
    const user = await getUserFromCookies();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const users = db.collection('users');

    // Find all users referred by current user
    const referrals = await users
      .find(
        { referredBy: user.id },
        {
          projection: {
            fullName: 1,
            email: 1,
            phone: 1,
            role: 1,
            createdAt: 1,
            _id: 1,
          },
        },
      )
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      ok: true,
      count: referrals.length,
      referrals: referrals.map((r) => ({
        _id: String(r._id),
        fullName: r.fullName,
        email: r.email || null,
        phone: r.phone || null,
        role: r.role,
        createdAt: r.createdAt,
      })),
    });
  } catch (err) {
    console.error('REFERRALS_LIST_ERROR:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
