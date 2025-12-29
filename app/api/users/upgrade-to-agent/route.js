export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { verifyJwt, signJwt } from '@/src/lib/auth/createToken.js';
import { generateAgentCoupon } from '@/lib/agents';
import { getToken } from 'next-auth/jwt';

export async function POST(req) {
  try {
    let userId = null;
    let userEmail = null;
    let isNextAuthUser = false;

    // Try legacy JWT first
    const token = req.cookies.get('auth_token')?.value || req.cookies.get('token')?.value || '';
    if (token) {
      try {
        const decoded = verifyJwt(token);
        if (decoded?.userId) {
          userId = decoded.userId;
          userEmail = decoded.email;
          console.log('[UPGRADE_AGENT] Legacy JWT detected for user:', userId, userEmail);
        }
      } catch (e) {
        console.log('[UPGRADE_AGENT] Legacy JWT invalid, will try NextAuth token');
      }
    }

    // Try NextAuth token if legacy failed
    if (!userId) {
      try {
        const nextAuthToken = await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET,
        });
        
        if (nextAuthToken) {
          userId = nextAuthToken.userId || nextAuthToken.sub;
          userEmail = nextAuthToken.email;
          isNextAuthUser = true;
          console.log('[UPGRADE_AGENT] NextAuth token resolved', {
            userId,
            email: userEmail,
            sub: nextAuthToken.sub,
          });
        } else {
          console.log('[UPGRADE_AGENT] getToken returned null');
        }
      } catch (e) {
        console.error('[UPGRADE_AGENT] NextAuth token check failed:', e.message);
      }
    }

    if (!userId) {
      console.warn('[UPGRADE_AGENT] No userId from cookies/tokens');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const db = await getDb();
    const users = db.collection('users');

    let user = null;
    const normalizedEmail = userEmail?.toLowerCase()?.trim();

    // For NextAuth users, prefer email lookup (userId is Google sub, not MongoDB ID)
    if (isNextAuthUser && normalizedEmail) {
      console.log('[UPGRADE_AGENT] NextAuth user - searching by email first:', normalizedEmail);
      user = await users.findOne({ email: normalizedEmail });
    }

    // For legacy users or if email lookup failed, try by ObjectId
    if (!user && userId && ObjectId.isValid(userId)) {
      console.log('[UPGRADE_AGENT] Trying lookup by ObjectId:', userId);
      user = await users.findOne({ _id: new ObjectId(userId) });
    }

    // Fallback: legacy string _id
    if (!user && userId && !isNextAuthUser) {
      console.log('[UPGRADE_AGENT] Trying lookup by string _id:', userId);
      user = await users.findOne({ _id: userId });
    }

    // Final fallback: email for non-NextAuth users
    if (!user && normalizedEmail && !isNextAuthUser) {
      console.log('[UPGRADE_AGENT] Final fallback - email lookup:', normalizedEmail);
      user = await users.findOne({ email: normalizedEmail });
    }

    console.log('[UPGRADE_AGENT] User lookup result', {
      found: !!user,
      foundId: user?._id ? String(user._id) : null,
      userId,
      userEmail: normalizedEmail,
      isNextAuthUser,
    });

    if (!user) {
      console.warn('[UPGRADE_AGENT] User not found in DB', { userId, userEmail });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is already an agent or admin
    if (user.role === 'agent') {
      return NextResponse.json({ error: 'You are already an agent' }, { status: 400 });
    }

    if (user.role === 'admin') {
      return NextResponse.json({ error: 'Admins cannot become agents' }, { status: 400 });
    }

    // Only customers can upgrade to agent
    if (user.role !== 'customer') {
      return NextResponse.json({ error: 'Only customers can upgrade to agent' }, { status: 400 });
    }

    // Upgrade user to agent
    const result = await users.updateOne(
      { _id: user._id },
      {
        $set: {
          role: 'agent',
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Failed to upgrade user' }, { status: 500 });
    }

    let couponInfo = null;
    if (!user.couponCode) {
      const fullNameForCoupon = user.fullName?.trim() || user.email || 'agent';
      try {
        couponInfo = await generateAgentCoupon({ fullName: fullNameForCoupon, agentId: user._id });
      } catch (couponError) {
        console.error('USER_UPGRADE_COUPON_ERROR', couponError);
      }
    }

    // Log the upgrade
    console.log(`USER_UPGRADED_TO_AGENT: ${userId} (${user.email})`);

    // Create new JWT token with updated role
    const newToken = signJwt({
      userId: user._id.toString(),
      email: user.email,
      role: 'agent',
      fullName: user.fullName || '',
    });

    // Create response with new token
    const response = NextResponse.json({
      success: true,
      message: 'Successfully upgraded to agent',
      role: 'agent',
      coupon: couponInfo?.couponCode || user.couponCode || null,
    });

    // Set the new token in cookies
    response.cookies.set('auth_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Upgrade to agent error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
