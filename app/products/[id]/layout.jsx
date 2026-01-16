import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vipo-group.com';
const SITE_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || 'VIPO';

async function getProduct(id) {
  try {
    if (!ObjectId.isValid(id)) return null;
    const db = await getDb();
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
    return product;
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
    return null;
  }
}

function ensureAbsoluteUrl(url) {
  if (!url) return `${SITE_URL}/icons/512.png`;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${SITE_URL}${url}`;
  }
  return `${SITE_URL}/${url}`;
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    return {
      title: 'מוצר לא נמצא | ' + SITE_NAME,
      description: 'המוצר שחיפשת אינו קיים במערכת',
    };
  }

  const rawImage = product.image || product.images?.[0] || null;
  const productImage = ensureAbsoluteUrl(rawImage);
  const productUrl = `${SITE_URL}/products/${product._id}`;
  
  const priceText = product.price ? `₪${product.price.toLocaleString('he-IL')}` : '';
  const description = product.description 
    ? `${product.description.substring(0, 120)}${priceText ? ` | ${priceText}` : ''}`
    : `${product.name}${priceText ? ` - ${priceText}` : ''} | ${SITE_NAME}`;

  return {
    title: `${product.name} | ${SITE_NAME}`,
    description: description,
    
    openGraph: {
      title: `${product.name}${priceText ? ` - ${priceText}` : ''}`,
      description: description,
      url: productUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: 'he_IL',
      type: 'product',
    },
    
    twitter: {
      card: 'summary_large_image',
      title: `${product.name}${priceText ? ` - ${priceText}` : ''}`,
      description: description,
      images: [productImage],
    },

    other: {
      'product:price:amount': product.price?.toString() || '',
      'product:price:currency': 'ILS',
      'product:availability': product.stockCount > 0 ? 'in stock' : 'out of stock',
    },
  };
}

export default function ProductLayout({ children }) {
  return children;
}
