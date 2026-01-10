import mongoose from 'mongoose';

const ErrorLogSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  stack: String,
  path: String,
  method: String,
  statusCode: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ip: String,
  userAgent: String,
  requestBody: mongoose.Schema.Types.Mixed,
  requestQuery: mongoose.Schema.Types.Mixed,
  responseBody: mongoose.Schema.Types.Mixed,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Index for efficient queries
ErrorLogSchema.index({ createdAt: -1 });
ErrorLogSchema.index({ path: 1, createdAt: -1 });
ErrorLogSchema.index({ statusCode: 1 });
ErrorLogSchema.index({ severity: 1 });

export default mongoose.models.ErrorLog || mongoose.model('ErrorLog', ErrorLogSchema);
