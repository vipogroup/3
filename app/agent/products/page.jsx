"use client";

import { useState, useEffect } from "react";
import { getProducts, generateAgentLink } from "@/app/lib/products";
import Link from "next/link";

export default function AgentProductsPage() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

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

  const copyLink = (productId) => {
    if (!user) return;
    
    const link = generateAgentLink(user.id, productId);
    navigator.clipboard.writeText(link);
    setCopiedId(productId);
    
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            המוצרים שלי
          </h1>
          <p className="text-gray-600">
            בחר מוצר וקבל לינק ייחודי לשיתוף. כל רכישה דרך הלינק שלך תזכה אותך ב-10% עמלה!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const agentLink = user ? generateAgentLink(user.id, product._id) : "";
            
            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
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
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ₪{product.commission} עמלה
                  </div>
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

                  {/* Price & Commission */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        ₪{product.price}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-400 line-through">
                          ₪{product.originalPrice}
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        ₪{product.commission}
                      </div>
                      <div className="text-xs text-gray-500">עמלה (10%)</div>
                    </div>
                  </div>

                  {/* Agent Link */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-600 mb-1 font-semibold">
                      הלינק הייחודי שלך:
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={agentLink}
                        readOnly
                        className="flex-1 text-xs bg-white border border-gray-300 rounded px-2 py-1 font-mono"
                      />
                      <button
                        onClick={() => copyLink(product._id)}
                        className={`px-3 py-1 rounded font-semibold text-sm transition-all ${
                          copiedId === product._id
                            ? "bg-green-500 text-white"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        {copiedId === product._id ? "✓ הועתק" : "העתק"}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${product._id}`}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all text-center"
                    >
                      צפה במוצר
                    </Link>
                    <button
                      onClick={() => copyLink(product._id)}
                      className="bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold px-4 py-3 rounded-xl transition-all"
                    >
                      🔗
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        <span className="font-semibold">0</span> מכירות
                      </div>
                      <div className="text-gray-600">
                        <span className="font-semibold">0</span> קליקים
                      </div>
                      <div className="text-green-600 font-semibold">
                        ₪0 הכנסות
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">💡 איך זה עובד?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl mb-2">1️⃣</div>
              <h3 className="font-bold mb-2">בחר מוצר</h3>
              <p className="text-purple-100">
                בחר מוצר מהרשימה והעתק את הלינק הייחודי שלך
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">2️⃣</div>
              <h3 className="font-bold mb-2">שתף</h3>
              <p className="text-purple-100">
                שתף את הלינק ברשתות חברתיות, WhatsApp או אימייל
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">3️⃣</div>
              <h3 className="font-bold mb-2">הרווח</h3>
              <p className="text-purple-100">
                קבל 10% עמלה מכל רכישה שמתבצעת דרך הלינק שלך!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
