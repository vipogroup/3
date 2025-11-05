// app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET(_req, { params }) {
  await connectMongo();
  const doc = await Product.findById(params.id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PUT(req, { params }) {
  await connectMongo();
  const body = await req.json();
  const update = {};

  if (typeof body.name === "string") update.name = body.name.trim();
  if (typeof body.description === "string") update.description = body.description.trim();
  if (typeof body.category === "string") update.category = body.category.trim();
  if (typeof body.price === "number" && !Number.isNaN(body.price)) update.price = Number(body.price);
  if (Array.isArray(body.images)) update.images = body.images;

  const doc = await Product.findByIdAndUpdate(params.id, update, { new: true });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(_req, { params }) {
  await connectMongo();
  const res = await Product.findByIdAndDelete(params.id);
  if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
