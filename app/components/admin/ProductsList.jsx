"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { formatCurrencyILS } from "@/app/utils/date";
import ImageUpload from "@/components/ImageUpload";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.price) {
      setError("שם ומחיר הם שדות חובה");
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError("המחיר חייב להיות גדול מ-0");
      return;
    }

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      // Reset form and refresh list
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(productId, productName) {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את "${productName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete product");
      }

      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category || "",
      imageUrl: product.imageUrl || "",
    });
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
    });
    setError("");
  }

  if (loading) {
    return <div className="text-center py-8">טוען...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">רשימת מוצרים</h2>
          <p className="text-gray-600">סה״כ {products.length} מוצרים</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          ➕ הוסף מוצר
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4">
            <h3 className="text-xl font-bold mb-4">
              {editingProduct ? "עריכת מוצר" : "הוספת מוצר חדש"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">שם המוצר *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">תיאור</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">מחיר (₪) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">קטגוריה</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                label="תמונת מוצר"
              />
              
              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingProduct ? "עדכן" : "הוסף"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {product.imageUrl && (
              <div className="h-48 bg-gray-200 relative">
                <Image
                  src={product.imageUrl}
                  alt={product.name || "מוצר"}
                  fill
                  sizes="(min-width: 1024px) 25vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              )}
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-purple-600">{formatCurrencyILS(product.price)}</span>
                {product.category && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
                >
                  ✏️ ערוך
                </button>
                <button
                  onClick={() => handleDelete(product._id, product.name)}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm"
                >
                  🗑️ מחק
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">אין מוצרים במערכת</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-purple-600 hover:text-purple-700"
          >
            הוסף מוצר ראשון
          </button>
        </div>
      )}
    </div>
  );
}
