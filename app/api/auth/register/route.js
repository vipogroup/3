export const dynamic = 'force-dynamic';

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
import { generateAgentCoupon } from '@/lib/agents';
import { pushToRoles } from '@/lib/pushSender';

const automationKey = process.env.AUTOMATION_KEY || 'test-automation-key';

function normalizePhone(value) {
  if (!value) return null;
  const str = String(value).trim();
  if (!str) return null;

  const digitsOnly = str.replace(/\D/g, '');
  if (!digitsOnly) return null;

  if (str.startsWith('+')) {
    return `+${digitsOnly}`;
  }

  return digitsOnly;
}

export async function POST(req) {
  const incomingAutomationKey = req.headers.get('x-automation-key');
  const bypassRateLimit =
    process.env.DISABLE_RATE_LIMIT === 'true' || incomingAutomationKey === automationKey;

  if (!bypassRateLimit) {
    // Rate limiting: 3 requests per 10 minutes
    const rateLimit = rateLimiters.register(req);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: 'TOO_MANY_REQUESTS', message: rateLimit.message },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
      );
    }
  }

  try {
    const body = await req.json();
    const { fullName, phone, email, password, role, referrerId } = body;
    const normalizedPhone = normalizePhone(phone);

    // Support both phone and email registration
    if (!password) {
      return NextResponse.json(
        { ok: false, error: 'missing fields' },
        { status: 400 },
      );
    }

    if (!normalizedPhone && !email) {
      return NextResponse.json(
        { ok: false, error: 'phone or email required' },
        { status: 400 },
      );
    }

    const allowedRoles = ['customer', 'agent'];
    const normalizedRole = allowedRoles.includes(role) ? role : 'customer';
    if (role && !allowedRoles.includes(role)) {
      return NextResponse.json(
        { ok: false, error: 'invalid role' },
        { status: 400 },
      );
    }

    const db = await getDb();
    const users = db.collection('users');

    // Check if user exists
    const query = email
      ? { email: email.toLowerCase().trim() }
      : { phone: normalizedPhone };
    const exists = await users.findOne(query);
    if (exists) {
      return NextResponse.json(
        { ok: false, error: 'user exists' },
        { status: 409 },
      );
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
      phone: normalizedPhone || null,
      email: email ? email.toLowerCase().trim() : null,
      passwordHash, // hashed password only
      role: normalizedRole,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add referredBy if valid referrer exists
    if (finalReferrerId) {
      try {
        const refUserId = new ObjectId(finalReferrerId);
        const refUser = await users.findOne(
          { _id: refUserId },
          { projection: { _id: 1 } },
        );
        if (refUser) {
          doc.referredBy = refUser._id;
        }
      } catch (err) {
        console.log('Invalid referrer ID:', finalReferrerId);
      }
    }

    const r = await users.insertOne(doc);
    const newUserId = r.insertedId;

    // Auto-generate coupon for newly registered agents
    let generatedCouponCode = null;
    if (normalizedRole === 'agent') {
      try {
        const couponInfo = await generateAgentCoupon({ fullName: doc.fullName || doc.email || 'agent', agentId: newUserId });
        generatedCouponCode = couponInfo?.couponCode || null;
      } catch (couponErr) {
        console.error('REGISTER_AGENT_COUPON_ERROR', couponErr);
      }
    }

    // Prevent self-referral (if somehow user referred themselves)
    if (doc.referredBy && String(doc.referredBy) === String(newUserId)) {
      await users.updateOne(
        { _id: newUserId },
        { $unset: { referredBy: '' } },
      );
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
        message: `נרשם משתמש חדש: ${
          doc.email || doc.phone || doc.fullName || 'Unknown'
        }`,
        payload: {
          userId: newUserId,
          email: doc.email,
          fullName: doc.fullName,
        },
      });

      // Send Push notification to admins
      await pushToRoles(['admin'], {
        title: 'משתמש חדש נרשם',
        body: `${doc.fullName || doc.email || doc.phone || 'משתמש'} נרשם למערכת`,
        data: {
          type: 'new_user',
          userId: String(newUserId),
          url: '/admin/users',
        },
      }).catch((pushErr) => console.error('REGISTER_PUSH_ERROR', pushErr));
    } catch (notifyErr) {
      console.error('REGISTER_NOTIFICATION_ERROR', notifyErr);
    }

    // Clear refSource cookie after successful registration
    const res = NextResponse.json(
      { ok: true, userId: String(newUserId), role: normalizedRole, couponCode: generatedCouponCode },
      { status: 201 },
    );
    res.cookies.set('refSource', '', { path: '/', maxAge: 0 });

    return res;
  } catch (e) {
    console.error('REGISTER_ERROR:', e);
    return NextResponse.json(
      { ok: false, error: 'server error' },
      { status: 500 },
    );
  }
}
