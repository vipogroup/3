'use client';

export const dynamic = 'force-dynamic';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get('type'); // 'available', 'group', or null (all)
  
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
  
  // Filter products by type
  const filteredProducts = useMemo(() => {
    if (!typeFilter) return products;
    if (typeFilter === 'available') {
      return products.filter(p => !isGroupPurchase(p));
    }
    if (typeFilter === 'group') {
      return products.filter(p => isGroupPurchase(p));
    }
    return products;
  }, [products, typeFilter]);

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

  const categoryGroups = useMemo(() => buildCategoryGroups(filteredProducts), [filteredProducts]);

  useEffect(() => {
    if (activeCategory === 'all') {
      return;
    }

    if (!categoryGroups.some((group) => group.key === activeCategory)) {
      setActiveCategory('all');
    }
  }, [categoryGroups, activeCategory]);

  const visibleGroups = useMemo(
    () => getVisibleGroups(categoryGroups, activeCategory, filteredProducts),
    [categoryGroups, activeCategory, filteredProducts],
  );
  
  // Page title based on filter
  const pageTitle = useMemo(() => {
    if (typeFilter === 'available') return 'מוצרים זמינים עכשיו';
    if (typeFilter === 'group') return 'רכישה קבוצתית';
    return 'כל המוצרים';
  }, [typeFilter]);

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
    <div 
      className="min-h-[calc(100vh-64px)]"
      style={{
        background: typeFilter === 'group'
          ? 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)'
          : 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
      }}
    >
      {/* Marquee Banner - For customers and guests */}
      {showMarquee && (!user || user?.role === 'customer') && (
        <div
          className="relative overflow-hidden py-3 cursor-pointer"
          style={{ background: gradientPrimary }}
          onClick={() => setShowAgentModal(true)}
        >
          <div className="marquee-container">
            <div className="marquee-content">
              <div className="flex items-center gap-4 whitespace-nowrap">
                <span className="text-white font-bold text-lg">
                  רוצים להרוויח כסף?
                </span>
                <span className="text-white font-semibold text-lg">
                  הפכו לסוכן וקבלו 10% עמלה על כל מכירה!
                </span>
                <span className="bg-white text-blue-900 px-4 py-1 rounded-full font-bold text-sm">
                  לחצו כאן להצטרפות
                </span>
              </div>
            </div>
            <div className="marquee-content" aria-hidden="true">
              <div className="flex items-center gap-4 whitespace-nowrap">
                <span className="text-white font-bold text-lg">
                  רוצים להרוויח כסף?
                </span>
                <span className="text-white font-semibold text-lg">
                  הפכו לסוכן וקבלו 10% עמלה על כל מכירה!
                </span>
                <span className="bg-white text-blue-900 px-4 py-1 rounded-full font-bold text-sm">
                  לחצו כאן להצטרפות
                </span>
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
          animation: marquee 10s linear infinite;
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

      {/* Page Header with Back Button */}
      {typeFilter && (
        <div 
          className="border-b"
          style={{ 
            background: typeFilter === 'group' 
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/shop"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span>חזרה לחנות</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 
                className="text-xl font-bold"
                style={{ 
                  color: typeFilter === 'group' ? '#f59e0b' : '#1e3a8a',
                }}
              >
                {typeFilter === 'group' && (
                  <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
                {typeFilter === 'available' && (
                  <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                )}
                {pageTitle}
              </h1>
            </div>
          </div>
        </div>
      )}

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
    <div className="border-b border-gray-200/50" style={{ background: 'transparent' }}>
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

    </header>
  );
}

function GroupBadge() {
  return (
    <span
      className="absolute right-2 bottom-2 text-xs font-semibold px-2 py-1 rounded-md shadow"
      style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        color: 'white',
      }}
    >
      קבוצתית
    </span>
  );
}

function GroupTimer({ product }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = product.groupPurchaseDetails?.endDate;
      if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const diff = end - now;
      
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [product]);

  return (
    <div className="flex items-center justify-center gap-1">
      <div className="flex items-center gap-0.5">
        <div className="flex flex-col items-center">
          <span 
            className="text-sm font-bold text-white px-1.5 py-0.5 rounded"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-gray-500">שניות</span>
        </div>
        <span className="text-gray-400 font-bold">:</span>
        <div className="flex flex-col items-center">
          <span 
            className="text-sm font-bold text-white px-1.5 py-0.5 rounded"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-gray-500">דקות</span>
        </div>
        <span className="text-gray-400 font-bold">:</span>
        <div className="flex flex-col items-center">
          <span 
            className="text-sm font-bold text-white px-1.5 py-0.5 rounded"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-gray-500">שעות</span>
        </div>
        <span className="text-gray-400 font-bold">:</span>
        <div className="flex flex-col items-center">
          <span 
            className="text-sm font-bold text-white px-1.5 py-0.5 rounded"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}
          >
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-gray-500">ימים</span>
        </div>
      </div>
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

  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden group h-full flex flex-col transition-all duration-300"
      style={{
        border: '2px solid transparent',
        backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        boxShadow: '0 4px 15px rgba(8, 145, 178, 0.15)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(8, 145, 178, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(8, 145, 178, 0.15)';
      }}
    >
      {/* Image Container */}
      <Link href={`/products/${product._id}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-t-xl">
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

          {/* Heart/Favorites Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: isFavorite ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
            aria-label={isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
          >
            <svg
              className="w-4 h-4"
              fill={isFavorite ? 'white' : 'none'}
              stroke={isFavorite ? 'white' : '#6b7280'}
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div
              className="absolute top-2 right-2 text-white px-2 py-1 rounded-md text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
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
          <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2 hover:text-cyan-600 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-3">
          {product.originalPrice ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span 
                className="text-2xl font-black"
                style={{ 
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ₪{product.price.toLocaleString('he-IL')}
              </span>
              <span className="text-sm line-through text-gray-400">
                ₪{product.originalPrice.toLocaleString('he-IL')}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              ₪{product.price.toLocaleString('he-IL')}
            </span>
          )}
        </div>

        {/* Group Purchase - Combined Card */}
        {isGroupPurchase(product) && (
          <div 
            className="mb-3 p-3 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            {/* Title */}
            <div className="flex items-center gap-1 mb-2">
              <svg className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-xs font-bold" style={{ color: '#d97706' }}>מבצע נסגר בעוד:</span>
            </div>
            
            {/* Timer */}
            <GroupTimer product={product} />
            
            {/* Divider */}
            <div className="h-px my-2" style={{ background: 'rgba(245, 158, 11, 0.3)' }} />
            
            {/* Progress */}
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-bold" style={{ color: '#d97706' }}>
                {product.groupPurchaseDetails?.currentQuantity || 0}/{product.groupPurchaseDetails?.minQuantity || 10} נרשמו
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2.5 bg-white rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, ((product.groupPurchaseDetails?.currentQuantity || 0) / (product.groupPurchaseDetails?.minQuantity || 10)) * 100)}%`,
                    background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
                  }}
                />
              </div>
              <span className="text-xs font-bold" style={{ color: '#d97706' }}>
                {Math.round(((product.groupPurchaseDetails?.currentQuantity || 0) / (product.groupPurchaseDetails?.minQuantity || 10)) * 100)}%
              </span>
            </div>
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
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold transition-all duration-300 text-white"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              boxShadow: '0 4px 15px rgba(8, 145, 178, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(8, 145, 178, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(8, 145, 178, 0.3)';
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            הוסף לסל
          </button>
        ) : (
          <Link
            href="/cart"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              color: 'white',
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            מעבר לסל
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
