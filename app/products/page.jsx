"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { getProducts } from "@/app/lib/products";
import { useCartContext } from "@/app/context/CartContext";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [videoProduct, setVideoProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const { addItem } = useCartContext();

  const primaryColor = "var(--primary)";
  const secondaryColor = "var(--secondary)";
  const accentColor = "var(--accent)";
  const gradientBackground = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${accentColor} 100%)`;

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      const list = Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data)
        ? data
        : [];
      setProducts(list);
    } catch (error) {
      console.error("Error loading products:", error);
      const fallback = getProducts();
      setProducts(fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();

    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else if (res.status === 401) {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    }

    fetchUser();
  }, [loadProducts]);

  const categoryGroups = useMemo(() => buildCategoryGroups(products), [products]);

  useEffect(() => {
    if (activeCategory === "all") {
      return;
    }

    if (!categoryGroups.some((group) => group.key === activeCategory)) {
      setActiveCategory("all");
    }
  }, [categoryGroups, activeCategory]);

  const visibleGroups = useMemo(
    () => getVisibleGroups(categoryGroups, activeCategory, products),
    [categoryGroups, activeCategory, products]
  );

  const handleDeleteProduct = useCallback(
    async (productId) => {
      if (!productId) return;

      try {
        const res = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data?.error || "שגיאה במחיקת המוצר");
          return;
        }

        setProducts((prev) => prev.filter((product) => product._id !== productId));
        await loadProducts();
        alert("המוצר נמחק בהצלחה! השינוי יוחל בכל הדפים.");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("שגיאה במחיקת המוצר");
      }
    },
    [loadProducts]
  );

  return (
    <div className="relative min-h-screen overflow-hidden p-2 sm:p-4 md:p-8" style={{ background: gradientBackground }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 right-[-12%] w-72 h-72 bg-white/25 rounded-full blur-[140px] opacity-60 animate-float-glow"></div>
        <div className="absolute -bottom-40 left-[-18%] w-96 h-96 bg-fuchsia-400/25 rounded-full blur-[180px] opacity-50 animate-float-glow-reverse"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <div
          className="absolute inset-1 sm:inset-3 md:inset-6 -z-10 rounded-[28px] sm:rounded-[36px] border border-white/20 bg-white/10 backdrop-blur-[18px] animate-glass-pulse pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 48%, rgba(255,255,255,0.18) 100%)",
            boxShadow: "0 25px 80px rgba(59,130,246,0.28)",
            mixBlendMode: "screen",
          }}
        ></div>
        <PageHeader
          primaryColor={primaryColor}
          gradientBackground={gradientBackground}
          user={user}
        />

        <CategoryFilters
          categories={categoryGroups}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
          gradientBackground={gradientBackground}
          primaryColor={primaryColor}
        />

        {videoProduct && (
          <VideoModal
            product={videoProduct}
            onClose={() => setVideoProduct(null)}
            gradientBackground={gradientBackground}
          />
        )}

        {loading ? (
          <LoadingState />
        ) : (
          <CategorySections
            groups={visibleGroups}
            addItem={addItem}
            onShowVideo={setVideoProduct}
            onDeleteProduct={handleDeleteProduct}
            gradientBackground={gradientBackground}
            primaryColor={primaryColor}
            accentColor={accentColor}
            user={user}
          />
        )}
      </div>
    </div>
  );
}

function SparkleIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 4l1.8 4.7 4.7 1.8-4.7 1.8-1.8 4.7-1.8-4.7L5.5 10.5l4.7-1.8L12 4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VideoIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 7.5A2.5 2.5 0 017.5 5h5A2.5 2.5 0 0115 7.5v9a2.5 2.5 0 01-2.5 2.5h-5A2.5 2.5 0 015 16.5v-9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 10l4-2v8l-4-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PageHeader({ primaryColor, gradientBackground, user }) {
  return (
    <div className="text-center mb-6 sm:mb-8 md:mb-12">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-8 w-full sm:w-auto inline-block">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">חנות המוצרים שלנו</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 mb-4">
          מבחר מוצרי גיימינג ואביזרים מקצועיים עם חוויית קנייה מעוצבת ונוחה.
        </p>

        {!user && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Link
              href="/register"
              className="text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg text-sm sm:text-base"
              style={{ background: gradientBackground }}
            >
              הצטרפי עכשיו - קבלי קופון מתנה
            </Link>
            <Link
              href="/login"
              className="bg-white font-semibold px-6 py-3 rounded-lg transition-all text-sm sm:text-base"
              style={{ border: `2px solid ${primaryColor}`, color: primaryColor }}
            >
              התחברי
            </Link>
          </div>
        )}

        {user && (
          <div className="mt-4 text-center">
            <p className="text-green-600 font-semibold">שלום, {user.name}!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryFilters({ categories, activeCategory, onSelect, gradientBackground, primaryColor }) {
  if (!categories.length) {
    return null;
  }

  return (
    <div className="bg-white/80 rounded-xl shadow-md p-3 sm:p-4 mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-right">
          <h2 className="text-sm sm:text-base font-semibold text-gray-800">סינון לפי קטגוריה</h2>
          <p className="text-xs sm:text-sm text-gray-500">בחרי קטגוריה כדי לראות את המוצרים שמתאימים לך.</p>
        </div>
        <div className="flex flex-nowrap space-x-2 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 px-1">
          <FilterChip
            label="כל המוצרים"
            active={activeCategory === "all"}
            onClick={() => onSelect("all")}
            gradientBackground={gradientBackground}
            primaryColor={primaryColor}
          />
          {categories.map((category) => (
            <FilterChip
              key={category.key}
              label={category.label}
              active={activeCategory === category.key}
              onClick={() => onSelect(category.key)}
              gradientBackground={gradientBackground}
              primaryColor={primaryColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick, gradientBackground, primaryColor }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-all border whitespace-nowrap snap-start ${
        active ? "text-white shadow-lg" : "text-gray-700 bg-white"
      }`}
      style={{
        background: active
          ? gradientBackground
          : "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.75))",
        borderColor: primaryColor,
      }}
    >
      {label}
    </button>
  );
}

function VideoModal({ product, onClose, gradientBackground }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {product.name} - סרטון הדגמה
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            aria-label="סגור וידאו"
          >
            ✕
          </button>
        </div>
        <div className="aspect-video bg-black">
          <iframe
            key={product._id}
            src={product.videoUrl}
            title={product.name}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="px-4 py-3 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg"
            style={{ background: gradientBackground }}
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
    </div>
  );
}

function CategorySections({
  groups,
  addItem,
  onShowVideo,
  onDeleteProduct,
  gradientBackground,
  primaryColor,
  accentColor,
  user,
}) {
  if (!groups.length) {
    return (
      <div className="text-center text-white/80 text-sm sm:text-base">
        אין מוצרים להצגה כרגע.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <section key={group.key} className="bg-white/80 rounded-2xl shadow-xl p-4 sm:p-6">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold" style={{ background: gradientBackground, color: "#fff" }}>
              <SparkleIcon className="w-4 h-4" />
              {group.label}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 text-right">
              {group.products.length} מוצרים בקטגוריה זו
            </p>
          </header>

          <div className="grid grid-cols-2 max-[380px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {group.products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                addItem={addItem}
                onShowVideo={onShowVideo}
                onDelete={onDeleteProduct}
                gradientBackground={gradientBackground}
                primaryColor={primaryColor}
                accentColor={accentColor}
                user={user}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ProductCard({
  product,
  addItem,
  onShowVideo,
  onDelete,
  gradientBackground,
  primaryColor,
  accentColor,
  user,
}) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105">
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

      <div className="p-3 sm:p-4 md:p-6">
        <div className="text-xs font-semibold mb-1 sm:mb-2 uppercase" style={{ color: primaryColor }}>
          {product.catalog?.name || product.category}
        </div>

        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="text-lg"
                style={{ color: i < Math.floor(product.rating) ? accentColor : "#d1d5db" }}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews} ביקורות)
          </span>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {(product.features || []).slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: accentColor, color: "#ffffff" }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold" style={{ color: primaryColor }}>
              ₪{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">₪{product.originalPrice}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/products/${product._id}`}
            className="bg-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all text-center text-sm sm:text-base"
            style={{ border: `2px solid ${primaryColor}`, color: primaryColor }}
          >
            צפה במוצר
          </Link>
          <button
            type="button"
            onClick={() => addItem(product, 1)}
            className="text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all text-center shadow-lg text-sm sm:text-base"
            style={{ background: gradientBackground }}
          >
            הוסף לסל
          </button>
        </div>

        {product.videoUrl && (
          <button
            onClick={() => onShowVideo(product)}
            className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <VideoIcon className="w-4 h-4" />
            צפה בסרטון מוצר
          </button>
        )}

        {user?.role === "admin" && (
          <div className="flex gap-2 mt-3">
            <Link
              href={`/admin/products/${encodeURIComponent(product._id || product.legacyId || product.id)}/edit`}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2 rounded-lg transition-all text-center"
            >
              ערוך
            </Link>
            <button
              onClick={() => {
                if (confirm("האם למחוק את המוצר?")) {
                  onDelete(product._id);
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
  );
}

function buildCategoryGroups(list) {
  const map = new Map();

  list.forEach((product) => {
    const raw = (product.category || "אחר").trim();
    const key = raw.toLowerCase();

    if (!map.has(key)) {
      map.set(key, {
        key,
        label: raw,
        products: [],
      });
    }

    map.get(key).products.push(product);
  });

  const groups = Array.from(map.values()).map((group) => ({
    ...group,
    products: group.products.sort((a, b) => a.name.localeCompare(b.name, "he")),
  }));

  return groups.sort((a, b) => a.label.localeCompare(b.label, "he"));
}

function getVisibleGroups(groups, activeKey, fallbackList) {
  if (!groups.length) {
    return [
      {
        key: "all",
        label: "כל המוצרים",
        products: fallbackList,
      },
    ];
  }

  if (activeKey === "all") {
    return groups;
  }

  const filtered = groups.filter((group) => group.key === activeKey);
  return filtered.length ? filtered : groups;
}
