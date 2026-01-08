// models/BonusRule.js
import mongoose from 'mongoose';

const BonusRuleSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
      enum: ['sale', 'monthly'],
    },
    condition: {
      minSaleAmount: {
        type: Number,
        min: 0,
      },
      everyNthDeal: {
        type: Number,
        min: 0,
      },
    },
    reward: {
      fixedAmount: {
        type: Number,
        min: 0,
      },
      percentBoostPct: {
        type: Number,
        min: 0,
      },
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

// Validation: ensure at least one condition and one reward is specified
BonusRuleSchema.pre('validate', function (next) {
  // Check condition
  const hasCondition =
    (this.condition.minSaleAmount !== undefined && this.condition.minSaleAmount !== null) ||
    (this.condition.everyNthDeal !== undefined && this.condition.everyNthDeal !== null);

  // Check reward
  const hasReward =
    (this.reward.fixedAmount !== undefined && this.reward.fixedAmount !== null) ||
    (this.reward.percentBoostPct !== undefined && this.reward.percentBoostPct !== null);

  if (!hasCondition) {
    this.invalidate('condition', 'At least one condition must be specified');
  }

  if (!hasReward) {
    this.invalidate('reward', 'At least one reward must be specified');
  }

  next();
});

export default mongoose.models.BonusRule || mongoose.model('BonusRule', BonusRuleSchema);
