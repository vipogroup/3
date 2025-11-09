"use client";
import { useEffect, useState } from "react";

export default function AdminReports() {
  const [overview, setOverview] = useState(null);
  const [byProduct, setByProduct] = useState([]);
  const [byAgent, setByAgent] = useState([]);

  const q = "";

  useEffect(() => {
    fetch(`/api/admin/reports/overview${q}`)
      .then((r) => r.json())
      .then((d) => setOverview(d.data));

    fetch(`/api/admin/reports/by-product${q}`)
      .then((r) => r.json())
      .then((d) => setByProduct(d.items || []));

    fetch(`/api/admin/reports/by-agent${q}`)
      .then((r) => r.json())
      .then((d) => setByAgent(d.items || []));
  }, []);

  return (
    <main className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">דוחות מנהל</h1>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { k: "newCustomers", t: "לקוחות חדשים" },
          { k: "activeAgents", t: "סוכנים פעילים" },
          { k: "ordersCount", t: "כמות הזמנות" },
          { k: "gmv", t: "מחזור (GMV)" },
        ].map((c) => (
          <div key={c.k} className="rounded-2xl bg-white/60 p-5 shadow">
            <div className="text-sm text-gray-500">{c.t}</div>
            <div className="text-2xl font-semibold">{overview?.[c.k] ?? "—"}</div>
          </div>
        ))}
        <div className="rounded-2xl bg-white/60 p-5 shadow md:col-span-4">
          <div className="text-sm text-gray-500">עמלות (10%)</div>
          <div className="text-2xl font-semibold">{overview?.commissions ?? "—"}</div>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">לפי מוצר</h2>
        <div className="overflow-auto rounded-2xl bg-white/60 shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">מוצר</th>
                <th className="p-3">כמות</th>
                <th className="p-3">הכנסה</th>
              </tr>
            </thead>
            <tbody>
              {byProduct.map((r) => (
                <tr key={r._id || r.productName} className="border-t">
                  <td className="p-3">{r.productName || r._id || "—"}</td>
                  <td className="p-3 text-center">{r.qty}</td>
                  <td className="p-3 text-center">{r.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">לפי סוכן</h2>
        <div className="overflow-auto rounded-2xl bg-white/60 shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">AgentId</th>
                <th className="p-3">הזמנות</th>
                <th className="p-3">GMV</th>
                <th className="p-3">עמלות (10%)</th>
              </tr>
            </thead>
            <tbody>
              {byAgent.map((r) => (
                <tr key={r._id || `agent-${Math.random()}`} className="border-t">
                  <td className="p-3">{r._id || "—"}</td>
                  <td className="p-3 text-center">{r.orders}</td>
                  <td className="p-3 text-center">{r.gmv}</td>
                  <td className="p-3 text-center">{r.commissions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
