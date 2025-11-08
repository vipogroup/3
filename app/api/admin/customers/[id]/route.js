import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "@/lib/mongoose";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { getReqInfo } from "@/lib/requestInfo";

const SUMMARY_PROJECTION = {
  fullName: 1,
  email: 1,
  phone: 1,
  refSource: 1,
  agentId: 1,
  joinedAt: 1,
  createdAt: 1,
  updatedAt: 1,
  orders: 1,
  isActive: 1,
  isCustomer: 1,
  adminNote: 1,
};

export async function GET(request, { params }) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  const customer = await findCustomer(params.id);
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const agent = await resolveAgent(customer.refSource || customer.agentId);

  const payload = mapCustomerDetail(customer, agent);

  const { ip, userAgent } = getReqInfo(request);
  await logAudit({
    action: "customer.viewed",
    actorType: "admin",
    actorId: auth.userId,
    targetType: "customer",
    targetId: payload._id,
    metadata: {},
    ip,
    userAgent,
  });

  return NextResponse.json({ ok: true, item: payload });
}

export async function PATCH(request, { params }) {
  const auth = await requireAdmin({ cookie: request.headers.get("cookie") || "" });
  if (!auth?.ok) {
    return NextResponse.json({ error: auth?.error || "Unauthorized" }, { status: auth?.status || 401 });
  }

  const customer = await findCustomer(params.id);
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.name !== undefined) customer.fullName = body.name;
  if (body.email !== undefined) customer.email = body.email?.toLowerCase() || null;
  if (body.note !== undefined) customer.adminNote = body.note;
  if (body.isActive !== undefined) customer.isActive = Boolean(body.isActive);

  await customer.save();

  const agent = await resolveAgent(customer.refSource || customer.agentId);
  const payload = mapCustomerDetail(customer, agent);

  const { ip, userAgent } = getReqInfo(request);
  await logAudit({
    action: "customer.updated",
    actorType: "admin",
    actorId: auth.userId,
    targetType: "customer",
    targetId: payload._id,
    metadata: {
      name: body.name,
      email: body.email,
      note: body.note,
      isActive: body.isActive,
    },
    ip,
    userAgent,
  });

  return NextResponse.json({ ok: true, item: payload });
}

async function findCustomer(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectMongo();
  return User.findOne({ _id: id, isCustomer: true }).select(SUMMARY_PROJECTION);
}

async function resolveAgent(refSource) {
  if (!refSource) return null;
  return User.findOne({ agentId: refSource }).select({ fullName: 1, email: 1, agentId: 1 });
}

function mapCustomerDetail(doc, agent) {
  return {
    _id: String(doc._id),
    name: doc.fullName,
    email: doc.email,
    phone: doc.phone,
    joinedAt: doc.joinedAt || doc.createdAt,
    refSource: doc.refSource,
    agent: agent
      ? {
          name: agent.fullName,
          email: agent.email,
          agentId: agent.agentId,
        }
      : null,
    isActive: doc.isActive,
    ordersCount: Array.isArray(doc.orders) ? doc.orders.length : 0,
    note: doc.adminNote || "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
