'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CustomerNav from './CustomerNav';
import { buildManagerWhatsAppUrl } from '@/lib/whatsapp';

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: '', email: '', phone: '' });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState(null);
  const router = useRouter();

  const gradientStyle = useMemo(
    () => ({
      background:
        'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
    }),
    [],
  );

  const fetchUserData = useCallback(async () => {
    try {
      const res = await fetch('/api/users/me', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (!data?.user) {
          router.push('/login');
          return;
        }

        if (data.user.role !== 'customer') {
          router.push(data.user.role === 'admin' ? '/admin' : '/agent');
          return;
        }

        setUser(data.user);
        setProfileForm({
          fullName: data.user.fullName || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
        });
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, [fetchUserData, fetchOrders]);

  async function handleUpgradeToAgent() {
    try {
      setUpgrading(true);
      const res = await fetch('/api/users/upgrade-to-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        // Success - redirect to agent dashboard
        alert('🎉 ברכות! הפכת לסוכן בהצלחה!');
        router.push('/agent');
      } else {
        const data = await res.json();
        alert('שגיאה: ' + (data.error || 'לא ניתן לשדרג לסוכן'));
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('שגיאה בשדרוג לסוכן');
    } finally {
      setUpgrading(false);
      setShowAgentModal(false);
    }
  }

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleProfileSaveSubmit(event) {
    event.preventDefault();
    setProfileSaving(true);
    setProfileFeedback(null);

    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'שגיאה בעדכון הפרופיל');
      }

      const data = await res.json();
      setUser(data.user);
      setProfileForm({
        fullName: data.user.fullName || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
      });
      setProfileFeedback({ type: 'success', message: 'הפרופיל עודכן בהצלחה' });
      setEditingProfile(false);
    } catch (error) {
      console.error('Profile update error', error);
      setProfileFeedback({ type: 'error', message: error.message || 'שגיאה בעדכון הפרופיל' });
    } finally {
      setProfileSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={gradientStyle}>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">טוען...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen p-8" style={gradientStyle}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-3 mb-6">
          <CustomerNav />
          <form action="/api/auth/logout" method="post" className="self-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              התנתק
            </button>
          </form>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
                שלום, {user.fullName}! 👋
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">ברוך הבא לדשבורד הלקוחות שלך</p>
            </div>
            <div className="text-right space-y-2">
              <div className="text-sm text-gray-500">חשבון לקוח</div>
              <div className="text-base sm:text-lg font-semibold text-purple-600 break-all">
                {user.email}
              </div>
              <a
                href={buildManagerWhatsAppUrl(
                  `שלום, אני לקוח במערכת VIPO ורוצה לבדוק את הסטטוס שלי.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-green-500 text-white hover:bg-green-600 shadow-sm"
              >
                📲 צור קשר עם מנהל
              </a>
            </div>
          </div>
        </div>

        {/* Personal Profile */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">פרופיל אישי</h2>
              <p className="text-gray-600">עדכון פרטי ההתחברות והתקשורת שלך</p>
            </div>
            <button
              onClick={() => {
                setEditingProfile((prev) => !prev);
                setProfileFeedback(null);
              }}
              className="px-5 py-2.5 rounded-xl border border-purple-500 text-purple-600 font-semibold hover:bg-purple-50 transition-all"
            >
              {editingProfile ? 'ביטול' : 'עריכת פרופיל'}
            </button>
          </div>

          {profileFeedback && (
            <div
              className={`${
                profileFeedback.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              } border px-4 py-3 rounded-xl mb-6`}
            >
              {profileFeedback.message}
            </div>
          )}

          {editingProfile ? (
            <form
              onSubmit={handleProfileSaveSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">שם מלא</label>
                <input
                  type="text"
                  name="fullName"
                  value={profileForm.fullName}
                  onChange={handleProfileChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">אימייל</label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">טלפון</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(false);
                    setProfileFeedback(null);
                    setProfileForm({
                      fullName: user.fullName || '',
                      email: user.email || '',
                      phone: user.phone || '',
                    });
                  }}
                  className="px-5 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition-all"
                  disabled={profileSaving}
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
                >
                  {profileSaving ? 'שומר...' : 'שמירת שינויים'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-sm text-gray-500">שם מלא</div>
                <div className="text-lg font-semibold text-gray-900">
                  {user.fullName || 'לא הוגדר'}
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-sm text-gray-500">אימייל</div>
                <div className="text-lg font-semibold text-gray-900">
                  {user.email || 'לא הוגדר'}
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-sm text-gray-500">טלפון</div>
                <div className="text-lg font-semibold text-gray-900">
                  {user.phone || 'לא הוגדר'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upgrade to Agent Banner */}
        <div
          className="rounded-2xl shadow-xl p-4 sm:p-6 mb-8"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl flex-shrink-0">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-1">רוצה להרוויח כסף? 💰</h3>
                <p className="text-sm sm:text-base text-blue-50">
                  הפוך לסוכן וקבל עמלות של 10% על כל מכירה!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAgentModal(true)}
              className="bg-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
              style={{ color: '#1e3a8a' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f9ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🚀 הפוך לסוכן
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Browse Products */}
          <Link
            href="/products"
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white p-4 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">עיין במוצרים</h3>
                <p className="text-gray-600 text-sm">גלה את המוצרים שלנו</p>
              </div>
            </div>
          </Link>

          {/* My Orders */}
          <Link
            href="/customer/orders"
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white p-4 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">ההזמנות שלי</h3>
                <p className="text-gray-600 text-sm">{orders.length} הזמנות</p>
              </div>
            </div>
          </Link>

          {/* Profile */}
          <Link
            href="/customer/profile"
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-4 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">הפרופיל שלי</h3>
                <p className="text-gray-600 text-sm">ערוך פרטים אישיים</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">הזמנות אחרונות</h2>
            <Link
              href="/customer/orders"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              צפה בכל →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">אין הזמנות עדיין</h3>
              <p className="text-gray-600 mb-6">התחל לקנות מוצרים ותראה אותם כאן!</p>
              <Link
                href="/products"
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                עיין במוצרים
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">
                        מספר הזמנה
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">תאריך</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">מוצרים</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">סכום</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">סטטוס</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 font-mono text-sm">#{order._id.slice(-6)}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('he-IL')}
                        </td>
                        <td className="py-4 px-4 text-sm">{order.items?.length || 0} פריטים</td>
                        <td className="py-4 px-4 font-semibold text-purple-600">
                          ₪{order.totalAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : order.status === 'processing'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {order.status === 'completed'
                              ? 'הושלם'
                              : order.status === 'pending'
                                ? 'ממתין'
                                : order.status === 'processing'
                                  ? 'בטיפול'
                                  : order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Link
                            href={`/customer/orders/${order._id}`}
                            className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                          >
                            צפה
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-gray-500">מספר הזמנה</p>
                        <p className="font-mono text-sm font-semibold">#{order._id.slice(-6)}</p>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : order.status === 'processing'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status === 'completed'
                          ? 'הושלם'
                          : order.status === 'pending'
                            ? 'ממתין'
                            : order.status === 'processing'
                              ? 'בטיפול'
                              : order.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">תאריך</p>
                        <p className="font-medium">
                          {new Date(order.createdAt).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">פריטים</p>
                        <p className="font-medium">{order.items?.length || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="text-xs text-gray-500">סכום</p>
                        <p className="text-lg font-bold text-purple-600">
                          ₪{order.totalAmount?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <Link
                        href={`/customer/orders/${order._id}`}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700"
                      >
                        צפה
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-4 sm:p-8 mt-8 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">צריך עזרה?</h3>
              <p className="text-sm sm:text-base text-purple-100">
                אנחנו כאן בשבילך! צור קשר עם התמיכה שלנו
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl text-center"
            >
              צור קשר
            </Link>
          </div>
        </div>
      </div>

      {/* Upgrade to Agent Modal */}
      {showAgentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-scale-in">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">הפוך לסוכן! 🚀</h3>
              <p className="text-gray-600">צור הכנסה פאסיבית על ידי שיתוף מוצרים</p>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-green-900 mb-3 text-lg">🎁 מה תקבל כסוכן?</h4>
              <ul className="space-y-2 text-green-800">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>
                    <strong>עמלות של 10%</strong> על כל מכירה שתבצע
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>
                    <strong>קישור הפניה ייחודי</strong> לשיתוף עם חברים
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>
                    <strong>דשבורד סוכן מתקדם</strong> עם סטטיסטיקות
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>
                    <strong>מעקב אחר הרווחים</strong> בזמן אמת
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>
                    <strong>בונוסים ותגמולים</strong> למוכרים מצטיינים
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>📝 שים לב:</strong> השדרוג הוא חד-פעמי ולא ניתן לבטל אותו. לאחר השדרוג תקבל
                גישה לדשבורד הסוכנים ותוכל להתחיל להרוויח!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpgradeToAgent}
                disabled={upgrading}
                className="flex-1 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                onMouseEnter={(e) => {
                  if (!upgrading)
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
                }}
                onMouseLeave={(e) => {
                  if (!upgrading)
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                }}
              >
                {upgrading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    משדרג...
                  </span>
                ) : (
                  '✨ כן, אני רוצה להפוך לסוכן!'
                )}
              </button>
              <button
                onClick={() => setShowAgentModal(false)}
                disabled={upgrading}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-all disabled:opacity-50"
              >
                אולי מאוחר יותר
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
