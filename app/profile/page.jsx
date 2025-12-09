'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/app/components/layout/MainLayout';
import { copyToClipboard } from '@/app/utils/copyToClipboard';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          router.push('/login');
          return;
        }

        const authData = await authRes.json();
        let mergedUser = authData.user || null;

        try {
          const profileRes = await fetch('/api/users/me');
          if (profileRes.status === 401) {
            router.push('/login');
            return;
          }
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData?.user) {
              mergedUser = mergedUser ? { ...mergedUser, ...profileData.user } : profileData.user;
            }
          }
        } catch (profileError) {
          console.error('Failed to fetch extended profile', profileError);
        }

        if (!mergedUser) {
          setError('שגיאה בטעינת הפרופיל');
          return;
        }

        setUser(mergedUser);
        setFormData({
          fullName: mergedUser.fullName || mergedUser.name || '',
          phone: mergedUser.phone || '',
          email: mergedUser.email || '',
        });
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setError('שגיאה בטעינת הפרופיל');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  const roleLabels = {
    admin: 'מנהל',
    agent: 'סוכן',
    customer: 'לקוח',
  };

  const roleLabel = user?.role ? roleLabels[user.role] || user.role : 'משתמש';
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : user?.name
      ? user.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : '??';

  const couponCode = user?.referralCode || user?.couponCode;

  const handleEditClick = () => {
    setIsEditing(true);
    setFormSuccess('');
    setFormError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: user?.fullName || user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
    });
    setFormError('');
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setFormSuccess('');

    try {
      const trimmedData = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
      };

      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trimmedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'שמירה נכשלה');
      }

      const data = await res.json();
      if (data?.user) {
        setUser((prev) => ({ ...(prev || {}), ...data.user }));
        setFormData({
          fullName: data.user.fullName || data.user.name || '',
          phone: data.user.phone || '',
          email: data.user.email || '',
        });
      }
      setIsEditing(false);
      setFormSuccess('הפרטים עודכנו בהצלחה!');
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (submitError) {
      console.error('Failed to save profile:', submitError);
      setFormError(submitError.message || 'שמירת הפרופיל נכשלה');
    } finally {
      setSaving(false);
    }
  };

  async function handleUpgradeToAgent() {
    try {
      setUpgrading(true);
      const res = await fetch('/api/users/upgrade-to-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
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

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !user) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white p-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'לא נמצא משתמש'}</p>
            <button
              onClick={() => router.push('/login')}
              className="text-white px-6 py-2 rounded-lg transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)')
              }
            >
              חזרה להתחברות
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] bg-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header with Icon */}
          <div className="text-center mb-8">
            <div
              className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1
              className="text-3xl font-bold mb-3"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {user.fullName || user.name || 'משתמש VIPO'}
            </h1>
            <span
              className="inline-block text-white text-sm font-medium px-4 py-1 rounded-full"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              {roleLabel}
            </span>
          </div>

          {/* Upgrade to Agent Banner - Only for customers */}
          {user.role === 'customer' && (
            <div
              className="rounded-2xl shadow-xl p-4 sm:p-6 mb-6"
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
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">רוצה להרוויח כסף?</h3>
                    <p className="text-sm sm:text-base text-blue-50">
                      הפוך לסוכן וקבל עמלות של 10% על כל מכירה!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAgentModal(true)}
                  className="bg-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all shadow-lg hover:shadow-xl w-full sm:w-auto flex items-center justify-center gap-2"
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  הפוך לסוכן
                </button>
              </div>
            </div>
          )}

          {/* Main Info Card */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{
              border: '2px solid transparent',
              backgroundImage:
                'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              boxShadow: '0 4px 15px rgba(8, 145, 178, 0.12)',
            }}
          >
            <h2 className="text-xl font-bold text-center mb-1" style={{ color: '#1e3a8a' }}>
              מידע אישי
            </h2>
            <div
              className="w-16 h-1 mx-auto mb-6 rounded-full"
              style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)' }}
            ></div>

            <div className="space-y-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">שם מלא</p>
                <p className="text-base font-medium text-gray-900">
                  {user.fullName || user.name || '—'}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">טלפון</p>
                <p className="text-base font-medium text-gray-900">{user.phone || '—'}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">אימייל</p>
                <p className="text-base font-medium text-gray-900">{user.email || '—'}</p>
              </div>

              {user?.createdAt && (
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">תאריך הצטרפות</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('he-IL')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Coupon Code Card */}
          {couponCode && (
            <div
              className="rounded-2xl p-6 mb-6"
              style={{
                border: '2px solid transparent',
                backgroundImage:
                  'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                boxShadow: '0 4px 15px rgba(8, 145, 178, 0.12)',
              }}
            >
              <h2 className="text-xl font-bold text-center mb-1" style={{ color: '#1e3a8a' }}>
                קוד הקופון שלך
              </h2>
              <div
                className="w-16 h-1 mx-auto mb-6 rounded-full"
                style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)' }}
              ></div>

              <div
                className="rounded-xl p-4 text-center"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                }}
              >
                <code className="text-2xl font-bold text-white">{couponCode.toUpperCase()}</code>
              </div>

              <button
                onClick={async () => {
                  const ok = await copyToClipboard(couponCode);
                  if (ok) {
                    alert('קוד הועתק!');
                  } else {
                    alert('אירעה שגיאה בעת העתקת הקוד');
                  }
                }}
                className="w-full mt-4 text-white font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: 'white',
                  color: '#1e3a8a',
                  border: '2px solid #1e3a8a',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#1e3a8a';
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                העתק קוד
              </button>
            </div>
          )}

          {/* Edit Section */}
          <div
            className="rounded-2xl p-6"
            style={{
              border: '2px solid transparent',
              backgroundImage:
                'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              boxShadow: '0 4px 15px rgba(8, 145, 178, 0.12)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#1e3a8a' }}>
                עדכון פרטים
              </h2>
              {!isEditing && (
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-2 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  עריכה
                </button>
              )}
            </div>

            {formSuccess && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {formSuccess}
              </div>
            )}
            {formError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    שם מלא
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange('fullName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="שם מלא"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    טלפון
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="מספר טלפון"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    אימייל
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="אימייל"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    disabled={saving}
                  >
                    בטל
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                    disabled={saving}
                    onMouseEnter={(e) => {
                      if (!saving)
                        e.currentTarget.style.background =
                          'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
                    }}
                    onMouseLeave={(e) => {
                      if (!saving)
                        e.currentTarget.style.background =
                          'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                    }}
                  >
                    {saving ? 'שומר...' : 'שמור'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-gray-600 text-center">
                לחץ על כפתור העריכה כדי לעדכן את הפרטים שלך
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade to Agent Modal */}
      {showAgentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="text-center mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">הפוך לסוכן!</h3>
              <p className="text-gray-600">צור הכנסה פאסיבית על ידי שיתוף מוצרים</p>
            </div>

            <div
              className="rounded-xl p-6 mb-6"
              style={{
                background:
                  'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)',
                border: '2px solid rgba(8, 145, 178, 0.3)',
              }}
            >
              <h4 className="font-bold mb-3 text-lg" style={{ color: '#1e3a8a' }}>
                מה תקבל כסוכן?
              </h4>
              <ul className="space-y-2" style={{ color: '#1e3a8a' }}>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: '#0891b2' }}>
                    ✓
                  </span>
                  <span>
                    <strong>עמלות של 10%</strong> על כל מכירה שתבצע
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: '#0891b2' }}>
                    ✓
                  </span>
                  <span>
                    <strong>קוד קופון ייחודי</strong> לשיתוף עם חברים
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: '#0891b2' }}>
                    ✓
                  </span>
                  <span>
                    <strong>דשבורד סוכן מתקדם</strong> עם סטטיסטיקות
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: '#0891b2' }}>
                    ✓
                  </span>
                  <span>
                    <strong>מעקב אחר הרווחים</strong> בזמן אמת
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: '#0891b2' }}>
                    ✓
                  </span>
                  <span>
                    <strong>בונוסים ותגמולים</strong> למוכרים מצטיינים
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>שים לב:</strong> השדרוג הוא חד-פעמי ולא ניתן לבטל אותו. לאחר השדרוג תקבל
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
                  'כן, אני רוצה להפוך לסוכן!'
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
    </MainLayout>
  );
}
