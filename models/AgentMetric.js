import mongoose from "mongoose";

const AgentMetricSchema = new mongoose.Schema({
  agentId: { type: String, unique: true, index: true },
  clicks: { type: Number, default: 0 },
  leads: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  commissionTotal: { type: Number, default: 0 },
  byProduct: [{
    productId: mongoose.Schema.Types.ObjectId,
    productName: String,
    clicks: Number,
    leads: Number,
    sales: Number,
    revenue: Number,
    commission: Number,
  }],
}, { timestamps: true });

export default mongoose.models.AgentMetric || mongoose.model("AgentMetric", AgentMetricSchema);
