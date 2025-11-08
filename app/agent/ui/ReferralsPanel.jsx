"use client";

import { useEffect, useState } from "react";

async function fetchReferrals(kind, cursor) {
  const url = new URL("/api/agent/referrals", window.location.origin);
  url.searchParams.set("kind", kind);
  if (cursor) url.searchParams.set("cursor", cursor);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${kind} ${res.status}`);
  return res.json();
}

function formatValue(value, fallback = "-") {
  if (!value) return fallback;
  return value;
}

function ReferralsList({ kind }) {
  const [rows, setRows] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setRows([]);
    setNextCursor(null);
    load(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  const load = async (cursor = null) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchReferrals(kind, cursor);
      const items = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.items)
        ? data.items
        : [];

      setRows(cursor ? (prev) => [...prev, ...items] : items);
      setNextCursor(data?.nextCursor || data?.next || null);
    } catch (err) {
      setError(err.message || `${kind} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <p className="text-red-500 mb-2">שגיאה: {error}</p>}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="p-3 text-left">תאריך</th>
              <th className="p-3 text-left">
                {kind === "clicks" ? "מוצר" : "שם"}
              </th>
              <th className="p-3 text-left">
                {kind === "clicks" ? "Slug / מזהה" : "אימייל/טלפון"}
              </th>
              <th className="p-3 text-left">
                {kind === "clicks" ? "מכשיר / IP" : "מספר מזהה"}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id} className="odd:bg-white/0 even:bg-white/5">
                <td className="p-3">
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                </td>
                {kind === "clicks" ? (
                  <>
                    <td className="p-3">{formatValue(row.productName || row.productSlug)}</td>
                    <td className="p-3">{formatValue(row.productSlug || row.productId)}</td>
                    <td className="p-3">{formatValue(row.userAgent || row.ip)}</td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{formatValue(row.fullName || row.name)}</td>
                    <td className="p-3">
                      {formatValue(row.email, "-")}
                      {row.phone ? ` / ${row.phone}` : ""}
                    </td>
                    <td className="p-3">{formatValue(row._id)}</td>
                  </>
                )}
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td className="p-4" colSpan={4}>
                  אין נתונים.
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
    </>
  );
}

export default function ReferralsPanel() {
  const [tab, setTab] = useState("clicks");

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Referrals</h2>
      <div className="mb-3 flex gap-2">
        {[
          { key: "clicks", label: "קליקים" },
          { key: "leads", label: "לידים" },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`px-3 py-2 rounded-lg border border-white/10 ${
              tab === key ? "bg-white/20" : "bg-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <ReferralsList kind={tab} />
    </section>
  );
}
