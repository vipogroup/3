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

function getUserIdFromCookie(req) {
  const token = req.cookies.get("token")?.value;
  const decoded = token ? verifyJwt(token) : null;
  return decoded?.userId || null;
}

export async function GET(req) {
  try {
    const userId = getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ authenticated: false }, { status: 401 });
    const col = await usersCollection();
    const user = await col.findOne({ _id: new ObjectId(userId) }, { projection: { passwordHash: 0 } });
    return NextResponse.json({ authenticated: true, user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const userId = getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const updates = {};
    if (body.fullName) updates.fullName = String(body.fullName);
    if (body.phone) updates.phone = String(body.phone);

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const col = await usersCollection();
    await col.updateOne({ _id: new ObjectId(userId) }, { $set: updates });
    const user = await col.findOne({ _id: new ObjectId(userId) }, { projection: { passwordHash: 0 } });
    return NextResponse.json({ success: true, user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
