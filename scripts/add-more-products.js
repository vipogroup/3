// Add more products with images and videos
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const moreProducts = [
  {
    name: "תיק גב למחשב נייד",
    description: "תיק גב עמיד עם תא מרופד למחשב 15.6 אינץ'",
    fullDescription: "תיק גב איכותי עם תא מרופד למחשב נייד, כיסים מרובים, רצועות נוחות, ועמידות למים.",
    price: 249,
    originalPrice: 349,
    category: "אביזרים",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800",
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800"
    ],
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    inStock: true,
    stockCount: 60,
    rating: 4.6,
    reviews: 145,
    features: ["תא למחשב 15.6\"", "עמיד למים", "רצועות מרופדות", "כיסים מרובים"],
    specs: {
      "גודל": "45x30x15 ס\"מ",
      "נפח": "25 ליטר",
      "חומר": "פוליאסטר עמיד",
      "משקל": "650 גרם",
      "תא מחשב": "עד 15.6 אינץ'",
      "צבעים": "שחור, אפור, כחול"
    }
  },
  {
    name: "מקלדת גיימינג מכנית RGB",
    description: "מקלדת מכנית עם תאורת RGB ומתגים כחולים",
    fullDescription: "מקלדת גיימינג מכנית עם מתגים כחולים, תאורת RGB מלאה, משענת יד, ומקשי מדיה ייעודיים.",
    price: 399,
    originalPrice: 549,
    category: "אלקטרוניקה",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800"
    ],
    videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
    inStock: true,
    stockCount: 35,
    rating: 4.7,
    reviews: 198,
    features: ["מתגים מכניים", "RGB מלא", "משענת יד", "Anti-ghosting"],
    specs: {
      "מתגים": "Blue Mechanical",
      "תאורה": "RGB 16.8M צבעים",
      "חיבור": "USB",
      "אורך כבל": "1.8 מטר",
      "משקל": "1.2 ק\"ג",
      "תאימות": "Windows, Mac"
    }
  },
  {
    name: "עכבר גיימינג אלחוטי",
    description: "עכבר גיימינג עם חיישן 16000 DPI",
    fullDescription: "עכבר גיימינג אלחוטי עם חיישן אופטי 16000 DPI, 8 כפתורים, תאורת RGB, וסוללה ל-70 שעות.",
    price: 279,
    originalPrice: 379,
    category: "אלקטרוניקה",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800",
      "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800"
    ],
    videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
    inStock: true,
    stockCount: 45,
    rating: 4.5,
    reviews: 167,
    features: ["16000 DPI", "8 כפתורים", "אלחוטי", "70 שעות סוללה"],
    specs: {
      "חיישן": "Optical 16000 DPI",
      "כפתורים": "8 ניתנים לתכנות",
      "חיבור": "2.4GHz + Bluetooth",
      "סוללה": "70 שעות",
      "משקל": "95 גרם",
      "תאורה": "RGB"
    }
  },
  {
    name: "רמקול Bluetooth נייד",
    description: "רמקול אלחוטי עמיד במים עם 20 שעות סוללה",
    fullDescription: "רמקול Bluetooth נייד עם סאונד 360 מעלות, עמידות IP67, 20 שעות סוללה, ואפשרות חיבור זוגי.",
    price: 349,
    originalPrice: 499,
    category: "אודיו",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800"
    ],
    videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY",
    inStock: true,
    stockCount: 55,
    rating: 4.4,
    reviews: 223,
    features: ["IP67 עמיד למים", "20 שעות סוללה", "סאונד 360°", "חיבור זוגי"],
    specs: {
      "הספק": "30W",
      "Bluetooth": "5.0",
      "סוללה": "20 שעות",
      "עמידות": "IP67",
      "משקל": "850 גרם",
      "צבעים": "שחור, כחול, אדום"
    }
  },
  {
    name: "מטען אלחוטי מהיר",
    description: "מטען אלחוטי 15W עם טעינה מהירה",
    fullDescription: "מטען אלחוטי Qi עם טעינה מהירה 15W, תאורת LED, הגנות בטיחות, ותאימות לכל המכשירים.",
    price: 129,
    originalPrice: 199,
    category: "אביזרים",
    image: "https://images.unsplash.com/photo-1591290619762-c588f8f2f1f6?w=800",
    images: [
      "https://images.unsplash.com/photo-1591290619762-c588f8f2f1f6?w=800",
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    inStock: true,
    stockCount: 80,
    rating: 4.3,
    reviews: 312,
    features: ["טעינה מהירה 15W", "תאורת LED", "הגנות בטיחות", "תאימות רחבה"],
    specs: {
      "הספק": "15W מקסימום",
      "תקן": "Qi Wireless",
      "חיבור": "USB-C",
      "תאימות": "iPhone, Samsung, Xiaomi",
      "משקל": "120 גרם",
      "צבעים": "שחור, לבן"
    }
  },
  {
    name: "כבל USB-C מהיר 2 מטר",
    description: "כבל טעינה מהיר USB-C לUSB-C בד קלוע",
    fullDescription: "כבל טעינה איכותי עם ציפוי בד קלוע, תמיכה ב-100W, העברת נתונים מהירה, ואורך 2 מטר.",
    price: 79,
    originalPrice: 129,
    category: "אביזרים",
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800",
    images: [
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800",
      "https://images.unsplash.com/photo-1591290619762-c588f8f2f1f6?w=800",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800"
    ],
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    inStock: true,
    stockCount: 120,
    rating: 4.6,
    reviews: 456,
    features: ["100W טעינה מהירה", "בד קלוע", "2 מטר", "העברת נתונים"],
    specs: {
      "אורך": "2 מטר",
      "הספק": "100W",
      "העברת נתונים": "480 Mbps",
      "חומר": "בד קלוע עמיד",
      "תאימות": "USB-C devices",
      "צבעים": "שחור, אפור, כחול"
    }
  },
  {
    name: "מחזיק טלפון לרכב מגנטי",
    description: "מחזיק מגנטי חזק עם זרוע גמישה",
    fullDescription: "מחזיק טלפון מגנטי לרכב עם זרוע גמישה, מגנט חזק, סיבוב 360 מעלות, והתקנה קלה.",
    price: 89,
    originalPrice: 149,
    category: "אביזרים",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800",
    images: [
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800"
    ],
    videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
    inStock: true,
    stockCount: 95,
    rating: 4.5,
    reviews: 278,
    features: ["מגנט חזק", "זרוע גמישה", "סיבוב 360°", "התקנה קלה"],
    specs: {
      "סוג": "מגנטי",
      "התקנה": "פתח אוורור / דבק",
      "סיבוב": "360 מעלות",
      "תאימות": "כל הטלפונים",
      "משקל": "150 גרם",
      "צבע": "שחור"
    }
  }
];

async function addProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || 'vipo',
    });

    console.log('✅ Connected to MongoDB');

    const Product = require('../models/Product');
    const ProductModel = Product?.default || Product;

    // Insert new products
    const result = await ProductModel.insertMany(moreProducts);
    console.log(`✅ Added ${result.length} more products!`);

    // Get total count
    const total = await ProductModel.countDocuments();
    console.log(`📦 Total products in database: ${total}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
  }
}

addProducts();
