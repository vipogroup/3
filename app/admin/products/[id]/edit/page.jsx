"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProductById, updateProduct } from "@/app/lib/products";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    stockCount: ""
  });

  useEffect(() => {
    const loadedProduct = getProductById(params.id);
    if (loadedProduct) {
      setProduct(loadedProduct);
      setFormData({
        name: loadedProduct.name || "",
        description: loadedProduct.description || "",
        price: loadedProduct.price?.toString() || "",
        originalPrice: loadedProduct.originalPrice?.toString() || "",
        category: loadedProduct.category || "",
        stockCount: loadedProduct.stockCount?.toString() || ""
      });
    } else {
      setError("מוצר לא נמצא");
    }
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const updates = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        stockCount: parseInt(formData.stockCount) || 0
      };

      // Update product using the library function
      const updatedProduct = updateProduct(params.id, updates);
      
      if (updatedProduct) {
        console.log("Product updated:", updatedProduct);
        alert("מוצר עודכן בהצלחה! השינויים יוחלו בכל הדפים.");
        router.push("/admin/products");
      } else {
        setError("מוצר לא נמצא");
      }
    } catch (error) {
      setError(error.message || "שגיאה בעדכון המוצר");
    } finally {
      setSubmitting(false);
    }
  };

  if (!product && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 flex items-center justify-center">
        <div className="text-white text-2xl">טוען...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <Link
            href="/admin/products"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            חזרה לרשימת מוצרים
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white">ערוך מוצר</h1>
            <p className="text-purple-100 mt-2">{product?.name}</p>
          </div>
          <Link
            href="/admin/products"
            className="bg-white text-purple-600 font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            ← חזרה
          </Link>
        </div>

        {error && (
          <div className="bg-red-500 text-white px-6 py-4 rounded-xl mb-6 shadow-lg">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  שם המוצר *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  תיאור *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  מחיר *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  מחיר מקורי
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  קטגוריה *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                >
                  <option value="">בחר קטגוריה</option>
                  <option value="אביזרי מחשב">אביזרי מחשב</option>
                  <option value="אודיו">אודיו</option>
                  <option value="מסכים">מסכים</option>
                  <option value="ריהוט">ריהוט</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  כמות במלאי *
                </label>
                <input
                  type="number"
                  name="stockCount"
                  value={formData.stockCount}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg ${
                  submitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "שומר..." : "✓ שמור שינויים"}
              </button>
              <Link
                href="/admin/products"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold text-lg py-4 rounded-xl transition-all text-center"
              >
                ביטול
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
