"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function EditUserButton({ user }) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [role, setRole] = useState(user?.role || "agent");
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();

  async function save() {
    setErr("");
    const res = await fetch(`/api/users/${user._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phone, role }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error || "שגיאה בעדכון משתמש");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <div>
      <button onClick={() => setOpen((v) => !v)}>{open ? "בטל" : "ערוך"}</button>
      {open && (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="שם מלא" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="טלפון" />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="agent">agent</option>
            <option value="admin">admin</option>
          </select>
          <button disabled={pending} onClick={() => start(save)}>{pending ? "שומר..." : "שמור"}</button>
          {err && <span style={{ color: "crimson" }}>{err}</span>}
        </div>
      )}
    </div>
  );
}
