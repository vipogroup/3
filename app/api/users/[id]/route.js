import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

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

export async function GET(req, { params }) {
  try {
    const token = req.cookies.get("auth_token")?.value || req.cookies.get("token")?.value || "";
    const decoded = verifyJwt(token);
    if (decoded?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const col = await usersCollection();
    const user = await col.findOne(
      { _id: new ObjectId(id) },
      { projection: { passwordHash: 0 } }
    );
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ user });
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
    if (body.fullName) updates.fullName = String(body.fullName);
    if (body.phone) updates.phone = String(body.phone);
    if (body.role) {
      if (!["admin", "agent"].includes(body.role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      updates.role = body.role;
    }
    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const col = await usersCollection();
    if (updates.phone) {
      const dup = await col.findOne({ phone: updates.phone, _id: { $ne: new ObjectId(id) } });
      if (dup) return NextResponse.json({ error: "Phone already in use" }, { status: 409 });
    }
    await col.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    const user = await col.findOne(
      { _id: new ObjectId(id) },
      { projection: { passwordHash: 0 } }
    );
    return NextResponse.json({ success: true, user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
