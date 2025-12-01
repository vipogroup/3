
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendOTP } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();
  const schema = z.object({ phone: z.string().min(6) });
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  try {
    await sendOTP(parsed.data.phone);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err?.message || "Failed to send OTP";
    console.error("[OTP] send failed", message);
    const status = /try again/i.test(message) ? 429 : 500;
    return NextResponse.json({ error: "otp_send_failed", message }, { status });
  }
}
