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
        } else if (res.status === 401) {
          // User not logged in - this is normal
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Auth Buttons */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-8 w-full sm:w-auto inline-block">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">חנות המוצרים שלנו</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 mb-4">מבחר מוצרי גיימינג ואביזרים מקצועיים</p>
            
            {/* Auth Buttons */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg text-sm sm:text-base"
                >
                  🎁 הצטרף עכשיו - קבל הנחה!
                </Link>
                <Link
                  href="/login"
                  className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg transition-all text-sm sm:text-base"
                >
                  🔐 התחבר
                </Link>
              </div>
            )}
            
            {user && (
              <div className="mt-4 text-center">
                <p className="text-green-600 font-semibold">
                  👋 שלום, {user.name}!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105"
              >
                {/* Product Image */}
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
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
                <div className="p-3 sm:p-4 md:p-6">
                  {/* Category */}
                  <div className="text-xs text-purple-600 font-semibold mb-1 sm:mb-2 uppercase">
                    {product.category}
                  </div>

                  {/* Product Name */}
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
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
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/products/${product._id}`}
                      className="bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all text-center text-sm sm:text-base"
                    >
                      צפה במוצר
                    </Link>
                    <Link
                      href={`/checkout/${product._id}`}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all text-center shadow-lg text-sm sm:text-base"
                    >
                      🛒 קנה עכשיו
                    </Link>
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
