
import { z } from "zod";
import { sendOTP } from "@/lib/auth";

export async function POST(req){
  const body = await req.json();
  const schema = z.object({ phone: z.string().min(6) });
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "bad_request" }, { status: 400 });
  await sendOTP(parsed.data.phone);
  return Response.json({ ok: true });
}
