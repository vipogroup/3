const STORAGE_KEY = 'vipo_product_categories';

export const DEFAULT_PRODUCT_CATEGORIES = [
  'אביזרי מחשב',
  'אודיו',
  'מסכים',
  'ריהוט',
  'רכישה קבוצתית',
];

function normalizeCategories(list = []) {
  const seen = new Set();
  const normalized = [];

  list.forEach((item) => {
    const value = typeof item === 'string' ? item.trim() : '';
    if (value && !seen.has(value)) {
      seen.add(value);
      normalized.push(value);
    }
  });

  return normalized;
}

function broadcastCategories(categories) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent('productCategoriesUpdated', {
      detail: { categories },
    }),
  );
}

export function loadProductCategories() {
  if (typeof window === 'undefined') {
    return [...DEFAULT_PRODUCT_CATEGORIES];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [...DEFAULT_PRODUCT_CATEGORIES];
    }

    const parsed = JSON.parse(raw);
    const normalized = normalizeCategories(parsed);
    const merged = [...normalized];
    DEFAULT_PRODUCT_CATEGORIES.forEach((category) => {
      if (!merged.some((item) => item.toLowerCase() === category.toLowerCase())) {
        merged.push(category);
      }
    });

    return merged.length > 0 ? merged : [...DEFAULT_PRODUCT_CATEGORIES];
  } catch (error) {
    console.error('Failed to load product categories', error);
    return [...DEFAULT_PRODUCT_CATEGORIES];
  }
}

export function saveProductCategories(categories) {
  const normalized = normalizeCategories(categories);

  if (typeof window !== 'undefined') {
    try {
      if (normalized.length > 0) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save product categories', error);
    }
  }

  broadcastCategories(normalized.length > 0 ? normalized : DEFAULT_PRODUCT_CATEGORIES);
  return normalized.length > 0 ? normalized : [...DEFAULT_PRODUCT_CATEGORIES];
}
