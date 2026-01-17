import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import Product from '@/models/Product';
import Tenant from '@/models/Tenant';

export const dynamic = 'force-dynamic';

/**
 * GET /api/marketplace/products
 * מחזיר מוצרים מכל העסקים הפעילים עם פרטי העסק
 * לשימוש בדף הבית - מרקטפלייס מוצרים
 */
export async function GET(request) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    
    // פרמטרים לסינון
    const tenantSlug = searchParams.get('tenant'); // סינון לפי עסק ספציפי
    const category = searchParams.get('category');
    const purchaseType = searchParams.get('type'); // 'group' או 'regular'
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 24;
    const skip = (page - 1) * limit;

    // קבלת כל העסקים הפעילים
    const activeTenants = await Tenant.find({ status: 'active' })
      .select('_id name slug branding contact')
      .lean();
    
    const activeTenantIds = activeTenants.map(t => t._id);
    const tenantsMap = {};
    activeTenants.forEach(t => {
      tenantsMap[t._id.toString()] = t;
    });

    // בניית Query למוצרים
    // מציג מוצרים מעסקים פעילים + מוצרים ללא tenant (גלובליים)
    const query = {
      active: { $ne: false }, // מוצרים פעילים או ללא סטטוס
      $or: [
        { tenantId: { $in: activeTenantIds } }, // מוצרים מעסקים פעילים
        { tenantId: { $exists: false } }, // מוצרים ללא tenant
        { tenantId: null }, // מוצרים עם tenant null
      ],
      $and: [{
        $or: [
          { stockCount: { $gt: 0 } },
          { stockCount: { $exists: false } }, // מוצרים ללא stockCount
          { purchaseType: 'group' },
          { type: 'group' }
        ]
      }]
    };

    // סינון לפי עסק
    if (tenantSlug) {
      const tenant = activeTenants.find(t => t.slug === tenantSlug);
      if (tenant) {
        query.tenantId = tenant._id;
      }
    }

    // סינון לפי קטגוריה
    if (category) {
      query.category = category;
    }

    // סינון לפי סוג רכישה
    if (purchaseType === 'group') {
      query.$and = [
        { $or: [{ purchaseType: 'group' }, { type: 'group' }] }
      ];
    } else if (purchaseType === 'regular') {
      query.purchaseType = 'regular';
      query.type = { $ne: 'group' };
    }

    // חיפוש טקסט
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex }
        ]
      });
    }

    // שליפת מוצרים
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .sort({ isFeatured: -1, position: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    // הוספת פרטי העסק לכל מוצר
    const productsWithTenant = products.map(product => {
      const tenantId = product.tenantId?.toString();
      const tenant = tenantId ? tenantsMap[tenantId] : null;
      
      return {
        _id: product.legacyId || product._id.toString(),
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        commission: product.commission,
        image: product.imageUrl || product.image,
        images: product.images,
        purchaseType: product.purchaseType,
        type: product.type,
        inStock: product.inStock,
        stockCount: product.stockCount,
        rating: product.rating,
        reviews: product.reviews,
        isFeatured: product.isFeatured,
        groupEndDate: product.groupEndDate,
        groupMinQuantity: product.groupMinQuantity,
        groupCurrentQuantity: product.groupCurrentQuantity,
        // פרטי העסק
        tenant: tenant ? {
          _id: tenant._id.toString(),
          name: tenant.name,
          slug: tenant.slug,
          logo: tenant.branding?.logo,
          primaryColor: tenant.branding?.primaryColor,
        } : null,
      };
    });

    // קבלת קטגוריות ייחודיות
    const allCategories = await Product.distinct('category', {
      active: true,
      tenantId: { $in: activeTenantIds }
    });

    return NextResponse.json({
      products: productsWithTenant,
      tenants: activeTenants.map(t => ({
        _id: t._id.toString(),
        name: t.name,
        slug: t.slug,
        logo: t.branding?.logo,
        primaryColor: t.branding?.primaryColor,
      })),
      categories: allCategories.filter(Boolean),
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      }
    });

  } catch (error) {
    console.error('GET /api/marketplace/products error:', error);
    return NextResponse.json(
      { error: 'Failed to load marketplace products' },
      { status: 500 }
    );
  }
}
