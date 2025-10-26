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

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
    const active = searchParams.get("active");
    const filter = {};
    if (q) filter.$or = [{ title: { $regex: q, $options: "i" } }, { sku: { $regex: q, $options: "i" } }];
    if (active === "true") filter.active = true;
    if (active === "false") filter.active = false;

    const col = await productsCollection();
    const items = await col
      .find(filter)
      .skip((page - 1) * limit)
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
    if (decoded?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const title = String(body?.title || "").trim();
    const sku = String(body?.sku || "").trim();
    const price = Number(body?.price ?? NaN);
    const currency = String(body?.currency || "ILS");
    const active = body?.active === false ? false : true;
    if (!title || !sku || !isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }
    const col = await productsCollection();
    const exists = await col.findOne({ sku });
    if (exists) return NextResponse.json({ error: "SKU exists" }, { status: 409 });
    const createdAt = new Date();
    const doc = { title, sku, price, currency, active, createdAt };
    const { insertedId } = await col.insertOne(doc);
    const product = await col.findOne({ _id: new ObjectId(insertedId) });
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
