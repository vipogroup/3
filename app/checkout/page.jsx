"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useCartContext } from "@/app/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    items,
    totals,
    isEmpty,
    hydrated,
    clearCart,
  } = useCartContext();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "credit_card",
    agreeToTerms: false,
  });

  const gradientStyle = useMemo(
    () => ({
      background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)",
    }),
    []
  );

  useEffect(() => {
    if (!hydrated) return;
    if (isEmpty) {
      router.replace("/cart");
      return;
    }

    async function loadUser() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setFormData((prev) => ({
            ...prev,
            fullName: data.user.fullName || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
          }));
        } else if (res.status === 401) {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [hydrated, isEmpty, router]);

  useEffect(() => {
    if (!hydrated) return;
    const couponParam = searchParams?.get("coupon");
    if (couponParam && !appliedCoupon) {
      setCouponInput(couponParam);
      handleApplyCoupon(couponParam);
    }
  }, [hydrated, isEmpty, router]);

  const discountPercent = appliedCoupon?.discountPercent || 0;
  const discountAmount = useMemo(() => {
    if (!totals?.subtotal || !discountPercent) return 0;
    return Number(((totals.subtotal * discountPercent) / 100).toFixed(2));
  }, [totals?.subtotal, discountPercent]);

  const grandTotal = useMemo(() => {
    if (!totals?.subtotal) return 0;
    return Math.max(0, totals.subtotal - discountAmount);
  }, [totals?.subtotal, discountAmount]);

  const handleApplyCoupon = async (codeOverride) => {
    const code = (codeOverride ?? couponInput).trim();
    if (!code) {
      setCouponError("נא להזין קוד קופון");
      return;
    }

    setApplyingCoupon(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        setAppliedCoupon(null);
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error === "coupon_not_found" ? "קופון לא נמצא או אינו פעיל" : "אירעה שגיאה באימות הקופון");
      }

      const data = await res.json();
      setAppliedCoupon(data.coupon);
      setCouponError("");
    } catch (err) {
      setCouponError(err.message || "קופון לא תקף");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.agreeToTerms) {
      setError("יש לאשר את התנאים לפני התשלום");
      return;
    }

    setProcessing(true);
    setError("");

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

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "שגיאה ביצירת הזמנה");
      }

      const data = await res.json();
      clearCart();
      alert(`✅ ההזמנה בוצעה בהצלחה!\nמספר הזמנה: ${data.orderId}`);
      router.push("/customer");
    } catch (err) {
      console.error("Checkout error", err);
      setError(err.message || "שגיאה בביצוע ההזמנה");
    } finally {
      setProcessing(false);
    }
  };

  if (!hydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={gradientStyle}>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">טוען...</p>
        </div>
      </div>
    );
  }

  if (isEmpty) return null; // redirect handled above

  return (
    <div className="min-h-screen p-6" style={gradientStyle}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-gray-900">🛒 סל קניות ותשלום</h1>
          <Link href="/cart" className="text-purple-600 hover:text-purple-700 font-semibold">
            ← חזרה לסל
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-2 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">פרטים אישיים</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">שם מלא *</label>
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
                  <label className="block text-sm font-semibold text-gray-900 mb-2">אימייל *</label>
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
                  <label className="block text-sm font-semibold text-gray-900 mb-2">טלפון *</label>
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
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">כתובת למשלוח</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">כתובת מלאה *</label>
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
                  <label className="block text-sm font-semibold text-gray-900 mb-2">מיקוד *</label>
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
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">אמצעי תשלום</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-purple-600">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === "credit_card"}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600"
                  />
                  <span className="font-semibold text-gray-900">💳 כרטיס אשראי</span>
                </label>
                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-purple-600">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === "paypal"}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600"
                  />
                  <span className="font-semibold text-gray-900">💰 PayPal</span>
                </label>
                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-purple-600">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={formData.paymentMethod === "bank_transfer"}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600"
                  />
                  <span className="font-semibold text-gray-900">🏦 העברה בנקאית</span>
                </label>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">קוד קופון</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="לדוגמה: vipo-agent-001"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 uppercase"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  disabled={applyingCoupon}
                  className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
                    applyingCoupon
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  }`}
                >
                  {applyingCoupon ? "בודק..." : appliedCoupon ? "עדכן קוד" : "החל קוד"}
                </button>
              </div>
              {appliedCoupon && (
                <p className="mt-2 text-sm text-green-600 font-semibold">
                  הקופון הופעל! {appliedCoupon.discountPercent}% הנחה ללקוח ו-{appliedCoupon.commissionPercent}% עמלה לסוכן {appliedCoupon.agentName && `(${appliedCoupon.agentName})`}.
                </p>
              )}
              {couponError && (
                <p className="mt-2 text-sm text-red-600">{couponError}</p>
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
                  אני מאשר/ת את {" "}
                  <Link href="/terms" className="text-purple-600 hover:underline font-semibold">
                    התנאים וההגבלות
                  </Link>{" "}
                  ואת {" "}
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
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                processing || !formData.agreeToTerms
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              }`}
            >
              {processing ? "מעבד..." : "✅ אשר הזמנה ושלם"}
            </button>
          </form>

          <aside className="bg-white rounded-2xl shadow-xl p-6 space-y-6 sticky top-6 h-fit">
            <h2 className="text-2xl font-bold text-gray-900">סיכום הזמנה</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 items-center">
                  <img
                    src={item.image || "https://via.placeholder.com/80x80?text=VIPO"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">כמות: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold text-purple-600">
                    ₪{(item.price * item.quantity).toLocaleString("he-IL")}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>סכום ביניים</span>
                <span className="font-semibold">₪{totals.subtotal.toLocaleString("he-IL")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>הנחת קופון ({discountPercent}%)</span>
                  <span>-₪{discountAmount.toLocaleString("he-IL")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>משלוח</span>
                <span className="font-semibold text-green-600">חינם</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                <span>{'סה&quot;כ לתשלום'}</span>
                <span>₪{grandTotal.toLocaleString("he-IL")}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
