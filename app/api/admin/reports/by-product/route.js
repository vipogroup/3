import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { getByProduct } from "@/lib/reports";

export async function GET(req) {
  const auth = await requireAdmin({ cookie: req.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const items = await getByProduct({ from, to });
  return NextResponse.json({ success: true, items });
}
