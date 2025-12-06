import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    status: { type: String, default: 'pending' },

    // Referral tracking
    refSource: { type: String, default: null }, // הערך הגולמי מה-cookie
    refAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    commissionAmount: { type: Number, default: 0 }, // סכום העמלה (במטבע העסקה)
    commissionSettled: { type: Boolean, default: false },

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

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
