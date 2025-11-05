"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";

import { getProducts } from "@/app/lib/products";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Load products
  const loadProducts = () => {
    setProducts(getProducts());
  };

  useEffect(() => {
    // Initial load
    loadProducts();

    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }

    fetchUser();
  }, []);

  // Listen for product updates
  useEffect(() => {
    const handleProductsUpdate = () => {
      loadProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 inline-block">
            <h1 className="text-4xl font-bold text-gray-900">חנות המוצרים שלנו</h1>
            <p className="text-gray-600 mt-2">מבחר מוצרי גיימינג ואביזרים מקצועיים</p>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      חסכון {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  {product.inStock && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      במלאי
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Category */}
                  <div className="text-xs text-purple-600 font-semibold mb-2 uppercase">
                    {product.category}
                  </div>

                  {/* Product Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews} ביקורות)
                    </span>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-purple-600">
                          ₪{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            ₪{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${product._id}`}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all text-center shadow-lg"
                    >
                      צפה במוצר
                    </Link>
                    <button className="bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold px-4 py-3 rounded-xl transition-all">
                      🛒
                    </button>
                  </div>

                  {/* Admin Actions */}
                  {user?.role === "admin" && (
                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/products/${product._id}/edit`}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2 rounded-lg transition-all text-center"
                      >
                        ערוך
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm("האם למחוק את המוצר?")) {
                            setProducts(products.filter(p => p._id !== product._id));
                          }
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-lg transition-all"
                      >
                        מחק
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
