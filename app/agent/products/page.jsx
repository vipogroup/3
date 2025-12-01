"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { getProducts, refreshProductsFromApi } from "@/app/lib/products";

function buildCouponCode(user) {
  if (!user) return "";

  if (user.couponCode) {
    return String(user.couponCode).trim();
  }

  const rawName = String(user.fullName || user.name || "סוכן").trim();
  const sanitizedName = rawName.replace(/\s+/g, "");
  const baseName = sanitizedName || "סוכן";

  let sequence = user?.couponSequence;
  if (sequence === undefined || sequence === null || sequence === "") {
    const numericFromId = String(user?._id ?? "").replace(/\D/g, "").slice(-3);
    if (numericFromId) {
      sequence = numericFromId;
    }
  }

  const sequenceStr = String(sequence ?? "1").trim() || "1";
  return `${baseName}${sequenceStr}`;
}

export default function AgentProductsPage() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [couponCode, setCouponCode] = useState("");

  const themeStyles = useMemo(
    () => ({
      gradientBackground: {
        background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)",
      },
      primaryGradient: {
        background: "linear-gradient(90deg, var(--primary), var(--secondary))",
        color: "#ffffff",
      },
      gradientButton: {
        background: "linear-gradient(90deg, var(--primary), var(--secondary))",
        color: "#ffffff",
      },
      accentButton: {
        backgroundColor: "var(--accent)",
        color: "#ffffff",
      },
      successFill: {
        backgroundColor: "var(--success)",
        color: "#ffffff",
      },
      dangerFill: {
        backgroundColor: "var(--danger)",
        color: "#ffffff",
      },
      outlinePrimary: {
        border: "2px solid var(--primary)",
        color: "var(--primary)",
        backgroundColor: "#ffffff",
      },
      textPrimary: {
        color: "var(--primary)",
      },
      textSuccess: {
        color: "var(--success)",
      },
      mutedCard: {
        backgroundColor: "var(--bg)",
      },
    }),
    []
  );

  // Load products
  const loadProducts = useCallback(async () => {
    try {
      const list = await refreshProductsFromApi();
      if (Array.isArray(list)) {
        setProducts(list.filter((product) => product?.active));
        return;
      }
    } catch (error) {
      console.error("Failed to refresh products for agent dashboard:", error);
    }

    setProducts(getProducts());
  }, []);

  useEffect(() => {
    // Initial load
    loadProducts();

    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          let mergedUser = data?.user || null;

          if (mergedUser) {
            try {
              const profileRes = await fetch("/api/users/me");
              if (profileRes.ok) {
                const profileData = await profileRes.json();
                if (profileData?.user) {
                  mergedUser = { ...mergedUser, ...profileData.user };
                }
              }
            } catch (profileError) {
              console.error("Failed to fetch user profile:", profileError);
            }
          }

          setUser(mergedUser);
          setCouponCode(buildCouponCode(mergedUser));
        } else {
          setUser(null);
          setCouponCode("");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
        setCouponCode("");
      }
    }
    fetchUser();
  }, [loadProducts]);

  // Listen for product updates
  useEffect(() => {
    const handleProductsUpdate = () => {
      loadProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate);
  }, [loadProducts]);

  const copyCoupon = (productId) => {
    if (!couponCode || typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    navigator.clipboard
      .writeText(couponCode)
      .then(() => {
        setCopiedId(productId);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy coupon code:", err);
      });
  };

  const getProductShareUrl = (product) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://vipo.agents";
    return `${baseUrl}/product/${product._id}`;
  };

  const buildShareText = (product) => {
    const lines = [
      `🛍️ *${product.name}*`,
      "",
      product.description,
      "",
      `💰 מחיר: ₪${product.price}`,
    ];

    if (couponCode) {
      lines.push(`🏷️ קוד קופון: ${couponCode}`);
    }

    const productUrl = getProductShareUrl(product);
    if (productUrl) {
      lines.push("", `🔗 לרכישה: ${productUrl}`);
    }

    lines.push("", "השתמשו בקוד הקופון בקופה לקבלת ההטבה!");

    return lines.filter(Boolean).join("\n");
  };

  const shareToWhatsApp = (product) => {
    if (!couponCode) return;
    const text = buildShareText(product);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToFacebook = (product) => {
    if (!couponCode) return;
    const text = buildShareText(product);
    const shareUrl = getProductShareUrl(product);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = (product) => {
    if (!couponCode) return;
    const text = buildShareText(product);
    const shareUrl = getProductShareUrl(product);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareViaEmail = (product) => {
    if (!couponCode) return;
    const text = buildShareText(product);
    const subject = `בדוק את ${product.name}`;
    const body = `שלום,\n\n${text}\n\nבברכה`; 
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen p-8" style={themeStyles.gradientBackground}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            המוצרים שלי
          </h1>
          <p className="text-gray-600">
            בחר מוצר וקבל קוד קופון אישי לשיתוף. כל רכישה עם הקוד שלך תזכה אותך בעמלה!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const hasCoupon = Boolean(couponCode);

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden" style={themeStyles.mutedCard}>
                  <Image
                    src={product.image || "https://placehold.co/600x400?text=VIPO"}
                    alt={product.name || "מוצר"}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                  {product.originalPrice && (
                    <div
                      className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold"
                      style={themeStyles.dangerFill}
                    >
                      חסכון {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  <div
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold"
                    style={themeStyles.successFill}
                  >
                    ₪{product.commission} עמלה
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Category */}
                  <div className="text-xs font-semibold mb-2 uppercase" style={themeStyles.primaryText}>
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
                      <div className="text-2xl font-bold" style={themeStyles.primaryText}>
                        ₪{product.price}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-400 line-through">
                          ₪{product.originalPrice}
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold" style={themeStyles.successText}>
                        ₪{product.commission}
                      </div>
                      <div className="text-xs text-gray-500">עמלה (10%)</div>
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="mb-4 p-3 rounded-xl" style={themeStyles.mutedCard}>
                    <div className="text-xs text-gray-600 mb-1 font-semibold">
                      קוד הקופון האישי שלך:
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        value={couponCode}
                        readOnly
                        placeholder="הקוד יופיע כאן"
                        className="flex-1 text-xs bg-white border border-gray-300 rounded px-2 py-1 font-mono"
                      />
                      <button
                        onClick={() => copyCoupon(product._id)}
                        disabled={!hasCoupon}
                        className="font-semibold px-4 py-3 rounded-xl transition-all"
                        style={themeStyles.outlinePrimary}
                      >
                        {copiedId === product._id ? "✔" : "העתק"}
                      </button>
                    </div>
                    {!hasCoupon && (
                      <div className="text-xs text-gray-500">
                        הקוד יופיע כאן לאחר שיוגדר עבורך. אנא פנה למנהל במקרה הצורך.
                      </div>
                    )}

                    {/* Social Share Buttons */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 font-semibold">שתף:</span>
                      <button
                        onClick={() => shareToWhatsApp(product)}
                        disabled={!hasCoupon}
                        className="flex-1 font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1 text-xs"
                        style={themeStyles.successFill}
                        title="שתף ב-WhatsApp"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        WhatsApp
                      </button>
                      <button
                        onClick={() => shareToFacebook(product)}
                        disabled={!hasCoupon}
                        className="flex-1 font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1 text-xs"
                        style={themeStyles.gradientButton}
                        title="שתף ב-Facebook"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </button>
                      <button
                        onClick={() => shareViaEmail(product)}
                        disabled={!hasCoupon}
                        className="font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center text-xs"
                        style={themeStyles.accentButton}
                        title="שלח במייל"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Card */}
        <div
          className="mt-8 rounded-2xl shadow-xl p-8 text-white"
          style={themeStyles.primaryGradient}
        >
          <h2 className="text-2xl font-bold mb-4">💡 איך זה עובד?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl mb-2">1️⃣</div>
              <h3 className="font-bold mb-2">בחר מוצר</h3>
              <p className="text-white">
                בחר מוצר מהרשימה והעתק את קוד הקופון האישי שלך
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">2️⃣</div>
              <h3 className="font-bold mb-2">שתף</h3>
              <p className="text-blue-100">
                שתף את קוד הקופון יחד עם קישור המוצר ב-WhatsApp, רשתות חברתיות או מייל
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">3️⃣</div>
              <h3 className="font-bold mb-2">הרווח</h3>
              <p className="text-blue-100">
                קבל עמלה על כל רכישה שמתבצעת עם הקוד שלך!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
