import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getDb } from "@/lib/db";
import { verifyJwt } from "@/src/lib/auth/createToken.js";

function extractToken(req) {
  const authCookie = req.cookies.get("auth_token")?.value;
  const legacyCookie = req.cookies.get("token")?.value;
  return authCookie || legacyCookie || "";
}

function resolveUserId(req) {
  const token = extractToken(req);
  const decoded = token ? verifyJwt(token) : null;
  return decoded?.userId || decoded?.sub || null;
}

function buildUserFilter(userId) {
  if (!userId) return null;
  return ObjectId.isValid(userId)
    ? { _id: new ObjectId(userId) }
    : { _id: userId };
}

function normalizeUpdates(body = {}) {
  const updates = {};
  if (body.fullName !== undefined) {
    const value = String(body.fullName).trim();
    if (value) updates.fullName = value;
  }
  if (body.phone !== undefined) {
    const value = String(body.phone).trim();
    if (value) updates.phone = value;
  }
  if (body.email !== undefined) {
    const value = String(body.email).trim().toLowerCase();
    if (value) updates.email = value;
  }
  return updates;
}

export async function GET(req) {
  try {
    const filter = buildUserFilter(resolveUserId(req));
    if (!filter) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const db = await getDb();
    const users = db.collection("users");
    const user = await users.findOne(filter, {
      projection: { passwordHash: 0, password: 0 },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 404 });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    console.error("/api/users/me GET error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const filter = buildUserFilter(resolveUserId(req));
    if (!filter) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = normalizeUpdates(await req.json());
    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    updates.updatedAt = new Date();

    const db = await getDb();
    const users = db.collection("users");
    const updateResult = await users.updateOne(filter, { $set: updates });

    if (!updateResult.matchedCount) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await users.findOne(filter, {
      projection: { passwordHash: 0, password: 0 },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("/api/users/me PATCH error", error);
    const message = error.code === 11000 ? "אימייל או טלפון כבר קיימים במערכת" : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
