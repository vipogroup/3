import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getDb } from "@/lib/db";
import { verifyJwt } from "@/src/lib/auth/createToken.js";

const ALLOWED_STATUSES = ["new", "qualified", "paid", "shipped", "delivered", "canceled"];
const NEXT_ALLOWED = {
  new: ["qualified", "canceled"],
  qualified: ["paid", "canceled"],
  paid: ["shipped", "canceled"],
  shipped: ["delivered", "canceled"],
  delivered: [],
  canceled: [],
};

async function ordersCollection() {
  const db = await getDb();
  const col = db.collection("orders");
  await col.createIndex({ agentId: 1 }).catch(() => {});
  await col.createIndex({ status: 1 }).catch(() => {});
  return col;
}

export async function POST(req, { params }) {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decoded = verifyJwt(token);
    if (decoded?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();
    const status = String(body?.status || "").trim();
    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const col = await ordersCollection();
    const order = await col.findOne({ _id: new ObjectId(id) });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Allow cancel from any state, otherwise only forward transitions
    const curr = order.status || "new";
    const ok = status === "canceled" || (NEXT_ALLOWED[curr] || []).includes(status);
    if (!ok) return NextResponse.json({ error: "Invalid transition" }, { status: 400 });

    await col.updateOne({ _id: order._id }, { $set: { status, updatedAt: new Date() } });
    const updated = await col.findOne({ _id: order._id });
    return NextResponse.json({ success: true, order: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
