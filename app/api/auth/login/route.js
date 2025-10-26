import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

import { verifyPassword } from "@/lib/auth/hash.js";
import { sign } from "@/lib/auth/createToken.js";

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
    const { phone, password } = await req.json();
    if (!phone || !password) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }
    const dbo = await db();
    const user = await dbo.collection("users").findOne({ phone });
    if (!user) {
      return NextResponse.json({ ok: false, error: "not found" }, { status: 401 });
    }
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "invalid credentials" }, { status: 401 });
    }
    const token = sign({ userId: user._id.toString(), role: user.role });
    const res = NextResponse.json({
      ok: true,
      user: { fullName: user.fullName, role: user.role, phone: user.phone },
    });
    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}
