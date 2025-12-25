const STORAGE_KEY = 'vipo_product_categories';
const DELETED_KEY = 'vipo_deleted_categories';

export const DEFAULT_PRODUCT_CATEGORIES = [
  'אביזרי מחשב',
  'אודיו',
  'מסכים',
  'ריהוט',
  'רכישה קבוצתית',
];

// Track permanently deleted categories
function getDeletedCategories() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addToDeleted(category) {
  if (typeof window === 'undefined') return;
  try {
    const deleted = getDeletedCategories();
    if (!deleted.includes(category)) {
      deleted.push(category);
      window.localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
    }
  } catch (error) {
    console.error('Failed to save deleted category', error);
  }
}

function removeFromDeleted(category) {
  if (typeof window === 'undefined') return;
  try {
    const deleted = getDeletedCategories();
    const updated = deleted.filter(c => c !== category);
    window.localStorage.setItem(DELETED_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to update deleted categories', error);
  }
}

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
    const deleted = getDeletedCategories();
    
    if (!raw) {
      // Return defaults minus deleted ones
      return DEFAULT_PRODUCT_CATEGORIES.filter(c => !deleted.includes(c));
    }

    const parsed = JSON.parse(raw);
    const normalized = normalizeCategories(parsed);
    const merged = [...normalized];
    
    // Only add default categories that weren't deliberately deleted
    DEFAULT_PRODUCT_CATEGORIES.forEach((category) => {
      if (!merged.some((item) => item.toLowerCase() === category.toLowerCase()) && !deleted.includes(category)) {
        merged.push(category);
      }
    });

    const result = merged.length > 0 ? merged : DEFAULT_PRODUCT_CATEGORIES.filter(c => !deleted.includes(c));
    return result.length > 0 ? result : ['כללי']; // Always have at least one category
  } catch (error) {
    console.error('Failed to load product categories', error);
    return [...DEFAULT_PRODUCT_CATEGORIES];
  }
}

// Delete a category permanently (won't come back from defaults)
export function deleteCategory(category, currentCategories) {
  // Add to deleted list
  addToDeleted(category);
  
  // Remove from current categories and save
  const updated = currentCategories.filter(c => c !== category);
  return saveProductCategories(updated);
}

// Add a new category (and remove from deleted list if it was there)
export function addCategory(category, currentCategories) {
  removeFromDeleted(category);
  const updated = [...currentCategories, category];
  return saveProductCategories(updated);
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
