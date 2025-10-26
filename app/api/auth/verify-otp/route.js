
import { z } from "zod";
import { verifyOTP, ensureUser, signJWT } from "@/lib/auth";

export async function POST(req){
  const body = await req.json();
  const schema = z.object({ phone: z.string().min(6), code: z.string().min(4) });
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "bad_request" }, { status: 400 });

  const ok = await verifyOTP(parsed.data.phone, parsed.data.code);
  if (!ok) return Response.json({ error: "invalid_code" }, { status: 401 });

  const user = await ensureUser(parsed.data.phone);
  const token = signJWT({ uid: String(user._id), role: user.role, phone: user.phone });
  return Response.json({ ok: true, token });
}
