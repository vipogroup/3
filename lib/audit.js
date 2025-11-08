import AuditLog from "@/models/AuditLog";
import { connectMongo } from "@/lib/mongoose";

export async function logAudit({
  action,
  actorType = "system",
  actorId = null,
  targetType = "system",
  targetId = null,
  metadata = {},
  ip = null,
  userAgent = null,
}) {
  try {
    await connectMongo();
    await AuditLog.create({
      action,
      actorType,
      actorId,
      targetType,
      targetId,
      metadata,
      ip,
      userAgent,
    });
  } catch (e) {
    console.error("[AUDIT] write failed:", e?.message);
  }
}
