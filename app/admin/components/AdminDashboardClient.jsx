'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function DashboardIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="9" width="8" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PlusCircleIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8.5v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 12h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ className = 'w-6 h-6' }) {
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

function UsersIcon({ className = 'w-10 h-10' }) {
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

function CartIcon({ className = 'w-10 h-10' }) {
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

function CubeIcon({ className = 'w-10 h-10' }) {
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

function CoinStackIcon({ className = 'w-10 h-10' }) {
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

function CursorIcon({ className = 'w-10 h-10' }) {
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

function UserPlusIcon({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M4 20v-.75A5.25 5.25 0 019.25 14h1.5"
      />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M16 8v4" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M14 10h4" />
    </svg>
  );
}

function SparkIcon({ className = 'w-8 h-8' }) {
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

function ClipboardIcon({ className = 'w-8 h-8' }) {
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

function AgentIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6.5" cy="16.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="16.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10.4 9.4L8.3 13.6" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M13.6 9.4l2.1 4.2" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8.5 16.5h7" />
    </svg>
  );
}

function ShieldIcon({ className = 'w-4 h-4' }) {
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

function UserCircleIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M8.5 17.5a3.5 3.5 0 017 0"
      />
    </svg>
  );
}

function LinkMarkIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15.5" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M11.5 12h1" />
    </svg>
  );
}

function ChartBarIcon({ className = 'w-10 h-10' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 20h16"
      />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8 20v-8" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12 20v-12" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M16 20v-5" />
    </svg>
  );
}

function getRoleBadge(role) {
  switch (role) {
    case 'agent':
      return { label: 'סוכן', className: 'bg-purple-100 text-purple-700', Icon: AgentIcon };
    case 'admin':
      return { label: 'מנהל', className: 'bg-red-100 text-red-700', Icon: ShieldIcon };
    default:
      return { label: 'לקוח', className: 'bg-blue-100 text-blue-700', Icon: UserCircleIcon };
  }
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      // Get current user
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        router.push('/login');
        return;
      }
      const userData = await userRes.json();

      if (userData.user.role !== 'admin') {
        router.push('/');
        return;
      }

      setUser(userData.user);

      // Get dashboard data
      const dashRes = await fetch('/api/admin/dashboard');
      if (dashRes.ok) {
        const data = await dashRes.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Failed to load admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
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
            className="animate-spin rounded-full h-16 w-16 mx-auto mb-4"
            style={{
              border: '4px solid rgba(8, 145, 178, 0.2)',
              borderTopColor: '#0891b2',
            }}
          ></div>
          <p className="text-gray-600 text-center font-medium">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};

  return (
    <main className="min-h-screen bg-white p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            <span
              className="flex items-center gap-2 sm:gap-3"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <DashboardIcon
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                style={{ color: '#0891b2' }}
              />
              דשבורד מנהל
            </span>
          </h1>
        </div>

        {/* ניהול משתמשים */}
        <section className="mb-4 sm:mb-6">
          <h2 className="text-sm sm:text-base font-bold mb-3 flex items-center gap-2" style={{ color: '#1e3a8a' }}>
            <UsersIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
            ניהול משתמשים
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/users" className="group relative overflow-hidden rounded-lg p-3 sm:p-4 transition-all hover:-translate-y-1 hover:shadow-xl" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <UsersIcon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">ניהול משתמשים</p>
                  <p className="text-xs text-gray-500 hidden sm:block">ניהול כל המשתמשים</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/agents" className="group relative overflow-hidden rounded-lg p-3 sm:p-4 transition-all hover:-translate-y-1 hover:shadow-xl" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <AgentIcon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">ניהול סוכנים</p>
                  <p className="text-xs text-gray-500 hidden sm:block">ניהול סוכנים ועמלות</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* קטלוג ומכירות */}
        <section className="mb-4 sm:mb-6">
          <h2 className="text-sm sm:text-base font-bold mb-3 flex items-center gap-2" style={{ color: '#1e3a8a' }}>
            <CubeIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
            קטלוג ומכירות
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/admin/products" className="group relative overflow-hidden rounded-lg p-3 sm:p-4 transition-all hover:-translate-y-1 hover:shadow-xl" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <CubeIcon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">ניהול מוצרים</p>
                  <p className="text-xs text-gray-500 hidden sm:block">ניהול קטלוג</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/orders" className="group relative overflow-hidden rounded-lg p-3 sm:p-4 transition-all hover:-translate-y-1 hover:shadow-xl" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <CartIcon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">ניהול הזמנות</p>
                  <p className="text-xs text-gray-500 hidden sm:block">מעקב הזמנות</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/products/new" className="group relative overflow-hidden rounded-lg p-3 sm:p-4 transition-all hover:-translate-y-1 hover:shadow-xl" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #16a34a, #22c55e)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(22, 163, 74, 0.1)' }}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' }}>
                  <PlusCircleIcon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">הוסף מוצר</p>
                  <p className="text-xs text-gray-500 hidden sm:block">מוצר חדש</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* כספים ודוחות */}
        <section className="mb-4 sm:mb-6">
          <h2 className="text-sm sm:text-base font-bold mb-3 flex items-center gap-2" style={{ color: '#1e3a8a' }}>
            <CoinStackIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
            כספים ודוחות
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/admin/reports" className="group relative overflow-hidden rounded-lg p-3 sm:p-4 transition-all hover:-translate-y-1 hover:shadow-xl" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <ChartBarIcon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">דוחות</p>
                  <p className="text-xs text-gray-500 hidden sm:block">סטטיסטיקות</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/analytics" className="group relative overflow-hidden rounded-lg p-3 sm:p-4 transition-all hover:-translate-y-1 hover:shadow-xl" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">ניתוח נתונים</p>
                  <p className="text-xs text-gray-500 hidden sm:block">מתקדם</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/transactions" className="group relative overflow-hidden rounded-lg p-3 sm:p-4 transition-all hover:-translate-y-1 hover:shadow-xl" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <CoinStackIcon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">ניהול עסקאות</p>
                  <p className="text-xs text-gray-500 hidden sm:block">תשלומים</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* הגדרות ושיווק */}
        <section className="mb-4 sm:mb-6">
          <h2 className="text-sm sm:text-base font-bold mb-3 flex items-center gap-2" style={{ color: '#1e3a8a' }}>
            <SettingsIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
            הגדרות ושיווק
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/admin/notifications" className="group relative overflow-hidden rounded-lg p-3 sm:p-4 transition-all hover:-translate-y-1 hover:shadow-xl" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">ניהול התראות</p>
                  <p className="text-xs text-gray-500 hidden sm:block">שליחת Push</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/marketing-assets" className="group relative overflow-hidden rounded-lg p-3 sm:p-4 transition-all hover:-translate-y-1 hover:shadow-xl" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <SparkIcon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">ניהול שיווק</p>
                  <p className="text-xs text-gray-500 hidden sm:block">חומרי שיווק</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/settings" className="group relative overflow-hidden rounded-lg p-3 sm:p-4 transition-all hover:-translate-y-1 hover:shadow-xl" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <SettingsIcon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">ניהול הגדרות</p>
                  <p className="text-xs text-gray-500 hidden sm:block">הגדרות מערכת</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          {/* New Users Section */}
          <section className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2
                className="text-base sm:text-lg font-bold flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <UserPlusIcon
                  className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7"
                  style={{ color: '#0891b2' }}
                />
                <span>משתמשים חדשים</span>
              </h2>
            </div>
            <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
              {dashboardData?.newUsers?.length > 0 ? (
                dashboardData.newUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-start justify-between p-3 sm:p-4 rounded-lg transition-all"
                    style={{
                      border: '2px solid #e5e7eb',
                      background: 'white',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#0891b2';
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {user.fullName || user.email || user.phone}
                        </p>
                        {(() => {
                          const {
                            label,
                            className: roleClass,
                            Icon: RoleIcon,
                          } = getRoleBadge(user.role);
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
                          <span>
                            {'הופנה ע&quot;י:'} {user.referrerName}
                          </span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('he-IL')} בשעה{' '}
                        {new Date(user.createdAt).toLocaleTimeString('he-IL', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">אין משתמשים חדשים</div>
              )}
            </div>
          </section>

          {/* Recent Orders Section */}
          <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2
                className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <ClipboardIcon
                  className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7"
                  style={{ color: '#0891b2' }}
                />
                <span>הזמנות אחרונות</span>
              </h2>
            </div>

            {dashboardData?.recentOrders?.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '2px solid #0891b2' }}>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: '#1e3a8a' }}
                        >
                          מוצר
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: '#1e3a8a' }}
                        >
                          לקוח
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: '#1e3a8a' }}
                        >
                          סכום
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: '#1e3a8a' }}
                        >
                          עמלה
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: '#1e3a8a' }}
                        >
                          סטטוס
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: '#1e3a8a' }}
                        >
                          תאריך
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b border-gray-100 transition-all"
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)')
                          }
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                        >
                          <td className="py-3 px-3 text-sm">{order.productName}</td>
                          <td className="py-3 px-3 text-sm">{order.customerName}</td>
                          <td
                            className="py-3 px-3 text-sm font-semibold"
                            style={{ color: '#1e3a8a' }}
                          >
                            ₪{(order.totalAmount || 0).toLocaleString()}
                          </td>
                          <td
                            className="py-3 px-3 text-sm font-semibold"
                            style={{ color: '#16a34a' }}
                          >
                            ₪{(order.commissionAmount || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : order.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('he-IL')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {dashboardData.recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 rounded-lg transition-all"
                      style={{
                        border: '2px solid #e5e7eb',
                        background: 'white',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0891b2';
                        e.currentTarget.style.background =
                          'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.background = 'white';
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            {order.productName}
                          </p>
                          <p className="text-xs text-gray-500">{order.customerName}</p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">סכום:</span>
                          <span className="font-semibold mr-1" style={{ color: '#1e3a8a' }}>
                            ₪{(order.totalAmount || 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">עמלה:</span>
                          <span className="font-semibold mr-1" style={{ color: '#16a34a' }}>
                            ₪{(order.commissionAmount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">אין הזמנות עדיין</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
