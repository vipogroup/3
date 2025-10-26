"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function CreateUserForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("agent");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();

  async function create() {
    setErr("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phone, role, password }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error || "שגיאה ביצירת משתמש");
      return;
    }
    setFullName("");
    setPhone("");
    setPassword("");
    setRole("agent");
    router.refresh();
  }

  return (
    <section style={{ marginTop: 12, marginBottom: 12 }}>
      <h2>צור משתמש</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input placeholder="שם מלא" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <input placeholder="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="agent">agent</option>
          <option value="admin">admin</option>
        </select>
        <input placeholder="סיסמה" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={pending} onClick={() => start(create)}>
          {pending ? "יוצר..." : "צור"}
        </button>
      </div>
      {err && <div style={{ color: "crimson" }}>{err}</div>}
    </section>
  );
}
