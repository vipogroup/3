/**
 * Minimal model descriptor to satisfy the Stage 2 checklist.
 * This project does not currently use an ORM; the "model" documents the shape only.
 */
import mongoose from 'mongoose';

/**
 * דרישות בסיסיות לפי השכבות הקיימות:
 * - fullName: String (required)
 * - phone: String (required, unique)
 * - role: 'admin' | 'agent' | 'customer' (default: 'customer')
 * - passwordHash: String (required)
 * - createdAt: Date (default now)
 * - referralId: String (unique, sparse)  ← Stage 8.1
 */

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, sparse: true, index: true, trim: true, lowercase: true },
    role: {
      type: String,
      enum: ['admin', 'agent', 'customer'],
      default: 'customer',
      required: true,
    },
    passwordHash: { type: String, required: true },

    // Stage 8.1 – מזהה הפניה ייחודי (למערכת ההפניות)
    referralId: { type: String, unique: true, sparse: true, index: true },

    // Stage 11 – Referral System (חבר-מביא-חבר)
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // מי הפנה
    referralsCount: { type: Number, default: 0 }, // כמות הפניות (לסטטיסטיקה מהירה)
    
    // Stage 12 – Commission/Credit System
    referralCount: { type: Number, default: 0 }, // כמות הפניות (שם חלופי)
    commissionBalance: { type: Number, default: 0 }, // יתרת עמלות בש"ח
    totalSales: { type: Number, default: 0 }, // סה"כ מכירות שהסוכן הביא

    // תאימות למודל הקודם
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // מוסיף updatedAt בנוסף ל-createdAt לוגי
    versionKey: false,
  }
);

/** Validator דומה ל-validateUserShape הישן */
UserSchema.statics.validateUserShape = function (obj = {}) {
  const missing = [];
  if (!obj.fullName) missing.push('fullName');
  if (!obj.phone) missing.push('phone');
  if (!obj.role) missing.push('role');
  if (!obj.passwordHash) missing.push('passwordHash');
  return { ok: missing.length === 0, missing };
};

/** Virtual property: refLink - לינק הפניה אישי */
UserSchema.virtual('refLink').get(function() {
  const base = process.env.PUBLIC_URL || 'http://localhost:3001';
  return `${base}/?ref=${this._id}`;
});

/** Public view דומה ל-toPublicUser הישן – מסיר passwordHash */
UserSchema.methods.toPublicUser = function () {
  return {
    _id: this._id,
    fullName: this.fullName,
    phone: this.phone,
    email: this.email,
    role: this.role,
    referralId: this.referralId ?? null,
    referredBy: this.referredBy ?? null,
    referralsCount: this.referralsCount ?? 0,
    referralCount: this.referralCount ?? 0,
    commissionBalance: this.commissionBalance ?? 0,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// אינדקס מפורש (למקרה שה־autoIndex כבוי בפרודקשן)
UserSchema.index({ referralId: 1 }, { unique: true, sparse: true, name: 'uniq_referralId_sparse' });
UserSchema.index({ phone: 1 }, { unique: true, name: 'uniq_phone' });
UserSchema.index({ email: 1 }, { sparse: true, name: 'idx_email_sparse' });
UserSchema.index({ referredBy: 1 }, { name: 'idx_referredBy' });

// ייצוא סטנדרטי של מודל Mongoose
export default mongoose.models.User || mongoose.model('User', UserSchema);
