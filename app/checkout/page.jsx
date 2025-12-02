'use client';

import { Suspense, useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { useCartContext } from '@/app/context/CartContext';

function CheckoutFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center text-gray-600">טוען עמוד התשלום…</div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutClient />
    </Suspense>
  );
}

function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, totals, isEmpty, hydrated, clearCart } = useCartContext();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [openSections, setOpenSections] = useState({ 1: true, 2: false, 3: false });
  const [expandAll, setExpandAll] = useState(false);

  const toggleSection = (section) => {
    if (expandAll) return; // Don't toggle if expand all is active
    setOpenSections((prev) => ({
      1: section === 1,
      2: section === 2,
      3: section === 3,
    }));
  };

  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
    if (!expandAll) {
      setOpenSections({ 1: true, 2: true, 3: true });
    } else {
      setOpenSections({ 1: true, 2: false, 3: false });
    }
  };
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'credit_card',
    agreeToTerms: false,
  });

  const gradientStyle = useMemo(
    () => ({
      background:
        'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
    }),
    [],
  );

  const steps = [
    { number: 1, title: 'פרטים אישיים', icon: 'user' },
    { number: 2, title: 'כתובת משלוח', icon: 'location' },
    { number: 3, title: 'אמצעי תשלום', icon: 'payment' },
    { number: 4, title: 'סיכום ואישור', icon: 'check' },
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName || !formData.email || !formData.phone) {
          setError('נא למלא את כל השדות');
          return false;
        }
        break;
      case 2:
        if (!formData.address || !formData.city || !formData.zipCode) {
          setError('נא למלא את כל שדות הכתובת');
          return false;
        }
        break;
      case 3:
        if (!formData.paymentMethod) {
          setError('נא לבחור אמצעי תשלום');
          return false;
        }
        break;
      case 4:
        if (!formData.agreeToTerms) {
          setError('יש לאשר את התנאים לפני התשלום');
          return false;
        }
        break;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  useEffect(() => {
    if (!hydrated) return;
    if (isEmpty) {
      router.replace('/cart');
      return;
    }

    async function loadUser() {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setFormData((prev) => ({
            ...prev,
            fullName: data.user.fullName || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
          }));
        } else if (res.status === 401) {
          router.replace('/login');
        }
      } catch (err) {
        console.error('Failed to load user', err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [hydrated, isEmpty, router]);

  const handleApplyCoupon = useCallback(
    async (codeOverride) => {
      const code = (codeOverride ?? couponInput).trim();
      if (!code) {
        setCouponError('נא להזין קוד קופון');
        return;
      }

      setApplyingCoupon(true);
      setCouponError('');

      try {
        const res = await fetch('/api/coupons/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) {
          setAppliedCoupon(null);
          const data = await res.json().catch(() => ({}));
          throw new Error(
            data.error === 'coupon_not_found'
              ? 'קופון לא נמצא או אינו פעיל'
              : 'אירעה שגיאה באימות הקופון',
          );
        }

        const data = await res.json();
        setAppliedCoupon(data.coupon);
        setCouponError('');
      } catch (err) {
        setCouponError(err.message || 'קופון לא תקף');
      } finally {
        setApplyingCoupon(false);
      }
    },
    [couponInput],
  );

  useEffect(() => {
    if (!hydrated) return;
    const couponParam = searchParams?.get('coupon');
    if (couponParam && !appliedCoupon) {
      setCouponInput(couponParam);
      handleApplyCoupon(couponParam);
    }
  }, [appliedCoupon, handleApplyCoupon, hydrated, searchParams]);

  const discountPercent = appliedCoupon?.discountPercent || 0;
  const discountAmount = useMemo(() => {
    if (!totals?.subtotal || !discountPercent) return 0;
    return Number(((totals.subtotal * discountPercent) / 100).toFixed(2));
  }, [totals?.subtotal, discountPercent]);

  const grandTotal = useMemo(() => {
    if (!totals?.subtotal) return 0;
    return Math.max(0, totals.subtotal - discountAmount);
  }, [totals?.subtotal, discountAmount]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.agreeToTerms) {
      setError('יש לאשר את התנאים לפני התשלום');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
        totals: {
          subtotal: totals.subtotal,
          discountPercent,
          discountAmount,
          total: grandTotal,
        },
        total: grandTotal,
        discountAmount,
        paymentMethod: formData.paymentMethod,
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        coupon: appliedCoupon
          ? {
              code: appliedCoupon.code,
              discountPercent: appliedCoupon.discountPercent,
              commissionPercent: appliedCoupon.commissionPercent,
              agentId: appliedCoupon.agentId,
              discountAmount,
            }
          : null,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'שגיאה ביצירת הזמנה');
      }

      const data = await res.json();
      clearCart();
      alert(`✅ ההזמנה בוצעה בהצלחה!\nמספר הזמנה: ${data.orderId}`);
      router.push('/customer');
    } catch (err) {
      console.error('Checkout error', err);
      setError(err.message || 'שגיאה בביצוע ההזמנה');
    } finally {
      setProcessing(false);
    }
  };

  if (!hydrated || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div
          className="bg-white rounded-xl p-8"
          style={{
            border: '2px solid transparent',
            backgroundImage:
              'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 4px 20px rgba(8, 145, 178, 0.15)',
          }}
        >
          <div
            className="animate-spin rounded-full h-12 w-12 mx-auto"
            style={{
              border: '4px solid rgba(8, 145, 178, 0.2)',
              borderTopColor: '#0891b2',
            }}
          ></div>
          <p className="text-gray-600 mt-4 text-center font-medium">טוען...</p>
        </div>
      </div>
    );
  }

  if (isEmpty) return null; // redirect handled above

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back to Cart Button - Top Left */}
        <div className="mb-4">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(8, 145, 178, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            חזרה לסל
          </Link>
        </div>

        <div
          className="bg-white rounded-xl p-4 sm:p-6 mb-6"
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
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              אימות ותשלום
            </h1>
            <div
              className="h-1 w-24 rounded-full mb-3"
              style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)' }}
            />
            <div className="flex items-center gap-3 flex-wrap">
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)',
                  color: '#1e3a8a',
                  border: '1px solid rgba(8, 145, 178, 0.3)',
                }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                תשלום מאובטח SSL
              </div>
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)',
                  color: '#1e3a8a',
                  border: '1px solid rgba(8, 145, 178, 0.3)',
                }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                מאומת בטוח
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-4 sm:p-6 lg:col-span-2 space-y-6 order-2 lg:order-1"
            style={{
              border: '2px solid transparent',
              backgroundImage:
                'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              boxShadow: '0 4px 20px rgba(8, 145, 178, 0.15)',
            }}
          >
            {/* Expand All Button */}
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={toggleExpandAll}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                style={{
                  backgroundColor: expandAll
                    ? 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)'
                    : 'white',
                  border: '2px solid #1e3a8a',
                  color: expandAll ? 'white' : '#1e3a8a',
                  background: expandAll
                    ? 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)'
                    : 'white',
                }}
              >
                {expandAll ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                    כווץ הכל
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    פתח הכל
                  </>
                )}
              </button>
            </div>

            <section
              className="border-2 rounded-xl p-4"
              style={{
                borderColor: openSections[1] || expandAll ? '#0891b2' : '#e5e7eb',
                background:
                  openSections[1] || expandAll
                    ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)'
                    : 'white',
              }}
            >
              <button
                type="button"
                onClick={() => toggleSection(1)}
                className="w-full flex items-center justify-between mb-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        openSections[1] || expandAll
                          ? 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)'
                          : '#e5e7eb',
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: openSections[1] || expandAll ? 'white' : '#9ca3af' }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h2
                    className="text-xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    פרטים אישיים
                  </h2>
                </div>
                <svg
                  className="w-6 h-6 transition-transform duration-300"
                  style={{
                    transform: openSections[1] || expandAll ? 'rotate(180deg)' : 'rotate(0deg)',
                    color: '#1e3a8a',
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {(openSections[1] || expandAll) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      שם מלא *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                      placeholder="דני ישראלי"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      אימייל *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      טלפון *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                      placeholder="050-1234567"
                    />
                  </div>
                </div>
              )}
            </section>

            <section
              className="border-2 rounded-xl p-4"
              style={{
                borderColor: openSections[2] || expandAll ? '#0891b2' : '#e5e7eb',
                background:
                  openSections[2] || expandAll
                    ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)'
                    : 'white',
              }}
            >
              <button
                type="button"
                onClick={() => toggleSection(2)}
                className="w-full flex items-center justify-between mb-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        openSections[2] || expandAll
                          ? 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)'
                          : '#e5e7eb',
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: openSections[2] || expandAll ? 'white' : '#9ca3af' }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <h2
                    className="text-xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    כתובת למשלוח
                  </h2>
                </div>
                <svg
                  className="w-6 h-6 transition-transform duration-300"
                  style={{
                    transform: openSections[2] || expandAll ? 'rotate(180deg)' : 'rotate(0deg)',
                    color: '#1e3a8a',
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {(openSections[2] || expandAll) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      כתובת מלאה *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                      placeholder="רחוב הרצל 123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">עיר *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                      placeholder="תל אביב"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      מיקוד *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                      placeholder="1234567"
                    />
                  </div>
                </div>
              )}
            </section>

            <section
              className="border-2 rounded-xl p-4"
              style={{
                borderColor: openSections[3] || expandAll ? '#0891b2' : '#e5e7eb',
                background:
                  openSections[3] || expandAll
                    ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)'
                    : 'white',
              }}
            >
              <button
                type="button"
                onClick={() => toggleSection(3)}
                className="w-full flex items-center justify-between mb-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        openSections[3] || expandAll
                          ? 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)'
                          : '#e5e7eb',
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: openSections[3] || expandAll ? 'white' : '#9ca3af' }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h2
                    className="text-xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    אמצעי תשלום
                  </h2>
                </div>
                <svg
                  className="w-6 h-6 transition-transform duration-300"
                  style={{
                    transform: openSections[3] || expandAll ? 'rotate(180deg)' : 'rotate(0deg)',
                    color: '#1e3a8a',
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {(openSections[3] || expandAll) && (
                <div className="space-y-3">
                  <label
                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      border: '2px solid',
                      borderColor: formData.paymentMethod === 'credit_card' ? '#0891b2' : '#e5e7eb',
                      background:
                        formData.paymentMethod === 'credit_card'
                          ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)'
                          : 'white',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleChange}
                      className="w-5 h-5"
                      style={{ accentColor: '#0891b2' }}
                    />
                    <svg
                      className="w-5 h-5"
                      style={{ color: '#1e3a8a' }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold text-gray-900">כרטיס אשראי</span>
                  </label>
                  <label
                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      border: '2px solid',
                      borderColor: formData.paymentMethod === 'paypal' ? '#0891b2' : '#e5e7eb',
                      background:
                        formData.paymentMethod === 'paypal'
                          ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)'
                          : 'white',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                      className="w-5 h-5"
                      style={{ accentColor: '#0891b2' }}
                    />
                    <svg
                      className="w-5 h-5"
                      style={{ color: '#1e3a8a' }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold text-gray-900">PayPal</span>
                  </label>
                  <label
                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      border: '2px solid',
                      borderColor:
                        formData.paymentMethod === 'bank_transfer' ? '#0891b2' : '#e5e7eb',
                      background:
                        formData.paymentMethod === 'bank_transfer'
                          ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)'
                          : 'white',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleChange}
                      className="w-5 h-5"
                      style={{ accentColor: '#0891b2' }}
                    />
                    <svg
                      className="w-5 h-5"
                      style={{ color: '#1e3a8a' }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span className="font-semibold text-gray-900">העברה בנקאית</span>
                  </label>
                </div>
              )}
            </section>

            <section>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-5 h-5 text-purple-600 rounded"
                />
                <span className="text-sm text-gray-700">
                  אני מאשר/ת את{' '}
                  <Link href="/terms" className="text-purple-600 hover:underline font-semibold">
                    התנאים וההגבלות
                  </Link>{' '}
                  ואת{' '}
                  <Link href="/privacy" className="text-purple-600 hover:underline font-semibold">
                    מדיניות הפרטיות
                  </Link>
                </span>
              </label>
            </section>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={processing || !formData.agreeToTerms}
              className="w-full py-4 rounded-xl font-bold text-lg transition shadow-lg"
              style={{
                background:
                  processing || !formData.agreeToTerms
                    ? '#d1d5db'
                    : 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                color: processing || !formData.agreeToTerms ? '#6b7280' : 'white',
                cursor: processing || !formData.agreeToTerms ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!processing && formData.agreeToTerms) {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(8, 145, 178, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!processing && formData.agreeToTerms) {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              {processing ? 'מעבד...' : 'אשר הזמנה ושלם'}
            </button>
          </form>

          <aside
            className="bg-white rounded-xl p-4 sm:p-6 space-y-6 lg:sticky lg:top-6 h-fit order-1 lg:order-2"
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
                className="h-1 w-20 rounded-full mb-2"
                style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)' }}
              />
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium inline-flex"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)',
                  color: '#1e3a8a',
                  border: '1px solid rgba(8, 145, 178, 0.3)',
                }}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                מאובטח
              </div>
            </div>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 items-center">
                  <Image
                    src={item.image || 'https://placehold.co/80x80?text=VIPO'}
                    alt={item.name || 'פריט בסל'}
                    width={80}
                    height={80}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">כמות: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold text-purple-600">
                    ₪{(item.price * item.quantity).toLocaleString('he-IL')}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>סכום ביניים</span>
                <span className="font-semibold">₪{totals.subtotal.toLocaleString('he-IL')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>הנחת קופון ({discountPercent}%)</span>
                  <span>-₪{discountAmount.toLocaleString('he-IL')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>משלוח</span>
                <span className="font-semibold text-green-600">חינם</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                <span>{'סה&quot;כ לתשלום'}</span>
                <span>₪{grandTotal.toLocaleString('he-IL')}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
