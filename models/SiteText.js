import mongoose from 'mongoose';

const SiteTextSchema = new mongoose.Schema({
  textId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  page: {
    type: String,
    required: true,
    index: true,
  },
  section: {
    type: String,
    required: true,
    index: true,
  },
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: '',
  },
  defaultValue: {
    type: String,
    default: '',
  },
  previewLocation: {
    type: String,
    default: '',
  },
  fieldType: {
    type: String,
    enum: ['text', 'textarea', 'html'],
    default: 'text',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Create compound index for efficient queries
SiteTextSchema.index({ page: 1, section: 1, order: 1 });

export default mongoose.models.SiteText || mongoose.model('SiteText', SiteTextSchema);
