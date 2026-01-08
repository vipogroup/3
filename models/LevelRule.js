// models/LevelRule.js
import mongoose from 'mongoose';

const LevelRuleSchema = new mongoose.Schema(
  {
    // === Multi-Tenant ===
    tenantId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Tenant', 
      default: null,
      index: true,
    },
    
    name: {
      type: String,
      required: true,
      trim: true,
    },
    minSalesAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    minDeals: {
      type: Number,
      required: true,
      min: 0,
    },
    commissionBoostPct: {
      type: Number,
      required: true,
      min: 0,
    },
    badgeColor: {
      type: String,
      required: true,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
    },
    sortOrder: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.models.LevelRule || mongoose.model('LevelRule', LevelRuleSchema);
