import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawCode = typeof body.code === 'string' ? body.code.trim() : '';

    if (!rawCode) {
      return NextResponse.json({ ok: false, error: 'code_required' }, { status: 400 });
    }

    await connectMongo();

    const code = rawCode.toLowerCase();
    const agent = await User.findOne({
      couponCode: { $regex: new RegExp(`^${code}$`, 'i') },
      role: 'agent',
    })
      .lean()
      .exec();

    if (!agent || agent.couponStatus !== 'active') {
      return NextResponse.json({ ok: false, error: 'coupon_not_found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        ok: true,
        coupon: {
          code: agent.couponCode,
          discountPercent: agent.discountPercent ?? 0,
          commissionPercent: agent.commissionPercent ?? 0,
          agentId: String(agent._id),
          agentName: agent.fullName ?? '',
          status: agent.couponStatus,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('COUPON_VALIDATE_ERROR', error);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
