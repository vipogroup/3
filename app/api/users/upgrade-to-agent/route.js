export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { verifyJwt } from '@/src/lib/auth/createToken.js';
import { generateAgentCoupon } from '@/lib/agents';

export async function POST(req) {
  try {
    // Get user from cookie
    const token = req.cookies.get('auth_token')?.value || req.cookies.get('token')?.value || '';
    const decoded = verifyJwt(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = decoded.userId;
    const userFilter = ObjectId.isValid(userId) ? { _id: new ObjectId(userId) } : { _id: userId };
    const db = await getDb();
    const users = db.collection('users');

    // Get current user
    const user = await users.findOne(userFilter);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
    const result = await users.updateOne(userFilter, {
      $set: {
        role: 'agent',
        updatedAt: new Date(),
      },
    });

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

    return NextResponse.json({
      success: true,
      message: 'Successfully upgraded to agent',
      role: 'agent',
      coupon: couponInfo?.couponCode || user.couponCode || null,
    });
  } catch (error) {
    console.error('Upgrade to agent error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
