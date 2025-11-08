import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "@/lib/mongoose";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

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

  console.log("AUDIT", {
    action: "product.update",
    actorId: auth.userId,
    targetId: product._id,
    meta: updates,
    timestamp: new Date().toISOString(),
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

  console.log("AUDIT", {
    action: "product.delete",
    actorId: auth.userId,
    targetId: product._id,
    meta: { title: product.title, slug: product.slug },
    timestamp: new Date().toISOString(),
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
