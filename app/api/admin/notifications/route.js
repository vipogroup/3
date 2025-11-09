import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Notification from "@/models/Notification";

export async function GET(req) {
  const auth = await requireAdmin({ cookie: req.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  await dbConnect();
  const items = await Notification.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ success: true, items });
}
