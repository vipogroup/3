export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendOTP } from '@/lib/auth';
import { rateLimiters } from '@/lib/rateLimit';

export async function POST(req) {
  // Rate limiting: 3 requests per 5 minutes
  const rateLimit = rateLimiters.otp(req);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'TOO_MANY_REQUESTS', message: rateLimit.message },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    );
  }

  const body = await req.json();
  const schema = z.object({ phone: z.string().min(6) });
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  try {
    await sendOTP(parsed.data.phone);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err?.message || 'Failed to send OTP';
    console.error('[OTP] send failed', message);
    const status = /try again/i.test(message) ? 429 : 500;
    return NextResponse.json({ error: 'otp_send_failed', message }, { status });
  }
}
