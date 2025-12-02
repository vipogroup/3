import mongoose from 'mongoose';

const CatalogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    sourcePdf: { type: String, default: '' },
    sourceJson: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Catalog || mongoose.model('Catalog', CatalogSchema);
