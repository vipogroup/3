import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    actorType: { type: String, enum: ["admin", "agent", "customer", "system"], required: true },
    actorId: { type: mongoose.Schema.Types.ObjectId, refPath: "actorTypeRef" },
    actorTypeRef: { type: String, default: "User" },
    targetType: { type: String, enum: ["product", "agent", "customer", "order", "system"], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: Object, default: {} },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ actorType: 1, actorId: 1, createdAt: -1 });
AuditLogSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
