'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function CheckoutDemoPage() {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
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

  // Mock data for demo
  const items = [
    {
      productId: '1',
      name: 'כורסת עיסוי',
      price: 10000,
      quantity: 1,
      image: 'https://placehold.co/80x80?text=VIPO'
    },
    {
      productId: '2', 
      name: 'ניסוי חדש',
      price: 500,
      quantity: 1,
      image: 'https://placehold.co/80x80?text=VIPO'
    }
  ];

  const totals = {
    subtotal: 10500
  };

  const discountAmount = appliedCoupon ? (totals.subtotal * (appliedCoupon.discountPercent / 100)) : 0;
  const discountPercent = appliedCoupon?.discountPercent || 0;
  const grandTotal = totals.subtotal - discountAmount;

  const handleApplyCoupon = () => {
    setApplyingCoupon(true);
    setTimeout(() => {
      if (couponInput.toLowerCase() === 'demo') {
        setAppliedCoupon({ code: 'DEMO', discountPercent: 10 });
        setCouponError('');
      } else {
        setCouponError('קוד קופון לא תקין');
      }
      setApplyingCoupon(false);
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">דף בדיקה - עמוד התשלום</h1>
          <p className="text-gray-600">בדיקת העיצוב המתוקן למובייל</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <form className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">פרטים אישיים</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">שם מלא *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none border-gray-300 focus:border-purple-600"
                    placeholder="יוסי כהן"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">אימייל *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none border-gray-300 focus:border-purple-600"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">אמצעי תשלום</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 border-blue-500 bg-blue-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === 'credit_card'}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold text-gray-900">כרטיס אשראי</span>
                </label>
              </div>
            </section>

            <button
              type="button"
              className="w-full py-4 rounded-xl font-bold text-lg text-white"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              }}
            >
              אשר הזמנה ושלם
            </button>
          </form>

          <aside className="bg-white rounded-xl p-4 sm:p-6 space-y-6 lg:sticky lg:top-6 h-fit order-1 lg:order-2">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-1" style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                סיכום הזמנה
              </h2>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 items-center">
                  <Image
                    src={item.image}
                    alt={item.name}
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

            {/* Coupon Input Section - המקום שתוקן */}
            <div className="border-t pt-4 mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                קוד קופון
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ 
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)', 
                  border: '1px solid rgba(16, 185, 129, 0.3)' 
                }}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-700">{appliedCoupon.code}</span>
                    <span className="text-sm text-green-600">({appliedCoupon.discountPercent}% הנחה)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAppliedCoupon(null)}
                    className="text-gray-500 hover:text-red-500 transition"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="הזן קוד קופון (נסה: demo)"
                    className="flex-1 px-4 py-2 border-2 rounded-xl focus:outline-none focus:border-cyan-500 border-gray-300 min-w-0"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponInput.trim()}
                    className="px-4 py-2 rounded-xl font-semibold text-white transition whitespace-nowrap flex-shrink-0"
                    style={{
                      background: applyingCoupon || !couponInput.trim() ? '#d1d5db' : 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                      cursor: applyingCoupon || !couponInput.trim() ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {applyingCoupon ? '...' : 'החל'}
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-xs text-red-600 mt-1">{couponError}</p>
              )}
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
                <span>סה&quot;כ לתשלום</span>
                <span>₪{grandTotal.toLocaleString('he-IL')}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
