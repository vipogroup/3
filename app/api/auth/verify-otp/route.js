import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyOTP, ensureUser, signJWT } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();
  const schema = z.object({ phone: z.string().min(6), code: z.string().min(4) });
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const ok = await verifyOTP(parsed.data.phone, parsed.data.code);
  if (!ok) {
    return NextResponse.json({ error: "invalid_code" }, { status: 401 });
  }

  const user = await ensureUser(parsed.data.phone);
  const token = signJWT({ uid: String(user._id), role: user.role, phone: user.phone });

  const res = NextResponse.json({ ok: true, role: user.role, user: { id: String(user._id), phone: user.phone, role: user.role } });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
