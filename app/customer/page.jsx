"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 p-8">
      <div className="max-w-7xl mx-auto">
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
    </div>
  );
}
