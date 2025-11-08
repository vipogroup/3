import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

const PROJECTION = {
  fullName: 1,
  email: 1,
  phone: 1,
  refSource: 1,
  agentId: 1,
  joinedAt: 1,
  createdAt: 1,
  updatedAt: 1,
  isActive: 1,
  isCustomer: 1,
};

export async function GET(request) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  await connectMongo();

  const customers = await User.find({ isCustomer: true }).select(PROJECTION).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    ok: true,
    items: customers.map(mapCustomerSummary),
  });
}

function mapCustomerSummary(doc) {
  return {
    _id: String(doc._id),
    name: doc.fullName,
    email: doc.email,
    phone: doc.phone,
    refSource: doc.refSource,
    joinedAt: doc.joinedAt || doc.createdAt,
    isActive: doc.isActive,
    agentId: doc.agentId || null,
  };
}
