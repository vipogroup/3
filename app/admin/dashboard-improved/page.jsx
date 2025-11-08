"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Get current user
      const userRes = await fetch("/api/auth/me");
      if (!userRes.ok) {
        router.push("/login");
        return;
      }
      const userData = await userRes.json();
      
      if (userData.user.role !== "admin") {
        router.push("/");
        return;
      }
      
      setUser(userData.user);

      // Get dashboard data
      const dashRes = await fetch("/api/admin/dashboard");
      if (dashRes.ok) {
        const data = await dashRes.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Failed to load admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/admin/dashboard-improved"
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                אזור אישי
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-xl transition-all font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                משתמשים
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-xl transition-all font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                מוצרים
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-xl transition-all font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                הגדרות
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
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              🎛️ דשבורד מנהל
            </h1>
            <p className="text-gray-600">
              שלום {user?.fullName || "מנהל"}! ניהול מלא של המערכת
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/products/new"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg"
            >
              ➕ מוצר חדש
            </Link>
            <Link
              href="/admin/settings"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg"
            >
              ⚙️ הגדרות
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs md:text-sm text-gray-600">סה"כ משתמשים</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {stats.totalUsers || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalAgents || 0} סוכנים | {stats.totalCustomers || 0} לקוחות
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs md:text-sm text-gray-600">סה"כ הזמנות</h3>
              <span className="text-2xl">🛒</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {stats.totalOrders || 0}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs md:text-sm text-gray-600">סה"כ מוצרים</h3>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {stats.totalProducts || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.onlineProducts || 0} רגילים | {stats.groupProducts || 0} קבוצתיים
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs md:text-sm text-gray-600">סה"כ עמלות</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              ₪{(stats.totalCommissions || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs md:text-sm text-gray-600">קליקים</h3>
              <span className="text-2xl">🖱️</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">
              {stats.totalClicks || 0}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* New Users Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                משתמשים חדשים
              </h2>
              <span className="text-3xl">🆕</span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {dashboardData?.newUsers?.length > 0 ? (
                dashboardData.newUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 truncate">
                          {user.fullName || user.email || user.phone}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.role === 'agent' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'admin' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'agent' ? '🔷 סוכן' :
                           user.role === 'admin' ? '👑 מנהל' : '👤 לקוח'}
                        </span>
                      </div>
                      {user.referrerName && (
                        <p className="text-xs text-green-600 mb-1">
                          🔗 הופנה ע"י: {user.referrerName}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("he-IL")} בשעה{" "}
                        {new Date(user.createdAt).toLocaleTimeString("he-IL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  אין משתמשים חדשים
                </div>
              )}
            </div>
          </section>

          {/* Agent Stats Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                עמלות סוכנים
              </h2>
              <span className="text-3xl">💎</span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {dashboardData?.agentStats?.length > 0 ? (
                dashboardData.agentStats.map((agent) => (
                  <div
                    key={agent._id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {agent.fullName || agent.email}
                      </p>
                      <p className="text-xs text-gray-600">
                        {agent.referralsCount || 0} הפניות | {agent.totalSales || 0} מכירות
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-green-600">
                        ₪{(agent.commissionBalance || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">עמלות</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  אין סוכנים עדיין
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Recent Orders Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              הזמנות אחרונות
            </h2>
            <span className="text-3xl">📋</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">מוצר</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">לקוח</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">סכום</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">עמלה</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">סטטוס</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">תאריך</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.recentOrders?.length > 0 ? (
                  dashboardData.recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{order.productName}</td>
                      <td className="py-3 px-4 text-sm">{order.customerName}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        ₪{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600">
                        ₪{order.commissionAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("he-IL")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      אין הזמנות עדיין
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="bg-white hover:bg-gray-50 rounded-xl shadow-lg p-6 text-center transition-all"
          >
            <span className="text-4xl mb-2 block">👥</span>
            <p className="font-semibold text-gray-900">ניהול משתמשים</p>
          </Link>
          <Link
            href="/admin/products"
            className="bg-white hover:bg-gray-50 rounded-xl shadow-lg p-6 text-center transition-all"
          >
            <span className="text-4xl mb-2 block">📦</span>
            <p className="font-semibold text-gray-900">ניהול מוצרים</p>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white hover:bg-gray-50 rounded-xl shadow-lg p-6 text-center transition-all"
          >
            <span className="text-4xl mb-2 block">🛒</span>
            <p className="font-semibold text-gray-900">הזמנות</p>
          </Link>
          <Link
            href="/admin/reports"
            className="bg-white hover:bg-gray-50 rounded-xl shadow-lg p-6 text-center transition-all"
          >
            <span className="text-4xl mb-2 block">📊</span>
            <p className="font-semibold text-gray-900">דוחות</p>
          </Link>
        </section>
      </div>
    </main>
  );
}
