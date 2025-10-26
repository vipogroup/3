import { NextResponse } from "next/server";

import { verify } from "@/lib/auth/createToken.js";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value || "";
    const payload = verify(token);
    if (!payload) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    return NextResponse.json({
      ok: true,
      user: { userId: payload.userId, role: payload.role },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
