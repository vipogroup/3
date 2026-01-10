'use client';

import { useEffect, useState } from 'react';

export default function TransactionsCard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    avgAmount: 0,
  });

  useEffect(() => {
    fetch('/api/transactions', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.items) {
          setTransactions(data.items);
          calculateStats(data.items);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  function calculateStats(items) {
    const total = items.length;
    const totalAmount = items.reduce((sum, t) => sum + (t.amount || 0), 0);
    const avgAmount = total > 0 ? totalAmount / total : 0;

    setStats({ total, totalAmount, avgAmount });
  }

  const statusLabels = {
    pending: { label: 'ממתין', color: 'bg-yellow-100 text-yellow-800' },
    paid: { label: 'שולם', color: 'bg-green-100 text-green-800' },
    shipped: { label: 'נשלח', color: 'bg-blue-100 text-blue-800' },
    completed: { label: 'הושלם', color: 'bg-purple-100 text-purple-800' },
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">העסקאות שלי</h3>
        <p className="text-gray-500">טוען...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header with KPIs */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">העסקאות שלי</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">סה״כ עסקאות</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">מחזור מכירות</p>
            <p className="text-2xl font-bold text-green-600">
              ₪{stats.totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">ממוצע עסקה</p>
            <p className="text-2xl font-bold text-purple-600">
              ₪{Math.round(stats.avgAmount).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-2 flex justify-center">
            <svg className="w-8 h-8" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p>אין עדיין עסקאות</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  מוצר
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  תאריך
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  סכום
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  סטטוס
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {tx.product?.title || tx.product?.name || `מוצר ${tx.productId.slice(-6)}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(tx.createdAt).toLocaleDateString('he-IL')}
                  </td>
                  <td className="px-4 py-3 font-semibold">₪{tx.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${statusLabels[tx.status]?.color || 'bg-gray-100 text-gray-800'}`}
                    >
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
  );
}
