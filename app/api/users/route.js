import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

import { hashPassword } from "@/src/lib/auth/hash.js";
import { verifyJwt } from "@/src/lib/auth/createToken.js";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "vipo";
let _client;
async function db() {
  _client ||= new MongoClient(uri);
  if (!_client.topology?.isConnected()) await _client.connect();
  return _client.db(dbName);
}
async function usersCollection() {
  const dbo = await db();
  return dbo.collection("users");
}

export async function GET(req) {
  try {
    const token = req.cookies.get("auth_token")?.value || req.cookies.get("token")?.value || "";
    const decoded = verifyJwt(token);
    if (decoded?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const col = await usersCollection();
    const items = await col
      .find({}, { projection: { passwordHash: 0 } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();
    const total = await col.countDocuments();

    return NextResponse.json({ items, total, page, limit });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get("auth_token")?.value || req.cookies.get("token")?.value || "";
    const decoded = verifyJwt(token);
    if (decoded?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { fullName, phone, role, password } = body || {};
    if (!fullName || !phone || !role || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (!["admin", "agent"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const col = await usersCollection();
    const exists = await col.findOne({ phone });
    if (exists) return NextResponse.json({ error: "User already exists" }, { status: 409 });

    const passwordHash = await hashPassword(password);
    const createdAt = new Date();
    const { insertedId } = await col.insertOne({ fullName, phone, role, passwordHash, createdAt });

    const user = await col.findOne({ _id: insertedId }, { projection: { passwordHash: 0 } });
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
