// מקור מוצרים מרכזי - ישמש את כל המערכת
export const PRODUCT_DATA_VERSION = "2025-11-19-empty-catalog";

const API_PRODUCTS_URL = "/api/products";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/800x600?text=Product";

const INITIAL_PRODUCTS = [];

let PRODUCTS = [...INITIAL_PRODUCTS];
let apiSyncPromise = null;
let lastSavedSignature = null;

function normalizeProductShape(product) {
  if (!product) return null;

  const normalized = {
    ...product,
    _id: String(product._id ?? product.legacyId ?? product.id ?? ""),
    legacyId: product.legacyId ?? product._id ?? product.id ?? null,
    image: product.image || product.imageUrl || PLACEHOLDER_IMAGE,
    imageUrl: product.imageUrl || product.image || PLACEHOLDER_IMAGE,
    images: Array.isArray(product.images) && product.images.length
      ? product.images
      : [product.image || PLACEHOLDER_IMAGE],
    fullDescription: product.fullDescription || product.description || "",
    description: product.description || product.fullDescription || "",
    specs: typeof product.specs === "object" && product.specs !== null ? product.specs : {},
    features: Array.isArray(product.features) ? product.features : [],
    catalogId: product.catalogId ?? product.catalog?._id ?? null,
    catalogSlug: product.catalogSlug ?? product.catalog?.slug ?? "",
  };

  if (!normalized.description) {
    normalized.description = "פרטי המוצר יעודכנו בקרוב.";
  }

  if (!normalized.fullDescription) {
    normalized.fullDescription = normalized.description;
  }

  if (!normalized.images || normalized.images.length === 0) {
    normalized.images = [normalized.image];
  }

  return normalized;
}

function setProducts(list, { persist = true } = {}) {
  const normalizedList = list.map((item) => normalizeProductShape(item)).filter(Boolean);
  const signature = JSON.stringify(normalizedList);
  if (signature === lastSavedSignature) {
    return;
  }

  PRODUCTS = normalizedList;
  lastSavedSignature = signature;
  if (persist) {
    saveProducts();
  }
}

async function fetchProductsFromApi() {
  if (typeof fetch === "undefined") {
    return null;
  }

  try {
    const response = await fetch(API_PRODUCTS_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch products: status ${response.status}`);
    }

    const payload = await response.json();
    const list = Array.isArray(payload?.products)
      ? payload.products
      : Array.isArray(payload)
      ? payload
      : [];

    return list;
  } catch (err) {
    console.error("fetchProductsFromApi error:", err);
    return null;
  }
}

function scheduleApiSync({ force = false } = {}) {
  if (typeof window === "undefined") {
    return;
  }

  if (apiSyncPromise && !force) {
    return;
  }

  apiSyncPromise = (async () => {
    const remoteProducts = await fetchProductsFromApi();
    if (Array.isArray(remoteProducts)) {
      setProducts(remoteProducts);
    }
    apiSyncPromise = null;
  })();
}

export async function refreshProductsFromApi() {
  scheduleApiSync({ force: true });
  if (apiSyncPromise) {
    await apiSyncPromise;
  }
  return [...PRODUCTS];
}

export async function fetchProductById(id) {
  if (!id) return null;

  if (typeof window !== "undefined") {
    scheduleApiSync({ force: true });
    if (apiSyncPromise) {
      await apiSyncPromise;
    }
  } else {
    const remote = await fetchProductsFromApi();
    if (Array.isArray(remote)) {
      setProducts(remote, { persist: false });
    }
  }

  return PRODUCTS.find((p) => p._id === id || p.legacyId === id || p.id === id) || null;
}

function syncFromStorage() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const stored = localStorage.getItem('vipo_products');
    const storedVersion = localStorage.getItem('vipo_products_version');

    if (stored && storedVersion === PRODUCT_DATA_VERSION) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every((product) => product?.image)) {
        PRODUCTS = parsed;
        lastSavedSignature = stored;
        return;
      }
    }

    const signature = JSON.stringify(PRODUCTS);
    localStorage.setItem('vipo_products', signature);
    localStorage.setItem('vipo_products_version', PRODUCT_DATA_VERSION);
    lastSavedSignature = signature;
  } catch (error) {
    console.error('Failed to load products from localStorage:', error);
    const signature = JSON.stringify(PRODUCTS);
    localStorage.setItem('vipo_products', signature);
    localStorage.setItem('vipo_products_version', PRODUCT_DATA_VERSION);
    lastSavedSignature = signature;
  }
}

// טעינה ראשונית
syncFromStorage();
scheduleApiSync();

// שמירה ב-localStorage
function saveProducts() {
  if (typeof window !== 'undefined') {
    const signature = JSON.stringify(PRODUCTS);
    if (signature === lastSavedSignature) {
      return;
    }

    localStorage.setItem('vipo_products', signature);
    localStorage.setItem('vipo_products_version', PRODUCT_DATA_VERSION);
    lastSavedSignature = signature;
    // Trigger storage event for other tabs/windows
    window.dispatchEvent(new Event('productsUpdated'));
  }
}

// פונקציות עזר
export function getProducts() {
  syncFromStorage();
  scheduleApiSync();
  return PRODUCTS.filter(p => p.active);
}

export function getAllProducts() {
  syncFromStorage();
  scheduleApiSync();
  return [...PRODUCTS];
}

export function getProductById(id) {
  syncFromStorage();
  scheduleApiSync();
  return PRODUCTS.find(p => p._id === id);
}

export function getProductsByCategory(category) {
  syncFromStorage();
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
