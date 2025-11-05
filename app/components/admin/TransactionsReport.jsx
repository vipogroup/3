"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  async function fetchTransactions() {
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
  }

  const statusLabels = {
    pending: { label: "ממתין", color: "bg-yellow-100 text-yellow-800" },
    paid: { label: "שולם", color: "bg-green-100 text-green-800" },
    shipped: { label: "נשלח", color: "bg-blue-100 text-blue-800" },
    completed: { label: "הושלם", color: "bg-purple-100 text-purple-800" }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">פילטרים</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">סטטוס</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
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
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">מס׳ עסקאות</p>
              <p className="text-3xl font-bold text-blue-600">{stats.count}</p>
            </div>
            <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl">
              📊
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">מחזור כולל</p>
              <p className="text-3xl font-bold text-green-600">₪{stats.totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl">
              💰
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">ממוצע עסקה</p>
              <p className="text-3xl font-bold text-purple-600">₪{Math.round(stats.avgAmount).toLocaleString()}</p>
            </div>
            <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl">
              📈
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">עסקאות</h3>
        
        {loading ? (
          <p className="text-center py-8 text-gray-500">טוען...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center py-8 text-gray-500">אין עסקאות להצגה</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">סוכן</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">מוצר</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">תאריך</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">סכום</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50">
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
                    <td className="px-4 py-3 font-semibold">
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
        )}
      </div>
    </div>
  );
}
