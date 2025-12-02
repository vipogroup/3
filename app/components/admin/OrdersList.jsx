'use client';

import { useState, useEffect } from 'react';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      setError('');
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update status');
      }

      // Optimistic UI update
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      setError(err.message);
      fetchOrders(); // Revert on error
    }
  }

  // Filter and search
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch =
      !searchTerm ||
      order._id.includes(searchTerm) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone?.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const statusOptions = [
    { value: 'pending', label: 'ממתין', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid', label: 'שולם', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'בוטל', color: 'bg-red-100 text-red-800' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          className="bg-white rounded-xl p-8"
          style={{
            border: '2px solid transparent',
            backgroundImage:
              'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 4px 20px rgba(8, 145, 178, 0.15)',
          }}
        >
          <div
            className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
            style={{
              border: '4px solid rgba(8, 145, 178, 0.2)',
              borderTopColor: '#0891b2',
            }}
          ></div>
          <p className="text-gray-600 text-center font-medium">טוען הזמנות...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              רשימת הזמנות
            </h2>
            <p className="text-gray-600">סה״כ {filteredOrders.length} הזמנות</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="חיפוש לפי מזהה, אימייל או טלפון..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 rounded-xl transition-all"
              style={{ borderColor: '#e5e7eb' }}
              onFocus={(e) => (e.target.style.borderColor = '#0891b2')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border-2 rounded-xl transition-all"
            style={{ borderColor: '#e5e7eb', minWidth: '200px' }}
          >
            <option value="all">כל הסטטוסים</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 font-medium">
          {error}
        </div>
      )}

      {/* Desktop Table - Hidden on mobile */}
      <div
        className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden"
        style={{
          border: '2px solid transparent',
          backgroundImage:
            'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '2px solid #0891b2' }}>
              <th
                className="px-6 py-3 text-right text-xs font-medium uppercase"
                style={{ color: '#1e3a8a' }}
              >
                מזהה
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium uppercase"
                style={{ color: '#1e3a8a' }}
              >
                לקוח
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium uppercase"
                style={{ color: '#1e3a8a' }}
              >
                סכום
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium uppercase"
                style={{ color: '#1e3a8a' }}
              >
                סטטוס
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium uppercase"
                style={{ color: '#1e3a8a' }}
              >
                תאריך
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium uppercase"
                style={{ color: '#1e3a8a' }}
              >
                פעולות
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => {
              const statusOption = statusOptions.find((s) => s.value === order.status);

              return (
                <tr
                  key={order._id}
                  className="border-b border-gray-100 transition-all"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)')
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                    {order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div>{order.customerEmail || '-'}</div>
                      <div className="text-gray-500">{order.customerPhone || '-'}</div>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap font-bold"
                    style={{ color: '#1e3a8a' }}
                  >
                    ₪{order.totalAmount?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusOption?.color}`}>
                      {statusOption?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('he-IL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border-2 rounded-lg px-2 py-1 text-sm cursor-pointer transition-all"
                      style={{ borderColor: '#0891b2' }}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || filter !== 'all' ? 'לא נמצאו הזמנות מתאימות' : 'אין הזמנות במערכת'}
          </div>
        )}
      </div>

      {/* Mobile Cards - Visible only on mobile */}
      <div className="md:hidden space-y-4">
        {filteredOrders.map((order) => {
          const statusOption = statusOptions.find((s) => s.value === order.status);

          return (
            <div
              key={order._id}
              className="bg-white rounded-xl p-4 shadow-lg"
              style={{
                border: '2px solid transparent',
                backgroundImage:
                  'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">מזהה הזמנה</p>
                  <p className="font-mono text-sm font-semibold">{order._id.slice(-8)}</p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${statusOption?.color}`}>
                  {statusOption?.label}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <p className="text-xs text-gray-500">לקוח</p>
                  <p className="text-sm">{order.customerEmail || '-'}</p>
                  <p className="text-sm text-gray-500">{order.customerPhone || '-'}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">סכום</p>
                    <p className="text-lg font-bold" style={{ color: '#1e3a8a' }}>
                      ₪{order.totalAmount?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">תאריך</p>
                    <p className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">עדכון סטטוס</p>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="w-full border-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-all"
                  style={{ borderColor: '#0891b2' }}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
        {filteredOrders.length === 0 && (
          <div
            className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-lg"
            style={{
              border: '2px solid transparent',
              backgroundImage:
                'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            {searchTerm || filter !== 'all' ? 'לא נמצאו הזמנות מתאימות' : 'אין הזמנות במערכת'}
          </div>
        )}
      </div>
    </div>
  );
}
