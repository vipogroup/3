'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { api } from '../../../lib/http';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Check for OAuth errors in URL
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      if (error === 'OAuthSignin' || error === 'OAuthCallback') {
        setErr('שגיאה בהתחברות עם Google. אנא נסה שוב.');
      } else if (error === 'AccessDenied') {
        setErr('הגישה נדחתה. אנא נסה שוב או השתמש באימייל וסיסמה.');
      } else {
        setErr('שגיאה בהתחברות. אנא נסה שוב.');
      }
    }
  }, [searchParams]);

  // Save referral to cookie before OAuth redirect
  const saveReferralToCookie = () => {
    const ref = searchParams.get('ref');
    if (ref) {
      document.cookie = `refSource=${ref}; path=/; max-age=86400`;
    }
  };

  const handleGoogleSignIn = async () => {
    setErr('');
    setGoogleLoading(true);
    saveReferralToCookie();
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (e) {
      console.error('[LOGIN] Google sign-in error:', e);
      setErr('שגיאה בהתחברות עם Google');
      setGoogleLoading(false);
    }
  };

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
  }, []);

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

      setMsg('התחברת בהצלחה! מעביר לדשבורד...');
      setLoading(false);

      // Add a longer delay to ensure cookie is properly set and synced
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
    } catch (e) {
      console.error('[LOGIN] Exception:', e);
      setErr('שגיאה בחיבור לשרת. אנא נסה שוב.');
      setLoading(false);
    }
  };

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
              סוכני VIPO – מתחילים ברגע
            </h1>
            <p className="text-gray-600">התחבר לחשבון שלך כדי להמשיך</p>
            <ul className="text-sm text-gray-500 mt-3 space-y-1">
              <li>✓ עמלות גבוהות על כל מכירה</li>
              <li>✓ מעקב בזמן אמת</li>
              <li>✓ תמיכה מלאה</li>
            </ul>
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            data-testid="google-signin"
            className="w-full flex items-center justify-center gap-3 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:cursor-not-allowed mb-6"
            style={{
              background: googleLoading
                ? '#9ca3af'
                : 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
            }}
          >
            {googleLoading ? (
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
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                המשך עם Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">או התחברות עם אימייל</span>
            </div>
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
