import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { connectMongo } from "@/lib/mongoose";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { getReqInfo } from "@/lib/requestInfo";

export async function GET(request, { params }) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  const agent = await findAgent(params.id);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, item: mapAgent(agent) });
}

export async function PATCH(request, { params }) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  const agent = await findAgent(params.id);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updates = {};
  if (body.fullName !== undefined) updates.fullName = body.fullName;
  if (body.email !== undefined) updates.email = body.email?.toLowerCase();
  if (body.phone !== undefined) updates.phone = body.phone;
  if (body.commissionRate !== undefined) {
    const rate = Number(body.commissionRate);
    if (Number.isNaN(rate) || rate < 0 || rate > 1) {
      return NextResponse.json({ error: "Commission rate must be between 0 and 1" }, { status: 400 });
    }
    updates.commissionRate = rate;
  }
  if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);
  if (body.agentId === null) {
    updates.agentId = null;
  }

  Object.assign(agent, updates);
  if (!agent.agentId) {
    agent.agentId = randomUUID();
  }

  agent.isAgent = true;
  agent.role = "agent";

  await agent.save();

  const { ip, userAgent } = getReqInfo(request);
  await logAudit({
    action: "agent.updated",
    actorType: "admin",
    actorId: auth.userId,
    targetType: "agent",
    targetId: agent._id,
    metadata: { updates },
    ip,
    userAgent,
  });

  return NextResponse.json({ ok: true, item: mapAgent(agent) });
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  const agent = await findAgent(params.id);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  agent.isAgent = false;
  agent.role = "customer";
  agent.isActive = false;

  await agent.save();

  const { ip, userAgent } = getReqInfo(request);
  await logAudit({
    action: "agent.deleted",
    actorType: "admin",
    actorId: auth.userId,
    targetType: "agent",
    targetId: agent._id,
    metadata: { agentId: agent.agentId },
    ip,
    userAgent,
  });

  return NextResponse.json({ ok: true });
}

async function findAgent(id) {
  await connectMongo();
  return User.findOne({ _id: id, isAgent: true });
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
