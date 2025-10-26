import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

import { hashPassword } from "@/lib/auth/hash.js";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "vipo";
let _client;

async function db() {
  _client ||= new MongoClient(uri);
  if (!_client.topology?.isConnected()) {
    await _client.connect();
  }
  return _client.db(dbName);
}

export async function POST(req) {
  try {
    const { fullName, phone, password, role } = await req.json();
    if (!fullName || !phone || !password || !role) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }
    if (!["admin", "agent"].includes(role)) {
      return NextResponse.json({ ok: false, error: "invalid role" }, { status: 400 });
    }
    const dbo = await db();
    const users = dbo.collection("users");
    const exists = await users.findOne({ phone });
    if (exists) {
      return NextResponse.json({ ok: false, error: "user exists" }, { status: 409 });
    }
    const passwordHash = await hashPassword(password);
    const doc = { fullName, phone, role, passwordHash, createdAt: new Date() };
    const r = await users.insertOne(doc);
    return NextResponse.json({ ok: true, userId: r.insertedId.toString() }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}
