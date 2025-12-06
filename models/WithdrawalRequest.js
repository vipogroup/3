import mongoose from 'mongoose';

/**
 * Stage 12.6 - Withdrawal Request Model
 * For agents to request commission withdrawal
 */

const WithdrawalRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    processedAt: {
      type: Date,
    },
    payoutTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      index: true,
    },
    snapshotBalance: {
      type: Number,
      default: 0,
    },
    snapshotOnHold: {
      type: Number,
      default: 0,
    },
    autoSettled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Index for queries
WithdrawalRequestSchema.index({ userId: 1, status: 1 });
WithdrawalRequestSchema.index({ createdAt: -1 });
WithdrawalRequestSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.WithdrawalRequest ||
  mongoose.model('WithdrawalRequest', WithdrawalRequestSchema);
