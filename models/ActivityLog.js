import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: String,
  userEmail: String,
  userRole: String,
  details: String,
  path: String,
  method: String,
  ip: String,
  userAgent: String,
  statusCode: Number,
  responseTime: Number,
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Index for efficient queries
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });
ActivityLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
