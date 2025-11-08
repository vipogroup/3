// מקור מוצרים מרכזי - ישמש את כל המערכת

const INITIAL_PRODUCTS = [
  {
    _id: "1",
    name: "מקלדת מכנית RGB",
    description: "מקלדת גיימינג מקצועית עם תאורת RGB מלאה, מתגי Cherry MX Blue, ובניה איכותית מאלומיניום",
    fullDescription: "מקלדת גיימינג מקצועית המשלבת עיצוב מודרני עם ביצועים מעולים. כוללת תאורת RGB מלאה עם 16.8 מיליון צבעים, מתגי Cherry MX Blue מקוריים המספקים משוב טקטילי מעולה, ובניית אלומיניום איכותית שמבטיחה עמידות לאורך זמן.",
    price: 450,
    originalPrice: 599,
    commission: 45, // 10% עמלה
    type: "online", // סוג מוצר: online או group
    category: "אביזרי מחשב",
    image: "https://placehold.co/600x600/8B5CF6/FFFFFF?text=⌨️+RGB+Keyboard&font=roboto",
    images: [
      "https://placehold.co/800x800/8B5CF6/FFFFFF?text=⌨️+מקלדת+RGB&font=roboto",
      "https://placehold.co/800x800/6366F1/FFFFFF?text=⌨️+Cherry+MX&font=roboto",
      "https://placehold.co/800x800/7C3AED/FFFFFF?text=⌨️+RGB+Lights&font=roboto"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // סרטון דמו - להחליף בסרטון אמיתי
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
    },
    active: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    _id: "2",
    name: "עכבר גיימינג אלחוטי",
    description: "עכבר גיימינג מקצועי עם חיישן אופטי 16000 DPI, 6 כפתורים ניתנים לתכנות וסוללה עד 70 שעות",
    fullDescription: "עכבר גיימינג אלחוטי מתקדם המציע דיוק מקסימלי וחופש תנועה מוחלט. מצויד בחיישן אופטי מתקדם עם רזולוציה של עד 16000 DPI, 6 כפתורים הניתנים לתכנות באמצעות תוכנה ייעודית, וסוללה חזקה המספקת עד 70 שעות שימוש רצוף.",
    price: 280,
    originalPrice: 399,
    commission: 28,
    type: "online",
    category: "אביזרי מחשב",
    image: "https://placehold.co/600x600/3B82F6/FFFFFF?text=🖱️+Gaming+Mouse&font=roboto",
    images: [
      "https://placehold.co/800x800/3B82F6/FFFFFF?text=🖱️+עכבר+גיימינג&font=roboto",
      "https://placehold.co/800x800/2563EB/FFFFFF?text=🖱️+16000+DPI&font=roboto",
      "https://placehold.co/800x800/1D4ED8/FFFFFF?text=🖱️+Wireless&font=roboto"
    ],
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_2",
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
    },
    active: true,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02")
  },
  {
    _id: "3",
    name: "אוזניות גיימינג 7.1",
    description: "אוזניות גיימינג עם סראונד 7.1, מיקרופון מבטל רעשים, ריפוד נוח וכבל קלוע",
    fullDescription: "אוזניות גיימינג מקצועיות המספקות חוויית שמע אימרסיבית מושלמת. מערכת סראונד 7.1 וירטואלית מאפשרת זיהוי מדויק של כיוון הצלילים במשחק, מיקרופון מבטל רעשים מתקדם מבטיח תקשורת ברורה עם חברי הצוות.",
    price: 320,
    originalPrice: 449,
    commission: 32,
    type: "online",
    category: "אודיו",
    image: "https://placehold.co/600x600/10B981/FFFFFF?text=🎧+Gaming+Headset&font=roboto",
    images: [
      "https://placehold.co/800x800/10B981/FFFFFF?text=🎧+אוזניות+7.1&font=roboto",
      "https://placehold.co/800x800/059669/FFFFFF?text=🎧+Surround&font=roboto",
      "https://placehold.co/800x800/047857/FFFFFF?text=🎧+RGB+Lights&font=roboto"
    ],
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_3",
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
    },
    active: true,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03")
  },
  {
    _id: "4",
    name: "מסך גיימינג 27 אינץ'",
    description: "מסך גיימינג 144Hz, רזולוציה QHD 2K, זמן תגובה 1ms, תמיכה ב-FreeSync ו-G-Sync",
    fullDescription: "מסך גיימינג מקצועי בגודל 27 אינץ' המציע חוויית משחק מושלמת. רזולוציה QHD 2K (2560x1440) מספקת חדות תמונה יוצאת דופן, קצב רענון של 144Hz מבטיח תנועה חלקה ללא קרעים.",
    price: 1299,
    originalPrice: 1799,
    commission: 129.9,
    type: "group",
    groupEndDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    expectedDeliveryDays: 60,
    groupMinQuantity: 10,
    groupCurrentQuantity: 7,
    category: "מסכים",
    image: "https://placehold.co/600x600/F59E0B/FFFFFF?text=🖥️+Gaming+Monitor&font=roboto",
    images: [
      "https://placehold.co/800x800/F59E0B/FFFFFF?text=🖥️+מסך+27&font=roboto",
      "https://placehold.co/800x800/D97706/FFFFFF?text=🖥️+144Hz&font=roboto",
      "https://placehold.co/800x800/B45309/FFFFFF?text=🖥️+QHD+2K&font=roboto"
    ],
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_4",
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
    },
    active: true,
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04")
  },
  {
    _id: "5",
    name: "כיסא גיימינג ארגונומי",
    description: "כיסא גיימינג מקצועי עם תמיכה מלאה לגב, משענת ראש ומשענת ידיים מתכווננות",
    fullDescription: "כיסא גיימינג ארגונומי מתקדם המעוצב לשעות ארוכות של ישיבה נוחה. מערכת תמיכה מלאה לגב כוללת כרית לומבר מתכווננת, משענת ראש עם זיכרון קצף, ומשענות ידיים 4D הניתנות להתאמה מלאה.",
    price: 899,
    originalPrice: 1299,
    commission: 89.9,
    type: "online",
    category: "ריהוט",
    image: "https://placehold.co/600x600/EF4444/FFFFFF?text=💺+Gaming+Chair&font=roboto",
    images: [
      "https://placehold.co/800x800/EF4444/FFFFFF?text=💺+כיסא+גיימינג&font=roboto",
      "https://placehold.co/800x800/DC2626/FFFFFF?text=💺+Ergonomic&font=roboto",
      "https://placehold.co/800x800/B91C1C/FFFFFF?text=💺+Comfort&font=roboto"
    ],
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_5",
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
    },
    active: true,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05")
  },
  {
    _id: "6",
    name: "מצלמת רשת 4K",
    description: "מצלמת רשת מקצועית ברזולוציה 4K, 60 FPS, מיקרופון סטריאו ותאורה אוטומטית",
    fullDescription: "מצלמת רשת מקצועית המספקת איכות תמונה יוצאת דופן לשידורים חיים, פגישות וידאו ויצירת תוכן. רזולוציה 4K (3840x2160) ב-60 FPS מבטיחה תמונה חדה וחלקה.",
    price: 550,
    originalPrice: 799,
    commission: 55,
    type: "online",
    category: "אביזרי מחשב",
    image: "https://placehold.co/600x600/06B6D4/FFFFFF?text=📷+4K+Webcam&font=roboto",
    images: [
      "https://placehold.co/800x800/06B6D4/FFFFFF?text=📷+מצלמת+4K&font=roboto",
      "https://placehold.co/800x800/0891B2/FFFFFF?text=📷+60+FPS&font=roboto",
      "https://placehold.co/800x800/0E7490/FFFFFF?text=📷+Auto+Focus&font=roboto"
    ],
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_6",
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
    },
    active: true,
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-06")
  }
];

let PRODUCTS = [...INITIAL_PRODUCTS];

// טעינה מ-localStorage (client-side only)
if (typeof window !== 'undefined') {
  // Force reload from INITIAL_PRODUCTS with placeholder images
  console.log("🔄 Loading products with placeholder images");
  PRODUCTS = [...INITIAL_PRODUCTS];
  // Clear old localStorage and save new products
  localStorage.removeItem('vipo_products');
  localStorage.setItem('vipo_products', JSON.stringify(PRODUCTS));
  console.log("✅ Products updated with placeholder images");
}

// שמירה ב-localStorage
function saveProducts() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vipo_products', JSON.stringify(PRODUCTS));
    // Trigger storage event for other tabs/windows
    window.dispatchEvent(new Event('productsUpdated'));
  }
}

// פונקציות עזר
export function getProducts() {
  return PRODUCTS.filter(p => p.active);
}

export function getAllProducts() {
  return [...PRODUCTS];
}

export function getProductById(id) {
  return PRODUCTS.find(p => p._id === id);
}

export function getProductsByCategory(category) {
  return PRODUCTS.filter(p => p.active && p.category === category);
}

export function calculateCommission(productId) {
  const product = getProductById(productId);
  return product ? product.commission : 0;
}

// הוספת מוצר
export function addProduct(product) {
  const newProduct = {
    ...product,
    _id: Date.now().toString(),
    commission: product.price * 0.1,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    // ערכי ברירת מחדל לשדות חסרים
    fullDescription: product.fullDescription || product.description || "",
    images: product.images || (product.image ? [product.image] : []),
    inStock: product.inStock !== undefined ? product.inStock : true,
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    features: product.features || [],
    specs: product.specs || {}
  };
  PRODUCTS.push(newProduct);
  saveProducts();
  return newProduct;
}

// עדכון מוצר
export function updateProduct(id, updates) {
  const index = PRODUCTS.findIndex(p => p._id === id);
  if (index !== -1) {
    PRODUCTS[index] = {
      ...PRODUCTS[index],
      ...updates,
      commission: updates.price ? updates.price * 0.1 : PRODUCTS[index].commission,
      updatedAt: new Date()
    };
    saveProducts();
    return PRODUCTS[index];
  }
  return null;
}

// מחיקת מוצר
export function deleteProduct(id) {
  const index = PRODUCTS.findIndex(p => p._id === id);
  if (index !== -1) {
    PRODUCTS.splice(index, 1);
    saveProducts();
    return true;
  }
  return false;
}

// איפוס למוצרים ההתחלתיים
export function resetProducts() {
  PRODUCTS = [...INITIAL_PRODUCTS];
  saveProducts();
}

// יצירת לינק ייחודי לסוכן
export function generateAgentLink(agentId, productId) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
  return `${baseUrl}/products/${productId}?ref=${agentId}`;
}
