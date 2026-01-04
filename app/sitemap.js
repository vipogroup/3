import { getDb } from '@/lib/db';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vipo.co.il';

export default async function sitemap() {
  const db = await getDb();
  
  // Static pages
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Get all published products
  let productPages = [];
  try {
    const products = await db.collection('products')
      .find({ 
        $or: [
          { status: 'published' },
          { status: { $exists: false } },
          { isActive: true },
          { isActive: { $exists: false } }
        ]
      })
      .project({ _id: 1, updatedAt: 1, createdAt: 1 })
      .toArray();

    productPages = products.map((product) => ({
      url: `${SITE_URL}/products/${product._id}`,
      lastModified: product.updatedAt || product.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap: Error fetching products:', error);
  }

  // Get all categories
  let categoryPages = [];
  try {
    const categories = await db.collection('categories')
      .find({})
      .project({ slug: 1, updatedAt: 1 })
      .toArray();

    categoryPages = categories.map((category) => ({
      url: `${SITE_URL}/shop?category=${category.slug}`,
      lastModified: category.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Sitemap: Error fetching categories:', error);
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
