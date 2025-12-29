import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    status: { type: String, default: 'pending' },

    // Referral tracking & commission basics
    refSource: { type: String, default: null }, // הערך הגולמי מה-cookie
    refAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    commissionAmount: { type: Number, default: 0 }, // סכום העמלה (במטבע העסקה)
    commissionSettled: { type: Boolean, default: false }, // תאימות לאחור

    // Commission lifecycle
    orderType: {
      type: String,
      enum: ['regular', 'group'],
      default: 'regular',
    },
    deliveredAt: { type: Date, default: null }, // תאריך הספקה (בפועל)
    commissionAvailableAt: { type: Date, default: null }, // תאריך בו העמלה משתחררת
    commissionStatus: {
      type: String,
      enum: ['pending', 'available', 'claimed', 'cancelled'],
      default: 'pending',
    },
    groupPurchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GroupPurchase',
      default: null,
    },

    // Coupon tracking
    appliedCouponCode: { type: String, default: null },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Core order fields
    items: { type: Array, default: [] },
    totalAmount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Minimal placeholders (extend as needed)
    customerName: { type: String, default: null },
    customerPhone: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
OrderSchema.index({ agentId: 1, status: 1, createdAt: -1 });
OrderSchema.index({ refAgentId: 1, createdAt: -1 });
OrderSchema.index({ commissionStatus: 1, commissionAvailableAt: 1 });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
