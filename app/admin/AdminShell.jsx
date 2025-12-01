'use client';

import { useState } from "react";
import Link from "next/link";

function DashboardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="9" width="8" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function AgentsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="7" r="2.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M7 20v-.75A5.25 5.25 0 0112.25 14h1.5A5.25 5.25 0 0119 19.25V20"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M5.5 9.5l2.5 1.5M18.5 9.5l-2.5 1.5"
      />
      <circle cx="5.5" cy="9" r="1.75" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18.5" cy="9" r="1.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M4 19.25v-.75A5.5 5.5 0 019.5 13h5A5.5 5.5 0 0120 18.5v.75"
      />
      <circle cx="12" cy="8.5" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M6.5 8.5a3.5 3.5 0 016.75-1"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M17.5 8.5a3.5 3.5 0 00-6.75-1"
      />
    </svg>
  );
}

function ProductsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 7.5L12 12l8.25-4.5m-16.5 0L12 3l8.25 4.5m-16.5 0V16.5L12 21m8.25-13.5V16.5L12 21m0-9v9"
      />
    </svg>
  );
}

function OrdersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.5 4.5H5l2.1 10.5h9.8L19 7.5H7.4"
      />
      <circle cx="9.75" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.75" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 3.5l3 0 1 3 2.7 1.1 2.1-2.1 2.1 2.1-2.1 2.1 1.1 2.7 3 .9v3l-3 .9-1.1 2.7 2.1 2.1-2.1 2.1-2.1-2.1-2.7 1.1-1 3h-3l-1-3-2.7-1.1-2.1 2.1-2.1-2.1 2.1-2.1L4.5 16l-3-.9v-3l3-.9 1.1-2.7-2.1-2.1 2.1-2.1 2.1 2.1L9.5 6.5z"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function LogoutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 6V5a2 2 0 00-2-2h-6a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2v-1"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.5 12l-3-3m3 3l-3 3m3-3H9"
      />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", Icon: DashboardIcon, color: "from-purple-500 to-indigo-500" },
  { href: "/admin/agents", label: "סוכנים", Icon: AgentsIcon, color: "from-amber-500 to-orange-500" },
  { href: "/admin/users", label: "משתמשים", Icon: UsersIcon, color: "from-blue-500 to-cyan-500" },
  { href: "/admin/products", label: "מוצרים", Icon: ProductsIcon, color: "from-rose-500 to-pink-500" },
  { href: "/admin/orders", label: "הזמנות", Icon: OrdersIcon, color: "from-emerald-500 to-green-500" },
  { href: "/admin/settings", label: "הגדרות", Icon: SettingsIcon, color: "from-slate-500 to-gray-600" },
];

export default function AdminShell({ user, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50" dir="rtl">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-gray-900 text-white px-4 py-3 shadow">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          תפריט
        </button>
        <span className="text-sm font-medium text-gray-200">VIPO Admin</span>
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-64 transform bg-gray-900 text-white shadow-xl transition-transform duration-300 md:static md:translate-x-0 md:block md:shadow-none ${
          sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">VIPO Admin</h2>
            <button
              type="button"
              onClick={closeSidebar}
              className="md:hidden rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="סגור תפריט"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>

          {user && (
            <div className="mb-6 rounded-xl bg-white/5 p-4 text-sm text-gray-200">
              <p className="text-xs text-gray-400">מחובר כ:</p>
              <p className="font-semibold text-white truncate">{user.id}</p>
              <p className="text-xs text-gray-400">{user.role}</p>
            </div>
          )}

          <nav className="flex-1 space-y-2 overflow-y-auto">
            {NAV_ITEMS.map(({ href, label, Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                onClick={closeSidebar}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg shadow-black/20`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 border-t border-gray-700 pt-6">
            <Link
              href="/api/auth/logout"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-900/40 transition-colors"
              onClick={closeSidebar}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-black/20">
                <LogoutIcon className="h-5 w-5" />
              </span>
              <span>התנתק</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 pt-20 pb-12 md:pb-12 md:pt-8 md:px-8">
        {children}
      </main>
    </div>
  );
}
