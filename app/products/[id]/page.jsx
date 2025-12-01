"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
      <div
        className="min-h-screen flex items-center justify-center p-8"
        style={{ background: backgroundGradient }}
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl px-10 py-12 text-center max-w-md">
          <div className="flex items-center justify-center mb-6">
            <div className="h-14 w-14 rounded-full border-4 border-white/60 border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">טוען מוצר...</h2>
          <p className="text-gray-600">אנא המתן שנייה, אנחנו מביאים את כל הפרטים עבורך.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">מוצר לא נמצא</h1>
          <p className="text-gray-600 mb-6">המוצר שחיפשת אינו קיים במערכת</p>
          <Link href="/products" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all">
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
    <div
      className="min-h-screen p-2 sm:p-4 md:p-6"
      style={{ background: backgroundGradient }}
    >
      <div className="max-w-7xl mx-auto" style={{ color: textColor }}>

        <nav className="mb-4 text-sm">
          <div
            className="inline-flex items-center gap-2 backdrop-blur-md rounded-full px-3 py-1.5 shadow-sm text-white/90"
            style={{
              background: "rgba(255,255,255,0.18)",
              border: `1px solid ${borderSoftColor}`,
              boxShadow: "0 12px 32px rgba(15,23,42,0.12)",
            }}
          >
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link
                  href="/"
                  className="group inline-flex items-center gap-1 transition text-white/90 hover:text-white"
                >
                  <svg
                    className="w-3.5 h-3.5 text-white/70 group-hover:text-white/90"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-5h-4v5H5a1 1 0 01-1-1v-9.5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>ראשי</span>
                </Link>
              </li>
              <li className="text-white/50">/</li>
              <li>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-1 transition text-white/90 hover:text-white"
                >
                  <svg
                    className="w-3.5 h-3.5 text-white/70 group-hover:text-white/90"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M4.5 6.5h15l-.9 9.02a2 2 0 01-2 1.83H7.4a2 2 0 01-2-1.83L4.5 6.5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 10.5V6.5a3 3 0 013-3v0a3 3 0 013 3v4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>מוצרים</span>
                </Link>
              </li>
              <li className="text-white/50">/</li>
              <li className="text-white font-semibold truncate max-w-[200px]">
                {product.name}
              </li>
            </ol>
          </div>
        </nav>

        <div
          className="rounded-2xl shadow-xl border overflow-hidden backdrop-blur-sm"
          style={{
            background: cardBackground,
            borderColor: borderSoftColor,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 p-4 sm:p-6">

            <div className="lg:col-span-2">
              <div
                className={`relative ${
                  selectedMedia.type === "video"
                    ? "aspect-video"
                    : "aspect-square"
                } border rounded-2xl overflow-hidden mb-3 shadow-md`}
                style={{ borderColor: borderSoftColor, background: "rgba(15,23,42,0.05)" }}
              >
                {selectedMedia.type === "video" ? (
                  <iframe src={selectedMedia.src} className="w-full h-full" allowFullScreen />
                ) : (
                  <img src={selectedMedia.src} alt="product" className="w-full h-full object-cover" />
                )}

                {hasDiscount && (
                  <div
                    className="absolute top-4 right-4 text-white px-4 py-2 rounded-full font-bold shadow-lg"
                    style={{ background: accentColor }}
                  >
                    חיסכון {discountPercent}%
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {mediaItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedMediaIndex(i)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-transform duration-200 ${
                      i === selectedMediaIndex ? "scale-105" : "opacity-80 hover:opacity-100"
                    }`}
                    style={{
                      borderColor: i === selectedMediaIndex ? primaryColor : borderSoftColor,
                      boxShadow: i === selectedMediaIndex ? `0 10px 25px ${primaryColor}33` : undefined,
                    }}
                  >
                    {item.type === "video" ? (
                      <div className="w-full h-full bg-black/80 text-white flex items-center justify-center text-xs font-semibold tracking-wide">
                        וידאו
                      </div>
                    ) : (
                      <img src={item.src} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 p-1 sm:p-2 flex flex-cols gap-4" style={{ color: textColor }}>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{product.name}</h1>

              <div
                className="rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-sm"
                style={{
                  background: cardBackground,
                  border: `1px solid ${borderSoftColor}`,
                }}
              >
                <div className="flex items-end gap-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold" style={{ color: primaryColor }}>
                    ₪{product.price}
                  </span>
                  {hasDiscount && (
                    <span className="line-through text-gray-400">₪{product.originalPrice}</span>
                  )}
                </div>

                <div className="flex gap-3 items-center">
                  <span className="text-sm font-medium" style={{ color: textColor }}>כמות:</span>
                  <div
                    className="flex rounded-full overflow-hidden border bg-white/60 text-base"
                    style={{ borderColor: borderSoftColor }}
                  >
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center font-semibold text-lg hover:bg-black/5"
                      aria-label="הפחת פריט"
                    >
                      −
                    </button>
                    <div className="w-11 flex items-center justify-center font-semibold">
                      {quantity}
                    </div>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center font-semibold text-lg hover:bg-black/5"
                      aria-label="הוסף פריט"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full text-white py-2.5 sm:py-3 rounded-full font-semibold shadow-lg transition transform hover:-translate-y-0.5 hover:shadow-xl"
                  style={{
                    background: buttonGradient,
                    boxShadow: `0 18px 40px ${primaryColor}33`,
                  }}
                >
                  קנה עכשיו
                </button>
                <button
                  onClick={() => addItem(product, quantity)}
                  className="w-full border-2 py-2.5 sm:py-3 rounded-full font-semibold transition hover:-translate-y-0.5"
                  style={{
                    borderColor: primaryColor,
                    color: primaryColor,
                    background: "rgba(255,255,255,0.72)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = outlineHoverColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.72)")}
                >
                  הוסף לעגלה
                </button>
              </div>

              {product.fullDescription && (
                <div
                  className="rounded-2xl p-4 sm:p-5 border shadow-sm"
                  style={{
                    background: cardBackground,
                    borderColor: borderSoftColor,
                  }}
                >
                  <h2 className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>
                    תיאור
                  </h2>
                  <p>{product.fullDescription}</p>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-semibold px-4 py-2 rounded-full backdrop-blur-md shadow-sm transition"
            style={{
              color: "white",
              background: "rgba(255,255,255,0.2)",
              border: `1px solid ${borderSoftColor}`,
            }}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8.25 15.75L3.5 11m0 0l4.75-4.75M3.5 11h14"
                stroke="currentColor"
                strokeWidth="1.5"
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
