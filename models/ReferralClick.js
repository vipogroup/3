import mongoose from "mongoose";

const ReferralClickSchema = new mongoose.Schema({
  agentId: { type: String, index: true, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  productSlug: String,
  ip: String,
  userAgent: String,
}, { timestamps: true });

ReferralClickSchema.index({ agentId: 1, createdAt: -1 });

export default mongoose.models.ReferralClick || mongoose.model("ReferralClick", ReferralClickSchema);
