import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getDb } from "@/lib/db";
import { verifyJwt } from "@/src/lib/auth/createToken.js";

async function ordersCollection() {
  const db = await getDb();
  const col = db.collection("orders");
  await col.createIndex({ agentId: 1 }).catch(() => {});
  await col.createIndex({ status: 1 }).catch(() => {});
  return col;
}

export async function GET(req, { params }) {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decoded = verifyJwt(token);
    if (!decoded?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const col = await ordersCollection();
    const order = await col.findOne({ _id: new ObjectId(id) });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (decoded.role !== "admin" && String(order.agentId) !== String(decoded.userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(order);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decoded = verifyJwt(token);
    if (!decoded?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const col = await ordersCollection();
    const order = await col.findOne({ _id: new ObjectId(id) });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isOwner = String(order.agentId) === String(decoded.userId);
    if (!(decoded.role === "admin" || isOwner)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updates = {};
    if (body.customer && typeof body.customer === "object") {
      updates["customer.fullName"] = String(body.customer.fullName || order.customer?.fullName || "").trim();
      updates["customer.phone"] = String(body.customer.phone || order.customer?.phone || "").trim();
      updates["customer.notes"] = String(body.customer.notes || order.customer?.notes || "").trim();
    }

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    await col.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    const updated = await col.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, order: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
