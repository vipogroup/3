"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  refreshProductsFromApi,
  getProducts,
} from "@/app/lib/products";

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

    window.addEventListener("productsUpdated", handleProductsUpdate);
    return () => window.removeEventListener("productsUpdated", handleProductsUpdate);
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
      console.error("Failed to refresh products", error);
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
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = data?.error || "שגיאה במחיקת המוצר";
        alert(message);
        return;
      }

      setSelectedProducts((prev) => {
        if (!prev.has(productId)) return prev;
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      alert("מוצר נמחק בהצלחה! השינוי יוחל בכל הדפים.");
      await loadProducts();
    } catch (error) {
      console.error("Delete error:", error);
      alert("שגיאה במחיקת המוצר");
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
      alert("לא נבחרו מוצרים למחיקה");
      return;
    }

    if (!confirm(`האם למחוק ${selectedCount} מוצרים? הפעולה אינה הפיכה.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/products/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedProducts) }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = data?.error || "Bulk delete failed";
        throw new Error(message);
      }

      const payload = await res.json();
      alert(`נמחקו ${payload.deletedCount ?? selectedCount} מוצרים בהצלחה`);
      setSelectedProducts(new Set());
      setSelectionMode(false);
      await loadProducts();
    } catch (error) {
      console.error("Bulk delete error", error);
      alert(error.message || "שגיאה במחיקה מרובה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <h1 className="text-4xl font-bold text-gray-900">ניהול מוצרים</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-5 py-3 rounded-xl transition-all shadow-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              👁️‍🗨️ צפייה בדף המוצרים באתר
            </Link>
            <button
              onClick={toggleSelectionMode}
              className={`font-semibold px-5 py-3 rounded-xl transition-all shadow-sm border ${
                selectionMode
                  ? "bg-red-50 border-red-500 text-red-600 hover:bg-red-100"
                  : "bg-white border-red-500 text-red-600 hover:bg-red-50"
              }`}
            >
              {selectionMode ? "בטל מחיקה מרובה" : "🗑️ מחיקת מוצרים"}
            </button>
            {selectionMode && (
              <>
                <button
                  onClick={handleSelectAll}
                  className="bg-white border border-gray-400 text-gray-700 hover:bg-gray-100 font-semibold px-5 py-3 rounded-xl transition-all shadow-sm"
                >
                  {allSelected ? "בטל סימון הכול" : "סמן את כל המוצרים"}
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={loading || selectedCount === 0}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  מחק {selectedCount ? `${selectedCount} מוצרים` : "מוצרים נבחרים"}
                </button>
              </>
            )}
            <Link
              href="/admin/products/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg"
            >
              + הוסף מוצר חדש
            </Link>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
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
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.active ? "פעיל" : "לא פעיל"}
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">אין מוצרים במערכת</h3>
            <p className="text-gray-600 mb-6">התחל בהוספת המוצר הראשון שלך</p>
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
