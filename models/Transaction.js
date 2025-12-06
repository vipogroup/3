import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['sale', 'payout', 'commission', 'refund', 'adjustment'],
      default: 'sale',
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
      index: true,
    },
    withdrawalRequestId: {
      type: Schema.Types.ObjectId,
      ref: 'WithdrawalRequest',
      default: null,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'ILS',
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'completed', 'approved', 'rejected', 'failed'],
      default: 'pending',
      index: true,
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: () => ({}),
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

// Indexes for common queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });
transactionSchema.index({ type: 1, createdAt: -1 });
transactionSchema.index({ referredBy: 1, status: 1 });
transactionSchema.index({ withdrawalRequestId: 1 });

// מונע כפילויות build במצב dev
export default models.Transaction || model('Transaction', transactionSchema);
