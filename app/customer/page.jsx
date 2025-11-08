"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/app/hooks/useTheme";

export default function CustomerDashboard() {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, []);

  async function fetchUserData() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user.role !== "customer") {
          // Redirect non-customers
          router.push(data.user.role === "admin" ? "/admin" : "/agent");
          return;
        }
        setUser(data.user);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }

  async function handleUpgradeToAgent() {
    try {
      setUpgrading(true);
      const res = await fetch("/api/users/upgrade-to-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        // Success - redirect to agent dashboard
        alert("🎉 ברכות! הפכת לסוכן בהצלחה!");
        router.push("/agent");
      } else {
        const data = await res.json();
        alert("שגיאה: " + (data.error || "לא ניתן לשדרג לסוכן"));
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("שגיאה בשדרוג לסוכן");
    } finally {
      setUpgrading(false);
      setShowAgentModal(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">טוען...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/customer"
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                אזור אישי
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-xl transition-all font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                מוצרים
              </Link>
              <Link
                href="/customer/orders"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-xl transition-all font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                הזמנות
              </Link>
            </div>
            <button
              onClick={() => {
                document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                router.push("/login");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              התנתק
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                שלום, {user.fullName}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                ברוך הבא לדשבורד הלקוחות שלך
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">חשבון לקוח</div>
              <div className="text-lg font-semibold text-purple-600">{user.email}</div>
            </div>
          </div>
        </div>

        {/* Upgrade to Agent Banner */}
        <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-1">רוצה להרוויח כסף? 💰</h3>
                <p className="text-green-50">הפוך לסוכן וקבל עמלות של 10% על כל מכירה!</p>
              </div>
            </div>
            <button
              onClick={() => setShowAgentModal(true)}
              className="bg-white text-green-600 hover:bg-green-50 font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              🚀 הפוך לסוכן
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Browse Products */}
          <Link
            href="/products"
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white p-4 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">עיין במוצרים</h3>
                <p className="text-gray-600 text-sm">גלה את המוצרים שלנו</p>
              </div>
            </div>
          </Link>

          {/* My Orders */}
          <Link
            href="/customer/orders"
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white p-4 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">ההזמנות שלי</h3>
                <p className="text-gray-600 text-sm">{orders.length} הזמנות</p>
              </div>
            </div>
          </Link>

          {/* Profile */}
          <Link
            href="/customer/profile"
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-4 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">הפרופיל שלי</h3>
                <p className="text-gray-600 text-sm">ערוך פרטים אישיים</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">הזמנות אחרונות</h2>
            <Link
              href="/customer/orders"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              צפה בכל ההזמנות →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">אין הזמנות עדיין</h3>
              <p className="text-gray-600 mb-6">התחל לקנות מוצרים ותראה אותם כאן!</p>
              <Link
                href="/products"
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                עיין במוצרים
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">מספר הזמנה</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">תאריך</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">מוצרים</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">סכום</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">סטטוס</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-mono text-sm">#{order._id.slice(-6)}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('he-IL')}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {order.items?.length || 0} פריטים
                      </td>
                      <td className="py-4 px-4 font-semibold text-purple-600">
                        ₪{order.totalAmount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status === 'completed' ? 'הושלם' :
                           order.status === 'pending' ? 'ממתין' :
                           order.status === 'processing' ? 'בטיפול' :
                           order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          href={`/customer/orders/${order._id}`}
                          className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                        >
                          צפה
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 mt-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">צריך עזרה?</h3>
              <p className="text-purple-100">אנחנו כאן בשבילך! צור קשר עם התמיכה שלנו</p>
            </div>
            <Link
              href="/contact"
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              צור קשר
            </Link>
          </div>
        </div>
      </div>

      {/* Upgrade to Agent Modal */}
      {showAgentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-scale-in">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">הפוך לסוכן! 🚀</h3>
              <p className="text-gray-600">צור הכנסה פאסיבית על ידי שיתוף מוצרים</p>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-green-900 mb-3 text-lg">🎁 מה תקבל כסוכן?</h4>
              <ul className="space-y-2 text-green-800">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>עמלות של 10%</strong> על כל מכירה שתבצע</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>קישור הפניה ייחודי</strong> לשיתוף עם חברים</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>דשבורד סוכן מתקדם</strong> עם סטטיסטיקות</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>מעקב אחר הרווחים</strong> בזמן אמת</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>בונוסים ותגמולים</strong> למוכרים מצטיינים</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>📝 שים לב:</strong> השדרוג הוא חד-פעמי ולא ניתן לבטל אותו. 
                לאחר השדרוג תקבל גישה לדשבורד הסוכנים ותוכל להתחיל להרוויח!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpgradeToAgent}
                disabled={upgrading}
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {upgrading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    משדרג...
                  </span>
                ) : (
                  "✨ כן, אני רוצה להפוך לסוכן!"
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
