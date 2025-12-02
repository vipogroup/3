// app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import { connectMongo } from '@/lib/mongoose';
import Product from '@/models/Product';
import Catalog from '@/models/Catalog';
import { requireAdminApi } from '@/lib/auth/server';

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
    await requireAdminApi(req);

    await connectMongo();
    const body = await req.json();
    const update = {};

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
    if (body.specs) {
      update.specs = typeof body.specs === 'object' && body.specs !== null ? body.specs : {};
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
    await requireAdminApi(req);

    await connectMongo();
    const res = await Product.findOneAndDelete(buildProductQuery(params.id));
    if (!res) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('DELETE /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
