'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const ROLE_LABELS = {
  admin: { label: 'מנהל', color: 'bg-red-100 text-red-800' },
  agent: { label: 'סוכן', color: 'bg-cyan-100 text-cyan-800' },
  customer: { label: 'לקוח', color: 'bg-blue-100 text-blue-800' },
};

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params?.id) return;
    
    async function loadUser() {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${params.id}`, { credentials: 'include' });
        const json = await res.json();
        
        if (!res.ok) {
          throw new Error(json.error || 'Failed to load user');
        }
        
        setUser(json.user);

        // Load user's orders if agent
        if (json.user?.role === 'agent') {
          const ordersRes = await fetch(`/api/admin/commissions?agentId=${params.id}`, { credentials: 'include' });
          const ordersJson = await ordersRes.json();
          if (ordersRes.ok) {
            setOrders(ordersJson.commissions || []);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, [params?.id]);

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">טוען פרופיל...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => router.back()} 
            className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            חזרה
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const roleInfo = ROLE_LABELS[user.role] || ROLE_LABELS.customer;

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            פרופיל משתמש
          </h1>
        </div>

        {/* User Card */}
        <div 
          className="rounded-xl p-6 mb-6"
          style={{
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              {user.fullName?.charAt(0) || '?'}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">{user.fullName || 'ללא שם'}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
              </div>
              
              {user.couponCode && (
                <code className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-bold">
                  {user.couponCode.toUpperCase()}
                </code>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contact Info */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              פרטי קשר
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">טלפון:</span>
                <span className="font-medium">{user.phone || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">אימייל:</span>
                <span className="font-medium text-sm">{user.email || '-'}</span>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              פרטי חשבון
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">תאריך הרשמה:</span>
                <span className="font-medium">{formatDate(user.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">סטטוס:</span>
                <span className={`font-medium ${user.isActive !== false ? 'text-green-600' : 'text-red-600'}`}>
                  {user.isActive !== false ? 'פעיל' : 'לא פעיל'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Specific Info */}
        {user.role === 'agent' && (
          <>
            {/* Commission Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                נתוני עמלות
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>
                    ₪{(user.commissionBalance || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">יתרה נוכחית</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">
                    ₪{(user.commissionOnHold || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">בהמתנה</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {user.commissionPercent || 0}%
                  </p>
                  <p className="text-xs text-gray-500">אחוז עמלה</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {user.discountPercent || 0}%
                  </p>
                  <p className="text-xs text-gray-500">אחוז הנחה</p>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            {user.bankDetails && (
              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  פרטי בנק להעברת עמלות
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500 text-sm">שם הבנק:</span>
                    <p className="font-medium">{user.bankDetails.bankName || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">סניף:</span>
                    <p className="font-medium">{user.bankDetails.branchNumber || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">מספר חשבון:</span>
                    <p className="font-medium">{user.bankDetails.accountNumber || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">שם בעל החשבון:</span>
                    <p className="font-medium">{user.bankDetails.accountName || '-'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Orders */}
            {orders.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  עמלות אחרונות ({orders.length})
                </h3>
                <div className="space-y-2">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.orderId} className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.orderDate)}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-green-600">₪{order.commissionAmount?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">מתוך ₪{order.orderTotal?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link 
                  href={`/admin/commissions?agentId=${params.id}`}
                  className="block text-center mt-4 text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                >
                  צפה בכל העמלות →
                </Link>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Link
            href="/admin/users"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
          >
            חזרה לרשימה
          </Link>
          <Link
            href={`/admin/commissions?agentId=${params.id}`}
            className="px-4 py-2 text-white rounded-lg transition-all"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            צפה בעמלות
          </Link>
        </div>
      </div>
    </div>
  );
}
