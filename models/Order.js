import mongoose from 'mongoose';

import {
  ORDER_STATUS,
  ORDER_STATUS_VALUES,
  PAYMENT_STATUS,
  PAYMENT_STATUS_VALUES,
  coercePaymentStatusForOrderStatus,
  assertOrderStatusInvariant,
  normalizeOrderStatus,
} from '@/lib/orders/status';

const OrderSchema = new mongoose.Schema(
  {
    // === Multi-Tenant ===
    tenantId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Tenant', 
      default: null,
      index: true,
    },
    
    status: {
      type: String,
      enum: ORDER_STATUS_VALUES,
      default: ORDER_STATUS.PENDING,
      set: normalizeOrderStatus,
    },

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

    // === PayPlus Integration ===
    payplusSessionId: { type: String, default: null, index: true },
    payplusTransactionId: { type: String, default: null, index: true },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS_VALUES,
      default: PAYMENT_STATUS.PENDING,
      set(value) {
        const coerced = coercePaymentStatusForOrderStatus(this?.status, value);
        return coerced;
      },
    },
    paymentMethod: { type: String, default: null },
    paidAt: { type: Date, default: null },

    // === Priority Integration ===
    priorityDocId: { type: String, default: null, index: true },
    prioritySalesOrderId: { type: String, default: null },
    invoiceNumber: { type: String, default: null },
    receiptNumber: { type: String, default: null },
    prioritySyncStatus: {
      type: String,
      enum: ['pending', 'synced', 'failed', 'not_required'],
      default: 'pending',
    },

    // === Refund tracking ===
    refundAmount: { type: Number, default: 0 },
    refundReason: { type: String, default: null },
    refundedAt: { type: Date, default: null },
    refundedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // === Customer details for Priority ===
    customer: {
      email: { type: String, default: null },
      address: { type: String, default: null },
      city: { type: String, default: null },
      zipCode: { type: String, default: null },
      vatId: { type: String, default: null },
    },

    // === Totals breakdown ===
    totals: {
      subtotal: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
      discountPercent: { type: Number, default: 0 },
      vatAmount: { type: Number, default: 0 },
      shippingAmount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
OrderSchema.index({ agentId: 1, status: 1, createdAt: -1 });
OrderSchema.index({ refAgentId: 1, createdAt: -1 });
OrderSchema.index({ commissionStatus: 1, commissionAvailableAt: 1 });

OrderSchema.pre('validate', function enforceStatusInvariant(next) {
  this.status = normalizeOrderStatus(this.status);
  this.paymentStatus = coercePaymentStatusForOrderStatus(this.status, this.paymentStatus);

  try {
    assertOrderStatusInvariant(this.status, this.paymentStatus);
    next();
  } catch (err) {
    next(err);
  }
});

OrderSchema.statics.normalizeStatus = normalizeOrderStatus;

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
