"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/app/components/layout/MainLayout";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch orders");
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("שגיאה בטעינת ההזמנות");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "הושלמה";
      case "pending":
        return "ממתינה";
      case "cancelled":
        return "בוטלה";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="bg-white rounded-xl p-8" style={{
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 4px 20px rgba(8, 145, 178, 0.15)'
          }}>
            <div className="animate-spin rounded-full h-12 w-12 mx-auto" style={{
              border: '4px solid rgba(8, 145, 178, 0.2)',
              borderTopColor: '#0891b2'
            }}></div>
            <p className="text-gray-600 mt-4 text-center font-medium">טוען הזמנות...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 
              className="text-4xl font-bold mb-2"
              style={{ 
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              ההזמנות שלי
            </h1>
            <div className="h-1 w-32 rounded-full" style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)' }} />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-xl p-12" style={{
                border: '2px solid transparent',
                backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                boxShadow: '0 4px 20px rgba(8, 145, 178, 0.15)'
              }}>
                <svg className="w-24 h-24 mx-auto mb-4" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">אין הזמנות עדיין</h2>
                <p className="text-gray-600 mb-6">התחל לקנות מוצרים כדי לראות את ההזמנות שלך כאן</p>
                <Link 
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-md"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(8, 145, 178, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  עבור לחנות
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order._id}
                  className="bg-white rounded-xl p-6 transition-all hover:shadow-lg"
                  style={{
                    border: '2px solid transparent',
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    boxShadow: '0 4px 20px rgba(8, 145, 178, 0.15)'
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          הזמנה #{order._id?.slice(-6)}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        תאריך: {new Date(order.createdAt).toLocaleDateString('he-IL')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items?.length || 0} פריטים
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="text-sm text-gray-600">סה"כ</p>
                        <p className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>
                          ₪{order.total?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <Link
                        href={`/orders/${order._id}`}
                        className="px-4 py-2 rounded-lg font-medium transition-all"
                        style={{
                          backgroundColor: 'white',
                          border: '2px solid #1e3a8a',
                          color: '#1e3a8a'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.color = '#1e3a8a';
                        }}
                      >
                        צפה בפרטים
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
