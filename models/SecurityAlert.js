import mongoose from 'mongoose';

const SecurityAlertSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['failed_login', 'brute_force', 'suspicious_ip', 'unauthorized_access', 'sql_injection', 'xss_attempt', 'rate_limit', 'other']
  },
  message: {
    type: String,
    required: true
  },
  ip: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userEmail: String,
  path: String,
  method: String,
  userAgent: String,
  country: String,
  city: String,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Index for efficient queries
SecurityAlertSchema.index({ createdAt: -1 });
SecurityAlertSchema.index({ type: 1, createdAt: -1 });
SecurityAlertSchema.index({ ip: 1, createdAt: -1 });
SecurityAlertSchema.index({ severity: 1 });

export default mongoose.models.SecurityAlert || mongoose.model('SecurityAlert', SecurityAlertSchema);
