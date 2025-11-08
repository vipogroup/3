"use client";
import { useEffect, useState } from "react";

export default function AdminAuditPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });

  async function load(page = 1) {
    const res = await fetch(`/api/admin/audit?page=${page}&limit=${meta.limit}`, {
      cache: "no-store",
    });
    const data = await res.json();
    setItems(data.items || []);
    setMeta({ total: data.total || 0, page: data.page || 1, limit: data.limit || 20 });
  }

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageCount = Math.max(1, Math.ceil(meta.total / meta.limit));

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Audit Log</h1>

      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Time</th>
              <th className="p-2 text-left">Action</th>
              <th className="p-2 text-left">Actor</th>
              <th className="p-2 text-left">Target</th>
              <th className="p-2 text-left">Metadata</th>
              <th className="p-2 text-left">IP</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row._id} className="border-t">
                <td className="p-2">{new Date(row.createdAt).toLocaleString()}</td>
                <td className="p-2">{row.action}</td>
                <td className="p-2">
                  {row.actorType} {row.actorId ? "#" + String(row.actorId).slice(-6) : ""}
                </td>
                <td className="p-2">
                  {row.targetType} {row.targetId ? "#" + String(row.targetId).slice(-6) : ""}
                </td>
                <td className="p-2 text-xs whitespace-pre-wrap">
                  {JSON.stringify(row.metadata || {}, null, 2)}
                </td>
                <td className="p-2">{row.ip || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="border rounded px-3 py-1"
          disabled={meta.page <= 1}
          onClick={() => load(meta.page - 1)}
        >
          Prev
        </button>

        <span>Page {meta.page} / {pageCount}</span>

        <button
          className="border rounded px-3 py-1"
          disabled={meta.page >= pageCount}
          onClick={() => load(meta.page + 1)}
        >
          Next
        </button>
      </div>
    </main>
  );
}
