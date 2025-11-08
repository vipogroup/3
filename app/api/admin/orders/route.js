import { NextResponse } from "next/server";

import { connectMongo } from "@/lib/mongoose";
import { requireAdmin } from "@/lib/auth";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

const ORDER_STATUS_VALUES = new Set(["pending", "paid", "shipped", "completed", "cancelled"]);

export async function GET(request) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json(
      { error: auth?.error || "Unauthorized" },
      { status: auth?.status || 401 }
    );
  }

  await connectMongo();

  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .populate("productId", "title slug")
    .populate("customerId", "fullName email")
    .populate("agentId", "fullName email")
    .lean();

  console.log("[ADMIN][ORDER]", "list", null);

  return NextResponse.json({
    ok: true,
    items: orders.map(mapOrderSummary),
  });
}

export async function POST(request) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json(
      { error: auth?.error || "Unauthorized" },
      { status: auth?.status || 401 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    productId,
    customerId,
    agentId = null,
    quantity = 1,
    price,
    note = "",
  } = body;

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  if (!customerId) {
    return NextResponse.json({ error: "customerId is required" }, { status: 400 });
  }

  const numericQuantity = Number(quantity ?? 1);
  if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
    return NextResponse.json({ error: "quantity must be a positive number" }, { status: 400 });
  }

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return NextResponse.json({ error: "price must be a non-negative number" }, { status: 400 });
  }

  await connectMongo();

  const [product, customer, agent] = await Promise.all([
    Product.findById(productId).select("title slug"),
    User.findById(customerId).select("fullName email isCustomer"),
    agentId ? User.findById(agentId).select("fullName email isAgent") : Promise.resolve(null),
  ]);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (!customer || !customer.isCustomer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  if (agentId && (!agent || !agent.isAgent)) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const order = await Order.create({
    productId: product._id,
    customerId: customer._id,
    agentId: agent ? agent._id : null,
    quantity: numericQuantity,
    price: numericPrice,
    note: String(note || ""),
  });

  await order.populate("productId", "title slug");
  await order.populate("customerId", "fullName email");
  await order.populate("agentId", "fullName email");

  const mapped = mapOrderSummary(order.toObject());

  console.log("[ADMIN][ORDER]", "create", mapped._id);

  return NextResponse.json({ ok: true, item: mapped }, { status: 201 });
}

function mapOrderSummary(doc) {
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

export { ORDER_STATUS_VALUES };
