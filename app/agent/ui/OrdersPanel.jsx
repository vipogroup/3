"use client";

import { useEffect, useState } from "react";

async function fetchOrders(cursor) {
  const url = new URL("/api/agent/orders", window.location.origin);
  if (cursor) url.searchParams.set("cursor", cursor);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`orders ${res.status}`);
  return res.json();
}

export default function OrdersPanel() {
  const [rows, setRows] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (cursor = null) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchOrders(cursor);
      const items = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.items)
        ? data.items
        : [];

      setRows(cursor ? (prev) => [...prev, ...items] : items);
      setNextCursor(data?.nextCursor || data?.next || null);
    } catch (err) {
      setError(err.message || "orders failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">מכירות</h2>
      {error && <p className="text-red-500 mb-2">שגיאה: {error}</p>}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="p-3 text-left">תאריך</th>
              <th className="p-3 text-left">מוצר</th>
              <th className="p-3 text-left">לקוח</th>
              <th className="p-3 text-left">סכום (₪)</th>
              <th className="p-3 text-left">עמלה (₪)</th>
              <th className="p-3 text-left">סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o._id} className="odd:bg-white/0 even:bg-white/5">
                <td className="p-3">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
                </td>
                <td className="p-3">{o.productName ?? o.productId ?? "-"}</td>
                <td className="p-3">{o.customerEmail ?? o.customerName ?? "-"}</td>
                <td className="p-3">
                  {Number(o.totalAmount ?? o.amount ?? 0).toLocaleString()}
                </td>
                <td className="p-3">
                  {Number(o.commission ?? o.commissionAmount ?? 0).toLocaleString()}
                </td>
                <td className="p-3">{o.status ?? "-"}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td className="p-4" colSpan={6}>
                  אין נתוני מכירות עדיין.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => load(nextCursor)}
          disabled={!nextCursor || loading}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50"
        >
          טען עוד
        </button>
        {loading && <span className="text-sm opacity-70">טוען…</span>}
      </div>
    </section>
  );
}
