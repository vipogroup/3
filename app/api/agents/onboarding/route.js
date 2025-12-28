export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { requireAuthApi } from '@/lib/auth/server';

/**
 * PATCH /api/agents/onboarding
 * Updates agent onboarding information (phone, payout details)
 * Marks onboarding as complete
 */
export async function PATCH(req) {
  try {
    const user = await requireAuthApi(req);

    if (!user) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await req.json();
    const { phone, payoutDetails } = body;

    // Phone is REQUIRED for onboarding
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'מספר טלפון הוא שדה חובה' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 15) {
      return NextResponse.json(
        { error: 'מספר טלפון לא תקין (9-15 ספרות)' },
        { status: 400 }
      );
    }

    // Validate payout details if provided
    if (payoutDetails && typeof payoutDetails === 'string' && payoutDetails.length > 500) {
      return NextResponse.json(
        { error: 'פרטי תשלום ארוכים מדי (מקסימום 500 תווים)' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const users = db.collection('users');

    const userId = ObjectId.isValid(user.id) ? new ObjectId(user.id) : null;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Build update object - phone is required, payout details optional
    const updateFields = {
      phone: cleanPhone,
      onboardingCompletedAt: new Date(),
      updatedAt: new Date(),
    };

    if (payoutDetails && typeof payoutDetails === 'string') {
      updateFields.payoutDetails = payoutDetails.trim();
    }

    // Update user
    const result = await users.updateOne(
      { _id: userId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('[ONBOARDING] Updated user:', {
      userId: String(userId),
      phone: updateFields.phone,
      hasPayoutDetails: !!updateFields.payoutDetails,
    });

    return NextResponse.json({
      ok: true,
      message: 'Onboarding completed',
    });
  } catch (error) {
    console.error('[ONBOARDING] Error:', error);

    if (error.status === 401) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
