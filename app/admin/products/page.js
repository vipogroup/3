"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, deleteProduct as deleteProductFromLib } from "@/app/lib/products";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Listen for product updates
  useEffect(() => {
    const handleProductsUpdate = () => {
      loadProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate);
  }, []);

  const loadProducts = () => {
    setProducts(getProducts());
  };

  const handleDelete = async (productId, productName) => {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את "${productName}"?`)) {
      return;
    }

    setLoading(true);
    try {
      // Delete from products library
      const success = deleteProductFromLib(productId);
      
      if (success) {
        // Reload products
        loadProducts();
        alert("מוצר נמחק בהצלחה! השינוי יוחל בכל הדפים.");
      } else {
        alert("שגיאה: מוצר לא נמצא");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("שגיאה במחיקת המוצר");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">ניהול מוצרים</h1>
          <Link
            href="/admin/products/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg"
          >
            + הוסף מוצר חדש
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">שם המוצר</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">מחיר</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">קטגוריה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-gray-900">₪{product.price}</td>
                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.active ? 'פעיל' : 'לא פעיל'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product._id}/edit`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          ערוך
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              אין מוצרים במערכת
            </h3>
            <p className="text-gray-600 mb-6">
              התחל בהוספת המוצר הראשון שלך
            </p>
            <Link
              href="/admin/products/new"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              + הוסף מוצר
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
