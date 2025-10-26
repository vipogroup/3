"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassButton({ id }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();

  async function reset() {
    setErr("");
    const res = await fetch(`/api/users/${id}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error || "שגיאה באיפוס סיסמה");
      return;
    }
    setOpen(false);
    setPassword("");
    router.refresh();
  }

  return (
    <div>
      <button onClick={() => setOpen((v) => !v)}>{open ? "בטל" : "איפוס סיסמה"}</button>
      {open && (
        <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          <input type="password" value={password} placeholder="סיסמה חדשה" onChange={(e) => setPassword(e.target.value)} />
          <button disabled={pending} onClick={() => start(reset)}>{pending ? "מעדכן..." : "עדכן"}</button>
          {err && <span style={{ color: "crimson" }}>{err}</span>}
        </span>
      )}
    </div>
  );
}
