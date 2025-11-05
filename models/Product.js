// models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    
    // Cloud images (Cloudinary URLs)
    imageUrl: { type: String, default: "" }, // Primary image from Cloudinary
    images: { type: [String], default: [] }, // Multiple images (Cloudinary URLs)
    
    // @deprecated - for backward compatibility only
    imagePath: { type: String, default: "" }, // Local path (deprecated)
    
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
