"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function EditProductButton({ product }) {
  const [open, setOpen] = useState(false);
  const [sku, setSku] = useState(product?.sku || "");
  const [title, setTitle] = useState(product?.title || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [currency, setCurrency] = useState(product?.currency || "ILS");
  const [active, setActive] = useState(Boolean(product?.active));
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();

  async function save() {
    setErr("");
    const res = await fetch(`/api/products/${product._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku, title, price: Number(price), currency, active }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error || "שגיאה בעדכון מוצר");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <div>
      <button onClick={() => setOpen((v) => !v)}>{open ? "בטל" : "ערוך"}</button>
      {open && (
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
          <button disabled={pending} onClick={() => start(save)}>{pending ? "שומר..." : "שמור"}</button>
          {err && <span style={{ color: "crimson" }}>{err}</span>}
        </div>
      )}
    </div>
  );
}
