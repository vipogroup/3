import Link from "next/link";
import { getUserFromCookies } from "@/lib/auth/server";

export default async function AdminLayout({ children }) {
  const user = await getUserFromCookies();
  
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/agents", label: "סוכנים", icon: "👔" },
    { href: "/admin/users", label: "משתמשים", icon: "👥" },
    { href: "/admin/products", label: "מוצרים", icon: "📦" },
    { href: "/admin/orders", label: "הזמנות", icon: "🛒" },
    { href: "/admin/settings", label: "הגדרות", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">VIPO Admin</h2>
          
          {user && (
            <div className="mb-6 pb-6 border-b border-gray-700">
              <p className="text-sm text-gray-400">מחובר כ:</p>
              <p className="font-semibold">{user.id}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          )}
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-gray-700">
            <Link
              href="/api/auth/logout"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900 transition-colors text-red-400"
            >
              <span className="text-xl">🚪</span>
              <span>התנתק</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
