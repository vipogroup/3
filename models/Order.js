import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    status: { type: String, default: 'pending' },

    // Referral tracking
    refSource: { type: String, default: null },           // הערך הגולמי מה-cookie
    refAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    commissionReferral: { type: Number, default: 0 },     // סכום העמלה (במטבע העסקה)

    // Core order fields
    items: { type: Array, default: [] },
    total: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Minimal placeholders (extend as needed)
    customerName: { type: String, default: null },
    customerPhone: { type: String, default: null },
    totalAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
