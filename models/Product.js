// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    sku: { type: String, trim: true, index: true },
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
    currency: { type: String, default: 'ILS', uppercase: true },

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
    rating: { 
      type: Number, 
      default: 0 
    },
    reviews: { 
      type: Number, 
      default: 0 
    },
    features: { 
      type: [String], 
      default: [] 
    },
    metadata: { 
      type: mongoose.Schema.Types.Mixed, 
      default: {} 
    },
    specs: { 
      type: String, 
      default: '' 
    },
    suitableFor: {
      type: String,
      default: ''
    },
    whyChooseUs: {
      type: String,
      default: ''
    },
    warranty: {
      type: String,
      default: ''
    },
    customFields: [{
      title: { type: String, default: '' },
      content: { type: String, default: '' }
    }],

    active: { 
      type: Boolean, 
      default: true 
    },
    archivedAt: { 
      type: Date, 
      default: null 
    },
  },
  { timestamps: true },
);

ProductSchema.pre('validate', function productPreValidate(next) {
  if (this.name) this.name = this.name.trim();
  if (this.category) this.category = this.category.trim();
  if (this.catalogSlug) this.catalogSlug = this.catalogSlug.trim().toLowerCase();

  if (this.currency) {
    this.currency = this.currency.toString().trim().toUpperCase() || 'ILS';
  } else {
    this.currency = 'ILS';
  }

  if (this.price !== undefined) {
    const numericPrice = Number(this.price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      this.invalidate('price', 'Product price must be a positive number');
    } else {
      this.price = numericPrice;
    }
  }

  if (this.originalPrice !== undefined && this.originalPrice !== null) {
    const numericOriginal = Number(this.originalPrice);
    this.originalPrice = Number.isNaN(numericOriginal) ? null : numericOriginal;
  }

  if (this.stockCount !== undefined) {
    const numericStock = Number(this.stockCount);
    this.stockCount = Number.isNaN(numericStock) ? 0 : Math.max(0, numericStock);
  }

  next();
});

ProductSchema.index({ catalogId: 1, active: 1 });
ProductSchema.index({ catalogSlug: 1, active: 1 });
ProductSchema.index({ active: 1, sortOrder: 1 || 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ active: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
