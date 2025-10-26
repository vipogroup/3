import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

import { verifyJwt } from "@/src/lib/auth/createToken.js";
import { comparePassword as compare, hashPassword as hash } from "@/src/lib/auth/hash.js";

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

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    const decoded = token ? verifyJwt(token) : null;
    if (!decoded?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const col = await usersCollection();
    const user = await col.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const ok = await compare(oldPassword, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Invalid old password" }, { status: 400 });

    const passwordHash = await hash(newPassword);
    await col.updateOne({ _id: user._id }, { $set: { passwordHash } });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
