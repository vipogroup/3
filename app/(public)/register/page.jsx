"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("agent");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phone, password, role }),
    });

    const j = await res.json().catch(() => ({}));
    if (!res.ok || !j?.ok) {
      setErr(j?.error || "Register failed");
      return;
    }

    setMsg("נרשמת בהצלחה, מעביר לעמוד כניסה...");
    setTimeout(() => router.push("/login"), 800);
  }

  return (
    <main style={{ direction: "rtl", padding: "24px", maxWidth: 420 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>הרשמה</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input placeholder="שם מלא" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input placeholder="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input placeholder="סיסמה" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="agent">agent</option>
          <option value="admin">admin</option>
        </select>
        <button type="submit">יצירת משתמש</button>
      </form>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      <p style={{ marginTop: 12 }}>
        <a href="/login">כבר רשום? התחברות</a>
      </p>
    </main>
  );
}
