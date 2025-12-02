// Add even more products with different images
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const additionalProducts = [
  {
    name: 'אוזניות גיימינג עם מיקרופון',
    description: 'אוזניות גיימינג עם סאונד 7.1 ומיקרופון מתקפל',
    fullDescription:
      'אוזניות גיימינג מקצועיות עם סאונד היקפי 7.1, מיקרופון מתקפל עם ביטול רעשים, ריפוד נוח, ותאורת RGB.',
    price: 349,
    originalPrice: 499,
    category: 'גיימינג',
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800',
    images: [
      'https://images.unsplash.com/photo-1599669454699-248893623440?w=800',
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800',
    ],
    videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    inStock: true,
    stockCount: 25,
    rating: 4.6,
    reviews: 189,
    features: ['סאונד 7.1', 'מיקרופון מתקפל', 'תאורת RGB', 'ריפוד נוח'],
    specs: {
      סוג: 'Over-ear גיימינג',
      סאונד: '7.1 Surround',
      מיקרופון: 'מתקפל עם ביטול רעשים',
      חיבור: 'USB + 3.5mm',
      תאורה: 'RGB',
      משקל: '320 גרם',
    },
  },
  {
    name: "טאבלט 10.1 אינץ'",
    description: 'טאבלט אנדרואיד עם מסך Full HD',
    fullDescription:
      "טאבלט עם מסך 10.1 אינץ' Full HD, מעבד 8 ליבות, 4GB RAM, 64GB אחסון, וסוללה ל-12 שעות.",
    price: 899,
    originalPrice: 1299,
    category: 'אלקטרוניקה',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800',
    images: [
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800',
      'https://images.unsplash.com/photo-1585790050230-5dd28404f1a1?w=800',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
    ],
    videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
    inStock: true,
    stockCount: 18,
    rating: 4.4,
    reviews: 156,
    features: ['מסך 10.1" Full HD', '8 ליבות', '4GB RAM', '12 שעות סוללה'],
    specs: {
      מסך: "10.1 אינץ' Full HD",
      מעבד: '8 ליבות 2.0GHz',
      RAM: '4GB',
      אחסון: '64GB + microSD',
      סוללה: '12 שעות',
      מערכת: 'Android 13',
    },
  },
  {
    name: "מסך מחשב 27 אינץ' 4K",
    description: 'מסך גיימינג 4K עם 144Hz',
    fullDescription:
      "מסך גיימינג 27 אינץ' ברזולוציית 4K, קצב רענון 144Hz, זמן תגובה 1ms, ותמיכה ב-HDR.",
    price: 1899,
    originalPrice: 2499,
    category: 'מחשבים',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800',
      'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800',
    ],
    videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
    inStock: true,
    stockCount: 12,
    rating: 4.8,
    reviews: 234,
    features: ['4K UHD', '144Hz', '1ms', 'HDR'],
    specs: {
      גודל: "27 אינץ'",
      רזולוציה: '3840x2160 (4K)',
      רענון: '144Hz',
      תגובה: '1ms',
      HDR: 'HDR10',
      חיבורים: 'HDMI 2.1, DisplayPort',
    },
  },
  {
    name: 'כיסא גיימינג ארגונומי',
    description: 'כיסא גיימינג עם תמיכה מלאה בגב',
    fullDescription:
      'כיסא גיימינג ארגונומי עם תמיכה מלאה בגב, משענות מתכווננות, ריפוד זיכרון, ובסיס מתכת חזק.',
    price: 1299,
    originalPrice: 1799,
    category: 'ריהוט',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800',
    images: [
      'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800',
    ],
    videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY',
    inStock: true,
    stockCount: 8,
    rating: 4.7,
    reviews: 178,
    features: ['תמיכה ארגונומית', 'משענות מתכווננות', 'ריפוד זיכרון', 'בסיס מתכת'],
    specs: {
      חומר: 'עור PU איכותי',
      'משענת גב': 'מתכווננת 90-180°',
      'משענות יד': '4D מתכווננות',
      גלגלים: '5 גלגלים שקטים',
      'משקל מקסימלי': '150 ק"ג',
      צבעים: 'שחור, אדום, כחול',
    },
  },
  {
    name: 'שעון יד חכם לספורט',
    description: 'שעון ספורט עם GPS ומדידת דופק',
    fullDescription:
      'שעון ספורט חכם עם GPS מובנה, מדידת דופק 24/7, מעקב שינה, 20 מצבי ספורט, ועמידות למים 50 מטר.',
    price: 799,
    originalPrice: 1099,
    category: 'ספורט',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    inStock: true,
    stockCount: 32,
    rating: 4.5,
    reviews: 267,
    features: ['GPS מובנה', 'מדידת דופק 24/7', '20 מצבי ספורט', 'עמיד למים'],
    specs: {
      מסך: "1.3 אינץ' AMOLED",
      GPS: 'GPS + GLONASS',
      חיישנים: 'דופק, חמצן, מד צעדים',
      סוללה: '14 ימים',
      עמידות: '50 מטר (5ATM)',
      תאימות: 'iOS 10+, Android 5+',
    },
  },
];

async function addMoreProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || 'vipo',
    });

    console.log('✅ Connected to MongoDB');

    const Product = require('../models/Product');
    const ProductModel = Product?.default || Product;

    const result = await ProductModel.insertMany(additionalProducts);
    console.log(`✅ Added ${result.length} more products!`);

    const total = await ProductModel.countDocuments();
    console.log(`📦 Total products in database: ${total}`);

    console.log('\n📸 New products with images:');
    result.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Image: ${p.image.substring(0, 60)}...`);
    });
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

addMoreProducts();
