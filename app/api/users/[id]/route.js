import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

import { verifyJwt } from "@/src/lib/auth/createToken.js";

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

async function usersCollection() {
  const dbo = await db();
  return dbo.collection("users");
}

function getToken(req) {
  return (
    req.cookies.get("auth_token")?.value ||
    req.cookies.get("token")?.value ||
    ""
  );
}

function ensureAdmin(req) {
  const decoded = verifyJwt(getToken(req));
  if (decoded?.role !== "admin") {
    return null;
  }
  return decoded;
}

function parseObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export async function GET(req, { params }) {
  try {
    if (!ensureAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params || {};
    const objectId = parseObjectId(id);
    if (!objectId) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const col = await usersCollection();
    const user = await col.findOne(
      { _id: objectId },
      { projection: { passwordHash: 0, password: 0 } }
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
    if (!ensureAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params || {};
    const objectId = parseObjectId(id);
    if (!objectId) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const updates = {};
    if (body.fullName) updates.fullName = String(body.fullName);
    if (body.phone) updates.phone = String(body.phone);
    if (Object.prototype.hasOwnProperty.call(body, "isActive")) {
      updates.isActive = Boolean(body.isActive);
    }
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
    const existing = await col.findOne({ _id: objectId });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (updates.phone) {
      const dup = await col.findOne({
        phone: updates.phone,
        _id: { $ne: objectId },
      });
      if (dup) {
        return NextResponse.json({ error: "Phone already in use" }, { status: 409 });
      }
    }

    const isAdmin = existing.role === "admin";

    if (updates.role && isAdmin && updates.role !== "admin") {
      const adminCount = await col.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return NextResponse.json({ error: "לא ניתן להוריד את המנהל האחרון במערכת" }, { status: 400 });
      }
    }

    if (Object.prototype.hasOwnProperty.call(updates, "isActive") && isAdmin && !updates.isActive) {
      const activeAdminCount = await col.countDocuments({ role: "admin", isActive: true });
      if (activeAdminCount <= 1) {
        return NextResponse.json({ error: "לא ניתן לכבות את המנהל האחרון במערכת" }, { status: 400 });
      }
    }

    await col.updateOne({ _id: objectId }, { $set: updates });
    const user = await col.findOne(
      { _id: objectId },
      { projection: { passwordHash: 0, password: 0 } }
    );

    return NextResponse.json({ success: true, user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const decoded = ensureAdmin(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params || {};
    const objectId = parseObjectId(id);
    if (!objectId) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const col = await usersCollection();
    const user = await col.findOne({ _id: objectId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const decodedId = String(decoded.userId || decoded.sub || decoded._id || "");
    if (decodedId && decodedId === id) {
      return NextResponse.json({ error: "לא ניתן למחוק את עצמך" }, { status: 400 });
    }

    if (user.role === "admin") {
      const adminCount = await col.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return NextResponse.json({ error: "לא ניתן למחוק את המנהל האחרון במערכת" }, { status: 400 });
      }
    }

    await col.deleteOne({ _id: objectId });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
