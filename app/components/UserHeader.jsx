"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserHeader() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const isAdmin = user?.role === "admin";
  const isAgent = user?.role === "agent";

  return (
    <header className="w-full text-sm flex justify-end gap-4 p-3">
      {/* Public links always allowed */}
      <Link href="/products">מוצרים</Link>

      {/* Guest (not logged-in): show only login/register */}
      {!user && !loading && (
        <>
          <Link href="/login">כניסה</Link>
          <Link href="/register">הרשמה</Link>
        </>
      )}

      {/* Agent: agent dashboard + logout */}
      {isAgent && (
        <>
          <Link href="/agent">דשבורד סוכן</Link>
          <Link href="/api/auth/logout">התנתקות</Link>
        </>
      )}

      {/* Admin: admin dashboard + logout */}
      {isAdmin && (
        <>
          <Link href="/admin">דשבורד מנהל</Link>
          <Link href="/api/auth/logout">התנתקות</Link>
        </>
      )}
    </header>
  );
}
