'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// אייקונים SVG
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const GroupIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const StoreIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// כרטיס מוצר
function ProductCard({ product, onShare }) {
  const isGroup = product.purchaseType === 'group' || product.type === 'group';
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareUrl = `${window.location.origin}/products/${product._id}`;
    const shareText = `${product.name} - רק ₪${product.price}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          // fallback to clipboard
          navigator.clipboard.writeText(shareUrl);
          onShare?.(product);
        }
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      onShare?.(product);
    }
  };

  return (
    <Link 
      href={`/products/${product._id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* תמונה */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <StoreIcon />
          </div>
        )}
        
        {/* תגיות */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isGroup && (
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <GroupIcon />
              <span>קבוצתית</span>
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              -{discountPercent}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
              מומלץ
            </span>
          )}
        </div>

        {/* כפתור שיתוף */}
        <button
          onClick={handleShare}
          className="absolute bottom-2 left-2 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          title="שתף והרווח 10%"
        >
          <ShareIcon />
        </button>
      </div>

      {/* תוכן */}
      <div className="p-3 flex-1 flex flex-col">
        {/* שם העסק */}
        {product.tenant && (
          <div className="flex items-center gap-1 mb-1">
            {product.tenant.logo ? (
              <Image
                src={product.tenant.logo}
                alt={product.tenant.name}
                width={16}
                height={16}
                className="rounded-full"
              />
            ) : (
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                style={{ background: product.tenant.primaryColor || '#1e3a8a' }}
              >
                {product.tenant.name?.[0]}
              </div>
            )}
            <span className="text-xs text-gray-500 truncate">{product.tenant.name}</span>
          </div>
        )}

        {/* שם מוצר */}
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-cyan-600 transition-colors">
          {product.name}
        </h3>

        {/* מחיר */}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">₪{product.price.toLocaleString()}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">₪{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* עמלה */}
        {product.commission > 0 && (
          <div className="mt-1 text-xs text-green-600 font-medium">
            הרווח ₪{product.commission.toLocaleString()} משיתוף
          </div>
        )}
      </div>
    </Link>
  );
}

// קומפוננטה ראשית
export default function MarketplaceHome() {
  const [products, setProducts] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // פילטרים
  const [selectedTenant, setSelectedTenant] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  
  // Toast
  const [toast, setToast] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedTenant) params.set('tenant', selectedTenant);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedType) params.set('type', selectedType);
      if (searchQuery) params.set('search', searchQuery);
      params.set('page', page.toString());
      params.set('limit', '24');

      const res = await fetch(`/api/marketplace/products?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      setProducts(data.products || []);
      setTenants(data.tenants || []);
      setCategories(data.categories || []);
      setPagination(data.pagination || { total: 0, pages: 1 });
    } catch (err) {
      setError('שגיאה בטעינת המוצרים');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedTenant, selectedCategory, selectedType, searchQuery, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleShare = (product) => {
    setToast(`הקישור למוצר "${product.name}" הועתק! שתף והרווח 10%`);
    setTimeout(() => setToast(null), 3000);
  };

  const clearFilters = () => {
    setSelectedTenant('');
    setSelectedCategory('');
    setSelectedType('');
    setSearchQuery('');
    setPage(1);
  };

  const hasActiveFilters = selectedTenant || selectedCategory || selectedType || searchQuery;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-2">
            מרקטפלייס המוצרים
          </h1>
          <p className="text-center text-blue-100 text-sm md:text-base mb-6">
            מוצרים מכל העסקים במקום אחד • שתף והרווח 10% מכל רכישה
          </p>

          {/* חיפוש */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="חפש מוצרים..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full px-5 py-3 pr-12 rounded-full text-gray-900 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
          </div>
        </div>
      </header>

      {/* פילטרים */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* כפתור פילטרים (מובייל) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full text-sm whitespace-nowrap"
            >
              <FilterIcon />
              <span>סינון</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-cyan-500 rounded-full" />
              )}
            </button>

            {/* עסקים */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-500">עסק:</span>
              <select
                value={selectedTenant}
                onChange={(e) => {
                  setSelectedTenant(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">כל העסקים</option>
                {tenants.map(t => (
                  <option key={t._id} value={t.slug}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* קטגוריות */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-500">קטגוריה:</span>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">כל הקטגוריות</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* סוג רכישה */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setSelectedType(selectedType === '' ? '' : '');
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedType === '' ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                הכל
              </button>
              <button
                onClick={() => {
                  setSelectedType(selectedType === 'group' ? '' : 'group');
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors ${
                  selectedType === 'group' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <GroupIcon />
                <span>קבוצתית</span>
              </button>
              <button
                onClick={() => {
                  setSelectedType(selectedType === 'regular' ? '' : 'regular');
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedType === 'regular' ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                במלאי
              </button>
            </div>

            {/* ניקוי פילטרים */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                נקה הכל
              </button>
            )}
          </div>

          {/* פילטרים מובייל */}
          {showFilters && (
            <div className="md:hidden mt-3 p-4 bg-gray-50 rounded-xl space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">עסק</label>
                <select
                  value={selectedTenant}
                  onChange={(e) => {
                    setSelectedTenant(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">כל העסקים</option>
                  {tenants.map(t => (
                    <option key={t._id} value={t.slug}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">קטגוריה</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">כל הקטגוריות</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium"
              >
                החל סינון
              </button>
            </div>
          )}
        </div>
      </div>

      {/* תוכן ראשי */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* סטטוס */}
        {!loading && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {pagination.total > 0 
                ? `נמצאו ${pagination.total} מוצרים`
                : 'לא נמצאו מוצרים'}
            </p>
          </div>
        )}

        {/* טעינה */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* שגיאה */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg"
            >
              נסה שוב
            </button>
          </div>
        )}

        {/* מוצרים */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onShare={handleShare}
              />
            ))}
          </div>
        )}

        {/* אין מוצרים */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
              <StoreIcon />
            </div>
            <p className="text-gray-500 mb-4">לא נמצאו מוצרים התואמים לחיפוש</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg"
              >
                נקה פילטרים
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              הקודם
            </button>
            <span className="text-sm text-gray-600">
              עמוד {page} מתוך {pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              הבא
            </button>
          </div>
        )}
      </main>

      {/* CTA להירשם כסוכן */}
      <section className="bg-gradient-to-r from-blue-900 to-cyan-600 text-white py-12 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            רוצה להרוויח מכל שיתוף?
          </h2>
          <p className="text-blue-100 mb-6">
            הירשם כסוכן ותקבל 10% מכל רכישה שנעשית דרך הלינק שלך
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-blue-900 font-bold rounded-full hover:bg-blue-50 transition-colors"
          >
            הירשם עכשיו - חינם!
          </Link>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <span className="text-green-400">✓</span>
          <span className="text-sm">{toast}</span>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
}
