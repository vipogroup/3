import { NextResponse } from "next/server";

import { requireAdminGuard } from "@/lib/auth/requireAuth";
import { getByProduct } from "@/lib/reports";

export async function GET(req) {
  const { ok, error, status } = await requireAdminGuard(req);
  if (!ok) {
    return NextResponse.json({ error: error || "Unauthorized" }, { status: status || 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const items = await getByProduct({ from, to });
  return NextResponse.json({ success: true, items, error: null });
}
