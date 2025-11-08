import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import { requireAgent } from "@/app/api/_lib/auth";
import Order from "@/models/Order";

export async function GET(req) {
  const auth = await requireAgent();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const limit = Math.max(1, Math.min(parseInt(searchParams.get("limit") || "20", 10), 50));
  const cursor = searchParams.get("cursor");

  const query = { agentId: auth.user.agentId };
  if (cursor) {
    if (!mongoose.Types.ObjectId.isValid(cursor)) {
      return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
    }
    query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  const docs = await Order.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasMore = docs.length > limit;
  const data = hasMore ? docs.slice(0, limit) : docs;
  const nextCursor = hasMore ? String(data[data.length - 1]._id) : null;

  return NextResponse.json({
    success: true,
    data,
    nextCursor,
  });
}
