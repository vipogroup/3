export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { connectMongo } from '@/lib/mongoose';
import User from '@/models/User';

export async function GET() {
  try {
    const cookieStore = cookies();
    const autoCoupon = cookieStore.get('autoCoupon')?.value;

    if (!autoCoupon) {
      return NextResponse.json({ ok: true, coupon: null });
    }

    await connectMongo();

    const couponCode = autoCoupon.trim().toLowerCase();
    const agent = await User.findOne({
      couponCode: { $regex: new RegExp(`^${couponCode}$`, 'i') },
      role: 'agent',
    })
      .lean()
      .exec();

    if (!agent || agent.couponStatus !== 'active') {
      const res = NextResponse.json({ ok: true, coupon: null });
      res.cookies.set('autoCoupon', '', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
        sameSite: 'lax',
      });
      return res;
    }

    return NextResponse.json({
      ok: true,
      coupon: agent.couponCode,
      discountPercent: agent.discountPercent ?? 0,
    });
  } catch (error) {
    console.error('AUTO_COUPON_ERROR', error);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
