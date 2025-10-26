import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getDb } from "@/lib/db";
import { verifyJwt } from "@/src/lib/auth/createToken.js";
import { calcTotals } from "@/lib/orders/calc.js";

async function ordersCollection() {
  const db = await getDb();
  const col = db.collection("orders");
  await col.createIndex({ agentId: 1 }).catch(() => {});
  await col.createIndex({ status: 1 }).catch(() => {});
  return col;
}

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decoded = verifyJwt(token);
    if (!decoded?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;
    const status = (searchParams.get("status") || "").trim();
    const q = (searchParams.get("q") || "").trim();

    const filter = {};
    if (decoded.role !== "admin") filter.agentId = decoded.userId;
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { "customer.phone": { $regex: q, $options: "i" } },
        { "items.sku": { $regex: q, $options: "i" } },
      ];
    }

    const col = await ordersCollection();
    const items = await col
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();
    const total = await col.countDocuments(filter);

    return NextResponse.json({ items, total, page, limit });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decoded = verifyJwt(token);
    if (decoded?.role !== "agent") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const items = Array.isArray(body?.items) ? body.items : [];
    const discount = Number(body?.discount || 0);
    const customer = body?.customer || {};

    const { subtotal, total } = calcTotals(items, discount);
    const doc = {
      agentId: decoded.userId,
      items,
      discount,
      subtotal,
      total,
      customer: {
        fullName: String(customer?.fullName || "").trim(),
        phone: String(customer?.phone || "").trim(),
        notes: String(customer?.notes || "").trim(),
      },
      status: "new",
      createdAt: new Date(),
    };

    const col = await ordersCollection();
    const { insertedId } = await col.insertOne(doc);
    const order = await col.findOne({ _id: new ObjectId(insertedId) });
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
