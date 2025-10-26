import { headers } from "next/headers";
import Link from "next/link";

import LogoutButton from "./_LogoutButton";

async function getUser() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3001";
  const proto = h.get("x-forwarded-proto") || "http";
  const base = process.env.PUBLIC_URL || `${proto}://${host}`;

  try {
    const res = await fetch(`${base}/api/auth/me`, {
      cache: "no-store",
      headers: {
        cookie: h.get("cookie") || "",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.user || null;
  } catch {
    return null;
  }
}

export default async function UserHeader() {
  const user = await getUser();

  return (
    <header
      style={{
        direction: "rtl",
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid #eee",
        background: "#fafafa",
      }}
    >
      <Link href="/" className="btn">
        מוצרים
      </Link>
      <Link href="/agent" className="btn">
        דשבורד סוכן
      </Link>
      <Link href="/admin" className="btn">
        דשבורד מנהל
      </Link>
      <div style={{ marginInlineStart: "auto" }} />
      {!user && (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/login">כניסה</Link>
          <span>·</span>
          <Link href="/register">הרשמה</Link>
        </div>
      )}
      {user && (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span>שלום, {user.role}</span>
          <LogoutButton />
        </div>
      )}
    </header>
  );
}
