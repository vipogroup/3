import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { commissionPerReferral } from '@/app/config/commissions';
import { rateLimiters } from '@/lib/rateLimit';
import { generateAgentCoupon } from '@/lib/agents';
import { sendTemplateNotification } from '@/lib/notifications/dispatcher';
import { pushToUsers } from '@/lib/pushSender';

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

async function POSTHandler(req) {
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
    const { fullName, phone, email, password, role, referrerId, tenantSlug } = body;
    const normalizedPhone = normalizePhone(phone);

    // Validate required fields
    if (!password) {
      return NextResponse.json(
        { ok: false, error: 'missing fields' },
        { status: 400 },
      );
    }

    // Phone is required for registration
    if (!normalizedPhone) {
      return NextResponse.json(
        { ok: false, error: 'phone required' },
        { status: 400 },
      );
    }

    // Email is also required for verification
    if (!email) {
      return NextResponse.json(
        { ok: false, error: 'email required' },
        { status: 400 },
      );
    }

    // If role is 'agent' (from /register-agent page), create as agent directly
    // Otherwise, register as customer
    const normalizedRole = role === 'agent' ? 'agent' : 'customer';

    const db = await getDb();
    const users = db.collection('users');
    const tenants = db.collection('tenants');

    // Find tenant if tenantSlug provided
    let tenantId = null;
    if (tenantSlug) {
      // Normalize slug - remove leading/trailing dashes
      const normalizedSlug = tenantSlug.toLowerCase().trim().replace(/^-+|-+$/g, '');
      const tenant = await tenants.findOne({ slug: normalizedSlug, status: 'active' });
      if (tenant) {
        tenantId = tenant._id;
      } else {
        // If tenant slug was provided but not found, return error
        return NextResponse.json(
          { ok: false, error: 'tenant not found', message: 'העסק לא נמצא או לא פעיל' },
          { status: 404 },
        );
      }
    }

    // Check if user exists (by phone or email) - with specific error message
    const emailLower = email.toLowerCase().trim();
    const existingByPhone = await users.findOne({ phone: normalizedPhone });
    if (existingByPhone) {
      return NextResponse.json(
        { ok: false, error: 'phone exists', message: 'מספר הטלפון הזה כבר רשום במערכת' },
        { status: 409 },
      );
    }

    const existingByEmail = await users.findOne({ email: emailLower });
    if (existingByEmail) {
      return NextResponse.json(
        { ok: false, error: 'email exists', message: 'כתובת האימייל הזו כבר רשומה במערכת' },
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
      ...(tenantId && { tenantId }), // Associate with tenant if provided
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

    // Generate agent coupon if registered directly as agent
    if (normalizedRole === 'agent') {
      try {
        const nameForCoupon = (doc.fullName || doc.email || doc.phone || 'agent').trim();
        await generateAgentCoupon({ fullName: nameForCoupon, agentId: newUserId });
        console.log('AGENT_COUPON_GENERATED', { userId: String(newUserId), tenantId: tenantId ? String(tenantId) : null });
      } catch (couponErr) {
        console.error('AGENT_COUPON_ERROR', couponErr);
        // Don't block registration if coupon generation fails
      }
    }

    // Note: Agent coupons are also generated when user upgrades to agent via /api/users/upgrade-to-agent

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
      const notifications = db.collection('notifications');
      await notifications.insertOne({
        type: 'new_user',
        message: `נרשם משתמש חדש: ${doc.email || doc.phone || doc.fullName || 'Unknown'}`,
        payload: {
          userId: newUserId,
          email: doc.email,
          fullName: doc.fullName,
        },
        read: false,
        tenantId: tenantId || null,
        __v: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (notifyErr) {
      console.error('REGISTER_NOTIFICATION_ERROR', notifyErr);
    }

    // Send push notifications
    try {
      // 1. Welcome notification to new user
      await pushToUsers([String(newUserId)], {
        title: 'ברוכים הבאים ל-VIPO!',
        body: `שלום ${doc.fullName || 'משתמש יקר'}, ההרשמה שלך הושלמה בהצלחה!`,
        icon: '/icons/192.png',
        url: '/dashboard',
        data: { type: 'welcome_user', userId: String(newUserId) },
      });

      // 2. Admin notification about new registration
      // Multi-Tenant: If user registered with tenant, send to business_admin only
      await sendTemplateNotification({
        templateType: 'admin_new_registration',
        variables: {
          user_type: normalizedRole === 'agent' ? 'סוכן' : 'לקוח',
          datetime: new Date().toLocaleString('he-IL'),
        },
        audienceRoles: tenantId ? ['business_admin'] : ['admin'],
        payloadOverrides: {
          url: tenantId ? '/business/users' : '/admin/users',
          data: {
            userId: String(newUserId),
            userType: normalizedRole,
          },
        },
        tenantId: tenantId ? String(tenantId) : null,
      });
    } catch (pushErr) {
      console.error('REGISTER_PUSH_ERROR', pushErr);
    }

    // Clear refSource cookie after successful registration
    const res = NextResponse.json(
      { ok: true, userId: String(newUserId), role: normalizedRole },
      { status: 201 },
    );
    res.cookies.set('refSource', '', { path: '/', maxAge: 0 });

    return res;
  } catch (e) {
    console.error('REGISTER_ERROR:', e);
    
    // Handle duplicate key error (user already exists)
    if (e.code === 11000) {
      return NextResponse.json(
        { ok: false, error: 'user exists' },
        { status: 409 },
      );
    }
    
    return NextResponse.json(
      { ok: false, error: 'server error' },
      { status: 500 },
    );
  }
}

export const POST = withErrorLogging(POSTHandler);
