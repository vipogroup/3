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
    const { phone, payoutDetails, skip } = body;

    // Validate phone if provided
    if (phone && typeof phone === 'string') {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length > 0 && (cleanPhone.length < 9 || cleanPhone.length > 15)) {
        return NextResponse.json(
          { error: 'מספר טלפון לא תקין' },
          { status: 400 }
        );
      }
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

    // Build update object
    const updateFields = {
      onboardingCompletedAt: new Date(),
      updatedAt: new Date(),
    };

    if (!skip) {
      if (phone && typeof phone === 'string' && phone.trim()) {
        // Normalize phone number
        let normalizedPhone = phone.trim().replace(/\D/g, '');
        if (normalizedPhone.startsWith('0')) {
          normalizedPhone = normalizedPhone; // Keep as is for Israeli format
        }
        updateFields.phone = normalizedPhone;
      }

      if (payoutDetails && typeof payoutDetails === 'string') {
        updateFields.payoutDetails = payoutDetails.trim();
      }
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
      skip: !!skip,
      hasPhone: !!updateFields.phone,
      hasPayoutDetails: !!updateFields.payoutDetails,
    });

    return NextResponse.json({
      ok: true,
      message: skip ? 'Onboarding skipped' : 'Onboarding completed',
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
