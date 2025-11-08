import { NextResponse } from "next/server";
import { requireAgent } from "@/app/api/_lib/auth";

const BASE = process.env.BASE_URL || "http://localhost:3001";

export async function POST(req) {
  const auth = await requireAgent();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json().catch(() => ({}));
  const productId = (body.productId || "").trim();
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const code = auth.user.agentId;
  const url = `${BASE}/p/${encodeURIComponent(productId)}?ref=${encodeURIComponent(code)}`;

  return NextResponse.json({ success: true, data: { code, url } });
}
