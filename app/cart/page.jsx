'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';

import { useCartContext } from '@/app/context/CartContext';
import { validateCouponClient, calculateDiscount, calculateTotal } from '@/lib/couponsClient';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    totals,
    isEmpty,
    incrementItem,
    decrementItem,
    setItemQuantity,
    removeItem,
    clearCart,
  } = useCartContext();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [user, setUser] = useState(null);
  const [showMarquee, setShowMarquee] = useState(true);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }
    fetchUser();
  }, []);

  const gradientPrimary = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
  const gradientReverse = 'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';

  const formatCurrency = (value) =>
    `₪${value.toLocaleString('he-IL', { minimumFractionDigits: 0 })}`;

  // Calculate discount using shared helper (consistent with Checkout)
  const discountPercent = appliedCoupon?.discountPercent || 0;
  const discount = useMemo(
    () => calculateDiscount(totals.subtotal, discountPercent),
    [totals.subtotal, discountPercent],
  );
  const finalTotal = useMemo(
    () => calculateTotal(totals.subtotal, discount),
    [totals.subtotal, discount],
  );

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('אנא הזן קוד קופון');
      return;
    }

    setIsApplying(true);
    setCouponError('');

    try {
      // Use real API validation (same as Checkout)
      const result = await validateCouponClient(couponCode);

      if (result.ok && result.coupon) {
        setAppliedCoupon(result.coupon);
        setCouponError('');
      } else {
        setCouponError(result.error || 'קוד קופון לא תקין');
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError('שגיאה בבדיקת הקופון');
      setAppliedCoupon(null);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  async function handleUpgradeToAgent() {
    try {
      setUpgrading(true);
      const res = await fetch('/api/users/upgrade-to-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        alert('ברכות! הפכת לסוכן בהצלחה!');
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

  if (isEmpty) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white">
        <div className="text-center space-y-4 max-w-md px-4">
          <svg
            className="w-24 h-24 mx-auto text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900">הסל שלך ריק</h1>
          <p className="text-gray-500">התחל להוסיף מוצרים</p>
          <Link
            href="/products"
            className="inline-block text-white font-medium px-6 py-3 rounded-lg transition-all duration-300"
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
            חזרה לחנות
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      {/* Marquee Banner - Only for customers */}
      {showMarquee && user?.role === 'customer' && (
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-3xl font-bold mb-1"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              סל קניות ({totals.totalQuantity})
            </h1>
            <div
              className="h-1 w-24 rounded-full"
              style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)' }}
            />
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300"
            style={{
              color: '#ef4444',
              border: '2px solid #ef4444',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ef4444';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#ef4444';
            }}
          >
            ריקון הסל
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="rounded-lg p-4 flex gap-4 transition-all duration-300"
                style={{
                  border: '2px solid transparent',
                  backgroundImage:
                    'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                  boxShadow: '0 2px 10px rgba(8, 145, 178, 0.08)',
                }}
              >
                <Image
                  src={item.image || 'https://placehold.co/120x120?text=VIPO'}
                  alt={item.name || 'Product image'}
                  width={100}
                  height={100}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
                      {item.name}
                    </h2>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-gray-400 hover:text-red-600 flex-shrink-0"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="text-base sm:text-lg font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        type="button"
                        onClick={() => decrementItem(item.productId)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 font-semibold"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-medium border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementItem(item.productId)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-6 h-fit sticky top-20 space-y-4"
            style={{
              border: '2px solid transparent',
              backgroundImage:
                'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              boxShadow: '0 4px 20px rgba(8, 145, 178, 0.15)',
            }}
          >
            <div className="mb-4">
              <h2
                className="text-2xl font-bold mb-1"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                סיכום הזמנה
              </h2>
              <div
                className="h-1 w-20 rounded-full"
                style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)' }}
              />
            </div>

            {/* Coupon Code Section */}
            <div className="border-t border-b border-gray-200 py-4">
              {!appliedCoupon ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">קוד קופון</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="הזן קוד"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isApplying}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplying}
                      className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                      style={{
                        background: isApplying
                          ? '#9CA3AF'
                          : 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                        boxShadow: isApplying ? 'none' : '0 2px 8px rgba(8, 145, 178, 0.2)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isApplying) {
                          e.currentTarget.style.background =
                            'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isApplying) {
                          e.currentTarget.style.background =
                            'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {isApplying ? '...' : 'החל'}
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-600">{couponError}</p>}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-900">{appliedCoupon.code}</p>
                      <p className="text-xs text-green-700">{discountPercent}% הנחה</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-600 hover:text-green-700"
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
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>סכום ביניים:</span>
                <span className="font-medium text-gray-900">{formatCurrency(totals.subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>הנחה ({appliedCoupon.code}):</span>
                  <span className="font-medium">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>משלוח:</span>
                <span className="font-medium text-green-600">חינם</span>
              </div>
            </div>
            <div className="border-t pt-3 flex justify-between text-base font-bold text-gray-900">
              <span>סה&quot;כ לתשלום:</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
            <button
              type="button"
              onClick={() => router.push('/checkout')}
              className="w-full text-white font-bold py-3 rounded-lg transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                boxShadow: '0 4px 12px rgba(8, 145, 178, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(8, 145, 178, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.3)';
              }}
            >
              המשך לתשלום
            </button>
            <Link
              href="/products"
              className="block w-full text-center font-medium py-3 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: 'white',
                border: '2px solid #1e3a8a',
                color: '#1e3a8a',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#1e3a8a';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              המשך לקנות
            </Link>
          </div>
        </div>
      </div>

      {/* Upgrade to Agent Modal */}
      {showAgentModal && user?.role === 'customer' && (
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
              <h4 className="font-bold mb-3 text-lg" style={{ color: '#1e3a8a' }}>
                מה תקבל כסוכן?
              </h4>
              <ul className="space-y-2" style={{ color: '#1e3a8a' }}>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: '#0891b2' }}>
                    ✓
                  </span>
                  <span>
                    <strong>עמלות של 10%</strong> על כל מכירה שתבצע
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: '#0891b2' }}>
                    ✓
                  </span>
                  <span>
                    <strong>קוד קופון ייחודי</strong> לשיתוף עם חברים
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: '#0891b2' }}>
                    ✓
                  </span>
                  <span>
                    <strong>דשבורד סוכן מתקדם</strong> עם סטטיסטיקות
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: '#0891b2' }}>
                    ✓
                  </span>
                  <span>
                    <strong>מעקב אחר הרווחים</strong> בזמן אמת
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: '#0891b2' }}>
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
                <strong>שים לב:</strong> השדרוג הוא חד-פעמי ולא ניתן לבטל אותו. לאחר השדרוג תקבל
                גישה לדשבורד הסוכנים ותוכל להתחיל להרוויח!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpgradeToAgent}
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
