import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

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

export async function POST(req, { params }) {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decoded = verifyJwt(token);
    if (decoded?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();
    const { password } = body || {};
    if (!password) return NextResponse.json({ error: "Missing password" }, { status: 400 });

    const col = await usersCollection();
    const passwordHash = await hashPassword(password);
    await col.updateOne({ _id: new ObjectId(id) }, { $set: { passwordHash } });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
