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
    currency: {
      type: String,
      default: 'ILS',
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'processing', 'completed', 'rejected'],
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

    // === Review Process ===
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    reviewNotes: {
      type: String,
      default: '',
    },

    // === Payment Process ===
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    processedAt: {
      type: Date,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    paidAt: {
      type: Date,
    },

    // === Bank Details (snapshot at request time) ===
    bankDetails: {
      bankName: { type: String, default: null },
      branchNumber: { type: String, default: null },
      accountNumber: { type: String, default: null },
      accountName: { type: String, default: null },
    },
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'paypal', 'check', 'bit', null],
      default: null,
    },
    paypalEmail: {
      type: String,
      default: null,
    },

    // === Payment Confirmation ===
    paymentReference: {
      type: String,
      default: null,
    },
    paymentProof: {
      type: String, // URL to uploaded proof image
      default: null,
    },
    priorityPaymentDocId: {
      type: String,
      default: null,
    },

    // === Transaction Reference ===
    payoutTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      index: true,
    },

    // === Snapshot Data ===
    snapshotBalance: {
      type: Number,
      default: 0,
    },
    snapshotOnHold: {
      type: Number,
      default: 0,
    },
    snapshotAvailable: {
      type: Number,
      default: 0,
    },

    // === Auto Settlement ===
    autoSettled: {
      type: Boolean,
      default: false,
    },

    // === Rejection ===
    rejectionReason: {
      type: String,
      default: null,
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
