'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function BusinessProductsPage() {
  const params = useParams();
  const tenantId = params.tenantId;
  
  const [products, setProducts] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tenantId) {
      loadProducts();
    }
  }, [tenantId]);

  const loadProducts = async () => {
    try {
      const res = await fetch(`/api/agent/marketplace/${tenantId}/products`, { credentials: 'include' });
      const data = await res.json();
      
      if (data.ok) {
        setProducts(data.products || []);
        setBusiness(data.business || null);
      } else {
        setError(data.error || 'שגיאה בטעינת מוצרים');
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('שגיאה בטעינת מוצרים');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען מוצרים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-[#1e3a8a] to-[#0891b2] text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/agent/marketplace" className="text-white/80 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{business?.name || 'מוצרי העסק'}</h1>
              <p className="text-white/80 text-sm">
                {business?.commissionPercent || 12}% עמלה על כל מכירה
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-500 text-lg">אין מוצרים להצגה</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 relative">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Commission Badge */}
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {business?.commissionPercent || 12}% עמלה
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">₪{product.price?.toLocaleString()}</span>
                    {product.stockCount !== undefined && (
                      <span className={`text-xs ${product.stockCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stockCount > 0 ? `במלאי (${product.stockCount})` : 'אזל'}
                      </span>
                    )}
                  </div>
                  {/* Potential Commission */}
                  <div className="mt-2 text-xs text-green-600 bg-green-50 rounded px-2 py-1 text-center">
                    עמלה משוערת: ₪{((product.price || 0) * ((business?.commissionPercent || 12) / 100)).toFixed(0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Link
            href="/agent/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>חזרה לשוק העסקים</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
