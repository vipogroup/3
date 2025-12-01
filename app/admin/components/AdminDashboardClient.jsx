"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function DashboardIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="9" width="8" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PlusCircleIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8.5v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 12h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function UsersIcon({ className = "w-10 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M4 19.5v-.75A5.75 5.75 0 019.75 13h4.5A5.75 5.75 0 0120 18.75v.75"
      />
      <circle cx="12" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CartIcon({ className = "w-10 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 2.25h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0h12.752a.75.75 0 01.736.92l-1.5 6a.75.75 0 01-.736.58H6.72a.75.75 0 01-.736-.58L4.106 4.522m13.813 10.477a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-8.25 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
      />
    </svg>
  );
}

function CubeIcon({ className = "w-10 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 7.5L12 2.25 3 7.5m18 0L12 12.75m9-5.25v9l-9 5.25m0-9L3 7.5m9 5.25v9l-9-5.25v-9"
      />
    </svg>
  );
}

function CoinStackIcon({ className = "w-10 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="6.5" rx="7" ry="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 6.5v7c0 1.93 3.134 3.5 7 3.5s7-1.57 7-3.5v-7"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 10.5c0 1.93 3.134 3.5 7 3.5s7-1.57 7-3.5"
      />
    </svg>
  );
}

function CursorIcon({ className = "w-10 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.25 4.25l8.5 9.5-3.8.7 2.2 5.8-2.05.75-2.05-5.95-3.8.7z"
      />
    </svg>
  );
}

function UserPlusIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M4 20v-.75A5.25 5.25 0 019.25 14h1.5" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M16 8v4" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M14 10h4" />
    </svg>
  );
}

function SparkIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4l1.76 4.95L18.7 10.7l-4.94 1.76L12 17.4l-1.76-4.94L5.3 10.7l4.94-1.75z"
      />
    </svg>
  );
}

function ClipboardIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 3h6a1 1 0 011 1v1h1.5A1.5 1.5 0 0119.5 6v12A1.5 1.5 0 0118 19.5H6A1.5 1.5 0 014.5 18V6A1.5 1.5 0 016 5h1V4a1 1 0 011-1z"
      />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M9 9h6" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M9 13h6" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M9 17h4" />
    </svg>
  );
}

function AgentIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6.5" cy="16.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="16.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M10.4 9.4L8.3 13.6"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M13.6 9.4l2.1 4.2"
      />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8.5 16.5h7" />
    </svg>
  );
}

function ShieldIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4l7 2.8v5.7c0 4-2.9 7.8-7 8.5-4.1-.7-7-4.5-7-8.5V6.8L12 4z"
      />
    </svg>
  );
}

function UserCircleIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8.5 17.5a3.5 3.5 0 017 0" />
    </svg>
  );
}

function LinkMarkIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15.5" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M11.5 12h1" />
    </svg>
  );
}

function ChartBarIcon({ className = "w-10 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 20h16" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8 20v-8" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12 20v-12" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M16 20v-5" />
    </svg>
  );
}

function getRoleBadge(role) {
  switch (role) {
    case "agent":
      return { label: "סוכן", className: "bg-purple-100 text-purple-700", Icon: AgentIcon };
    case "admin":
      return { label: "מנהל", className: "bg-red-100 text-red-700", Icon: ShieldIcon };
    default:
      return { label: "לקוח", className: "bg-blue-100 text-blue-700", Icon: UserCircleIcon };
  }
}

export default function AdminDashboardClient() {
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
                href="/admin"
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
            <form action="/api/auth/logout" method="post" className="contents">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                התנתק
              </button>
            </form>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              <span className="flex items-center gap-3">
                <DashboardIcon className="w-8 h-8 text-purple-600" />
                דשבורד מנהל
              </span>
            </h1>
            <p className="text-gray-600">
              שלום {user?.fullName || "מנהל"}! ניהול מלא של המערכת
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/products/new"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <PlusCircleIcon className="w-5 h-5 text-white" />
              <span>מוצר חדש</span>
            </Link>
            <Link
              href="/admin/settings"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <SettingsIcon className="w-5 h-5 text-white" />
              <span>הגדרות</span>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <SparkIcon className="w-6 h-6 text-purple-500" />
                  <span>קיצורי דרך לניהול מהיר</span>
                </h2>
                <p className="text-sm text-gray-500">
                  גישה מהירה לכלי הניהול המרכזיים במערכת
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Link
                href="/admin/users"
                className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-white to-purple-50/60 p-5 transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <span className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <div className="relative flex flex-col gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30">
                    <UsersIcon className="w-6 h-6" />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-gray-900">ניהול משתמשים</p>
                    <p className="text-sm text-gray-500">הוספה, עדכון ומעקב אחרי משתמשים רשומים</p>
                  </div>
                  <span className="mt-2 text-sm font-semibold text-purple-600">כניסה לניהול משתמשים</span>
                </div>
              </Link>

              <Link
                href="/admin/products"
                className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-white via-white to-amber-50/50 p-5 transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <span className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <div className="relative flex flex-col gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                    <CubeIcon className="w-6 h-6" />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-gray-900">ניהול מוצרים</p>
                    <p className="text-sm text-gray-500">עדכון קטלוג, מלאי ומידע על מוצרים</p>
                  </div>
                  <span className="mt-2 text-sm font-semibold text-amber-600">כניסה לניהול מוצרים</span>
                </div>
              </Link>

              <Link
                href="/admin/orders"
                className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50/60 p-5 transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <span className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <div className="relative flex flex-col gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
                    <CartIcon className="w-6 h-6" />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-gray-900">ניהול הזמנות</p>
                    <p className="text-sm text-gray-500">מעקב אחר סטטוסים, עמלות ותשלומים</p>
                  </div>
                  <span className="mt-2 text-sm font-semibold text-blue-600">כניסה לרשימת ההזמנות</span>
                </div>
              </Link>

              <Link
                href="/admin/reports"
                className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-white to-indigo-50/60 p-5 transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <span className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <div className="relative flex flex-col gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30">
                    <ChartBarIcon className="w-6 h-6" />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-gray-900">דוחות וביצועים</p>
                    <p className="text-sm text-gray-500">ניתוח נתונים והפקת תובנות עסקיות</p>
                  </div>
                  <span className="mt-2 text-sm font-semibold text-indigo-600">צפה בדוחות ובסטטיסטיקות</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* New Users Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <UserPlusIcon className="w-7 h-7 text-purple-500" />
                <span>משתמשים חדשים</span>
              </h2>
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
                        <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                          {user.fullName || user.email || user.phone}
                        </p>
                        {(() => {
                          const { label, className: roleClass, Icon: RoleIcon } = getRoleBadge(user.role);
                          return (
                            <span className={`text-xs px-2 py-1 rounded-full ${roleClass}`}>
                              <span className="flex items-center gap-1">
                                <RoleIcon className="w-4 h-4" />
                                {label}
                              </span>
                            </span>
                          );
                        })()}
                      </div>
                      {user.referrerName && (
                        <p className="text-xs text-green-600 mb-1 flex items-center gap-1">
                          <LinkMarkIcon className="w-4 h-4" />
                          <span>{'הופנה ע&quot;י:'} {user.referrerName}</span>
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

          {/* Recent Orders Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ClipboardIcon className="w-7 h-7 text-indigo-500" />
                <span>הזמנות אחרונות</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-right py-3 px-3 text-xs sm:text-sm font-semibold text-gray-700">מוצר</th>
                    <th className="text-right py-3 px-3 text-xs sm:text-sm font-semibold text-gray-700">לקוח</th>
                    <th className="text-right py-3 px-3 text-xs sm:text-sm font-semibold text-gray-700">סכום</th>
                    <th className="text-right py-3 px-3 text-xs sm:text-sm font-semibold text-gray-700">עמלה</th>
                    <th className="text-right py-3 px-3 text-xs sm:text-sm font-semibold text-gray-700">סטטוס</th>
                    <th className="text-right py-3 px-3 text-xs sm:text-sm font-semibold text-gray-700">תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.recentOrders?.length > 0 ? (
                    dashboardData.recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-3 text-xs sm:text-sm">{order.productName}</td>
                        <td className="py-3 px-3 text-xs sm:text-sm">{order.customerName}</td>
                        <td className="py-3 px-3 text-xs sm:text-sm font-semibold text-gray-900">
                          ₪{order.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-xs sm:text-sm font-semibold text-green-600">
                          ₪{order.commissionAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-500">
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
        </div>

      </div>
    </main>
  );
}
