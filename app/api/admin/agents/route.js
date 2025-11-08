import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/mongoose";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  await connectMongo();
  const agents = await User.find({ isAgent: true }).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    ok: true,
    items: agents.map(mapAgent),
  });
}

export async function POST(request) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    email = "",
    name = "",
    commissionRate,
    userId,
    phone,
  } = body;

  if (!name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (commissionRate === undefined || Number.isNaN(Number(commissionRate))) {
    return NextResponse.json({ error: "Commission rate is required" }, { status: 400 });
  }

  const rate = Number(commissionRate);
  if (rate < 0 || rate > 1) {
    return NextResponse.json({ error: "Commission rate must be between 0 and 1" }, { status: 400 });
  }

  await connectMongo();

  let targetUser = null;
  if (userId) {
    targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } else if (email) {
    targetUser = await User.findOne({ email: email.toLowerCase() });
  }

  let temporaryPassword = null;

  if (!targetUser) {
    if (!email) {
      return NextResponse.json({ error: "Email is required for new agent" }, { status: 400 });
    }

    const generatedPhone = phone || `AG-${Math.floor(Math.random() * 1_000_000_000)}`;
    const rawPassword = randomUUID();
    const passwordHash = await bcrypt.hash(rawPassword, 10);
    temporaryPassword = rawPassword;

    targetUser = await User.create({
      fullName: name,
      email: email.toLowerCase(),
      phone: generatedPhone,
      passwordHash,
      role: "agent",
      isAgent: true,
      agentId: randomUUID(),
      commissionRate: rate,
      isActive: true,
    });
  } else {
    targetUser.fullName = name;
    if (email) {
      targetUser.email = email.toLowerCase();
    }
    if (phone) {
      targetUser.phone = phone;
    }
  }

  if (!targetUser.agentId) {
    targetUser.agentId = randomUUID();
  }

  targetUser.role = "agent";
  targetUser.isAgent = true;
  targetUser.isActive = true;
  targetUser.commissionRate = rate;

  await targetUser.save();

  const mapped = mapAgent(targetUser);

  console.log("[ADMIN][AGENT] create", {
    actorId: auth.userId,
    agentId: mapped.agentId,
    targetId: mapped._id,
    temporaryPassword: temporaryPassword ? "generated" : "existing",
  });

  const responsePayload = { ok: true, item: mapped };
  if (temporaryPassword) {
    responsePayload.temporaryPassword = temporaryPassword;
  }

  return NextResponse.json(responsePayload, { status: 201 });
}

function mapAgent(doc) {
  return {
    _id: String(doc._id),
    fullName: doc.fullName,
    email: doc.email,
    phone: doc.phone,
    agentId: doc.agentId,
    isAgent: doc.isAgent,
    isActive: doc.isActive,
    role: doc.role,
    commissionRate: doc.commissionRate ?? 0,
    commissionTotal: doc.commissionTotal ?? 0,
    totalSales: doc.totalSales ?? 0,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
