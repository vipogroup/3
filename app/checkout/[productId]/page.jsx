"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductById } from "@/app/lib/products";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId;

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "credit_card",
    agreeToTerms: false
  });

  const gradientStyle = useMemo(
    () => ({
      background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)",
    }),
    []
  );

  const loadData = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    
    // Load product
    const prod = getProductById(productId);
    if (!prod) {
      alert("מוצר לא נמצא");
      router.push("/products");
      return;
    }
    setProduct(prod);

    // Load user if logged in
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        // Pre-fill form with user data
        setFormData(prev => ({
          ...prev,
          fullName: data.user.fullName || "",
          email: data.user.email || "",
          phone: data.user.phone || ""
        }));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
    
    setLoading(false);
  }, [productId, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      alert("עליך לאשר את התנאים וההגבלות");
      return;
    }

    setProcessing(true);

    try {
      // Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          productName: product.name,
          price: product.price,
          quantity: 1,
          customerInfo: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode
          },
          paymentMethod: formData.paymentMethod
        })
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderRes.json();
      
      // Create sale record
      if (user) {
        await fetch("/api/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: user.id,
            productId: product._id,
            productName: product.name,
            salePrice: product.price
          })
        });
      }

      // Success
      alert("✅ ההזמנה בוצעה בהצלחה!\n\nמספר הזמנה: " + orderData.orderId);
      router.push("/customer");
      
    } catch (error) {
      console.error("Checkout error:", error);
      alert("שגיאה בביצוע ההזמנה. אנא נסה שוב.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={gradientStyle}>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">טוען...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen p-8" style={gradientStyle}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">🛒 סל קניות ותשלום</h1>
            <Link href="/products" className="text-purple-600 hover:text-purple-700 font-semibold">
              ← חזור למוצרים
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
              {/* Customer Details */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>👤</span>
                  <span>פרטים אישיים</span>
                </h2>
                
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
                      placeholder="דוד כהן"
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
                      placeholder="david@example.com"
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
                      placeholder="050-1234567"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>📦</span>
                  <span>כתובת למשלוח</span>
                </h2>
                
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
                      placeholder="רחוב הרצל 123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      עיר *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
                      placeholder="1234567"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>💳</span>
                  <span>אמצעי תשלום</span>
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-purple-600 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === "credit_card"}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600"
                    />
                    <span className="mr-3 font-semibold text-gray-900">💳 כרטיס אשראי</span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-purple-600 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === "paypal"}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600"
                    />
                    <span className="mr-3 font-semibold text-gray-900">💰 PayPal</span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-purple-600 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === "bank_transfer"}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600"
                    />
                    <span className="mr-3 font-semibold text-gray-900">🏦 העברה בנקאית</span>
                  </label>
                </div>
              </div>

              {/* Terms */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 rounded mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    אני מאשר/ת את{" "}
                    <Link href="/terms" className="text-purple-600 hover:underline font-semibold">
                      התנאים וההגבלות
                    </Link>
                    {" "}ואת{" "}
                    <Link href="/privacy" className="text-purple-600 hover:underline font-semibold">
                      מדיניות הפרטיות
                    </Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing || !formData.agreeToTerms}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  processing || !formData.agreeToTerms
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : `bg-gradient-to-r ${theme.buttonGradient} text-white hover:shadow-xl`
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    מעבד...
                  </span>
                ) : (
                  "✅ אשר הזמנה ושלם"
                )}
              </button>
            </form>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">סיכום הזמנה</h2>
              
              {/* Product */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-4">
                  <Image
                    src={product.image || "https://placehold.co/120x120?text=VIPO"}
                    alt={product.name || "מוצר"}
                    width={120}
                    height={120}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <p className="text-sm text-gray-500 mt-1">כמות: 1</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>מחיר מוצר:</span>
                  <span className="font-semibold">₪{product.price}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>משלוח:</span>
                  <span className="font-semibold text-green-600">חינם</span>
                </div>
                {product.originalPrice && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>חסכת:</span>
                    <span className="font-semibold">
                      ₪{product.originalPrice - product.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-6 border-t-2 border-gray-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-900">{'סה&quot;כ לתשלום:'}</span>
                  <span className="text-3xl font-bold text-purple-600">
                    ₪{product.price}
                  </span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔒</span>
                  <span className="font-bold text-green-900">תשלום מאובטח</span>
                </div>
                <p className="text-sm text-green-800">
                  התשלום שלך מוגן בהצפנה ברמה הגבוהה ביותר
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
