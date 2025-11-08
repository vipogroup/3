import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { connectMongo } from "@/lib/mongoose";
import AuditLog from "@/models/AuditLog";

export async function GET(req) {
  const auth = await requireAdmin({ cookie: req.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  await connectMongo();

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Math.min(Number(searchParams.get("limit") || 20), 100);

  const q = {};
  const action = searchParams.get("action");
  const actorType = searchParams.get("actorType");
  const targetType = searchParams.get("targetType");

  if (action) q.action = action;
  if (actorType) q.actorType = actorType;
  if (targetType) q.targetType = targetType;

  const [items, total] = await Promise.all([
    AuditLog.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(q),
  ]);

  return NextResponse.json({
    success: true,
    total,
    page,
    limit,
    items,
  });
}
