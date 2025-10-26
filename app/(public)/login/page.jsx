"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error || "Login failed");
      return;
    }
    const j = await res.json();
    const role = j?.user?.role;
    if (role === "admin") router.push("/admin");
    else if (role === "agent") router.push("/agent");
    else router.push("/");
  }

  return (
    <main style={{ direction: "rtl", padding: "24px", maxWidth: 420 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>כניסה</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input placeholder="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input placeholder="סיסמה" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">כניסה</button>
      </form>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <p style={{ marginTop: 12 }}>
        <a href="/register">אין חשבון? הרשמה</a>
      </p>
    </main>
  );
}
