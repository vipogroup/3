export const dynamic = 'force-dynamic';

// app/api/join/route.js
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';

function resolveRedirectBase(req, requestUrl) {
  const fallback = 'http://localhost:3001';
  const envBase = process.env.PUBLIC_URL;
  const baseCandidate = envBase && envBase.startsWith('http') ? envBase : requestUrl?.origin || fallback;

  try {
    const parsed = new URL(baseCandidate);
    if (parsed.hostname === '0.0.0.0' || parsed.hostname === '::' || parsed.hostname === '::1') {
      parsed.hostname = 'localhost';
    }
    parsed.pathname = parsed.pathname.replace(/\/$/, '');
    return parsed.toString();
  } catch {
    return fallback;
  }
}

function sanitizeNextPath(rawNext) {
  if (!rawNext || typeof rawNext !== 'string') {
    return '/products';
  }

  const trimmed = rawNext.trim();
  if (!trimmed.startsWith('/')) {
    return '/products';
  }

  // הרחקת תווים מסוכנים בסיסית (אין תמיכה ב- // או javascript: וכו')
  return trimmed.replace(/\s/g, '') || '/products';
}

export async function GET(req) {
  const url = new URL(req.url);
  const ref = url.searchParams.get('ref');
  const nextParam = sanitizeNextPath(url.searchParams.get('next'));

  const redirectUrl = new URL(nextParam, resolveRedirectBase(req, url));

  // Log the click to referral_logs
  if (ref) {
    try {
      const db = await getDb();
      const users = db.collection('users');
      const referralLogs = db.collection('referral_logs');

      // Find agent by ref code
      let agent = null;
      agent = await users.findOne({ couponCode: ref, role: 'agent' });
      if (!agent) {
        agent = await users.findOne({ referralId: ref, role: 'agent' });
      }
      if (!agent) {
        try {
          const objectId = new ObjectId(ref);
          agent = await users.findOne({ _id: objectId, role: 'agent' });
        } catch {
          // Not a valid ObjectId
        }
      }

      if (agent) {
        const headersList = headers();
        const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        await referralLogs.insertOne({
          agentId: agent._id,
          refCode: ref,
          ip: ip.split(',')[0].trim(),
          userAgent,
          url: req.url,
          action: 'click',
          createdAt: new Date(),
        });
        console.log('Referral click logged for agent:', agent._id);
      }
    } catch (err) {
      console.error('Error logging referral click:', err);
    }
  }

  const response = NextResponse.redirect(redirectUrl);

  if (ref) {
    const cookieOptions = {
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      sameSite: 'lax',
      secure: redirectUrl.protocol === 'https:',
    };

    // קוקי הפניה (קיים)
    response.cookies.set('refSource', ref, cookieOptions);

    // קוקי קופון אוטומטי
    response.cookies.set('autoCoupon', ref, cookieOptions);
  }

  return response;
}
