"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AgentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [refLink, setRefLink] = useState("");
  const [referredCustomers, setReferredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
      
      if (userData.user.role !== "agent") {
        router.push("/");
        return;
      }
      
      setUser(userData.user);

      // Generate referral link
      const linkRes = await fetch("/api/agent/link/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: userData.user._id }),
      });
      
      if (linkRes.ok) {
        const linkData = await linkRes.json();
        setRefLink(linkData.refLink);
      }

      // Get agent stats
      const statsRes = await fetch(`/api/agent/stats?agentId=${userData.user._id}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else {
        // Default stats if API doesn't exist yet
        setStats({
          totalReferrals: userData.user.referralsCount || 0,
          totalSales: userData.user.totalSales || 0,
          commissionBalance: userData.user.commissionBalance || 0,
          clicks: 0,
          views: 0,
          conversionRate: 0,
        });
      }

      // Get referred customers
      const customersRes = await fetch(`/api/agent/customers?agentId=${userData.user._id}`);
      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setReferredCustomers(customersData.customers || []);
      }

    } catch (error) {
      console.error("Failed to load agent data:", error);
    } finally {
      setLoading(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              דשבורד סוכן
            </h1>
            <p className="text-gray-600">
              שלום {user?.fullName || "סוכן"}! 👋
            </p>
          </div>
          <Link
            href="/agent/products"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg"
          >
            🛍️ המוצרים שלי
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">סה"כ הפניות</h3>
              <span className="text-3xl">🔗</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.totalReferrals || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">לקוחות שהבאתי</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">סה"כ מכירות</h3>
              <span className="text-3xl">🛒</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.totalSales || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">רכישות שבוצעו</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">יתרת עמלות</h3>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ₪{(stats?.commissionBalance || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">זמין למשיכה</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">שיעור המרה</h3>
              <span className="text-3xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {stats?.conversionRate || 0}%
            </p>
            <p className="text-xs text-gray-500 mt-2">קליקים למכירות</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Referral Link Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                הקישור האישי שלך
              </h2>
              <span className="text-3xl">🔗</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-600 mb-3">שתף את הקישור הזה:</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <code className="flex-1 bg-white px-4 py-3 rounded-lg font-mono text-xs sm:text-sm break-all">
                    {refLink || "טוען..."}
                  </code>
                  <button
                    onClick={copyLink}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all whitespace-nowrap"
                  >
                    {copied ? "✓ הועתק!" : "העתק"}
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                שלח את הקישור ללקוחות - כל רכישה דרכו תזכה אותך ב-10% עמלה! 💰
              </p>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all">
                  <span>WhatsApp</span>
                </button>
                <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all">
                  <span>Email</span>
                </button>
              </div>
            </div>
          </section>

          {/* Customers List Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                לקוחות שהבאתי
              </h2>
              <span className="text-3xl">👥</span>
            </div>
            <div className="space-y-3">
              {referredCustomers.length > 0 ? (
                referredCustomers.slice(0, 5).map((customer, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {customer.fullName || customer.email || customer.phone}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(customer.createdAt).toLocaleDateString("he-IL")}
                      </p>
                    </div>
                    <span className="text-green-600 font-semibold">✓</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">עדיין אין לקוחות</p>
                  <p className="text-sm text-gray-400 mt-2">
                    התחל לשתף את הקישור שלך!
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Commission Breakdown */}
        <section className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">פירוט עמלות</h2>
            <span className="text-3xl">💎</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-gray-600 mb-2">עמלות מאושרות</p>
              <p className="text-2xl font-bold text-green-600">
                ₪{(stats?.commissionBalance || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-sm text-gray-600 mb-2">ממתין לאישור</p>
              <p className="text-2xl font-bold text-yellow-600">₪0</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">כבר שולם</p>
              <p className="text-2xl font-bold text-blue-600">₪0</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
