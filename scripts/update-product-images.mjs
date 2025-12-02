import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vipo-agents';

// Updated products with real images
const updatedProducts = [
  {
    legacyId: '1',
    name: 'מקלדת מכנית RGB',
    description:
      'מקלדת גיימינג מקצועית עם תאורת RGB מלאה, מתגי Cherry MX Blue, ובניה איכותית מאלומיניום',
    fullDescription:
      'מקלדת גיימינג מקצועית המשלבת עיצוב מודרני עם ביצועים מעולים. כוללת תאורת RGB מלאה עם 16.8 מיליון צבעים, מתגי Cherry MX Blue מקוריים המספקים משוב טקטילי מעולה, ובניית אלומיניום איכותית שמבטיחה עמידות לאורך זמן.',
    price: 450,
    originalPrice: 599,
    commission: 45,
    type: 'online',
    category: 'אביזרי מחשב',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&h=800&fit=crop',
    ],
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviews: 127,
    features: ['תאורת RGB', 'מתגים מכניים', 'חיבור USB-C', 'תוכנה ייעודית'],
    specs: {
      'סוג מתגים': 'Cherry MX Blue',
      תאורה: 'RGB 16.8M צבעים',
      חיבור: 'USB-C קווי',
      חומר: 'אלומיניום + ABS',
      משקל: '1.2 ק"ג',
      תאימות: 'Windows, Mac, Linux',
    },
    active: true,
  },
  {
    legacyId: '2',
    name: 'עכבר גיימינג אלחוטי',
    description:
      'עכבר גיימינג מקצועי עם חיישן אופטי 16000 DPI, 6 כפתורים ניתנים לתכנות וסוללה עד 70 שעות',
    fullDescription:
      'עכבר גיימינג אלחוטי מתקדם המציע דיוק מקסימלי וחופש תנועה מוחלט. מצויד בחיישן אופטי מתקדם עם רזולוציה של עד 16000 DPI, 6 כפתורים הניתנים לתכנות באמצעות תוכנה ייעודית, וסוללה חזקה המספקת עד 70 שעות שימוש רצוף.',
    price: 280,
    originalPrice: 399,
    commission: 28,
    type: 'online',
    category: 'אביזרי מחשב',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&h=800&fit=crop',
    ],
    inStock: true,
    stockCount: 23,
    rating: 4.9,
    reviews: 203,
    features: ['אלחוטי', '16000 DPI', '6 כפתורים', 'סוללה 70 שעות'],
    specs: {
      חיישן: 'אופטי 16000 DPI',
      כפתורים: '6 ניתנים לתכנות',
      סוללה: 'עד 70 שעות',
      משקל: '95 גרם',
      חיבור: '2.4GHz אלחוטי + USB-C',
      תאימות: 'Windows, Mac',
    },
    active: true,
  },
  {
    legacyId: '3',
    name: 'אוזניות גיימינג 7.1',
    description: 'אוזניות גיימינג עם סראונד 7.1, מיקרופון מבטל רעשים, ריפוד נוח וכבל קלוע',
    fullDescription:
      'אוזניות גיימינג מקצועיות המספקות חוויית שמע אימרסיבית מושלמת. מערכת סראונד 7.1 וירטואלית מאפשרת זיהוי מדויק של כיוון הצלילים במשחק, מיקרופון מבטל רעשים מתקדם מבטיח תקשורת ברורה עם חברי הצוות.',
    price: 320,
    originalPrice: 449,
    commission: 32,
    type: 'online',
    category: 'אודיו',
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=600&h=600&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
    ],
    inStock: true,
    stockCount: 18,
    rating: 4.7,
    reviews: 156,
    features: ['סראונד 7.1', 'מיקרופון מבטל רעשים', 'ריפוד נוח', 'תאורת RGB'],
    specs: {
      סאונד: '7.1 Virtual Surround',
      דרייברים: '50mm Neodymium',
      מיקרופון: 'מבטל רעשים דו-כיווני',
      חיבור: 'USB + 3.5mm',
      משקל: '320 גרם',
      תאימות: 'PC, PS5, Xbox, Switch',
    },
    active: true,
  },
  {
    legacyId: '4',
    name: "מסך גיימינג 27 אינץ'",
    description: 'מסך גיימינג 144Hz, רזולוציה QHD 2K, זמן תגובה 1ms, תמיכה ב-FreeSync ו-G-Sync',
    fullDescription:
      "מסך גיימינג מקצועי בגודל 27 אינץ' המציע חוויית משחק מושלמת. רזולוציה QHD 2K (2560x1440) מספקת חדות תמונה יוצאת דופן, קצב רענון של 144Hz מבטיח תנועה חלקה ללא קרעים.",
    price: 1299,
    originalPrice: 1799,
    commission: 129.9,
    type: 'group',
    category: 'מסכים',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop',
    ],
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviews: 89,
    features: ['144Hz', 'QHD 2K', '1ms', 'FreeSync & G-Sync'],
    specs: {
      גודל: "27 אינץ'",
      רזולוציה: '2560x1440 (QHD)',
      'קצב רענון': '144Hz',
      'זמן תגובה': '1ms MPRT',
      פאנל: 'IPS',
      תמיכה: 'FreeSync Premium, G-Sync Compatible',
    },
    active: true,
  },
  {
    legacyId: '5',
    name: 'כיסא גיימינג ארגונומי',
    description: 'כיסא גיימינג מקצועי עם תמיכה מלאה לגב, משענת ראש ומשענת ידיים מתכווננות',
    fullDescription:
      'כיסא גיימינג ארגונומי מתקדם המעוצב לשעות ארוכות של ישיבה נוחה. מערכת תמיכה מלאה לגב כוללת כרית לומבר מתכווננת, משענת ראש עם זיכרון קצף, ומשענות ידיים 4D הניתנות להתאמה מלאה.',
    price: 899,
    originalPrice: 1299,
    commission: 89.9,
    type: 'online',
    category: 'ריהוט',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&h=600&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&h=800&fit=crop',
    ],
    inStock: true,
    stockCount: 12,
    rating: 4.6,
    reviews: 234,
    features: ['ארגונומי', 'משענות מתכווננות', 'חומרים איכותיים', 'גלגלים שקטים'],
    specs: {
      חומר: 'עור PU + זיכרון קצף',
      'משענות ידיים': '4D מתכווננות',
      גובה: 'מתכוונן 45-55 ס"מ',
      'משקל מקסימלי': '150 ק"ג',
      גלגלים: 'PU 60mm שקטים',
      אחריות: '3 שנים',
    },
    active: true,
  },
  {
    legacyId: '6',
    name: 'מצלמת רשת 4K',
    description: 'מצלמת רשת מקצועית ברזולוציה 4K, 60 FPS, מיקרופון סטריאו ותאורה אוטומטית',
    fullDescription:
      'מצלמת רשת מקצועית המספקת איכות תמונה יוצאת דופן לשידורים חיים, פגישות וידאו ויצירת תוכן. רזולוציה 4K (3840x2160) ב-60 FPS מבטיחה תמונה חדה וחלקה.',
    price: 550,
    originalPrice: 799,
    commission: 55,
    type: 'online',
    category: 'אביזרי מחשב',
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&h=600&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=800&fit=crop',
    ],
    inStock: true,
    stockCount: 20,
    rating: 4.8,
    reviews: 178,
    features: ['4K 60FPS', 'מיקרופון סטריאו', 'תאורה אוטומטית', 'זווית רחבה'],
    specs: {
      רזולוציה: '4K (3840x2160) @ 60fps',
      'זווית צפייה': '90 מעלות',
      פוקוס: 'אוטומטי מתקדם',
      מיקרופון: 'סטריאו דו-כיווני',
      חיבור: 'USB 3.0',
      תאימות: 'Windows 10+, macOS 10.14+',
    },
    active: true,
  },
];

const productSchema = new mongoose.Schema(
  {
    legacyId: String,
    name: { type: String, required: true },
    description: String,
    fullDescription: String,
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: Number,
    commission: Number,
    type: String,
    purchaseType: String,
    groupEndDate: Date,
    expectedDeliveryDays: Number,
    groupMinQuantity: Number,
    groupCurrentQuantity: Number,
    groupPurchaseDetails: String,
    image: String,
    imageUrl: String,
    images: [String],
    videoUrl: String,
    imagePath: String,
    inStock: { type: Boolean, default: true },
    stockCount: Number,
    rating: Number,
    reviews: Number,
    features: [String],
    specs: mongoose.Schema.Types.Mixed,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function updateProductImages() {
  try {
    console.log('🔌 מתחבר ל-MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ התחברות הצליחה!');

    console.log('🗑️ מוחק מוצרים קיימים...');
    await Product.deleteMany({});
    console.log('✅ מוצרים ישנים נמחקו!');

    console.log('📦 מוסיף מוצרים עם תמונות חדשות...');
    for (const product of updatedProducts) {
      await Product.create(product);
      console.log(`✅ ${product.name} - נוסף בהצלחה!`);
    }

    console.log('\n🎉 כל המוצרים עודכנו בהצלחה עם תמונות אמיתיות!');
    console.log('📸 תמונות מ-Unsplash זמינות כעת בכל המוצרים.');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ שגיאה:', error);
    process.exit(1);
  }
}

updateProductImages();
