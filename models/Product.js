// models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    
    // Product type: regular online purchase or group purchase
    type: { 
      type: String, 
      enum: ['online', 'group'], 
      default: 'online',
      required: true 
    },
    
    // Group purchase specific fields
    groupEndDate: { type: Date, default: null }, // תאריך סגירת מכירה קבוצתית
    expectedDeliveryDays: { type: Number, default: null }, // ימי אספקה לאחר סגירה
    groupMinQuantity: { type: Number, default: 1 }, // כמות מינימלית לקבוצה
    groupCurrentQuantity: { type: Number, default: 0 }, // כמות נוכחית של רוכשים
    
    // Cloud images (Cloudinary URLs)
    imageUrl: { type: String, default: "" }, // Primary image from Cloudinary
    images: { type: [String], default: [] }, // Multiple images (Cloudinary URLs)
    
    // Video support
    videoUrl: { type: String, default: "" }, // YouTube/Vimeo embed URL
    
    // @deprecated - for backward compatibility only
    imagePath: { type: String, default: "" }, // Local path (deprecated)
    
    category: { type: String, required: true, trim: true },
    
    // Stock management
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
