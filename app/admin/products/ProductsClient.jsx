'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { refreshProductsFromApi, getProducts } from '@/app/lib/products';

export default function ProductsClient() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(() => new Set());

  const selectedCount = selectedProducts.size;
  const allSelected = useMemo(() => {
    if (!selectionMode || products.length === 0) return false;
    return selectedProducts.size === products.length;
  }, [selectionMode, products.length, selectedProducts]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const handleProductsUpdate = () => {
      loadProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate);
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const list = await refreshProductsFromApi();
      if (Array.isArray(list)) {
        setProducts(list);
      } else {
        setProducts(getProducts());
      }
    } catch (error) {
      console.error('Failed to refresh products', error);
      setProducts(getProducts());
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את "${productName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = data?.error || 'שגיאה במחיקת המוצר';
        alert(message);
        return;
      }

      setSelectedProducts((prev) => {
        if (!prev.has(productId)) return prev;
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      alert('מוצר נמחק בהצלחה! השינוי יוחל בכל הדפים.');
      await loadProducts();
    } catch (error) {
      console.error('Delete error:', error);
      alert('שגיאה במחיקת המוצר');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectionMode = () => {
    setSelectionMode((prev) => {
      const next = !prev;
      if (!next) {
        setSelectedProducts(new Set());
      }
      return next;
    });
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedProducts(new Set());
      return;
    }

    setSelectedProducts(new Set(products.map((product) => product._id)));
  };

  const handleBulkDelete = async () => {
    if (!selectedCount) {
      alert('לא נבחרו מוצרים למחיקה');
      return;
    }

    if (!confirm(`האם למחוק ${selectedCount} מוצרים? הפעולה אינה הפיכה.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/products/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedProducts) }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = data?.error || 'Bulk delete failed';
        throw new Error(message);
      }

      const payload = await res.json();
      alert(`נמחקו ${payload.deletedCount ?? selectedCount} מוצרים בהצלחה`);
      setSelectedProducts(new Set());
      setSelectionMode(false);
      await loadProducts();
    } catch (error) {
      console.error('Bulk delete error', error);
      alert(error.message || 'שגיאה במחיקה מרובה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ניהול מוצרים
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/products"
              className="font-semibold px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all shadow-sm flex items-center gap-2 text-xs sm:text-sm"
              style={{
                background: 'white',
                border: '2px solid #0891b2',
                color: '#0891b2',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="hidden sm:inline">צפייה בדף המוצרים באתר</span>
              <span className="sm:hidden">צפה באתר</span>
            </Link>
            <button
              onClick={toggleSelectionMode}
              className="font-semibold px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all shadow-sm flex items-center gap-2 text-xs sm:text-sm"
              style={{
                background: selectionMode ? 'rgba(220, 38, 38, 0.05)' : 'white',
                border: '2px solid #dc2626',
                color: '#dc2626',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = selectionMode
                  ? 'rgba(220, 38, 38, 0.05)'
                  : 'white';
              }}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span className="hidden sm:inline">
                {selectionMode ? 'בטל מחיקה מרובה' : 'מחיקת מוצרים'}
              </span>
              <span className="sm:hidden">{selectionMode ? 'בטל' : 'מחק'}</span>
            </button>
            {selectionMode && (
              <>
                <button
                  onClick={handleSelectAll}
                  className="font-semibold px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all shadow-sm text-xs sm:text-sm"
                  style={{
                    background: 'white',
                    border: '2px solid #6b7280',
                    color: '#374151',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                >
                  <span className="hidden sm:inline">
                    {allSelected ? 'בטל סימון הכול' : 'סמן את כל המוצרים'}
                  </span>
                  <span className="sm:hidden">{allSelected ? 'בטל הכל' : 'סמן הכל'}</span>
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={loading || selectedCount === 0}
                  className="text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  style={{
                    background:
                      loading || selectedCount === 0
                        ? '#9ca3af'
                        : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                  }}
                  onMouseEnter={(e) =>
                    !(loading || selectedCount === 0) &&
                    (e.currentTarget.style.background =
                      'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)')
                  }
                  onMouseLeave={(e) =>
                    !(loading || selectedCount === 0) &&
                    (e.currentTarget.style.background =
                      'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)')
                  }
                >
                  מחק {selectedCount ? `${selectedCount} מוצרים` : 'מוצרים נבחרים'}
                </button>
              </>
            )}
            <Link
              href="/admin/products/new"
              className="text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all shadow-lg flex items-center gap-2 text-xs sm:text-sm"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline">הוסף מוצר חדש</span>
              <span className="sm:hidden">הוסף</span>
            </Link>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '2px solid #0891b2' }}>
                    {selectionMode && (
                      <th className="px-4 py-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={handleSelectAll}
                          aria-label="select all products"
                        />
                      </th>
                    )}
                    <th
                      className="px-6 py-4 text-right text-sm font-semibold"
                      style={{ color: '#1e3a8a' }}
                    >
                      שם המוצר
                    </th>
                    <th
                      className="px-6 py-4 text-right text-sm font-semibold"
                      style={{ color: '#1e3a8a' }}
                    >
                      מחיר
                    </th>
                    <th
                      className="px-6 py-4 text-right text-sm font-semibold"
                      style={{ color: '#1e3a8a' }}
                    >
                      קטגוריה
                    </th>
                    <th
                      className="px-6 py-4 text-right text-sm font-semibold"
                      style={{ color: '#1e3a8a' }}
                    >
                      סטטוס
                    </th>
                    <th
                      className="px-6 py-4 text-right text-sm font-semibold"
                      style={{ color: '#1e3a8a' }}
                    >
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-100 transition-all"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)')
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                    >
                      {selectionMode && (
                        <td className="px-4 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product._id)}
                            onChange={() => toggleProductSelection(product._id)}
                            aria-label={`select product ${product.name}`}
                          />
                        </td>
                      )}
                      <td className="px-6 py-4 text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-gray-900">₪{product.price}</td>
                      <td className="px-6 py-4 text-gray-600">{product.category}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.active ? 'פעיל' : 'לא פעיל'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="font-medium transition-colors"
                            style={{ color: '#0891b2' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#0e7490')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#0891b2')}
                          >
                            ערוך
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            disabled={loading}
                            className="font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ color: loading ? '#9ca3af' : '#dc2626' }}
                            onMouseEnter={(e) =>
                              !loading && (e.currentTarget.style.color = '#b91c1c')
                            }
                            onMouseLeave={(e) =>
                              !loading && (e.currentTarget.style.color = '#dc2626')
                            }
                          >
                            מחק
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4">
              <div className="grid grid-cols-2 gap-3">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="p-3 rounded-lg border-2 border-gray-200 bg-white"
                  >
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>

                    <div className="mb-2">
                      <span className="text-sm font-bold" style={{ color: '#1e3a8a' }}>
                        ₪{product.price}
                      </span>
                      <span
                        className={`mr-2 text-xs px-2 py-0.5 rounded-full ${
                          product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.active ? 'פעיל' : 'לא פעיל'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                      {selectionMode && (
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product._id)}
                          onChange={() => toggleProductSelection(product._id)}
                          aria-label={`select product ${product.name}`}
                          className="w-4 h-4"
                        />
                      )}
                      <div className="flex gap-1">
                        <Link
                          href={`/admin/products/${product._id}/edit`}
                          className="flex-1 text-center text-white font-medium px-2 py-1.5 rounded text-xs"
                          style={{ background: '#0891b2' }}
                        >
                          ערוך
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          disabled={loading}
                          className="flex-1 font-medium px-2 py-1.5 rounded text-xs"
                          style={{
                            background: loading ? '#e5e7eb' : 'white',
                            border: '2px solid #dc2626',
                            color: loading ? '#6b7280' : '#dc2626',
                          }}
                        >
                          מחק
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="bg-white rounded-xl shadow-lg p-12 text-center"
            style={{
              border: '2px solid transparent',
              backgroundImage:
                'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <svg
              className="w-24 h-24 mx-auto mb-4"
              style={{ color: '#0891b2' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3
              className="text-2xl font-bold mb-2"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              אין מוצרים במערכת
            </h3>
            <p className="text-gray-600 mb-6">התחל בהוספת המוצר הראשון שלך</p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              הוסף מוצר
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
