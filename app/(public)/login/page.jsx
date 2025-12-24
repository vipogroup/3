'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/http';
import {
  markConsentAccepted,
  PUSH_CONSENT_VERSION,
} from '@/app/lib/pushConsent';
import { subscribeToPush } from '@/app/lib/pushClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPushPopup, setShowPushPopup] = useState(false);
  const [pushPermissionStatus, setPushPermissionStatus] = useState('default');
  const [loginData, setLoginData] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('vipo-login'));
      if (stored?.email) {
        setEmail(stored.email);
        setRememberMe(true);
      }
      if (stored?.password) {
        setPassword(stored.password);
      }
    } catch {
      // ignore corrupted localStorage data
    }

    // Check push permission status
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermissionStatus(Notification.permission);
    }
  }, []);

  // Request push permission using the existing pushClient
  async function requestPushPermission() {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
      return false;
    }

    try {
      const result = await subscribeToPush({
        tags: [loginData?.role || 'customer'],
        consentAt: new Date().toISOString(),
        consentVersion: PUSH_CONSENT_VERSION,
        consentMeta: { source: 'login', role: loginData?.role },
      });

      if (result?.ok) {
        setPushPermissionStatus('granted');
        markConsentAccepted({
          role: loginData?.role,
          version: PUSH_CONSENT_VERSION,
          meta: { source: 'login', consentAt: new Date().toISOString() },
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Push permission error:', err);
      setPushPermissionStatus(err?.message || 'error');
      return false;
    }
  }

  function redirectAfterLogin() {
    if (!loginData) return;
    let targetPath = '/dashboard';
    if (loginData.role === 'customer') {
      targetPath = '/products';
    } else if (loginData.role === 'agent') {
      targetPath = '/agent';
    } else if (loginData.role === 'admin') {
      targetPath = '/dashboard';
    }
    window.location.href = targetPath;
  }

  async function handlePushPopupAccept() {
    await requestPushPermission();
    setShowPushPopup(false);
    redirectAfterLogin();
  }

  function handlePushPopupDecline() {
    setShowPushPopup(false);
    redirectAfterLogin();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    setLoading(true);

    try {
      const payload = {
        identifier: email.trim(),
        password,
        rememberMe,
      };

      const res = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log('[LOGIN] Response status:', res.status);

      if (!res.ok) {
        const data = await res.json();
        console.log('[LOGIN] Error response:', data);
        setErr(data.error || 'שגיאה בהתחברות');
        setLoading(false);
        return;
      }

      // Success - get user role and redirect accordingly
      const data = await res.json();
      console.log('[LOGIN] Success response:', data);
      console.log('[LOGIN] User role:', data.role);

      if (rememberMe) {
        localStorage.setItem('vipo-login', JSON.stringify({ email: payload.identifier, password }));
      } else {
        localStorage.removeItem('vipo-login');
      }

      setMsg('התחברת בהצלחה!');
      setLoading(false);
      setLoginData(data);

      // Check if we should show push popup (for admins/agents who haven't enabled yet)
      if (pushPermissionStatus === 'default' && (data.role === 'admin' || data.role === 'agent')) {
        // Show push popup for admins and agents
        setTimeout(() => {
          setShowPushPopup(true);
        }, 500);
      } else {
        // Regular redirect
        setTimeout(() => {
          console.log('[LOGIN] About to redirect for role:', data.role);

          let targetPath = '/dashboard';
          if (data.role === 'customer') {
            targetPath = '/products';
          } else if (data.role === 'agent') {
            targetPath = '/agent';
          } else if (data.role === 'admin') {
            targetPath = '/dashboard';
          }

          console.log('[LOGIN] Redirecting to:', targetPath);

          // First update the cookie status
          fetch('/api/auth/me', { credentials: 'include' })
            .then(() => {
              // Then do the navigation after cookie is confirmed
              setTimeout(() => {
                window.location.href = targetPath;
              }, 100);
            })
            .catch(() => {
              // If cookie check fails, try direct navigation
              window.location.href = targetPath;
            });

        }, 1000);
      }
    } catch (e) {
      console.error('[LOGIN] Exception:', e);
      setErr('שגיאה בחיבור לשרת. אנא נסה שוב.');
      setLoading(false);
    }
  };

  // Push Permission Popup for Admins/Agents
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
            {loginData?.role === 'admin' 
              ? 'קבל התראות על משתמשים חדשים, הזמנות ופעילות חשובות!'
              : 'קבל התראות על עמלות, בונוסים והפניות חדשות!'
            }
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            {loginData?.role === 'admin' ? (
              <>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>משתמש חדש נרשם</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>הזמנה חדשה התקבלה</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>פעילות חשובות במערכת</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>עמלות חדשות</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>הפניות מלקוחות חדשים</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>בונוסים ומבצעים</span>
                </div>
              </>
            )}
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
              ברוכים השבים
            </h1>
            <p className="text-gray-600">התחבר לחשבון שלך כדי להמשיך</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                כתובת אימייל
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={{ borderColor: '#d1d5db' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#0891b2')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
                aria-describedby="email-help"
              />
              <p id="email-help" className="text-xs text-gray-500 mt-1">
                הזן את כתובת האימייל שנרשמת איתה
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                סיסמה
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  style={{ borderColor: '#d1d5db' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#0891b2')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
                  aria-describedby="password-help"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 left-0 flex items-center px-3 text-sm focus:outline-none"
                  style={{ color: '#0891b2' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#0e7490')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#0891b2')}
                  aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                >
                  {showPassword ? 'הסתר' : 'הצג'}
                </button>
              </div>
              <p id="password-help" className="text-xs text-gray-500 mt-1">
                ניתן להשתמש בסיסמה של לפחות 6 תווים
              </p>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: '#0891b2' }}
                  disabled={loading}
                />
                זכור אותי במכשיר זה
              </label>
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
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3"
                role="alert"
                aria-live="polite"
              >
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
                <div>
                  <strong className="font-semibold">שגיאה בהתחברות</strong>
                  <p className="text-sm mt-1">{err}</p>
                </div>
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
                  מתחבר...
                </span>
              ) : (
                'התחבר'
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

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            אין לך חשבון?{' '}
            <a
              href="/register"
              className="font-semibold focus:outline-none focus:underline"
              style={{ color: '#0891b2' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0e7490')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#0891b2')}
            >
              הירשם עכשיו
            </a>
          </p>

          {/* Forgot Password */}
          <p className="text-center text-sm text-gray-500 mt-4">
            <a
              href="/forgot-password"
              className="hover:text-gray-700 focus:outline-none focus:underline"
            >
              שכחת סיסמה?
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          בהתחברות אתה מסכים ל
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
