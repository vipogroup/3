"use client";

import { useEffect, useState } from "react";

const metrics = [
  { k: "newCustomers", t: "לקוחות חדשים" },
  { k: "activeAgents", t: "סוכנים פעילים" },
  { k: "ordersCount", t: "כמות הזמנות" },
  { k: "gmv", t: "מחזור (GMV)" },
];

export default function ReportsClient() {
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
  }, [q]);

  return (
    <main className="min-h-screen bg-white p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>דוחות וביצועים</h1>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {metrics.map((c) => (
          <div key={c.k} className="rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md" style={{
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box'
          }}>
            <div className="text-xs sm:text-sm text-gray-500 mb-1">{c.t}</div>
            <div className="text-lg sm:text-2xl font-bold" style={{ color: '#1e3a8a' }}>{overview?.[c.k] ?? "—"}</div>
          </div>
        ))}
        <div className="col-span-2 lg:col-span-4 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md" style={{
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box'
        }}>
          <div className="text-xs sm:text-sm text-gray-500 mb-1">עמלות (10%)</div>
          <div className="text-lg sm:text-2xl font-bold" style={{ color: '#1e3a8a' }}>{overview?.commissions ?? "—"}</div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold" style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>לפי מוצר</h2>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ borderBottom: '2px solid #0891b2' }}>
              <tr>
                <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#1e3a8a' }}>מוצר</th>
                <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>כמות</th>
                <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>הכנסה</th>
              </tr>
            </thead>
            <tbody>
              {byProduct.map((r) => (
                <tr key={r._id || r.productName} className="border-b border-gray-100 transition-all" onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                  <td className="px-4 py-3 text-gray-900">{r.productName || r._id || "—"}</td>
                  <td className="px-4 py-3 text-center text-gray-900">{r.qty}</td>
                  <td className="px-4 py-3 text-center font-semibold" style={{ color: '#1e3a8a' }}>₪{r.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {/* Mobile Cards */}
          <div className="md:hidden p-4">
            <div className="space-y-3">
              {byProduct.map((r) => (
                <div key={r._id || r.productName} className="p-3 rounded-lg border-2 border-gray-200 bg-white">
                  <p className="text-sm font-semibold text-gray-900 mb-2">{r.productName || r._id || "—"}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">כמות:</span>
                      <span className="mr-1 font-medium">{r.qty}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">הכנסה:</span>
                      <span className="mr-1 font-bold" style={{ color: '#1e3a8a' }}>₪{r.revenue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold" style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>לפי סוכן</h2>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ borderBottom: '2px solid #0891b2' }}>
              <tr>
                <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#1e3a8a' }}>מזהה סוכן</th>
                <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>הזמנות</th>
                <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>GMV</th>
                <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>עמלות (10%)</th>
              </tr>
            </thead>
            <tbody>
              {byAgent.map((r) => (
                <tr key={r._id || `agent-${Math.random()}`} className="border-b border-gray-100 transition-all" onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                  <td className="px-4 py-3 text-gray-900">{r._id || "—"}</td>
                  <td className="px-4 py-3 text-center text-gray-900">{r.orders}</td>
                  <td className="px-4 py-3 text-center font-semibold" style={{ color: '#1e3a8a' }}>₪{r.gmv}</td>
                  <td className="px-4 py-3 text-center font-semibold" style={{ color: '#16a34a' }}>₪{r.commissions}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {/* Mobile Cards */}
          <div className="md:hidden p-4">
            <div className="space-y-3">
              {byAgent.map((r) => (
                <div key={r._id || `agent-${Math.random()}`} className="p-3 rounded-lg border-2 border-gray-200 bg-white">
                  <p className="text-sm font-semibold text-gray-900 mb-2">סוכן: {r._id || "—"}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">הזמנות:</span>
                      <span className="mr-1 font-medium">{r.orders}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">GMV:</span>
                      <span className="mr-1 font-bold" style={{ color: '#1e3a8a' }}>₪{r.gmv}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">עמלות:</span>
                      <span className="mr-1 font-bold" style={{ color: '#16a34a' }}>₪{r.commissions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </div>
    </main>
  );
}
