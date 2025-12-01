"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useCartContext } from "@/app/context/CartContext";

export default function UserHeader() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { totals, isEmpty } = useCartContext();

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!ignore && res.ok) {
          const data = await res.json();
          setUser(data?.user || null);
        }
      } catch (_) {
        // ignore
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const role = user?.role;
  const navItems = useMemo(() => {
    if (!user) {
      return [
        { href: "/products", label: "מוצרים" },
        { href: "/cart", label: "סל קניות", showBadge: true },
        { href: "/login", label: "כניסה" },
        { href: "/register", label: "הרשמה" },
      ];
    }

    if (role === "customer") {
      return [
        { href: "/customer", label: "אזור אישי" },
        { href: "/products", label: "מוצרים" },
        { href: "/cart", label: "סל קניות", showBadge: true },
        { href: "/contact", label: "תמיכה" },
      ];
    }

    if (role === "agent") {
      return [
        { href: "/agent", label: "דשבורד" },
        { href: "/sales", label: "מכירות" },
        { href: "/profile", label: "פרופיל" },
        { href: "/products", label: "מוצרים" },
        { href: "/cart", label: "סל קניות", showBadge: true },
      ];
    }

    if (role === "admin") {
      return [
        { href: "/admin", label: "לוח בקרה" },
        { href: "/admin/products", label: "ניהול מוצרים" },
        { href: "/admin/agents", label: "סוכנים" },
        { href: "/admin/orders", label: "הזמנות" },
        { href: "/products", label: "חנות" },
      ];
    }

    return [
      { href: "/products", label: "מוצרים" },
      { href: "/cart", label: "סל קניות", showBadge: true },
    ];
  }, [role, user]);

  return (
    <header className="sticky top-0 z-40 w-full text-sm flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 p-3 sm:px-4 bg-white/90 backdrop-blur-md shadow-sm border-b border-white/40">
      <Link href="/" className="flex items-center gap-2 font-semibold text-gray-800">
        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
          V
        </div>
        <span>VIPO</span>
      </Link>

      <nav className="flex w-full sm:w-auto items-center gap-2 flex-wrap justify-center sm:justify-end">
        {navItems.map(({ href, label, showBadge }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative px-3 py-2 rounded-xl transition-colors text-center ${
                isActive ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {label}
              {showBadge && !isEmpty && (
                <span className="absolute -top-1 -right-1.5 inline-flex items-center justify-center rounded-full bg-purple-600 text-white text-[10px] w-4 h-4">
                  {Math.min(99, totals.totalQuantity)}
                </span>
              )}
            </Link>
          );
        })}

        {user && (
          <form action="/api/auth/logout" method="post" className="inline">
            <button
              type="submit"
              className="px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
            >
              התנתקות
            </button>
          </form>
        )}
      </nav>
    </header>
  );
}
