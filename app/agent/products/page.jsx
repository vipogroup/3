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

  const shareToWhatsApp = (product) => {
    if (!user) return;
    const link = generateAgentLink(user.id, product._id);
    const text = `🛍️ *${product.name}*\n\n${product.description}\n\n💰 מחיר: ₪${product.price}\n\n👉 לרכישה:`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + link)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToFacebook = (product) => {
    if (!user) return;
    const link = generateAgentLink(user.id, product._id);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = (product) => {
    if (!user) return;
    const link = generateAgentLink(user.id, product._id);
    const text = `${product.name} - רק ₪${product.price}!`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareViaEmail = (product) => {
    if (!user) return;
    const link = generateAgentLink(user.id, product._id);
    const subject = `בדוק את ${product.name}`;
    const body = `שלום,\n\nמצאתי מוצר מדהים שחשבתי שיעניין אותך:\n\n${product.name}\n${product.description}\n\nמחיר: ₪${product.price}\n\nלרכישה: ${link}\n\nבברכה`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
                    <div className="flex items-center gap-2 mb-3">
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
                    
                    {/* Social Share Buttons */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 font-semibold">שתף:</span>
                      <button
                        onClick={() => shareToWhatsApp(product)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1 text-xs"
                        title="שתף ב-WhatsApp"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        WhatsApp
                      </button>
                      <button
                        onClick={() => shareToFacebook(product)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1 text-xs"
                        title="שתף ב-Facebook"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </button>
                      <button
                        onClick={() => shareViaEmail(product)}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center text-xs"
                        title="שלח במייל"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
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
