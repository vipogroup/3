export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { commissionPerReferral } from '@/app/config/commissions';
import { connectMongo } from '@/lib/mongoose';
import Notification from '@/models/Notification';
import { rateLimiters } from '@/lib/rateLimit';

export async function POST(req) {
  // Rate limiting: 3 requests per 10 minutes
  const rateLimit = rateLimiters.register(req);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, error: 'TOO_MANY_REQUESTS', message: rateLimit.message },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    );
  }

  try {
    const body = await req.json();
    const { fullName, phone, email, password, role, referrerId } = body;

    // Support both phone and email registration
    if (!password || !role) {
      return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });
    }

    if (!phone && !email) {
      return NextResponse.json({ ok: false, error: 'phone or email required' }, { status: 400 });
    }

    if (['admin'].includes(role)) {
      return NextResponse.json(
        { ok: false, error: 'admin_registration_disabled' },
        { status: 403 },
      );
    }

    if (!['agent', 'customer'].includes(role)) {
      return NextResponse.json({ ok: false, error: 'invalid role' }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection('users');

    // Check if user exists
    const query = email ? { email: email.toLowerCase().trim() } : { phone };
    const exists = await users.findOne(query);
    if (exists) {
      return NextResponse.json({ ok: false, error: 'user exists' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Get referrer ID from cookie or body (fallback to localStorage)
    const cookieStore = cookies();
    const cookieRef = cookieStore.get('refSource')?.value || null;
    const finalReferrerId = cookieRef || referrerId || null;

    // Create user document
    const doc = {
      fullName: fullName || '',
      phone: phone || null,
      email: email ? email.toLowerCase().trim() : null,
      passwordHash: passwordHash, // Fixed: use passwordHash instead of password
      role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add referredBy if valid referrer exists
    if (finalReferrerId) {
      try {
        const refUserId = new ObjectId(finalReferrerId);
        const refUser = await users.findOne({ _id: refUserId }, { projection: { _id: 1 } });
        if (refUser) {
          doc.referredBy = refUser._id;
        }
      } catch (err) {
        console.log('Invalid referrer ID:', finalReferrerId);
      }
    }

    const r = await users.insertOne(doc);
    const newUserId = r.insertedId;

    // Prevent self-referral (if somehow user referred themselves)
    if (doc.referredBy && String(doc.referredBy) === String(newUserId)) {
      await users.updateOne({ _id: newUserId }, { $unset: { referredBy: '' } });
      doc.referredBy = null;
    }

    // Update referrer's counter and commission (Stage 12)
    if (doc.referredBy) {
      try {
        await users.updateOne(
          { _id: doc.referredBy },
          {
            $inc: {
              referralsCount: 1,
              referralCount: 1,
              commissionBalance: commissionPerReferral,
            },
          },
        );

        // Log successful referral application
        console.log('REFERRAL_APPLIED', {
          referrerId: String(doc.referredBy),
          newUserId: String(newUserId),
          delta: commissionPerReferral,
        });
      } catch (refErr) {
        // Don't block registration if referrer update fails
        console.error('REFERRAL_APPLY_FAILED', {
          referrerId: String(doc.referredBy),
          newUserId: String(newUserId),
          reason: refErr.message,
        });
      }
    }

    // Create admin notification (Stage 2.5)
    try {
      await connectMongo();
      await Notification.create({
        type: 'new_user',
        message: `נרשם משתמש חדש: ${doc.email || doc.phone || doc.fullName || 'Unknown'}`,
        payload: {
          userId: newUserId,
          email: doc.email,
          fullName: doc.fullName,
        },
      });
    } catch (notifyErr) {
      console.error('REGISTER_NOTIFICATION_ERROR', notifyErr);
    }

    // Clear refSource cookie after successful registration
    const res = NextResponse.json({ ok: true, userId: String(newUserId) }, { status: 201 });
    res.cookies.set('refSource', '', { path: '/', maxAge: 0 });

    return res;
  } catch (e) {
    console.error('REGISTER_ERROR:', e);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}
