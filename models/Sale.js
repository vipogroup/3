// models/Sale.js
import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema(
  {
    // === Multi-Tenant ===
    tenantId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Tenant', 
      default: null,
      index: true,
    },
    
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    salePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    commission: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    commissionMeta: {
      basePct: { type: Number, default: 0.05 },
      levelBoostPct: { type: Number, default: 0 },
      bonusPercentBoostPct: { type: Number, default: 0 },
      fixedBonus: { type: Number, default: 0 },
      levelName: { type: String, default: null },
      appliedBonuses: [{ type: String }],
      goalHitApplied: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

export default mongoose.models.Sale || mongoose.model('Sale', SaleSchema);
