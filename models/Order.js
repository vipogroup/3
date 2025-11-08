import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  agentId: { type: String, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  productName: String,
  amount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  currency: { type: String, default: "ILS" },
  status: { type: String, enum: ["paid", "refunded", "pending"], default: "paid" },
}, { timestamps: true });

OrderSchema.virtual("commission").get(function () {
  const baseAmount = this.amount ?? this.totalAmount ?? 0;
  return this.status === "paid" ? Number((baseAmount * 0.10).toFixed(2)) : 0;
});

OrderSchema.index({ agentId: 1, createdAt: -1 });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
