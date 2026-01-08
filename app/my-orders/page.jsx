'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import MainLayout from '@/app/components/layout/MainLayout';

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

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

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '✓' };
      case 'pending':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: '⏳' };
      case 'processing':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '📦' };
      case 'shipped':
        return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: '🚚' };
      case 'cancelled':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: '✗' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: '•' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'הושלמה';
      case 'pending': return 'ממתינה לתשלום';
      case 'processing': return 'בהכנה';
      case 'shipped': return 'נשלחה';
      case 'cancelled': return 'בוטלה';
      default: return status;
    }
  };

  const formatOrderId = (id) => {
    if (!id) return '';
    return '#' + id.slice(-6).toUpperCase();
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Hero Header with Wave */}
        <div className="relative">
          <div 
            className="relative px-4 pt-6 pb-16"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-10 right-10 w-20 h-20 bg-white/5 rounded-full" />
            <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/5 rounded-full" />

            <div className="max-w-2xl mx-auto relative z-10">
              {/* Back Button & Title */}
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={() => router.back()} 
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all border border-white/20"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">ההזמנות שלי</h1>
                  <p className="text-white/70 text-sm">היסטוריית הזמנות ומעקב משלוחים</p>
                </div>
              </div>

              {/* Stats Cards */}
              {!loading && orders.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 text-center border border-white/20">
                    <p className="text-xl font-bold text-white">{orders.length}</p>
                    <p className="text-[10px] text-white/70">הזמנות</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 text-center border border-white/20">
                    <p className="text-xl font-bold text-white">{orders.filter(o => o.status === 'completed').length}</p>
                    <p className="text-[10px] text-white/70">הושלמו</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 text-center border border-white/20">
                    <p className="text-base font-bold text-white">₪{totalSpent.toLocaleString('he-IL')}</p>
                    <p className="text-[10px] text-white/70">סה״כ קניות</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto" preserveAspectRatio="none">
              <path d="M0 120V60C240 100 480 20 720 60C960 100 1200 20 1440 60V120H0Z" fill="#f9fafb"/>
            </svg>
          </div>
        </div>

        <div className="px-4 max-w-2xl mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div 
                className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
                style={{ borderColor: '#0891b2', borderTopColor: 'transparent' }}
              />
              <p className="text-gray-500 mt-4">טוען הזמנות...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <div 
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)' }}
              >
                <svg className="w-10 h-10" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">עדיין לא ביצעת הזמנות</h2>
              <p className="text-gray-500 mb-6">התחל לקנות מוצרים כדי לראות את ההזמנות שלך כאן</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                לצפייה במוצרים
              </Link>
            </div>
          ) : (
            <>
              {/* Filter Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {[
                  { key: 'all', label: 'הכל' },
                  { key: 'pending', label: 'ממתינות' },
                  { key: 'processing', label: 'בהכנה' },
                  { key: 'completed', label: 'הושלמו' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      filter === tab.key
                        ? 'text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                    style={filter === tab.key ? { background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' } : {}}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const status = getStatusStyle(order.status);
                  return (
                    <div
                      key={order._id}
                      className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md"
                      style={{ border: '1px solid rgba(8, 145, 178, 0.15)' }}
                    >
                      {/* Order Header */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-gray-900">{formatOrderId(order._id)}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString('he-IL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.bg} ${status.text} border ${status.border}`}>
                            <span>{status.icon}</span>
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        {/* Items Preview */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex -space-x-2">
                            {order.items?.slice(0, 3).map((item, idx) => (
                              <div 
                                key={idx} 
                                className="w-10 h-10 rounded-lg border-2 border-white bg-gray-100 overflow-hidden shadow-sm"
                              >
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            ))}
                            {order.items?.length > 3 && (
                              <div className="w-10 h-10 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{order.items?.length || 0} פריטים</p>
                        </div>

                        {/* Total & Actions */}
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold" style={{ color: '#1e3a8a' }}>
                            ₪{order.totalAmount?.toLocaleString('he-IL')}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                              className="px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1"
                              style={{ 
                                background: 'rgba(8, 145, 178, 0.1)', 
                                color: '#0891b2' 
                              }}
                            >
                              {expandedOrder === order._id ? 'הסתר' : 'פרטים'}
                              <svg 
                                className={`w-4 h-4 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedOrder === order._id && (
                        <div className="border-t bg-gray-50 p-4">
                          {/* Order Tracking */}
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">מעקב הזמנה:</p>
                            <div className="flex items-center justify-between relative">
                              {/* Progress Line */}
                              <div className="absolute top-4 right-4 left-4 h-1 bg-gray-200 rounded-full">
                                <div 
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ 
                                    background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)',
                                    width: order.status === 'pending' ? '0%' : 
                                           order.status === 'processing' ? '33%' : 
                                           order.status === 'shipped' ? '66%' : 
                                           order.status === 'completed' ? '100%' : '0%'
                                  }}
                                />
                              </div>
                              
                              {/* Steps */}
                              {[
                                { key: 'pending', label: 'התקבלה', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                                { key: 'processing', label: 'בהכנה', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                                { key: 'shipped', label: 'נשלחה', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' },
                                { key: 'completed', label: 'נמסרה', icon: 'M5 13l4 4L19 7' },
                              ].map((step, idx) => {
                                const steps = ['pending', 'processing', 'shipped', 'completed'];
                                const currentIdx = steps.indexOf(order.status);
                                const stepIdx = steps.indexOf(step.key);
                                const isActive = stepIdx <= currentIdx;
                                const isCurrent = step.key === order.status;
                                
                                return (
                                  <div key={step.key} className="flex flex-col items-center relative z-10">
                                    <div 
                                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                        isCurrent ? 'ring-4 ring-cyan-100' : ''
                                      }`}
                                      style={{ 
                                        background: isActive 
                                          ? 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' 
                                          : '#e5e7eb'
                                      }}
                                    >
                                      <svg 
                                        className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                                      </svg>
                                    </div>
                                    <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                      {step.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <p className="text-sm font-medium text-gray-700 mb-3">פריטים בהזמנה:</p>
                          <div className="space-y-3">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-white rounded-xl p-3">
                                <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                  {item.image ? (
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={56}
                                      height={56}
                                      className="w-full h-full object-cover"
                                      unoptimized
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                  <p className="text-sm text-gray-500">כמות: {item.quantity || 1}</p>
                                </div>
                                <p className="font-bold" style={{ color: '#1e3a8a' }}>
                                  ₪{(item.totalPrice || item.unitPrice || 0).toLocaleString('he-IL')}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Order Summary */}
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                            {order.discountAmount > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">הנחה:</span>
                                <span className="text-emerald-600 font-medium">-₪{order.discountAmount?.toLocaleString('he-IL')}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-lg font-bold">
                              <span>סה״כ:</span>
                              <span style={{ color: '#1e3a8a' }}>₪{order.totalAmount?.toLocaleString('he-IL')}</span>
                            </div>
                          </div>

                          {/* Reorder Button */}
                          <Link
                            href="/shop"
                            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium transition-all hover:scale-[1.02]"
                            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            הזמן שוב
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredOrders.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <p className="text-gray-500">אין הזמנות בסטטוס זה</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
