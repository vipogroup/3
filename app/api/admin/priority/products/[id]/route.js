/**
 * Admin API - Priority Product Mapping
 * GET /api/admin/priority/products/:id - פרטי מיפוי
 * PUT /api/admin/priority/products/:id - עדכון מיפוי
 * DELETE /api/admin/priority/products/:id - מחיקת מיפוי
 */

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import PriorityProduct from '@/models/PriorityProduct';
import Product from '@/models/Product';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const mapping = await PriorityProduct.findById(params.id)
      .populate('productId', 'name sku price image category')
      .lean();

    if (!mapping) {
      return NextResponse.json({ error: 'Mapping not found' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      mapping,
    });

  } catch (err) {
    console.error('[ADMIN_PRIORITY_PRODUCT_GET]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const data = await req.json();
    const { priorityItemCode, priorityItemName, vatType, glAccountSales, isActive } = data;

    const mapping = await PriorityProduct.findById(params.id);
    if (!mapping) {
      return NextResponse.json({ error: 'Mapping not found' }, { status: 404 });
    }

    // Update fields
    if (priorityItemCode !== undefined) mapping.priorityItemCode = priorityItemCode;
    if (priorityItemName !== undefined) mapping.priorityItemName = priorityItemName;
    if (vatType !== undefined) mapping.vatType = vatType;
    if (glAccountSales !== undefined) mapping.glAccountSales = glAccountSales;
    if (isActive !== undefined) mapping.isActive = isActive;
    
    mapping.lastModifiedBy = session.user.id;
    mapping.lastSyncAt = new Date();
    
    await mapping.save();

    // Update product sync status
    if (mapping.productId) {
      await Product.updateOne(
        { _id: mapping.productId },
        {
          $set: {
            priorityItemCode: mapping.priorityItemCode,
            prioritySyncStatus: 'synced',
            lastPrioritySyncAt: new Date(),
          },
        }
      );
    }

    return NextResponse.json({
      ok: true,
      mapping,
    });

  } catch (err) {
    console.error('[ADMIN_PRIORITY_PRODUCT_PUT]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const mapping = await PriorityProduct.findById(params.id);
    if (!mapping) {
      return NextResponse.json({ error: 'Mapping not found' }, { status: 404 });
    }

    // Clear product sync status
    if (mapping.productId) {
      await Product.updateOne(
        { _id: mapping.productId },
        {
          $unset: { priorityItemCode: '' },
          $set: { prioritySyncStatus: 'not_synced' },
        }
      );
    }

    await mapping.deleteOne();

    return NextResponse.json({
      ok: true,
      message: 'Mapping deleted',
    });

  } catch (err) {
    console.error('[ADMIN_PRIORITY_PRODUCT_DELETE]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
