export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { connectMongo } from '@/lib/mongoose';
import Product from '@/models/Product';
import Catalog from '@/models/Catalog';
import Message from '@/models/Message';
import { requireAdminApi } from '@/lib/auth/server';
import { pushToTags } from '@/lib/pushSender';

const SEED_PRODUCTS = [
  {
    legacyId: 'seed-mechanical-keyboard',
    name: 'מקלדת מכנית RGB מקצועית',
    description: 'מקלדת מכנית איכותית עם תאורת RGB מלאה ומקשים כחולים להגבה חזקה.',
    fullDescription:
      'מקלדת מכנית מקצועית המתאימה לגיימרים וליוצרי תוכן. שלדת אלומיניום, תאורת RGB דינמית, ומתגים כחולים המספקים תחושה טקטילית מדויקת.',
    category: 'אביזרי מחשב',
    price: 499,
    originalPrice: 699,
    commission: 49.9,
    type: 'online',
    purchaseType: 'regular',
    expectedDeliveryDays: 5,
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    imageUrl:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=80',
    ],
    inStock: true,
    stockCount: 25,
    rating: 4.7,
    reviews: 18,
    features: ['תאורת RGB מלאה', 'מקשים ניתנים להחלפה', 'מבנה אלומיניום קשיח'],
    specs: {
      מותג: 'VIPO Gear',
      סוג_מתגים: 'כחולים',
      תאורה: 'RGB מלאה',
      חיבור: 'USB-C',
    },
    active: true,
  },
  {
    legacyId: 'seed-gaming-mouse',
    name: 'עכבר גיימינג אלחוטי עם DPI משתנה',
    description: 'עכבר גיימינג קל משקל עם חיישן 26,000 DPI ותאורת RGB מתכווננת.',
    fullDescription:
      'עכבר גיימינג אלחוטי המציע דיוק מקסימלי עם חיישן 26,000 DPI, משקל 65 גרם, ותאורת RGB מלאה. כולל 6 כפתורים ניתנים לתכנות וסוללה ל-90 שעות שימוש.',
    category: 'אביזרי מחשב',
    price: 389,
    originalPrice: 459,
    commission: 38.9,
    type: 'online',
    purchaseType: 'regular',
    expectedDeliveryDays: 4,
    image:
      'https://images.unsplash.com/photo-1584270354949-1ff37cfd84f0?auto=format&fit=crop&w=1200&q=80',
    imageUrl:
      'https://images.unsplash.com/photo-1584270354949-1ff37cfd84f0?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1584270354949-1ff37cfd84f0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
    ],
    inStock: true,
    stockCount: 40,
    rating: 4.5,
    reviews: 42,
    features: ['חיישן 26,000 DPI', 'חיבור אלחוטי דו-מצבי', 'משקל 65 גרם'],
    specs: {
      מותג: 'VIPO Gear',
      DPI: '26,000',
      חיבורים: 'USB-C / 2.4GHz / Bluetooth',
      משקל: '65 גרם',
    },
    active: true,
  },
  {
    legacyId: 'seed-4k-monitor',
    name: 'מסך 27" 4K HDR מקצועי',
    description: 'מסך 27 אינץ׳ ברזולוציית 4K עם תמיכה ב-HDR ודקויות צבע מרהיבות.',
    fullDescription:
      'מסך 27 אינץ׳ ברזולוציית 4K UHD עם תמיכה ב-HDR400 ודיוק צבעים של 99% sRGB. אידיאלי לעריכת וידאו, עיצוב גרפי וגיימינג.',
    category: 'מסכים',
    price: 2190,
    originalPrice: 2490,
    commission: 219,
    type: 'online',
    purchaseType: 'regular',
    expectedDeliveryDays: 7,
    image:
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80',
    imageUrl:
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589254065878-42c9da6694c2?auto=format&fit=crop&w=1200&q=80',
    ],
    inStock: true,
    stockCount: 12,
    rating: 4.8,
    reviews: 34,
    features: ['תמיכה ב-HDR400', 'דיוק צבעים 99% sRGB', 'קצב רענון 144Hz'],
    specs: {
      מותג: 'VIPO Vision',
      רזולוציה: '3840x2160',
      HDR: 'HDR400',
      חיבורים: 'HDMI 2.1 / DisplayPort 1.4 / USB-C',
    },
    active: true,
  },
  {
    legacyId: 'seed-ultrawide-monitor',
    name: 'מסך אולטרה-ווייד 34" עם קצב רענון 165Hz',
    description: 'מסך קעור בגודל 34 אינץ׳ עם יחס 21:9, רזולוציית QHD וקצב רענון מהיר.',
    fullDescription:
      'מסך UltraWide קעור בגודל 34 אינץ׳, רזולוציית 3440x1440, קצב רענון 165Hz, תמיכה ב-FreeSync Premium ו-HDR400. מיועד לגיימרים וליוצרי תוכן.',
    category: 'מסכים',
    price: 2690,
    originalPrice: 2990,
    commission: 269,
    type: 'online',
    purchaseType: 'regular',
    expectedDeliveryDays: 6,
    image:
      'https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=1200&q=80',
    imageUrl:
      'https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616464918770-5ce8f03b488f?auto=format&fit=crop&w=1200&q=80',
    ],
    inStock: true,
    stockCount: 15,
    rating: 4.7,
    reviews: 21,
    features: ['קצב רענון 165Hz', 'מסך קעור 1500R', 'HDR400 ו-FreeSync'],
    specs: {
      מותג: 'VIPO Vision',
      רזולוציה: '3440x1440',
      קצב_רענון: '165Hz',
      פורטים: 'HDMI 2.0 / DisplayPort 1.4 / USB-Hub',
    },
    active: true,
  },
  {
    legacyId: 'seed-ergonomic-chair',
    name: 'כיסא ארגונומי חכם עם תמיכת גב מלאה',
    description: 'כיסא ארגונומי עם תמיכה מותנית, משענות מתכווננות ובד נושם.',
    fullDescription:
      'כיסא עבודה ארגונומי שפותח עבור ישיבה ממושכת. כולל מנגנון תמיכה מותני דינמי, משענות מתכווננות 4D ובד רשת נושם המפחית הצטברות חום.',
    category: 'ריהוט',
    price: 1380,
    originalPrice: 1590,
    commission: 138,
    type: 'online',
    purchaseType: 'regular',
    expectedDeliveryDays: 3,
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    imageUrl:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    ],
    inStock: true,
    stockCount: 30,
    rating: 4.6,
    reviews: 27,
    features: ['תמיכה מותנית דינמית', 'משענות 4D', 'בד רשת נושם'],
    specs: {
      מותג: 'VIPO Comfort',
      חומר: 'רשת מיקרופייבר',
      צבע: 'שחור גרפיט',
      אחריות: '5 שנים',
    },
    active: true,
  },
  {
    legacyId: 'seed-standing-desk',
    name: 'שולחן עבודה חשמלי מתכוונן לגובה',
    description: 'שולחן עבודה מתכוונן חשמלית עם שני מנועים וטווח גובה רחב.',
    fullDescription:
      'שולחן עבודה חשמלי עם שני מנועים שקטים, טווח גובה 62-127 ס״מ, משטח עץ בגודל 140x70 ס״מ ופאנל שליטה עם 4 מצבי זיכרון.',
    category: 'ריהוט',
    price: 1890,
    originalPrice: 2190,
    commission: 189,
    type: 'online',
    purchaseType: 'regular',
    expectedDeliveryDays: 5,
    image:
      'https://images.unsplash.com/photo-1616628188505-4047d9b51958?auto=format&fit=crop&w=1200&q=80',
    imageUrl:
      'https://images.unsplash.com/photo-1616628188505-4047d9b51958?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1616628188505-4047d9b51958?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    ],
    inStock: true,
    stockCount: 18,
    rating: 4.6,
    reviews: 31,
    features: ['שני מנועים שקטים', 'טווח גובה 62-127 ס"מ', 'פאנל זיכרון עם 4 מצבים'],
    specs: {
      מותג: 'VIPO Comfort',
      חומר: 'משטח עץ מלא',
      עומס_מקסימלי: '120 ק"ג',
      אחריות: '3 שנים',
    },
    active: true,
  },
  {
    legacyId: 'seed-wireless-headphones',
    name: 'אוזניות אלחוטיות עם ביטול רעשים מתקדם',
    description: 'אוזניות Over-Ear עם ביטול רעשים אקטיבי, חיי סוללה ל-30 שעות וטעינה מהירה.',
    fullDescription:
      'אוזניות אלחוטיות יוקרתיות עם ביטול רעשים אקטיבי, מצב שקיפות, חיישני מגע וחיי סוללה של 30 שעות. כוללות תמיכה ב-Bluetooth 5.3 וטעינה מהירה USB-C.',
    category: 'אודיו',
    price: 1190,
    originalPrice: 1390,
    commission: 119,
    type: 'online',
    purchaseType: 'regular',
    expectedDeliveryDays: 3,
    image:
      'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=1200&q=80',
    imageUrl:
      'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80',
    ],
    inStock: true,
    stockCount: 22,
    rating: 4.9,
    reviews: 105,
    features: ['ביטול רעשים היברידי', 'חיי סוללה 30 שעות', 'מצב שקיפות'],
    specs: {
      מותג: 'VIPO Audio',
      Bluetooth: '5.3',
      אודיו: 'Hi-Res Wireless',
      טעינה: 'USB-C + טעינה מהירה',
    },
    active: true,
  },
  {
    legacyId: 'seed-smart-speaker',
    name: 'רמקול חכם עם עוזר קולי משולב',
    description: 'רמקול חכם עם סאונד 360°, עוזר קולי מובנה ושליטה על בית חכם.',
    fullDescription:
      'רמקול חכם חזק עם עיצוב פרימיום, סאונד 360°, תמיכה בעברית ובעוזר קולי משולב. מאפשר שליטה על תאורה, מזגן ומכשירי בית חכם בלחיצת כפתור.',
    category: 'אודיו',
    price: 690,
    originalPrice: 790,
    commission: 69,
    type: 'online',
    purchaseType: 'regular',
    expectedDeliveryDays: 2,
    image:
      'https://images.unsplash.com/photo-1585386959984-a4155220a1ad?auto=format&fit=crop&w=1200&q=80',
    imageUrl:
      'https://images.unsplash.com/photo-1585386959984-a4155220a1ad?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1585386959984-a4155220a1ad?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528291151373-774f0d4c52ae?auto=format&fit=crop&w=1200&q=80',
    ],
    inStock: true,
    stockCount: 35,
    rating: 4.4,
    reviews: 58,
    features: ['סאונד 360°', 'עוזר קולי בעברית', 'שליטה על בית חכם'],
    specs: {
      מותג: 'VIPO Audio',
      חיבורים: 'Wi-Fi / Bluetooth / AUX',
      מיקרופונים: '4 מיקרופונים כיווניים',
      תאורה: 'Ambient LED',
    },
    active: true,
  },
];

async function ensureSeedProducts() {
  await Promise.all(
    SEED_PRODUCTS.map(async (seed) => {
      const { legacyId, ...seedData } = seed;
      try {
        await Product.findOneAndUpdate(
          { legacyId },
          {
            $set: seedData,
            $setOnInsert: { legacyId },
          },
          {
            upsert: true,
            setDefaultsOnInsert: true,
            new: false,
          },
        );
      } catch (error) {
        console.error(`Failed to upsert seed product ${legacyId}:`, error);
      }
    }),
  );
}

async function notifyProductCreation(adminUser, productDoc) {
  const senderId = ObjectId.isValid(adminUser?.id) ? new ObjectId(adminUser.id) : null;
  if (!senderId) return;

  const baseMessage = `מוצר חדש נוסף למערכת: ${productDoc.name}`;
  const roles = ['agent', 'customer'];

  await Promise.all(
    roles.map(async (role) => {
      const messageDoc = await Message.create({
        senderId,
        senderRole: 'admin',
        targetRole: role,
        targetUserId: null,
        message: baseMessage,
        readBy: [
          {
            userId: senderId,
            readAt: new Date(),
          },
        ],
      });

      await pushToTags([role], {
        title: 'מוצר חדש ב-VIPO',
        body: baseMessage,
        data: {
          type: 'product_created',
          productId: String(productDoc._id),
          messageId: String(messageDoc._id),
          targetRole: role,
        },
        url: '/products',
      });
    }),
  );
}

function serializeProduct(doc) {
  if (!doc) return doc;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  const catalogDoc =
    obj.catalogId && typeof obj.catalogId === 'object' && !Array.isArray(obj.catalogId)
      ? obj.catalogId
      : null;

  const serialized = {
    ...obj,
    _id: obj.legacyId ?? obj._id?.toString?.() ?? obj._id,
    createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : null,
    updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : null,
  };

  if (catalogDoc) {
    serialized.catalog = {
      _id: catalogDoc._id?.toString?.() ?? catalogDoc._id,
      name: catalogDoc.name ?? '',
      slug: catalogDoc.slug ?? '',
      image: catalogDoc.image ?? '',
      active: catalogDoc.active ?? true,
    };
    serialized.catalogId =
      catalogDoc._id?.toString?.() ?? catalogDoc._id ?? serialized.catalogId ?? null;
    serialized.catalogSlug = catalogDoc.slug ?? serialized.catalogSlug ?? '';
  } else {
    serialized.catalog = null;
    if (serialized.catalogId && typeof serialized.catalogId === 'object') {
      serialized.catalogId =
        serialized.catalogId._id?.toString?.() ?? serialized.catalogId._id ?? null;
    }
  }

  return serialized;
}

export async function GET(request) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const catalogSlug = searchParams.get('catalog');
    const query = {};

    if (catalogSlug) {
      query.catalogSlug = catalogSlug;
    }

    const products = await Product.find(query)
      .populate({ path: 'catalogId', select: 'name slug image active' })
      .lean();
    const serialized = products.map((doc) => serializeProduct(doc));
    return NextResponse.json({ products: serialized }, { status: 200 });
  } catch (err) {
    console.error('GET /api/products error:', err);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Admin-only: create product
    const adminUser = await requireAdminApi(request);

    await connectMongo();
    const payload = await request.json();

    if (!payload?.name || !payload?.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let catalogId = null;
    let catalogSlug =
      typeof payload.catalogSlug === 'string' ? payload.catalogSlug.trim().toLowerCase() : '';

    if (payload.catalogId) {
      const catalog = await Catalog.findById(payload.catalogId).lean();
      if (!catalog) {
        return NextResponse.json(
          { error: 'Catalog not found for provided catalogId' },
          { status: 400 },
        );
      }
      catalogId = catalog._id;
      catalogSlug = catalog.slug;
    } else if (catalogSlug) {
      const catalog = await Catalog.findOne({ slug: catalogSlug }).lean();
      if (!catalog) {
        return NextResponse.json(
          { error: 'Catalog not found for provided catalogSlug' },
          { status: 400 },
        );
      }
      catalogId = catalog._id;
      catalogSlug = catalog.slug;
    }

    const legacyId = payload._id || payload.legacyId || payload.id || null;

    const isGroup = payload.purchaseType === 'group' || payload.type === 'group';
    const closingDays = Number(payload.groupPurchaseDetails?.closingDays) || 0;
    const normalizedCategory =
      typeof payload.category === 'string' && payload.category.trim()
        ? payload.category.trim()
        : isGroup
          ? 'רכישה קבוצתית'
          : '';

    const product = await Product.create({
      legacyId: legacyId ?? undefined,
      name: payload.name.trim(),
      description: payload.description,
      fullDescription: payload.fullDescription ?? payload.description ?? '',
      category: normalizedCategory,
      catalogId,
      catalogSlug,
      price: Number(payload.price) || 0,
      originalPrice: payload.originalPrice !== undefined ? Number(payload.originalPrice) : null,
      commission:
        payload.commission !== undefined
          ? Number(payload.commission)
          : (Number(payload.price) || 0) * 0.1,
      type: payload.type || (isGroup ? 'group' : 'online'),
      purchaseType: payload.purchaseType || (isGroup ? 'group' : 'regular'),
      groupEndDate:
        payload.groupEndDate
          ? new Date(payload.groupEndDate)
          : isGroup && closingDays > 0
            ? new Date(Date.now() + closingDays * 24 * 60 * 60 * 1000)
            : null,
      expectedDeliveryDays: payload.expectedDeliveryDays ?? null,
      groupMinQuantity: payload.groupMinQuantity ?? 1,
      groupCurrentQuantity: payload.groupCurrentQuantity ?? 0,
      groupPurchaseDetails: payload.groupPurchaseDetails ?? null,
      image: payload.image || '',
      imageUrl: payload.imageUrl || payload.image || '',
      images:
        Array.isArray(payload.images) && payload.images.length
          ? payload.images
          : payload.image
            ? [payload.image]
            : [],
      videoUrl: payload.videoUrl || '',
      imagePath: payload.imagePath || '',
      inStock: payload.inStock !== undefined ? Boolean(payload.inStock) : true,
      stockCount: payload.stockCount !== undefined ? Number(payload.stockCount) : 0,
      rating: payload.rating !== undefined ? Number(payload.rating) : 0,
      reviews: payload.reviews !== undefined ? Number(payload.reviews) : 0,
      features: Array.isArray(payload.features) ? payload.features : [],
      specs: payload.specs ?? {},
      active: payload.active !== undefined ? Boolean(payload.active) : true,
    });

    const serialized = serializeProduct(product);

    notifyProductCreation(adminUser, product).catch((err) => {
      console.warn('PRODUCT_NOTIFY_FAILED', err?.message || err);
    });

    return NextResponse.json({ product: serialized }, { status: 201 });
  } catch (err) {
    // Handle auth errors
    if (err.status === 401 || err.status === 403) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('POST /api/products error:', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
