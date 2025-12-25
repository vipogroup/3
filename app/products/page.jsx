'use client';

export const dynamic = 'force-dynamic';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { getProducts } from '@/app/lib/products';
import { useCartContext } from '@/app/context/CartContext';
import {
  isGroupPurchase,
  getGroupTimeRemaining,
  formatGroupCountdown,
} from '@/app/lib/groupPurchase';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [videoProduct, setVideoProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showMarquee, setShowMarquee] = useState(true);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});
  const { addItem } = useCartContext();

  const primaryColor = '#1e3a8a'; // כחול נייבי
  const secondaryColor = '#0891b2'; // טורקיז
  const accentColor = '#06b6d4'; // טורקיז בהיר
  const gradientPrimary = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
  const gradientReverse = 'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
  const warningColor = '#f59e0b'; // כתום לתגיות והנחות

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await res.json();
      const list = Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : [];
      setProducts(list);
    } catch (error) {
      console.error('Error loading products:', error);
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
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else if (res.status === 401) {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      }
    }

    fetchUser();
  }, [loadProducts]);

  const categoryGroups = useMemo(() => buildCategoryGroups(products), [products]);

  useEffect(() => {
    if (activeCategory === 'all') {
      return;
    }

    if (!categoryGroups.some((group) => group.key === activeCategory)) {
      setActiveCategory('all');
    }
  }, [categoryGroups, activeCategory]);

  const visibleGroups = useMemo(
    () => getVisibleGroups(categoryGroups, activeCategory, products),
    [categoryGroups, activeCategory, products],
  );

  const handleDeleteProduct = useCallback(
    async (productId) => {
      if (!productId) return;

      try {
        const res = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data?.error || 'שגיאה במחיקת המוצר');
          return;
        }

        setProducts((prev) => prev.filter((product) => product._id !== productId));
        await loadProducts();
        alert('המוצר נמחק בהצלחה! השינוי יוחל בכל הדפים.');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('שגיאה במחיקת המוצר');
      }
    },
    [loadProducts],
  );

  async function handleUpgradeToAgent() {
    try {
      setUpgrading(true);
      const res = await fetch('/api/users/upgrade-to-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        alert('🎉 ברכות! הפכת לסוכן בהצלחה!');
        window.location.href = '/agent';
      } else {
        const data = await res.json();
        alert('שגיאה: ' + (data.error || 'לא ניתן לשדרג לסוכן'));
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('שגיאה בשדרוג לסוכן');
    } finally {
      setUpgrading(false);
      setShowAgentModal(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      {/* Marquee Banner - For customers and guests */}
      {showMarquee && (!user || user?.role === 'customer') && (
        <div
          className="relative overflow-hidden py-3 cursor-pointer"
          style={{ background: gradientPrimary }}
          onClick={() => setShowAgentModal(true)}
        >
          <div className="marquee-container">
            <div className="marquee-content">
              <div className="flex items-center gap-3 whitespace-nowrap">
                <span className="flex items-center gap-2 text-white font-bold text-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                  </svg>
                  רוצים להרוויח כסף?
                </span>
                <span className="text-white text-base">•</span>
                <span className="text-white font-semibold text-lg">
                  הפכו לסוכן וקבלו 10% עמלה על כל מכירה!
                </span>
                <span className="text-white text-base">•</span>
                <span className="bg-white text-blue-900 px-4 py-1 rounded-full font-bold text-sm">
                  לחצו כאן להצטרפות
                </span>
                <span className="text-white text-base">•</span>
              </div>
            </div>
            <div className="marquee-content" aria-hidden="true">
              <div className="flex items-center gap-3 whitespace-nowrap">
                <span className="flex items-center gap-2 text-white font-bold text-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                  </svg>
                  רוצים להרוויח כסף?
                </span>
                <span className="text-white text-base">•</span>
                <span className="text-white font-semibold text-lg">
                  הפכו לסוכן וקבלו 10% עמלה על כל מכירה!
                </span>
                <span className="text-white text-base">•</span>
                <span className="bg-white text-blue-900 px-4 py-1 rounded-full font-bold text-sm">
                  לחצו כאן להצטרפות
                </span>
                <span className="text-white text-base">•</span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMarquee(false);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            aria-label="סגור"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <style jsx>{`
        .marquee-container {
          display: flex;
          animation: marquee 15s linear infinite;
        }
        .marquee-content {
          display: flex;
          flex-shrink: 0;
          min-width: 100%;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(50%);
          }
        }
        .marquee-container:hover {
          animation-play-state: paused;
        }
      `}</style>

      <CategoryFilters
        categories={categoryGroups}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
        gradientBackground={gradientPrimary}
        primaryColor={primaryColor}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {videoProduct && (
          <VideoModal
            product={videoProduct}
            onClose={() => setVideoProduct(null)}
            gradientBackground={gradientPrimary}
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
            gradientBackground={gradientPrimary}
            primaryColor={primaryColor}
            accentColor={accentColor}
            user={user}
            addedToCart={addedToCart}
            setAddedToCart={setAddedToCart}
          />
        )}
      </div>

      {/* Upgrade to Agent Modal */}
      {showAgentModal && (!user || user?.role === 'customer') && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="text-center mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: gradientPrimary }}
              >
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">הפוך לסוכן!</h3>
              <p className="text-gray-600">צור הכנסה פאסיבית על ידי שיתוף מוצרים</p>
            </div>

            <div
              className="rounded-xl p-6 mb-6"
              style={{
                background:
                  'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)',
                border: '2px solid rgba(8, 145, 178, 0.3)',
              }}
            >
              <h4 className="font-bold mb-3 text-lg" style={{ color: primaryColor }}>
                מה תקבל כסוכן?
              </h4>
              <ul className="space-y-2" style={{ color: primaryColor }}>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>
                    ✓
                  </span>
                  <span>
                    <strong>עמלות של 10%</strong> על כל מכירה שתבצע
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>
                    ✓
                  </span>
                  <span>
                    <strong>קוד קופון ייחודי</strong> לשיתוף עם חברים
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>
                    ✓
                  </span>
                  <span>
                    <strong>דשבורד סוכן מתקדם</strong> עם סטטיסטיקות
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>
                    ✓
                  </span>
                  <span>
                    <strong>מעקב אחר הרווחים</strong> בזמן אמת
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>
                    ✓
                  </span>
                  <span>
                    <strong>בונוסים ותגמולים</strong> למוכרים מצטיינים
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>שים לב:</strong>{' '}
                {!user
                  ? 'תצטרך להירשם כדי להפוך לסוכן. '
                  : 'השדרוג הוא חד-פעמי ולא ניתן לבטל אותו. '}
                לאחר {!user ? 'ההרשמה' : 'השדרוג'} תקבל גישה לדשבורד הסוכנים ותוכל להתחיל להרוויח!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (!user) {
                    // Redirect to register as agent
                    window.location.href = '/register?role=agent';
                  } else {
                    handleUpgradeToAgent();
                  }
                }}
                disabled={upgrading}
                className="flex-1 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: gradientPrimary }}
                onMouseEnter={(e) => {
                  if (!upgrading) e.currentTarget.style.background = gradientReverse;
                }}
                onMouseLeave={(e) => {
                  if (!upgrading) e.currentTarget.style.background = gradientPrimary;
                }}
              >
                {upgrading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    משדרג...
                  </span>
                ) : !user ? (
                  'הירשם כסוכן עכשיו!'
                ) : (
                  'כן, אני רוצה להפוך לסוכן!'
                )}
              </button>
              <button
                onClick={() => setShowAgentModal(false)}
                disabled={upgrading}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-all disabled:opacity-50"
              >
                אולי מאוחר יותר
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SparkleIcon({ className = 'w-4 h-4' }) {
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

function VideoIcon({ className = 'w-4 h-4' }) {
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
  return null; // Removed - cleaner design
}

function CategoryFilters({
  categories,
  activeCategory,
  onSelect,
  gradientBackground,
  primaryColor,
}) {
  if (!categories.length) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: '#1e3a8a' }}>
            סינון לפי קטגוריה:
          </span>
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => onSelect(e.target.value)}
              className="appearance-none bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium cursor-pointer transition-all duration-300"
              style={{
                border: '2px solid transparent',
                backgroundImage:
                  'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                color: '#1e3a8a',
                minWidth: '200px',
                boxShadow: '0 2px 8px rgba(8, 145, 178, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(8, 145, 178, 0.1)';
              }}
            >
              <option value="all">כל הקטגוריות</option>
              {categories.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.label}
                </option>
              ))}
            </select>
            <div
              className="pointer-events-none absolute inset-y-0 left-3 flex items-center"
              style={{ color: '#0891b2' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoModal({ product, onClose, gradientBackground }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div
        className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden"
        style={{
          border: '2px solid transparent',
          backgroundImage:
            'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 8px 30px rgba(8, 145, 178, 0.3)',
        }}
      >
        <div
          className="flex justify-between items-center px-4 py-3"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
          }}
        >
          <h2 className="text-lg font-semibold text-white">{product.name}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white transition-all duration-300"
            style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
            aria-label="סגור"
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
        <div className="px-4 py-3 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              boxShadow: '0 2px 8px rgba(8, 145, 178, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(8, 145, 178, 0.2)';
            }}
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
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"
        style={{
          borderTopColor: '#1e3a8a',
          borderBottomColor: '#0891b2',
        }}
      ></div>
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
  addedToCart,
  setAddedToCart,
}) {
  if (!groups.length) {
    return <div className="text-center text-gray-500 py-12">אין מוצרים להצגה</div>;
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.key}>
          {group.key !== 'all' && (
            <CategoryHeader group={group} />
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
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
                addedToCart={addedToCart}
                setAddedToCart={setAddedToCart}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CategoryHeader({ group }) {
  const computeTimeLeft = useCallback(() => {
    const products = group.products?.filter((p) => isGroupPurchase(p)) ?? [];
    if (!products.length) {
      return null;
    }

    const now = Date.now();
    let best = null;

    products.forEach((product) => {
      const info = getGroupTimeRemaining(product, now);
      if (info && !info.expired) {
        if (!best || info.totalMs < best.totalMs) {
          best = info;
        }
      }
    });

    return best;
  }, [group.products]);

  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft());

  useEffect(() => {
    const tick = () => setTimeLeft(computeTimeLeft());
    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, [computeTimeLeft]);

  const countdownLabel = timeLeft ? formatGroupCountdown(timeLeft) : '';
  const hasGroupProducts = Boolean(timeLeft);

  return (
    <header className="mb-6 text-center space-y-2">
      <h2
        className="text-xl font-bold inline-block relative"
        style={{ color: '#1e3a8a' }}
      >
        {group.label}
        <div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 rounded-full"
          style={{
            width: '80px',
            background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 50%, #1e3a8a 100%)',
          }}
        />
      </h2>

      {hasGroupProducts && countdownLabel && (
        <p className="text-sm font-semibold" style={{ color: '#0891b2' }}>
          {countdownLabel}
        </p>
      )}
    </header>
  );
}

function GroupBadge() {
  return (
    <span
      className="absolute right-2 bottom-2 text-xs font-semibold px-2 py-1 rounded-md shadow"
      style={{
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(8, 145, 178, 0.95) 100%)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.35)',
      }}
    >
      רכישה קבוצתית
    </span>
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
  addedToCart,
  setAddedToCart,
}) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const [groupCountdown, setGroupCountdown] = useState(() => {
    if (!isGroupPurchase(product)) return '';
    const info = getGroupTimeRemaining(product);
    return info ? formatGroupCountdown(info) : '';
  });

  useEffect(() => {
    if (!isGroupPurchase(product)) {
      setGroupCountdown('');
      return;
    }

    const update = () => {
      const info = getGroupTimeRemaining(product);
      setGroupCountdown(info ? formatGroupCountdown(info) : '');
    };

    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [product]);

  return (
    <div
      className="bg-white rounded-lg overflow-hidden group h-full flex flex-col transition-all duration-300"
      style={{
        border: '2px solid transparent',
        backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        boxShadow: '0 4px 15px rgba(8, 145, 178, 0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(8, 145, 178, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(8, 145, 178, 0.1)';
      }}
    >
      {/* Image Container */}
      <Link href={`/products/${product._id}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image || 'https://placehold.co/600x600?text=VIPO'}
            alt={product.name || 'מוצר'}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={false}
            loading="lazy"
            unoptimized
          />

          {/* Badges */}
          {discountPercent > 0 && (
            <div
              className="absolute top-2 right-2 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                transform: 'rotate(-8deg)',
              }}
            >
              -{discountPercent}%
            </div>
          )}

          {isGroupPurchase(product) && <GroupBadge />}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Product Title */}
        <Link href={`/products/${product._id}`}>
          <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 leading-tight min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-3 h-3"
                style={{ color: i < Math.floor(product.rating || 4.5) ? '#f59e0b' : '#d1d5db' }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({(product.reviews || Math.floor(Math.random() * 500) + 50).toLocaleString('he-IL')})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3 mt-auto">
          {product.originalPrice ? (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg font-bold line-through text-gray-400">
                ₪{product.originalPrice.toLocaleString('he-IL')}
              </span>
              <span className="text-2xl font-bold" style={{ color: '#16a34a' }}>
                ₪{product.price.toLocaleString('he-IL')}
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              ₪{product.price.toLocaleString('he-IL')}
            </span>
          )}
        </div>

        {isGroupPurchase(product) && groupCountdown && (
          <div className="mb-2 text-xs font-semibold" style={{ color: '#0891b2' }}>
            {groupCountdown}
          </div>
        )}

        {/* Add to Cart Button */}
        {!addedToCart?.[product._id] ? (
          <button
            type="button"
            onClick={() => {
              addItem(product, 1);
              setAddedToCart((prev) => ({ ...prev, [product._id]: true }));
            }}
            className="w-full text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              boxShadow: '0 2px 8px rgba(8, 145, 178, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(8, 145, 178, 0.2)';
            }}
          >
            הוסף לסל
          </button>
        ) : (
          <Link
            href="/cart"
            className="w-full text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-300 block text-center"
            style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.2)';
            }}
          >
            מעבר לסל ✓
          </Link>
        )}

        {/* Admin Buttons */}
        {user?.role === 'admin' && (
          <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200">
            <Link
              href={`/admin/products/${encodeURIComponent(product._id || product.legacyId || product.id)}/edit`}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1.5 rounded text-center"
            >
              ערוך
            </Link>
            <button
              onClick={() => {
                if (confirm('האם למחוק את המוצר?')) {
                  onDelete(product._id);
                }
              }}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-1.5 rounded"
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
    const raw = (product.category || 'אחר').trim();
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
    products: group.products.sort((a, b) => a.name.localeCompare(b.name, 'he')),
  }));

  return groups.sort((a, b) => a.label.localeCompare(b.label, 'he'));
}

function getVisibleGroups(groups, activeKey, fallbackList) {
  if (!groups.length) {
    return [
      {
        key: 'all',
        label: 'כל המוצרים',
        products: fallbackList,
      },
    ];
  }

  if (activeKey === 'all') {
    return groups;
  }

  const filtered = groups.filter((group) => group.key === activeKey);
  return filtered.length ? filtered : groups;
}
