import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['new_user', 'new_order'], required: true },
    message: { type: String, required: true },
    payload: { type: Object, default: {} },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
