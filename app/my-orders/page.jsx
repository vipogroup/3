'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/app/components/layout/MainLayout';

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    async function fetchMyOrders() {
      try {
        const res = await fetch('/api/my-orders');
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch orders');
        }
        const data = await res.json();
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('שגיאה בטעינת ההזמנות');
      } finally {
        setLoading(false);
      }
    }

    fetchMyOrders();
  }, [router]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'הושלמה';
      case 'pending':
        return 'ממתינה';
      case 'cancelled':
        return 'בוטלה';
      default:
        return status;
    }
  };

  return (
    <MainLayout>
      <div className="px-4 sm:px-0 pb-20">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="חזרה">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <h1
              className="text-xl sm:text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ההזמנות שלי
            </h1>
          </div>
          <div
            className="h-1 w-20 rounded-full mt-2"
            style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)' }}
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
          </div>
        ) : orders.length === 0 ? (
          <div
            className="rounded-xl p-6 text-center"
            style={{
              border: '2px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-500 text-sm">עדיין לא ביצעת הזמנות</p>
            <a
              href="/products"
              className="inline-block mt-3 px-5 py-2 text-white rounded-lg text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              לצפייה במוצרים
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden"
                style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('he-IL')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">
                        {order.items?.length || 0} פריטים
                      </p>
                    </div>
                    <p className="text-base font-bold flex-shrink-0" style={{ color: '#1e3a8a' }}>
                      {order.totalAmount?.toLocaleString('he-IL')} ₪
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className="mt-2 w-full text-xs py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                    style={{ color: '#0891b2', backgroundColor: 'rgba(8, 145, 178, 0.1)' }}
                  >
                    {expandedOrder === order._id ? 'הסתר פרטים' : 'צפה בפרטי ההזמנה'}
                    <svg 
                      className={`w-3 h-3 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order._id && (
                  <div className="border-t px-3 py-3 bg-gray-50 text-sm">
                    <p className="text-xs text-gray-500 mb-2">פריטים בהזמנה:</p>
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">כמות: {item.quantity || 1}</p>
                          </div>
                          <p className="text-sm" style={{ color: '#1e3a8a' }}>
                            {(item.totalPrice || item.unitPrice || 0).toLocaleString('he-IL')} ₪
                          </p>
                        </div>
                      ))}
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="mt-2 pt-2 border-t flex justify-between text-xs">
                        <span className="text-gray-500">הנחה:</span>
                        <span className="text-green-600">-{order.discountAmount?.toLocaleString('he-IL')} ₪</span>
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t flex justify-between font-bold">
                      <span>סה״כ:</span>
                      <span style={{ color: '#1e3a8a' }}>{order.totalAmount?.toLocaleString('he-IL')} ₪</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
