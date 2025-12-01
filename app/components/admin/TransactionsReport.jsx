"use client";

import { useEffect, useState, useCallback } from "react";

export default function TransactionsReport() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    since: ""
  });
  const [stats, setStats] = useState({
    count: 0,
    totalAmount: 0,
    avgAmount: 0
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.since) params.append("since", filters.since);

    try {
      const res = await fetch(`/api/admin/transactions?${params}`, { 
        credentials: "include" 
      });
      const data = await res.json();
      
      if (data.ok) {
        setTransactions(data.items || []);
        setStats({
          count: data.count || 0,
          totalAmount: data.totalAmount || 0,
          avgAmount: data.count > 0 ? (data.totalAmount / data.count) : 0
        });
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const statusLabels = {
    pending: { label: "ממתין", color: "bg-yellow-100 text-yellow-800" },
    paid: { label: "שולם", color: "bg-green-100 text-green-800" },
    shipped: { label: "נשלח", color: "bg-blue-100 text-blue-800" },
    completed: { label: "הושלם", color: "bg-purple-100 text-purple-800" }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>פילטרים</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">סטטוס</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 transition-all"
            >
              <option value="">הכל</option>
              <option value="pending">ממתין</option>
              <option value="paid">שולם</option>
              <option value="shipped">נשלח</option>
              <option value="completed">הושלם</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">מתאריך</label>
            <input
              type="date"
              value={filters.since}
              onChange={(e) => setFilters({ ...filters, since: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md" style={{
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">מס׳ עסקאות</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#1e3a8a' }}>{stats.count}</p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md" style={{
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">מחזור כולל</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#16a34a' }}>₪{stats.totalAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' }}>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md" style={{
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">ממוצע עסקה</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#1e3a8a' }}>₪{Math.round(stats.avgAmount).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>עסקאות</h3>
        
        {loading ? (
          <p className="text-center py-8 text-gray-500">טוען...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center py-8 text-gray-500">אין עסקאות להצגה</p>
        ) : (
          <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead style={{ borderBottom: '2px solid #0891b2' }}>
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#1e3a8a' }}>סוכן</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#1e3a8a' }}>מוצר</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#1e3a8a' }}>תאריך</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#1e3a8a' }}>סכום</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#1e3a8a' }}>סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} className="border-b border-gray-100 transition-all" onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="font-medium">{tx.user?.fullName || "לא ידוע"}</div>
                        <div className="text-gray-500">{tx.user?.email || ""}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {tx.product?.title || tx.product?.name || `מוצר ${tx.productId.slice(-6)}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(tx.createdAt).toLocaleDateString("he-IL", {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 font-bold" style={{ color: '#1e3a8a' }}>
                      ₪{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${statusLabels[tx.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {statusLabels[tx.status]?.label || tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {transactions.map((tx) => (
              <div key={tx._id} className="p-3 rounded-lg border-2 border-gray-200 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{tx.user?.fullName || "לא ידוע"}</p>
                    <p className="text-xs text-gray-500">{tx.user?.email || ""}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusLabels[tx.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                    {statusLabels[tx.status]?.label || tx.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{tx.product?.title || tx.product?.name || `מוצר ${tx.productId.slice(-6)}`}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">תאריך:</span>
                    <span className="mr-1">{new Date(tx.createdAt).toLocaleDateString("he-IL")}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">סכום:</span>
                    <span className="mr-1 font-bold" style={{ color: '#1e3a8a' }}>₪{tx.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
}
