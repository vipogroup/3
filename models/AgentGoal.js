// models/AgentGoal.js
import mongoose from 'mongoose';

const AgentGoalSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2020,
      max: 2100,
    },
    targetSalesAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    targetDeals: {
      type: Number,
      required: true,
      min: 0,
    },
    bonusOnHit: {
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

// Validation: ensure at least one bonus is specified
AgentGoalSchema.pre('validate', function (next) {
  // Check if at least one bonus is specified
  const hasBonus =
    (this.bonusOnHit.fixedAmount !== undefined && this.bonusOnHit.fixedAmount !== null) ||
    (this.bonusOnHit.percentBoostPct !== undefined && this.bonusOnHit.percentBoostPct !== null);

  if (!hasBonus) {
    this.invalidate('bonusOnHit', 'At least one bonus type must be specified');
  }

  next();
});

// Compound index to ensure uniqueness of agent goals per month/year
AgentGoalSchema.index({ agentId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.models.AgentGoal || mongoose.model('AgentGoal', AgentGoalSchema);
