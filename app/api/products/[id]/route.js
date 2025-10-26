import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getDb } from "@/lib/db";
import { verifyJwt } from "@/src/lib/auth/createToken.js";

async function productsCollection() {
  const db = await getDb();
  const col = db.collection("products");
  await col.createIndex({ sku: 1 }, { unique: true }).catch(() => {});
  return col;
}

export async function GET(req, { params }) {
  try {
    const { id } = params || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const col = await productsCollection();
    const doc = await col.findOne({ _id: new ObjectId(id) });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decoded = verifyJwt(token);
    if (decoded?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = params || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();
    const updates = {};
    if (body.title !== undefined) {
      const title = String(body.title || "").trim();
      if (!title) return NextResponse.json({ error: "Invalid title" }, { status: 400 });
      updates.title = title;
    }
    if (body.price !== undefined) {
      const price = Number(body.price);
      if (!isFinite(price) || price < 0) return NextResponse.json({ error: "Invalid price" }, { status: 400 });
      updates.price = price;
    }
    if (body.sku !== undefined) {
      const sku = String(body.sku || "").trim();
      if (!sku) return NextResponse.json({ error: "Invalid sku" }, { status: 400 });
      updates.sku = sku;
    }
    if (body.currency !== undefined) {
      updates.currency = String(body.currency || "ILS");
    }
    if (body.active !== undefined) {
      updates.active = Boolean(body.active);
    }
    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const col = await productsCollection();
    if (updates.sku) {
      const dup = await col.findOne({ sku: updates.sku, _id: { $ne: new ObjectId(id) } });
      if (dup) return NextResponse.json({ error: "SKU exists" }, { status: 409 });
    }
    updates.updatedAt = new Date();
    await col.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    const product = await col.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, product });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decoded = verifyJwt(token);
    if (decoded?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = params || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const col = await productsCollection();
    await col.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
