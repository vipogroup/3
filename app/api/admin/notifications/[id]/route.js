import { NextResponse } from "next/server";

import { requireAdminGuard } from "@/lib/auth/requireAuth";
import { connectMongo } from "@/lib/mongoose";
import Notification from "@/models/Notification";

export async function PATCH(req, { params }) {
  const auth = await requireAdminGuard(req);
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  await connectMongo();
  const { id } = params || {};
  if (!id) {
    return NextResponse.json({ error: "Missing notification id" }, { status: 400 });
  }

  const doc = await Notification.findByIdAndUpdate(id, { read: true }, { new: true }).lean();
  if (!doc) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, item: doc });
}
