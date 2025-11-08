"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/app/lib/products";

// מוצרים לדוגמה (אותם מוצרים מדף המוצרים) - לא בשימוש יותר!
const DEMO_PRODUCTS_OLD = [
  {
    _id: "1",
    name: "מקלדת מכנית RGB",
    description: "מקלדת גיימינג מקצועית עם תאורת RGB מלאה, מתגי Cherry MX Blue, ובניה איכותית מאלומיניום",
    fullDescription: "מקלדת גיימינג מקצועית המשלבת עיצוב מודרני עם ביצועים מעולים. כוללת תאורת RGB מלאה עם 16.8 מיליון צבעים, מתגי Cherry MX Blue מקוריים המספקים משוב טקטילי מעולה, ובניית אלומיניום איכותית שמבטיחה עמידות לאורך זמן. המקלדת כוללת תוכנה ייעודית לתכנות מקרו, פרופילי תאורה מותאמים אישית, וחיבור USB-C נוח.",
    price: 450,
    originalPrice: 599,
    category: "אביזרי מחשב",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800"
    ],
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviews: 127,
    features: ["תאורת RGB", "מתגים מכניים", "חיבור USB-C", "תוכנה ייעודית"],
    specs: {
      "סוג מתגים": "Cherry MX Blue",
      "תאורה": "RGB 16.8M צבעים",
      "חיבור": "USB-C קווי",
      "חומר": "אלומיניום + ABS",
      "משקל": "1.2 ק\"ג",
      "תאימות": "Windows, Mac, Linux"
    }
  },
  {
    _id: "2",
    name: "עכבר גיימינג אלחוטי",
    description: "עכבר גיימינג מקצועי עם חיישן אופטי 16000 DPI, 6 כפתורים ניתנים לתכנות וסוללה עד 70 שעות",
    fullDescription: "עכבר גיימינג אלחוטי מתקדם המציע דיוק מקסימלי וחופש תנועה מוחלט. מצויד בחיישן אופטי מתקדם עם רזולוציה של עד 16000 DPI, 6 כפתורים הניתנים לתכנות באמצעות תוכנה ייעודית, וסוללה חזקה המספקת עד 70 שעות שימוש רצוף. העכבר כולל מערכת תאורת RGB מתקדמת, משקל מאוזן, ועיצוב ארגונומי המתאים לשעות ארוכות של משחק.",
    price: 280,
    originalPrice: 399,
    category: "אביזרי מחשב",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800",
      "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800"
    ],
    inStock: true,
    stockCount: 23,
    rating: 4.9,
    reviews: 203,
    features: ["אלחוטי", "16000 DPI", "6 כפתורים", "סוללה 70 שעות"],
    specs: {
      "חיישן": "אופטי 16000 DPI",
      "כפתורים": "6 ניתנים לתכנות",
      "סוללה": "עד 70 שעות",
      "משקל": "95 גרם",
      "חיבור": "2.4GHz אלחוטי + USB-C",
      "תאימות": "Windows, Mac"
    }
  },
  {
    _id: "3",
    name: "אוזניות גיימינג 7.1",
    description: "אוזניות גיימינג עם סראונד 7.1, מיקרופון מבטל רעשים, ריפוד נוח וכבל קלוע",
    fullDescription: "אוזניות גיימינג מקצועיות המספקות חוויית שמע אימרסיבית מושלמת. מערכת סראונד 7.1 וירטואלית מאפשרת זיהוי מדויק של כיוון הצלילים במשחק, מיקרופון מבטל רעשים מתקדם מבטיח תקשורת ברורה עם חברי הצוות, וריפוד זיכרון קצף נושם מספק נוחות מקסימלית גם בשעות ארוכות של משחק. הכבל הקלוע עמיד במיוחד ומונע הסתבכויות.",
    price: 320,
    originalPrice: 449,
    category: "אודיו",
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=800",
    images: [
      "https://images.unsplash.com/photo-1599669454699-248893623440?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800"
    ],
    inStock: true,
    stockCount: 18,
    rating: 4.7,
    reviews: 156,
    features: ["סראונד 7.1", "מיקרופון מבטל רעשים", "ריפוד נוח", "תאורת RGB"],
    specs: {
      "סאונד": "7.1 Virtual Surround",
      "דרייברים": "50mm Neodymium",
      "מיקרופון": "מבטל רעשים דו-כיווני",
      "חיבור": "USB + 3.5mm",
      "משקל": "320 גרם",
      "תאימות": "PC, PS5, Xbox, Switch"
    }
  },
  {
    _id: "4",
    name: "מסך גיימינג 27 אינץ'",
    description: "מסך גיימינג 144Hz, רזולוציה QHD 2K, זמן תגובה 1ms, תמיכה ב-FreeSync ו-G-Sync",
    fullDescription: "מסך גיימינג מקצועי בגודל 27 אינץ' המציע חוויית משחק מושלמת. רזולוציה QHD 2K (2560x1440) מספקת חדות תמונה יוצאת דופן, קצב רענון של 144Hz מבטיח תנועה חלקה ללא קרעים, וזמן תגובה של 1ms מבטל טשטוש תנועה. המסך תומך בטכנולוגיות AMD FreeSync ו-NVIDIA G-Sync למניעת קרעי מסך ומשחק חלק. פאנל IPS מספק צבעים עשירים וזוויות צפייה רחבות.",
    price: 1299,
    originalPrice: 1799,
    category: "מסכים",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800"
    ],
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviews: 89,
    features: ["144Hz", "QHD 2K", "1ms", "FreeSync & G-Sync"],
    specs: {
      "גודל": "27 אינץ'",
      "רזולוציה": "2560x1440 (QHD)",
      "קצב רענון": "144Hz",
      "זמן תגובה": "1ms MPRT",
      "פאנל": "IPS",
      "תמיכה": "FreeSync Premium, G-Sync Compatible"
    }
  },
  {
    _id: "5",
    name: "כיסא גיימינג ארגונומי",
    description: "כיסא גיימינג מקצועי עם תמיכה מלאה לגב, משענת ראש ומשענת ידיים מתכווננות",
    fullDescription: "כיסא גיימינג ארגונומי מתקדם המעוצב לשעות ארוכות של ישיבה נוחה. מערכת תמיכה מלאה לגב כוללת כרית לומבר מתכווננת, משענת ראש עם זיכרון קצף, ומשענות ידיים 4D הניתנות להתאמה מלאה. הכיסא עשוי מחומרים איכותיים כולל עור PU נושם, מסגרת פלדה חזקה, וגלגלי PU שקטים המתאימים לכל סוג רצפה. מנגנון הטיה מתקדם מאפשר נעילה בכל זווית.",
    price: 899,
    originalPrice: 1299,
    category: "ריהוט",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800",
    images: [
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800"
    ],
    inStock: true,
    stockCount: 12,
    rating: 4.6,
    reviews: 234,
    features: ["ארגונומי", "משענות מתכווננות", "חומרים איכותיים", "גלגלים שקטים"],
    specs: {
      "חומר": "עור PU + זיכרון קצף",
      "משענות ידיים": "4D מתכווננות",
      "גובה": "מתכוונן 45-55 ס\"מ",
      "משקל מקסימלי": "150 ק\"ג",
      "גלגלים": "PU 60mm שקטים",
      "אחריות": "3 שנים"
    }
  },
  {
    _id: "6",
    name: "מצלמת רשת 4K",
    description: "מצלמת רשת מקצועית ברזולוציה 4K, 60 FPS, מיקרופון סטריאו ותאורה אוטומטית",
    fullDescription: "מצלמת רשת מקצועית המספקת איכות תמונה יוצאת דופן לשידורים חיים, פגישות וידאו ויצירת תוכן. רזולוציה 4K (3840x2160) ב-60 FPS מבטיחה תמונה חדה וחלקה, מערכת פוקוס אוטומטי מתקדמת עוקבת אחריך בתנועה, ומיקרופון סטריאו דו-כיווני מספק שמע ברור. תאורה אוטומטית מתכווננת לתנאי התאורה בחדר, וזווית צפייה רחבה של 90 מעלות מאפשרת צילום קבוצתי.",
    price: 550,
    originalPrice: 799,
    category: "אביזרי מחשב",
    image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800",
    images: [
      "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800",
      "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800"
    ],
    inStock: true,
    stockCount: 20,
    rating: 4.8,
    reviews: 178,
    features: ["4K 60FPS", "מיקרופון סטריאו", "תאורה אוטומטית", "זווית רחבה"],
    specs: {
      "רזולוציה": "4K (3840x2160) @ 60fps",
      "זווית צפייה": "90 מעלות",
      "פוקוס": "אוטומטי מתקדם",
      "מיקרופון": "סטריאו דו-כיווני",
      "חיבור": "USB 3.0",
      "תאימות": "Windows 10+, macOS 10.14+"
    }
  }
];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);

  // טען מוצר
  const loadProduct = () => {
    const foundProduct = getProductById(params.id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setProduct(null);
    }
  };

  useEffect(() => {
    loadProduct();

    // בדוק משתמש
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else if (res.status === 401) {
          // User not logged in - this is normal
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    }
    fetchUser();
  }, [params.id]);

  // האזן לעדכוני מוצרים
  useEffect(() => {
    const handleProductsUpdate = () => {
      loadProduct();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate);
  }, [params.id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">מוצר לא נמצא</h1>
          <p className="text-gray-600 mb-6">המוצר שחיפשת אינו קיים במערכת</p>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            חזרה לחנות
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    alert(`נוסף לסל: ${product.name} x${quantity}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm">
          <ol className="flex items-center flex-wrap gap-2">
            <li><Link href="/" className="text-blue-600 hover:text-blue-800 hover:underline">ראשי</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/products" className="text-blue-600 hover:text-blue-800 hover:underline">מוצרים</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600 font-medium truncate max-w-[200px]">{product.name}</li>
          </ol>
        </nav>

        {/* Product Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 p-3 sm:p-4 md:p-6">
            {/* Images Section */}
            <div className="lg:col-span-2">
              {/* Main Image */}
              <div className="relative aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden mb-3 sticky top-4">
                <img
                  src={product.images?.[selectedImage] || product.image || "https://via.placeholder.com/800x600?text=No+Image"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.originalPrice && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                    חסכון {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                )}
                {product.inStock && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    במלאי - {product.stockCount} יחידות
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-3 gap-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-orange-500"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="lg:col-span-3">
              {/* Product Name */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Category Badge */}
              <Link href="/products" className="inline-block text-xs sm:text-sm text-blue-600 hover:text-orange-600 hover:underline mb-3">
                {product.category}
              </Link>

              {/* Rating */}
              {(product.rating > 0 || product.reviews > 0) && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-base sm:text-lg ${
                          i < Math.floor(product.rating || 0) ? "text-orange-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm sm:text-base text-blue-600 hover:text-orange-600 hover:underline cursor-pointer">
                    {product.rating || 0} ({product.reviews || 0} ביקורות)
                  </span>
                </div>
              )}

              {/* Divider */}
              <hr className="my-4 border-gray-200" />

              {/* Price Section */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-baseline gap-3 mb-2">
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₪{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-600">מחיר:</span>
                  <span className="text-3xl sm:text-4xl font-bold text-red-600">
                    ₪{product.price.toLocaleString()}
                  </span>
                </div>
                {product.inStock && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-green-600 font-semibold text-sm">✓ במלאי</span>
                    <span className="text-gray-600 text-xs">(נשארו {product.stockCount} יחידות)</span>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">אודות המוצר:</h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">תכונות עיקריות:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Divider */}
              <hr className="my-4 border-gray-200" />

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">כמות:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold w-10 h-10 rounded-md transition-all"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(product.stockCount || 999, val)));
                    }}
                    className="w-16 h-10 text-center border border-gray-300 rounded-md font-semibold"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount || 999, quantity + 1))}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold w-10 h-10 rounded-md transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Link
                  href={`/checkout/${product._id}`}
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-center py-3 rounded-lg transition-all shadow-md text-sm sm:text-base"
                >
                  קנה עכשיו
                </Link>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition-all shadow-md text-sm sm:text-base"
                >
                  🛒 הוסף לסל
                </button>
                <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-all text-sm sm:text-base">
                  ❤️ הוסף למועדפים
                </button>
              </div>

              {/* Trust Badges */}
              <div className="border border-gray-200 rounded-lg p-4 bg-blue-50 mb-4">
                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span className="text-gray-700">משלוח מהיר</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span className="text-gray-700">החזרה חינם</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span className="text-gray-700">תשלום בטוח</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span className="text-gray-700">אחריות יצרן</span>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              {user?.role === "admin" && (
                <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <Link
                    href={`/products/${product._id}/edit`}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-all text-center"
                  >
                    ערוך מוצר
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm("האם למחוק את המוצר?")) {
                        router.push("/products");
                      }
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all"
                  >
                    מחק מוצר
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Full Description */}
          {(product.fullDescription || (product.specs && Object.keys(product.specs).length > 0)) && (
            <div className="border-t border-gray-200 p-8">
              {product.fullDescription && (
                <>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">תיאור מלא</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-8">
                    {product.fullDescription}
                  </p>
                </>
              )}

              {/* Specifications */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">מפרט טכני</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">{key}</div>
                        <div className="text-lg font-semibold text-gray-900">{value}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
