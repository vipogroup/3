// app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import { connectMongo } from '@/lib/mongoose';
import Product from '@/models/Product';
import Catalog from '@/models/Catalog';
import { requireAdminApi } from '@/lib/auth/server';
import { updateProductInPriority, deactivateProductInPriority } from '@/lib/priority/productSyncService';
import { isSuperAdmin } from '@/lib/tenant/tenantMiddleware';

function buildProductQuery(id) {
  const conditions = [];

  if (mongoose.Types.ObjectId.isValid(id)) {
    conditions.push({ _id: new mongoose.Types.ObjectId(id) });
  }

  conditions.push({ legacyId: id });

  return conditions.length === 1 ? conditions[0] : { $or: conditions };
}

export async function GET(_req, { params }) {
  await connectMongo();
  const doc = await Product.findOne(buildProductQuery(params.id)).lean();
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PUT(req, { params }) {
  try {
    // Admin-only: update product
    const admin = await requireAdminApi(req);

    await connectMongo();
    
    // Multi-Tenant: Verify product belongs to admin's tenant
    const existingProduct = await Product.findOne(buildProductQuery(params.id)).lean();
    if (!existingProduct) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    if (!isSuperAdmin(admin) && admin.tenantId) {
      const productTenantId = existingProduct.tenantId?.toString();
      const adminTenantId = admin.tenantId?.toString();
      if (productTenantId && productTenantId !== adminTenantId) {
        return NextResponse.json({ error: 'Forbidden - Product belongs to another tenant' }, { status: 403 });
      }
    }
    
    const body = await req.json();
    const update = {};

    if (typeof body.sku === 'string') update.sku = body.sku.trim();
    if (typeof body.name === 'string') update.name = body.name.trim();
    if (typeof body.description === 'string') update.description = body.description.trim();
    if (typeof body.fullDescription === 'string')
      update.fullDescription = body.fullDescription.trim();
    if (typeof body.category === 'string') update.category = body.category.trim();
    if (typeof body.price === 'number' && !Number.isNaN(body.price))
      update.price = Number(body.price);
    if (body.originalPrice !== undefined) {
      const original = Number(body.originalPrice);
      update.originalPrice = Number.isNaN(original) ? null : original;
    }
    if (typeof body.commission === 'number' && !Number.isNaN(body.commission)) {
      update.commission = body.commission;
    }
    if (Array.isArray(body.images)) update.images = body.images;
    if (typeof body.image === 'string') update.image = body.image;
    if (typeof body.imageUrl === 'string') update.imageUrl = body.imageUrl;
    if (typeof body.videoUrl === 'string') update.videoUrl = body.videoUrl;
    if (typeof body.inStock === 'boolean') update.inStock = body.inStock;
    if (body.stockCount !== undefined) {
      const stock = Number(body.stockCount);
      update.stockCount = Number.isNaN(stock) ? 0 : stock;
      
      // If stock is updated to > 0, automatically show product and mark as in stock
      if (update.stockCount > 0) {
        update.active = true;
        update.inStock = true;
      }
    }
    if (body.rating !== undefined) {
      const rating = Number(body.rating);
      update.rating = Number.isNaN(rating) ? 0 : rating;
    }
    if (body.reviews !== undefined) {
      const reviews = Number(body.reviews);
      update.reviews = Number.isNaN(reviews) ? 0 : reviews;
    }
    if (typeof body.purchaseType === 'string') {
      update.purchaseType = body.purchaseType;
      update.type = body.purchaseType === 'group' ? 'group' : 'online';
    }
    if (body.groupPurchaseDetails) {
      update.groupPurchaseDetails = {
        closingDays: Number(body.groupPurchaseDetails.closingDays) || 0,
        shippingDays: Number(body.groupPurchaseDetails.shippingDays) || 0,
        minQuantity: Number(body.groupPurchaseDetails.minQuantity) || 1,
        currentQuantity: Number(body.groupPurchaseDetails.currentQuantity) || 0,
        totalDays:
          (Number(body.groupPurchaseDetails.closingDays) || 0) +
          (Number(body.groupPurchaseDetails.shippingDays) || 0),
      };
      update.groupMinQuantity = update.groupPurchaseDetails.minQuantity;
      update.groupCurrentQuantity = update.groupPurchaseDetails.currentQuantity;
      update.expectedDeliveryDays = update.groupPurchaseDetails.shippingDays || null;
    } else if (body.purchaseType === 'regular') {
      update.groupPurchaseDetails = null;
      update.groupMinQuantity = null;
      update.groupCurrentQuantity = null;
      update.expectedDeliveryDays = body.expectedDeliveryDays ?? null;
    }
    if (body.features) {
      update.features = Array.isArray(body.features) ? body.features : [];
    }
    if (body.specs !== undefined) {
      update.specs = body.specs;
    }
    if (body.suitableFor !== undefined) {
      update.suitableFor = body.suitableFor;
    }
    if (body.whyChooseUs !== undefined) {
      update.whyChooseUs = body.whyChooseUs;
    }
    if (body.warranty !== undefined) {
      update.warranty = body.warranty;
    }
    if (body.customFields !== undefined) {
      update.customFields = Array.isArray(body.customFields) ? body.customFields : [];
    }
    if (typeof body.active === 'boolean') {
      update.active = body.active;
    }
    if (typeof body.isFeatured === 'boolean') {
      update.isFeatured = body.isFeatured;
    }

    // Handle position with auto-adjustment of other products (separated by purchase type)
    if (body.position !== undefined) {
      const newPosition = body.position === null ? null : Number(body.position);
      
      if (newPosition !== null && !Number.isNaN(newPosition) && newPosition > 0) {
        // Get current product to know its old position and type
        const currentProduct = await Product.findOne(buildProductQuery(params.id)).lean();
        const oldPosition = currentProduct?.position;
        const productType = body.purchaseType || currentProduct?.purchaseType || currentProduct?.type || 'regular';
        const isGroupPurchase = productType === 'group';
        
        // Build filter for same purchase type
        const typeFilter = isGroupPurchase 
          ? { $or: [{ purchaseType: 'group' }, { type: 'group' }] }
          : { $and: [{ purchaseType: { $ne: 'group' } }, { type: { $ne: 'group' } }] };
        
        console.log('[POSITION] Updating position for product:', currentProduct?.name, 'from', oldPosition, 'to', newPosition, 'type:', productType);
        
        // First, ensure all products of this type have a position assigned
        // Get all products of same type without position
        const productsWithoutPosition = await Product.find({
          position: { $exists: false },
          _id: { $ne: currentProduct._id },
          ...typeFilter
        }).lean();
        
        // Also get products with null position
        const productsWithNullPosition = await Product.find({
          position: null,
          _id: { $ne: currentProduct._id },
          ...typeFilter
        }).lean();
        
        // Get highest current position for this type
        const highestPositionProduct = await Product.findOne({
          position: { $exists: true, $ne: null },
          ...typeFilter
        }).sort({ position: -1 }).lean();
        
        let nextPosition = (highestPositionProduct?.position || 0) + 1;
        
        // Assign positions to products without one
        for (const prod of [...productsWithoutPosition, ...productsWithNullPosition]) {
          await Product.updateOne(
            { _id: prod._id },
            { $set: { position: nextPosition++ } }
          );
        }
        
        // Now handle the position change
        if (oldPosition !== newPosition) {
          if (oldPosition && newPosition < oldPosition) {
            // Moving up: shift products between newPosition and oldPosition-1 down by 1
            await Product.updateMany(
              { 
                position: { $gte: newPosition, $lt: oldPosition },
                _id: { $ne: currentProduct._id },
                ...typeFilter
              },
              { $inc: { position: 1 } }
            );
          } else if (oldPosition && newPosition > oldPosition) {
            // Moving down: shift products between oldPosition+1 and newPosition up by 1
            await Product.updateMany(
              { 
                position: { $gt: oldPosition, $lte: newPosition },
                _id: { $ne: currentProduct._id },
                ...typeFilter
              },
              { $inc: { position: -1 } }
            );
          } else if (!oldPosition) {
            // New position assignment: shift all products at newPosition and above down by 1
            await Product.updateMany(
              { 
                position: { $gte: newPosition },
                _id: { $ne: currentProduct._id },
                ...typeFilter
              },
              { $inc: { position: 1 } }
            );
          }
        }
        
        update.position = newPosition;
        console.log('[POSITION] Position set to:', newPosition);
      } else {
        update.position = null;
        console.log('[POSITION] Position cleared (set to null)');
      }
    }

    if (body.catalogId || body.catalogSlug) {
      let catalogDoc = null;

      if (body.catalogId) {
        catalogDoc = await Catalog.findById(body.catalogId).lean();
        if (!catalogDoc) {
          return NextResponse.json(
            { error: 'Catalog not found for provided catalogId' },
            { status: 400 },
          );
        }
      } else if (body.catalogSlug) {
        catalogDoc = await Catalog.findOne({
          slug: String(body.catalogSlug).trim().toLowerCase(),
        }).lean();
        if (!catalogDoc) {
          return NextResponse.json(
            { error: 'Catalog not found for provided catalogSlug' },
            { status: 400 },
          );
        }
      }

      if (catalogDoc) {
        update.catalogId = catalogDoc._id;
        update.catalogSlug = catalogDoc.slug;
      }
    }

    const doc = await Product.findOneAndUpdate(buildProductQuery(params.id), update, { new: true });
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Sync update to Priority ERP (async)
    updateProductInPriority(doc, update).then((result) => {
      if (result.synced) {
        console.log('[PRIORITY] Product updated:', result.itemCode);
      } else if (result.reason !== 'not_configured') {
        console.warn('[PRIORITY] Product update sync failed:', result.reason);
      }
    }).catch((err) => {
      console.warn('[PRIORITY] Product update sync error:', err?.message || err);
    });

    return NextResponse.json(doc);
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('PUT /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    // Admin-only: delete product
    const admin = await requireAdminApi(req);

    await connectMongo();
    
    // Multi-Tenant: Verify product belongs to admin's tenant before deleting
    const existingProduct = await Product.findOne(buildProductQuery(params.id)).lean();
    if (!existingProduct) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    if (!isSuperAdmin(admin) && admin.tenantId) {
      const productTenantId = existingProduct.tenantId?.toString();
      const adminTenantId = admin.tenantId?.toString();
      if (productTenantId && productTenantId !== adminTenantId) {
        return NextResponse.json({ error: 'Forbidden - Product belongs to another tenant' }, { status: 403 });
      }
    }
    
    const res = await Product.findOneAndDelete(buildProductQuery(params.id));
    if (!res) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Deactivate in Priority ERP (async, soft delete)
    deactivateProductInPriority(res).then((result) => {
      if (result.synced) {
        console.log('[PRIORITY] Product deactivated:', result.itemCode);
      } else if (result.reason !== 'not_configured') {
        console.warn('[PRIORITY] Product deactivation failed:', result.reason);
      }
    }).catch((err) => {
      console.warn('[PRIORITY] Product deactivation error:', err?.message || err);
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('DELETE /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
