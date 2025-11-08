import { NextResponse } from "next/server";

import { connectMongo } from "@/lib/mongoose";
import { requireAdmin } from "@/lib/auth";
import Order from "@/models/Order";

const ORDER_STATUS_VALUES = ["pending", "paid", "shipped", "completed", "cancelled"];

export async function GET(request, { params }) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json(
      { error: auth?.error || "Unauthorized" },
      { status: auth?.status || 401 }
    );
  }

  const { id } = params || {};
  if (!id) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  await connectMongo();

  const order = await Order.findById(id)
    .populate("productId", "title slug")
    .populate("customerId", "fullName email")
    .populate("agentId", "fullName email")
    .lean();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  console.log("[ADMIN][ORDER]", "view", String(order._id));

  return NextResponse.json({ ok: true, item: mapOrderDetail(order) });
}

export async function PATCH(request, { params }) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json(
      { error: auth?.error || "Unauthorized" },
      { status: auth?.status || 401 }
    );
  }

  const { id } = params || {};
  if (!id) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updates = {};

  if (body.status !== undefined) {
    const status = String(body.status).trim().toLowerCase();
    if (!ORDER_STATUS_VALUES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    updates.status = status;
  }

  if (body.note !== undefined) {
    updates.note = String(body.note || "").trim();
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await connectMongo();

  const order = await Order.findById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  Object.assign(order, updates);
  await order.save();

  await order.populate("productId", "title slug");
  await order.populate("customerId", "fullName email");
  await order.populate("agentId", "fullName email");

  console.log("[ADMIN][ORDER]", "update", String(order.id));

  return NextResponse.json({ ok: true, item: mapOrderDetail(order.toObject()) });
}

function mapOrderDetail(doc) {
  const product = doc.productId || null;
  const customer = doc.customerId || null;
  const agent = doc.agentId || null;

  return {
    _id: String(doc._id),
    product: product
      ? {
          _id: String(product._id ?? product.id),
          title: product.title || product.name || "Untitled product",
          slug: product.slug || null,
        }
      : null,
    customer: customer
      ? {
          _id: String(customer._id ?? customer.id),
          name: customer.fullName || customer.email || "Unknown customer",
          email: customer.email || null,
        }
      : null,
    agent: agent
      ? {
          _id: String(agent._id ?? agent.id),
          name: agent.fullName || agent.email || "",
          email: agent.email || null,
        }
      : null,
    quantity: doc.quantity,
    price: doc.price,
    status: doc.status,
    note: doc.note || "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
