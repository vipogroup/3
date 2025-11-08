import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import { requireAgent } from "@/app/api/_lib/auth";
import ReferralClick from "@/models/ReferralClick";
import User from "@/models/User";

export async function GET(req) {
  const auth = await requireAgent();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await dbConnect();
  const agentId = auth.user.agentId;

  const { searchParams } = new URL(req.url);
  const kind = (searchParams.get("kind") || "clicks").toLowerCase();
  const limit = Math.max(1, Math.min(parseInt(searchParams.get("limit") || "50", 10), 100));
  const cursor = searchParams.get("cursor");

  if (kind === "clicks") {
    const query = { agentId };
    if (cursor) {
      if (!mongoose.Types.ObjectId.isValid(cursor)) {
        return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
      }
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const docs = await ReferralClick.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = docs.length > limit;
    const data = hasMore ? docs.slice(0, limit) : docs;
    const nextCursor = hasMore ? String(data[data.length - 1]._id) : null;

    return NextResponse.json({ success: true, kind, data, nextCursor });
  }

  if (kind === "leads") {
    const query = { referredBy: agentId };
    if (cursor) {
      if (!mongoose.Types.ObjectId.isValid(cursor)) {
        return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
      }
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const docs = await User.find(query)
      .select("fullName name email phone createdAt")
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = docs.length > limit;
    const data = hasMore ? docs.slice(0, limit) : docs;
    const nextCursor = hasMore ? String(data[data.length - 1]._id) : null;

    return NextResponse.json({ success: true, kind, data, nextCursor });
  }

  return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
}
