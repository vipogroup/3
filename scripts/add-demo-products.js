// Add demo products for marketplace - 15+ products with images
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const demoProducts = [
  // === מוצרים זמינים עכשיו (מכירה רגילה) ===
  {
    name: 'אוזניות Bluetooth אלחוטיות Pro',
    description: 'אוזניות TWS איכותיות עם ביטול רעשים אקטיבי',
    fullDescription: 'אוזניות Bluetooth 5.3 עם ביטול רעשים אקטיבי ANC, סאונד היי-פיי, 30 שעות סוללה, עמידות למים IPX5, וטעינה אלחוטית.',
    price: 299,
    originalPrice: 449,
    category: 'אלקטרוניקה',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
    ],
    inStock: true,
    stockCount: 50,
    rating: 4.7,
    reviews: 234,
    purchaseType: 'regular',
    features: ['ביטול רעשים ANC', 'Bluetooth 5.3', '30 שעות סוללה', 'IPX5 עמיד למים'],
  },
  {
    name: 'שעון חכם ספורט GPS',
    description: 'שעון ספורט עם GPS מובנה ומדידת דופק',
    fullDescription: 'שעון חכם לספורטאים עם GPS מובנה, מדידת דופק 24/7, 50+ מצבי אימון, 14 ימי סוללה, ועמידות במים 5ATM.',
    price: 599,
    originalPrice: 899,
    category: 'שעונים',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
    ],
    inStock: true,
    stockCount: 30,
    rating: 4.8,
    reviews: 189,
    purchaseType: 'regular',
    features: ['GPS מובנה', 'דופק 24/7', '50+ מצבי אימון', '14 ימי סוללה'],
  },
  {
    name: 'מצלמת אקשן 4K',
    description: 'מצלמת אקשן עמידה למים עם צילום 4K',
    fullDescription: 'מצלמת אקשן 4K/60fps עם מייצב תמונה, עמידות למים עד 10 מטר, מסך מגע, ו-WiFi מובנה.',
    price: 449,
    originalPrice: 649,
    category: 'צילום',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
      'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800',
    ],
    inStock: true,
    stockCount: 25,
    rating: 4.5,
    reviews: 156,
    purchaseType: 'regular',
    features: ['4K/60fps', 'עמיד למים 10מ', 'מייצב תמונה', 'WiFi מובנה'],
  },
  {
    name: 'תיק צד עור איטלקי',
    description: 'תיק צד אלגנטי מעור אמיתי לגבר',
    fullDescription: 'תיק צד מעור איטלקי אמיתי, תא למחשב נייד 13", כיסים פנימיים מרובים, ורצועה מתכווננת.',
    price: 389,
    originalPrice: 549,
    category: 'אופנה',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    ],
    inStock: true,
    stockCount: 20,
    rating: 4.9,
    reviews: 98,
    purchaseType: 'regular',
    features: ['עור איטלקי אמיתי', 'תא למחשב 13"', 'רצועה מתכווננת', 'עיצוב קלאסי'],
  },
  {
    name: 'מנורת LED חכמה RGB',
    description: 'מנורת שולחן חכמה עם שליטה קולית',
    fullDescription: 'מנורת LED חכמה עם 16 מיליון צבעים, שליטה קולית (Alexa/Google), טיימר, ואפליקציה.',
    price: 179,
    originalPrice: 279,
    category: 'בית חכם',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
    ],
    inStock: true,
    stockCount: 60,
    rating: 4.4,
    reviews: 287,
    purchaseType: 'regular',
    features: ['16M צבעים', 'שליטה קולית', 'WiFi/Bluetooth', 'אפליקציה'],
  },
  {
    name: 'סט כלי מטבח 12 חלקים',
    description: 'סט סירים וכלי בישול מנירוסטה איכותית',
    fullDescription: 'סט כלי מטבח 12 חלקים מנירוסטה 18/10, תחתית משולשת, ידיות סיליקון, ומתאים לכל סוגי הכיריים.',
    price: 699,
    originalPrice: 1199,
    category: 'מטבח',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      'https://images.unsplash.com/photo-1584990347449-a5d9f8d1b3db?w=800',
    ],
    inStock: true,
    stockCount: 15,
    rating: 4.6,
    reviews: 134,
    purchaseType: 'regular',
    features: ['נירוסטה 18/10', 'תחתית משולשת', 'ידיות סיליקון', 'אחריות 10 שנים'],
  },
  {
    name: 'מזוודה קשיחה 24 אינץ',
    description: 'מזוודת נסיעות עמידה עם מנעול TSA',
    fullDescription: 'מזוודה קשיחה 24 אינץ\' עם גלגלים שקטים 360°, מנעול TSA, ידית טלסקופית, ומשקל קל.',
    price: 349,
    originalPrice: 549,
    category: 'נסיעות',
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800',
    images: [
      'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800',
      'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=800',
    ],
    inStock: true,
    stockCount: 40,
    rating: 4.5,
    reviews: 212,
    purchaseType: 'regular',
    features: ['גלגלים 360°', 'מנעול TSA', 'ידית טלסקופית', 'קלת משקל'],
  },

  // === מוצרים ברכישה קבוצתית ===
  {
    name: 'מכונת קפה אוטומטית פרימיום',
    description: 'מכונת אספרסו אוטומטית עם מטחנה מובנית',
    fullDescription: 'מכונת קפה אוטומטית מלאה עם מטחנה קרמית, מערכת חלב אוטומטית, 15 בר לחץ, ו-12 משקאות מובנים.',
    price: 1899,
    originalPrice: 3499,
    category: 'מטבח',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800',
    images: [
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    ],
    inStock: true,
    stockCount: 100,
    rating: 4.9,
    reviews: 89,
    purchaseType: 'group',
    groupPurchaseDetails: {
      minQuantity: 50,
      currentQuantity: 23,
      closingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      closingDays: 25,
      shippingDays: 45,
      totalDays: 70,
    },
    features: ['מטחנה קרמית', 'מערכת חלב', '15 בר', '12 משקאות'],
  },
  {
    name: 'טלוויזיה 55" QLED 4K',
    description: 'טלוויזיה חכמה עם טכנולוגיית QLED',
    fullDescription: 'טלוויזיה QLED 55 אינץ\' 4K, HDR10+, 120Hz, מערכת Tizen, שליטה קולית, ועיצוב דק במיוחד.',
    price: 2499,
    originalPrice: 4299,
    category: 'אלקטרוניקה',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
      'https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=800',
    ],
    inStock: true,
    stockCount: 80,
    rating: 4.8,
    reviews: 156,
    purchaseType: 'group',
    groupPurchaseDetails: {
      minQuantity: 40,
      currentQuantity: 31,
      closingDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      closingDays: 18,
      shippingDays: 30,
      totalDays: 48,
    },
    features: ['QLED 4K', 'HDR10+', '120Hz', 'שליטה קולית'],
  },
  {
    name: 'שואב אבק רובוטי חכם',
    description: 'רובוט שואב ושוטף עם מיפוי לייזר',
    fullDescription: 'שואב אבק רובוטי עם מיפוי לייזר LiDAR, שאיבה ושטיפה, 3000Pa כוח יניקה, ואפליקציה חכמה.',
    price: 1299,
    originalPrice: 2199,
    category: 'בית חכם',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1589894404892-8a7c7b32a95e?w=800',
    ],
    inStock: true,
    stockCount: 60,
    rating: 4.7,
    reviews: 234,
    purchaseType: 'group',
    groupPurchaseDetails: {
      minQuantity: 30,
      currentQuantity: 18,
      closingDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      closingDays: 22,
      shippingDays: 35,
      totalDays: 57,
    },
    features: ['מיפוי LiDAR', 'שאיבה + שטיפה', '3000Pa', 'אפליקציה חכמה'],
  },
  {
    name: 'אופניים חשמליים מתקפלים',
    description: 'אופניים חשמליים עם טווח 60 ק"מ',
    fullDescription: 'אופניים חשמליים מתקפלים עם מנוע 350W, סוללה 36V/10Ah, טווח 60 ק"מ, ומשקל 18 ק"ג בלבד.',
    price: 3299,
    originalPrice: 5499,
    category: 'ספורט',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800',
    images: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ],
    inStock: true,
    stockCount: 50,
    rating: 4.6,
    reviews: 78,
    purchaseType: 'group',
    groupPurchaseDetails: {
      minQuantity: 25,
      currentQuantity: 12,
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      closingDays: 30,
      shippingDays: 60,
      totalDays: 90,
    },
    features: ['מנוע 350W', 'טווח 60 ק"מ', 'מתקפל', '18 ק"ג'],
  },
  {
    name: 'מיקסר Stand מקצועי',
    description: 'מיקסר עומד 1200W עם 7 ליטר',
    fullDescription: 'מיקסר עומד מקצועי עם מנוע 1200W, קערה 7 ליטר מנירוסטה, 10 מהירויות, ו-3 אביזרים.',
    price: 899,
    originalPrice: 1599,
    category: 'מטבח',
    image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800',
    images: [
      'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    ],
    inStock: true,
    stockCount: 70,
    rating: 4.8,
    reviews: 167,
    purchaseType: 'group',
    groupPurchaseDetails: {
      minQuantity: 35,
      currentQuantity: 28,
      closingDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      closingDays: 12,
      shippingDays: 25,
      totalDays: 37,
    },
    features: ['1200W', 'קערה 7 ליטר', '10 מהירויות', '3 אביזרים'],
  },
  {
    name: 'מזרן זיכרון אורטופדי',
    description: 'מזרן קצף זיכרון 160x200 עם 7 אזורי נוחות',
    fullDescription: 'מזרן קצף זיכרון בצפיפות גבוהה, 7 אזורי נוחות, ציפוי רחיץ, אחריות 10 שנים, ומשלוח חינם.',
    price: 1999,
    originalPrice: 3999,
    category: 'ריהוט',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    ],
    inStock: true,
    stockCount: 40,
    rating: 4.9,
    reviews: 312,
    purchaseType: 'group',
    groupPurchaseDetails: {
      minQuantity: 20,
      currentQuantity: 15,
      closingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      closingDays: 20,
      shippingDays: 40,
      totalDays: 60,
    },
    features: ['קצף זיכרון', '7 אזורי נוחות', 'ציפוי רחיץ', 'אחריות 10 שנים'],
  },
  {
    name: 'מצלמת אבטחה חיצונית',
    description: 'מצלמת IP חיצונית 4K עם ראיית לילה',
    fullDescription: 'מצלמת אבטחה 4K עם ראיית לילה צבעונית, זיהוי אדם/רכב AI, אחסון ענן, ועמידות IP66.',
    price: 349,
    originalPrice: 599,
    category: 'בית חכם',
    image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=800',
    images: [
      'https://images.unsplash.com/photo-1557862921-37829c790f19?w=800',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800',
    ],
    inStock: true,
    stockCount: 90,
    rating: 4.5,
    reviews: 198,
    purchaseType: 'group',
    groupPurchaseDetails: {
      minQuantity: 60,
      currentQuantity: 42,
      closingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      closingDays: 15,
      shippingDays: 20,
      totalDays: 35,
    },
    features: ['4K Ultra HD', 'ראיית לילה צבעונית', 'AI זיהוי', 'IP66'],
  },
  {
    name: 'מכשיר עיסוי שיאצו',
    description: 'מכשיר עיסוי לצוואר וגב עם חימום',
    fullDescription: 'מכשיר עיסוי שיאצו עם 8 ראשי עיסוי, פונקציית חימום, 3 מהירויות, ושימוש בבית/רכב.',
    price: 249,
    originalPrice: 449,
    category: 'בריאות',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800',
    ],
    inStock: true,
    stockCount: 80,
    rating: 4.6,
    reviews: 267,
    purchaseType: 'group',
    groupPurchaseDetails: {
      minQuantity: 45,
      currentQuantity: 33,
      closingDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      closingDays: 10,
      shippingDays: 20,
      totalDays: 30,
    },
    features: ['8 ראשי עיסוי', 'חימום', '3 מהירויות', 'בית/רכב'],
  },
];

async function addDemoProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || 'vipo',
    });

    console.log('✅ Connected to MongoDB');

    const Product = require('../models/Product');
    const ProductModel = Product?.default || Product;

    // Check existing products
    const existingCount = await ProductModel.countDocuments();
    console.log(`📦 Existing products: ${existingCount}`);

    // Insert new products
    const result = await ProductModel.insertMany(demoProducts);
    console.log(`✅ Added ${result.length} demo products!`);

    // Summary
    const totalCount = await ProductModel.countDocuments();
    const availableCount = await ProductModel.countDocuments({ purchaseType: 'available' });
    const groupCount = await ProductModel.countDocuments({ purchaseType: 'group' });
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total products: ${totalCount}`);
    console.log(`   Available now: ${availableCount}`);
    console.log(`   Group purchase: ${groupCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

addDemoProducts();
