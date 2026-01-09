import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  // Multi-tenant support
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true,
  },
  
  // Basic info
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  
  // Status
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
    default: 'new',
  },
  
  // Source
  source: {
    type: String,
    enum: ['website', 'whatsapp', 'phone', 'referral', 'agent', 'manual', 'other'],
    default: 'manual',
  },
  
  // Agent attribution
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  
  // Assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  
  // Notes and tags
  notes: String,
  tags: [String],
  
  // Custom fields
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  
  // Conversion
  convertedToCustomer: {
    type: Boolean,
    default: false,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  convertedAt: Date,
  
  // Last contact
  lastContactAt: Date,
  nextFollowUpAt: Date,
  
}, {
  timestamps: true,
});

// Indexes
LeadSchema.index({ tenantId: 1, status: 1 });
LeadSchema.index({ tenantId: 1, createdAt: -1 });
LeadSchema.index({ tenantId: 1, phone: 1 });
LeadSchema.index({ tenantId: 1, assignedTo: 1 });

// Virtual for conversation count
LeadSchema.virtual('conversations', {
  ref: 'Conversation',
  localField: '_id',
  foreignField: 'leadId',
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
