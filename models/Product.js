// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    legacyId: { type: String, index: true, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    fullDescription: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    catalogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Catalog', default: null, index: true },
    catalogSlug: { type: String, trim: true, lowercase: true, default: '' },

    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    commission: { type: Number, default: 0 },

    // Purchase types
    type: {
      type: String,
      enum: ['online', 'group'],
      default: 'online',
      required: true,
    },
    purchaseType: {
      type: String,
      enum: ['regular', 'group'],
      default: 'regular',
      required: true,
    },

    // Group purchase specific fields
    groupEndDate: { type: Date, default: null },
    expectedDeliveryDays: { type: Number, default: null },
    groupMinQuantity: { type: Number, default: 1 },
    groupCurrentQuantity: { type: Number, default: 0 },
    groupPurchaseDetails: {
      closingDays: { type: Number, default: null },
      shippingDays: { type: Number, default: null },
      minQuantity: { type: Number, default: null },
      currentQuantity: { type: Number, default: null },
      totalDays: { type: Number, default: null },
    },

    // Media
    image: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    images: { type: [String], default: [] },
    videoUrl: { type: String, default: '' },
    imagePath: { type: String, default: '' },

    // Stock management
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0 },

    // UX metadata
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    features: { type: [String], default: [] },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },

    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
