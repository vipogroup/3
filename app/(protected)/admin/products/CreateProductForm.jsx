"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function CreateProductForm() {
  const [sku, setSku] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState("ILS");
  const [active, setActive] = useState(true);
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();

  async function create() {
    setErr("");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku, title, price: Number(price), currency, active }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error || "שגיאה ביצירת מוצר");
      return;
    }
    setSku("");
    setTitle("");
    setPrice(0);
    setCurrency("ILS");
    setActive(true);
    router.refresh();
  }

  return (
    <section style={{ marginTop: 12, marginBottom: 12 }}>
      <h2>צור מוצר</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
        <input placeholder="כותרת" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="מחיר" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="ILS">ILS</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        <label style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> פעיל
        </label>
        <button disabled={pending} onClick={() => start(create)}>
          {pending ? "יוצר..." : "צור"}
        </button>
      </div>
      {err && <div style={{ color: "crimson" }}>{err}</div>}
    </section>
  );
}
