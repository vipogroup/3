import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { getReqInfo } from "@/lib/requestInfo";

export async function GET(request) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  await connectMongo();
  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return NextResponse.json({ ok: true, items: products.map(mapProduct) });
}

export async function POST(request) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  const body = await request.json();
  const { title, slug, price, description = "", active = true, images = [] } = body || {};

  if (!title || !slug || price === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectMongo();

  const existing = await Product.findOne({ slug });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const product = await Product.create({
    title,
    slug,
    price,
    description,
    active,
    images,
  });

  const { ip, userAgent } = getReqInfo(request);
  await logAudit({
    action: "product.created",
    actorType: "admin",
    actorId: auth.userId,
    targetType: "product",
    targetId: product._id,
    metadata: { title, slug, price },
    ip,
    userAgent,
  });

  return NextResponse.json({ ok: true, item: mapProduct(product) }, { status: 201 });
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
