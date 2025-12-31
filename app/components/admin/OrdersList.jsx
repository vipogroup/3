'use client';

import { useState, useEffect } from 'react';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(orderId) {
    const order = orders.find((o) => o._id === orderId);
    const label = order ? order._id.slice(-8) : '';
    const confirmed = window.confirm(`האם למחוק את ההזמנה ${label}? לא ניתן לשחזר.`);
    if (!confirmed) return;

    try {
      setError('');
      setDeletingId(orderId);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'מחיקה נכשלה');
      }

      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      setError(err.message);
      fetchOrders();
    } finally {
      setDeletingId('');
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

  // Helper to get customer info from order
  const getCustomerInfo = (order) => ({
    fullName: order.customer?.fullName || order.customerName || '-',
    phone: order.customer?.phone || order.customerPhone || '-',
    email: order.customer?.email || order.customerEmail || '-',
    address: order.customer?.address || '-',
    city: order.customer?.city || '-',
    zipCode: order.customer?.zipCode || '-',
  });

  // Filter and search
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const customer = getCustomerInfo(order);
    const matchesSearch =
      !searchTerm ||
      order._id.includes(searchTerm) ||
      customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
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
                סוכן
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium uppercase"
                style={{ color: '#1e3a8a' }}
              >
                עמלה
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
                סוג מכירה
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
                      <div className="font-medium">{getCustomerInfo(order).fullName}</div>
                      <div className="text-gray-500">{getCustomerInfo(order).phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {order.agent?.fullName || order.agentName ? (
                        <>
                          <div className="font-medium" style={{ color: '#1e3a8a' }}>
                            {order.agent?.fullName || order.agentName}
                          </div>
                          {order.appliedCouponCode && (
                            <code className="text-xs bg-purple-50 text-purple-600 px-1 rounded">
                              {order.appliedCouponCode.toUpperCase()}
                            </code>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400">ללא סוכן</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.commissionAmount > 0 ? (
                      <span className="font-medium" style={{ color: '#16a34a' }}>
                        ₪{order.commissionAmount?.toFixed?.(2) || '0'}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap font-bold"
                    style={{ color: '#1e3a8a' }}
                  >
                    ₪
                    {order?.totals?.totalAmount?.toFixed?.(2) ??
                      order?.totalAmount?.toFixed?.(2) ??
                      '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.orderType === 'group'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {order.orderType === 'group' ? 'קבוצתית' : 'רגילה'}
                    </span>
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
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="w-full text-sm font-medium rounded-lg px-3 py-2 transition-all"
                        style={{
                          background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                          color: 'white',
                        }}
                      >
                        פרטים מלאים
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(order._id)}
                        disabled={deletingId === order._id}
                        className="w-full text-sm font-medium rounded-lg px-3 py-2 transition-all hover:opacity-90"
                        style={{
                          background: deletingId === order._id ? '#f87171' : '#dc2626',
                          color: 'white',
                        }}
                      >
                        {deletingId === order._id ? 'מוחק...' : 'מחק'}
                      </button>
                    </div>
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
                  <p className="text-sm font-medium">{getCustomerInfo(order).fullName}</p>
                  <p className="text-sm text-gray-500">{getCustomerInfo(order).phone}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">סכום</p>
                    <p className="text-lg font-bold" style={{ color: '#1e3a8a' }}>
                      ₪
                      {order?.totals?.totalAmount?.toFixed?.(2) ??
                        order?.totalAmount?.toFixed?.(2) ??
                        '0.00'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">סוג מכירה</p>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.orderType === 'group'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {order.orderType === 'group' ? 'קבוצתית' : 'רגילה'}
                    </span>
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
              <button
                type="button"
                onClick={() => setSelectedOrder(order)}
                className="mt-3 w-full text-sm font-medium rounded-lg px-3 py-2 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                  color: 'white',
                }}
              >
                פרטים מלאים
              </button>
              <button
                type="button"
                onClick={() => handleDelete(order._id)}
                disabled={deletingId === order._id}
                className="mt-2 w-full text-sm font-medium rounded-lg px-3 py-2 transition-all"
                style={{ background: deletingId === order._id ? '#f87171' : '#dc2626', color: 'white' }}
              >
                {deletingId === order._id ? 'מוחק...' : 'מחיקה'}
              </button>
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              border: '3px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 
                  className="text-xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  פרטי הזמנה #{selectedOrder._id.slice(-8)}
                </h3>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Customer Info */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: '#0891b2' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  פרטי לקוח
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">שם:</span>
                    <span className="font-medium">{getCustomerInfo(selectedOrder).fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">טלפון:</span>
                    <span className="font-medium" dir="ltr">{getCustomerInfo(selectedOrder).phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">אימייל:</span>
                    <span className="font-medium text-sm" dir="ltr">{getCustomerInfo(selectedOrder).email}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: '#0891b2' }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  כתובת למשלוח
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">כתובת:</span>
                    <span className="font-medium">{getCustomerInfo(selectedOrder).address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">עיר:</span>
                    <span className="font-medium">{getCustomerInfo(selectedOrder).city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">מיקוד:</span>
                    <span className="font-medium">{getCustomerInfo(selectedOrder).zipCode}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: '#0891b2' }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                  </svg>
                  פריטים בהזמנה
                </h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  {selectedOrder.items?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                          <div>
                            <span className="font-medium">{item.name || 'מוצר'}</span>
                            <span className="text-gray-500 text-sm mr-2">x{item.quantity || item.qty || 1}</span>
                          </div>
                          <span className="font-bold" style={{ color: '#1e3a8a' }}>
                            ₪{((item.unitPrice || item.price || 0) * (item.quantity || item.qty || 1)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">אין פריטים</p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">סה״כ:</span>
                  <span className="font-bold text-xl" style={{ color: '#1e3a8a' }}>
                    ₪{selectedOrder?.totals?.totalAmount?.toFixed?.(2) ?? selectedOrder?.totalAmount?.toFixed?.(2) ?? '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                  <span>תאריך הזמנה:</span>
                  <span>{new Date(selectedOrder.createdAt).toLocaleString('he-IL')}</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-6 w-full py-3 rounded-xl font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
