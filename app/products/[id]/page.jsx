"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductById, fetchProductById } from "@/app/lib/products";
import { useCartContext } from "@/app/context/CartContext";
import { useTheme } from "@/app/context/ThemeContext";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState(false);
  const { addItem } = useCartContext();
  const { settings: themeSettings } = useTheme();

  const {
    primaryColor,
    secondaryColor,
    accentColor,
    textColor,
    backgroundGradient,
    cardBackground,
    buttonGradient,
    borderSoftColor,
  } = useMemo(() => {
    const primary = themeSettings?.primaryColor || "#4f46e5";
    const secondary = themeSettings?.secondaryColor || "#4338ca";
    const accent = themeSettings?.accentColor || "#ec4899";
    const text = themeSettings?.textColor || "#1f2937";
    const background =
      themeSettings?.backgroundGradient ||
      `linear-gradient(135deg, ${primary} 0%, ${secondary} 50%, ${accent} 100%)`;
    const cardBg =
      themeSettings?.cardGradient ||
      "linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(240,246,255,0.98) 100%)";
    const buttonBg =
      themeSettings?.buttonGradient ||
      `linear-gradient(135deg, ${primary} 0%, ${secondary} 48%, ${accent} 100%)`;
    const borderColor = themeSettings?.primaryColor
      ? `${themeSettings.primaryColor}33`
      : "rgba(79,70,229,0.28)";

    return {
      primaryColor: primary,
      secondaryColor: secondary,
      accentColor: accent,
      textColor: text,
      backgroundGradient: background,
      cardBackground: cardBg,
      buttonGradient: buttonBg,
      borderSoftColor: borderColor,
    };
  }, [themeSettings]);

  const outlineHoverColor = useMemo(
    () =>
      themeSettings?.backgroundColor
        ? `${themeSettings.backgroundColor}dd`
        : "rgba(255,255,255,0.85)",
    [themeSettings]
  );

  const loadProduct = useCallback(async () => {
    const id = params.id;
    if (!id) {
      setProduct(null);
      setProductError(true);
      setLoadingProduct(false);
      return;
    }

    setLoadingProduct(true);
    setProductError(false);

    const cached = getProductById(id);
    if (cached) {
      setProduct(cached);
    }

    try {
      const remote = await fetchProductById(id);
      if (remote) {
        setProduct(remote);
        setProductError(false);
      } else if (!cached) {
        setProduct(null);
        setProductError(true);
      }
    } catch (error) {
      console.error("Failed to load product", error);
      if (!cached) {
        setProduct(null);
        setProductError(true);
      }
    }
    setLoadingProduct(false);
  }, [params.id]);

  useEffect(() => {
    loadProduct();
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else setUser(null);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, [params.id, loadProduct]);

  useEffect(() => {
    const update = () => {
      loadProduct();
    };
    window.addEventListener("productsUpdated", update);
    return () => window.removeEventListener("productsUpdated", update);
  }, [params.id, loadProduct]);

  useEffect(() => setSelectedMediaIndex(0), [product?._id]);

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-10 py-12 text-center max-w-md">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: '#1e3a8a', borderBottomColor: '#0891b2' }}></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">טוען מוצר...</h2>
          <p className="text-gray-600">אנא המתן</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">מוצר לא נמצא</h1>
          <p className="text-gray-600 mb-6">המוצר שחיפשת אינו קיים במערכת</p>
          <Link 
            href="/products" 
            className="inline-block text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              boxShadow: '0 2px 8px rgba(8, 145, 178, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(8, 145, 178, 0.2)';
            }}
          >
            חזרה לחנות
          </Link>
        </div>
      </div>
    );
  }

  const imageCandidates = [
    product.image,
    ...(Array.isArray(product.images) ? product.images : [])
  ].filter(Boolean);

  const uniqueImages = [...new Set(imageCandidates)].slice(0, 3);

  const mediaItems = [
    ...uniqueImages.map((src) => ({ type: "image", src })),
    ...(product.videoUrl ? [{ type: "video", src: product.videoUrl }] : [])
  ];

  if (mediaItems.length === 0) {
    mediaItems.push({
      type: "image",
      src: "https://via.placeholder.com/800x600?text=No+Image"
    });
  }

  const selectedMedia = mediaItems[selectedMediaIndex];

  const hasDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Product Content */}
        <div className="bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">

            {/* Left: Image Gallery */}
            <div>
              <div
                className={`relative ${
                  selectedMedia.type === "video"
                    ? "aspect-video"
                    : "aspect-square"
                } border border-gray-200 rounded-lg overflow-hidden mb-3 bg-gray-50`}
              >
                {selectedMedia.type === "video" ? (
                  <iframe src={selectedMedia.src} className="w-full h-full" allowFullScreen />
                ) : (
                  <Image
                    src={selectedMedia.src || "https://placehold.co/600x600?text=VIPO"}
                    alt={product?.name || "תמונה של מוצר"}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                )}

                {hasDiscount && (
                  <div 
                    className="absolute top-2 right-2 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md"
                    style={{ 
                      background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                      transform: 'rotate(-8deg)'
                    }}
                  >
                    -{discountPercent}%
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {mediaItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedMediaIndex(i)}
                    className="relative w-16 h-16 rounded-md overflow-hidden border-2 transition"
                    style={{
                      borderColor: i === selectedMediaIndex ? '#0891b2' : '#e5e7eb'
                    }}
                    onMouseEnter={(e) => {
                      if (i !== selectedMediaIndex) e.currentTarget.style.borderColor = '#0891b2';
                    }}
                    onMouseLeave={(e) => {
                      if (i !== selectedMediaIndex) e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    {item.type === "video" ? (
                      <div className="w-full h-full bg-black/80 text-white flex items-center justify-center text-xs font-semibold tracking-wide">
                        וידאו
                      </div>
                    ) : (
                      <Image
                        src={item.src || "https://placehold.co/80x80?text=VIPO"}
                        alt={product?.name || "תצוגת מוצר"}
                        fill
                        sizes="80px"
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col gap-2">
              {/* Category */}
              {product.category && (
                <Link 
                  href="/products" 
                  className="text-xs font-medium inline-block transition-colors duration-300"
                  style={{ color: '#0891b2' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1e3a8a'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0891b2'}
                >
                  {product.category}
                </Link>
              )}

              <h1 
                className="text-2xl lg:text-3xl font-bold leading-tight mb-1"
                style={{ 
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              {product.rating > 0 && (
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4"
                        style={{ color: i < Math.floor(product.rating) ? '#f59e0b' : '#d1d5db' }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-900">{product.rating}</span>
                  {product.reviews > 0 && (
                    <span className="text-sm text-gray-500">
                      ({product.reviews.toLocaleString('he-IL')})
                    </span>
                  )}
                </div>
              )}

              {/* Price Box */}
              <div className="border-t border-gray-200 pt-3 mt-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl lg:text-4xl font-bold text-red-600">
                    ₪{product.price.toLocaleString('he-IL')}
                  </span>
                  {hasDiscount && (
                    <span className="text-base line-through text-gray-400">
                      ₪{product.originalPrice.toLocaleString('he-IL')}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                {product.stockCount !== undefined && (
                  <div className="mt-2">
                    {product.stockCount > 0 ? (
                      <span className="text-sm text-green-600 font-medium">
                        ✓ במלאי ({product.stockCount} יחידות)
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 font-medium">
                        אזל מהמלאי
                      </span>
                    )}
                  </div>
                )}

                {/* Group Purchase Details */}
                {product.purchaseType === 'group' && product.groupPurchaseDetails && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm font-semibold text-blue-900 mb-2">
                      🏭 רכישה קבוצתית
                    </div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>הזמנות: {product.groupPurchaseDetails.currentQuantity || 0}/{product.groupPurchaseDetails.minQuantity}</div>
                      <div>זמן אספקה: ~{product.groupPurchaseDetails.totalDays || (product.groupPurchaseDetails.closingDays + product.groupPurchaseDetails.shippingDays)} ימים</div>
                    </div>
                  </div>
                )}

              </div>

              {/* Quantity Selector */}
              <div className="flex gap-2 items-center">
                <span className="text-xs font-medium text-gray-600">כמות:</span>
                <div className="flex rounded-md overflow-hidden border border-gray-300 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center font-semibold hover:bg-gray-100 transition"
                  >
                    −
                  </button>
                  <div className="w-10 flex items-center justify-center font-semibold text-sm border-x border-gray-300">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center font-semibold hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={handleBuyNow}
                  className="w-full text-white py-3 rounded-lg font-bold transition-all duration-300"
                  style={{ 
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                    boxShadow: '0 4px 12px rgba(8, 145, 178, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(8, 145, 178, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.3)';
                  }}
                >
                  קנה עכשיו
                </button>
                <button
                  onClick={() => addItem(product, quantity)}
                  className="w-full text-white py-3 rounded-lg font-medium transition-all duration-300"
                  style={{ 
                    background: 'white',
                    color: '#1e3a8a',
                    border: '2px solid #1e3a8a'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#1e3a8a';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  הוסף לעגלה
                </button>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && product.features.some(f => f) && (
                <div 
                  className="mt-4 rounded-xl p-5"
                  style={{
                    border: '2px solid transparent',
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    boxShadow: '0 2px 10px rgba(8, 145, 178, 0.08)'
                  }}
                >
                  <h2 className="text-lg font-bold mb-4" style={{ color: '#1e3a8a' }}>
                    תכונות עיקריות
                  </h2>
                  <ul className="space-y-3">
                    {product.features.filter(f => f).map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                        >
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="flex-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical Specs */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div 
                  className="mt-4 rounded-xl p-5"
                  style={{
                    border: '2px solid transparent',
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    boxShadow: '0 2px 10px rgba(8, 145, 178, 0.08)'
                  }}
                >
                  <h2 className="text-lg font-bold mb-4" style={{ color: '#1e3a8a' }}>
                    מפרט טכני
                  </h2>
                  <div className="bg-gradient-to-br from-blue-50/30 to-cyan-50/30 rounded-lg p-4">
                    <dl className="space-y-3">
                      {Object.entries(product.specs).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                            <dt className="text-sm font-semibold" style={{ color: '#1e3a8a' }}>{key}:</dt>
                            <dd className="text-sm font-medium text-gray-700">{value}</dd>
                          </div>
                        )
                      ))}
                    </dl>
                  </div>
                </div>
              )}

              {/* Description */}
              {product.fullDescription && (
                <div 
                  className="mt-4 rounded-xl p-5"
                  style={{
                    border: '2px solid transparent',
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    boxShadow: '0 2px 10px rgba(8, 145, 178, 0.08)'
                  }}
                >
                  <h2 className="text-lg font-bold mb-3" style={{ color: '#1e3a8a' }}>
                    תיאור המוצר
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{product.fullDescription}</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 pb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-300"
            style={{ 
              background: 'white',
              border: '2px solid #1e3a8a',
              color: '#1e3a8a',
              boxShadow: '0 2px 8px rgba(30, 58, 138, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateX(5px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#1e3a8a';
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(30, 58, 138, 0.1)';
            }}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.25 15.75L3.5 11m0 0l4.75-4.75M3.5 11h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>חזרה למוצרים</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
