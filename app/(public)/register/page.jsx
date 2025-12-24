'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/http';
import {
  markConsentAccepted,
  markConsentDeclined,
  PUSH_CONSENT_VERSION,
} from '@/app/lib/pushConsent';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [wantsPush, setWantsPush] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPushPopup, setShowPushPopup] = useState(false);
  const [pushPermissionStatus, setPushPermissionStatus] = useState('default');
  const [registeredRole, setRegisteredRole] = useState('');
  const router = useRouter();

  // Check push permission status
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermissionStatus(Notification.permission);
    }
  }, []);

  // Request push permission
  async function requestPushPermission() {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermissionStatus(permission);
      
      if (permission === 'granted') {
        // Subscribe to push notifications
        if ('serviceWorker' in navigator) {
          // Get VAPID public key from API
          const configRes = await fetch('/api/push/config');
          const configData = await configRes.json();
          if (!configData?.configured || !configData?.publicKey) {
            console.error('Push config not available');
            return false;
          }

          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: configData.publicKey,
          });

          // Send subscription to server
          await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subscription,
              role: registeredRole,
              tags: [registeredRole],
            }),
          });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Push permission error:', err);
      return false;
    }
  }

  async function handlePushPopupAccept() {
    await requestPushPermission();
    setShowPushPopup(false);
    // Redirect based on role
    if (registeredRole === 'customer') {
      router.push('/customer');
    } else {
      router.push('/login');
    }
  }

  function handlePushPopupDecline() {
    setShowPushPopup(false);
    // Redirect based on role
    if (registeredRole === 'customer') {
      router.push('/customer');
    } else {
      router.push('/login');
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setMsg('');
    setLoading(true);

    // Get referrerId from localStorage (fallback if cookie didn't work)
    let referrerId = null;
    try {
      referrerId = localStorage.getItem('referrerId');
    } catch (err) {
      console.log('localStorage not available');
    }

    // Register
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName,
        phone,
        email,
        password,
        role,
        referrerId,
        wantsPushNotifications: wantsPush,
      }),
    });

    const j = await res.json().catch(() => ({}));
    if (!res.ok || !j?.ok) {
      // Better error messages
      let errorMsg = j?.error || 'הרשמה נכשלה';
      if (errorMsg === 'user exists') {
        errorMsg = 'משתמש עם האימייל או הטלפון הזה כבר קיים. נסה להתחבר במקום.';
      } else if (errorMsg === 'missing fields') {
        errorMsg = 'חסרים שדות חובה. אנא מלא את כל השדות המסומנים בכוכבית.';
      } else if (errorMsg === 'phone or email required') {
        errorMsg = 'נדרש אימייל או טלפון לפחות.';
      } else if (errorMsg === 'invalid role') {
        errorMsg = 'סוג משתמש לא תקין.';
      }
      setErr(errorMsg);
      setLoading(false);
      return;
    }

    const consentAt = new Date().toISOString();
    try {
      if (wantsPush) {
        markConsentAccepted({
          role,
          version: PUSH_CONSENT_VERSION,
          meta: { source: 'register', consentAt },
        });
      } else {
        markConsentDeclined({
          role,
          version: PUSH_CONSENT_VERSION,
          reason: 'register_opt_out',
        });
      }
    } catch (consentError) {
      console.warn('register_push_consent_error', consentError);
    }

    // Auto-login for customers
    if (role === 'customer') {
      setMsg('נרשמת בהצלחה! מתחבר...');

      const identifier = email || phone;
      const loginRes = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });

      if (loginRes.ok) {
        setRegisteredRole(role);
        // Show push popup if user consented and permission not yet granted
        if (wantsPush && pushPermissionStatus === 'default') {
          setLoading(false);
          setShowPushPopup(true);
        } else {
          setTimeout(() => router.push('/customer'), 500);
        }
      } else {
        setMsg('נרשמת בהצלחה, אבל ההתחברות נכשלה. מעביר לעמוד כניסה...');
        setTimeout(() => router.push('/login'), 1500);
      }
    } else {
      // Admin/Agent - manual login required
      setMsg('נרשמת בהצלחה!');
      setRegisteredRole(role);
      // Show push popup if user consented and permission not yet granted
      if (wantsPush && pushPermissionStatus === 'default') {
        setLoading(false);
        setShowPushPopup(true);
      } else {
        setTimeout(() => router.push('/login'), 2000);
      }
    }
  }

  // Push Permission Popup
  if (showPushPopup) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
            הפעל התראות
          </h2>

          {/* Description */}
          <p className="text-center text-gray-600 mb-6">
            קבל עדכונים על מבצעים, הזמנות ועמלות ישירות למכשיר שלך!
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>עדכונים על מבצעים חדשים</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>התראות על הזמנות ורכישות</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>עמלות ובונוסים (לסוכנים)</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePushPopupAccept}
              className="w-full py-3 rounded-xl font-bold text-white text-lg"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              אשר התראות
            </button>
            <button
              onClick={handlePushPopupDecline}
              className="w-full py-3 rounded-xl font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              אולי אחר כך
            </button>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-400 text-center mt-4">
            תוכל לבטל בכל רגע דרך ההגדרות
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8"
          style={{
            border: '2px solid transparent',
            backgroundImage:
              'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              הצטרף אלינו
            </h1>
            <p className="text-gray-600">צור חשבון חדש והתחל למכור</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                שם מלא <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="ישראל ישראלי"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-describedby="fullName-help"
              />
              <p id="fullName-help" className="text-xs text-gray-500 mt-1">
                השם המלא שלך כפי שיופיע במערכת
              </p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                כתובת אימייל <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-describedby="email-help"
              />
              <p id="email-help" className="text-xs text-gray-500 mt-1">
                נשתמש באימייל לשליחת עדכונים ואימות חשבון
              </p>
            </div>

            {/* Push Notifications Consent */}
            <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-3">
              <input
                id="wantsPush"
                name="wantsPush"
                type="checkbox"
                checked={wantsPush}
                onChange={(e) => setWantsPush(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="wantsPush" className="text-sm text-gray-700 leading-6">
                אני רוצה לקבל התראות ועדכונים חשובים מ-VIPO ברגע שמתרחש משהו חדש.
              </label>
            </div>
            <p className="text-xs text-gray-500 -mt-2 mb-1">
              ניתן לבטל את ההתראות בכל רגע דרך ההגדרות האישיות שלך במערכת.
            </p>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                סיסמה <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-describedby="password-help"
              />
              <p id="password-help" className="text-xs text-gray-500 mt-1">
                לפחות 6 תווים - השתמש בסיסמה חזקה
              </p>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                סוג משתמש
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-describedby="role-help"
              >
                <option value="customer">לקוח</option>
                <option value="agent">סוכן</option>
              </select>
              <p id="role-help" className="text-xs text-gray-500 mt-1">
                {role === 'customer' && 'לקוח - גישה לרכישת מוצרים'}
                {role === 'agent' && 'סוכן - גישה לדשבורד סוכנים ועמלות'}
              </p>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                מספר טלפון
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="050-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-describedby="phone-help"
              />
              <p id="phone-help" className="text-xs text-gray-500 mt-1">
                אופציונלי - לצורך יצירת קשר
              </p>
            </div>

            {/* Success Message */}
            {msg && (
              <div
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3"
                role="status"
                aria-live="polite"
              >
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <strong className="font-semibold">הצלחה!</strong>
                  <p className="text-sm mt-1">{msg}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {err && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <strong className="font-semibold">שגיאה בהרשמה</strong>
                    <p className="text-sm mt-1">{err}</p>
                  </div>
                </div>
                {err.includes('כבר קיים') && (
                  <div className="mt-3">
                    <a
                      href="/login"
                      className="inline-block w-full text-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      עבור להתחברות
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? '#9ca3af'
                  : 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              }}
              onMouseEnter={(e) =>
                !loading &&
                (e.currentTarget.style.background =
                  'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)')
              }
              onMouseLeave={(e) =>
                !loading &&
                (e.currentTarget.style.background =
                  'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)')
              }
            >
              {loading ? (
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
                  נרשם...
                </span>
              ) : (
                'הירשם עכשיו'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">או</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            כבר יש לך חשבון?{' '}
            <a
              href="/login"
              className="font-semibold focus:outline-none focus:underline"
              style={{ color: '#0891b2' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0e7490')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#0891b2')}
            >
              התחבר כאן
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          בהרשמה אתה מסכים ל
          <a href="/terms" className="underline hover:text-gray-700">
            {' '}
            תנאי השימוש{' '}
          </a>
          ו
          <a href="/privacy" className="underline hover:text-gray-700">
            מדיניות הפרטיות
          </a>
        </p>
      </div>
    </main>
  );
}
