import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "@/lib/mongoose";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { getReqInfo } from "@/lib/requestInfo";

export async function GET(request, { params }) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  const product = await findProductById(params.id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, item: mapProduct(product) });
}

export async function PATCH(request, { params }) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  const product = await findProductById(params.id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const body = await request.json();
  const updates = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.slug !== undefined) updates.slug = body.slug;
  if (body.description !== undefined) updates.description = body.description;
  if (body.price !== undefined) updates.price = body.price;
  if (body.active !== undefined) updates.active = body.active;
  if (body.images !== undefined) updates.images = body.images;

  Object.assign(product, updates);
  await product.save();

  const { ip, userAgent } = getReqInfo(request);
  await logAudit({
    action: "product.updated",
    actorType: "admin",
    actorId: auth.userId,
    targetType: "product",
    targetId: product._id,
    metadata: updates,
    ip,
    userAgent,
  });

  return NextResponse.json({ ok: true, item: mapProduct(product) });
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  const product = await findProductById(params.id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await product.deleteOne();

  const { ip, userAgent } = getReqInfo(request);
  await logAudit({
    action: "product.deleted",
    actorType: "admin",
    actorId: auth.userId,
    targetType: "product",
    targetId: product._id,
    metadata: { title: product.title, slug: product.slug },
    ip,
    userAgent,
  });

  return NextResponse.json({ ok: true });
}

async function findProductById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectMongo();
  return Product.findById(id);
}

function mapProduct(doc) {
  return {
    _id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    price: doc.price,
    active: doc.active,
    images: doc.images || [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
