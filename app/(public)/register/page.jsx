'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

function RegisterPageContent() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Countdown timer
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Password validation
  const isPasswordValid = (pwd) => {
    if (pwd.length < 8) return false;
    if (!/\d/.test(pwd)) return false;
    if (!/[a-zA-Zא-ת]/.test(pwd)) return false;
    return true;
  };

  // Phone validation
  const isPhoneValid = (p) => p.replace(/\D/g, '').length >= 9;

  // Handle Google sign-in - only phone required
  const handleGoogleSignIn = async () => {
    setErr('');
    setPhoneError('');
    
    if (!phone || !isPhoneValid(phone)) {
      setPhoneError('יש להזין מספר טלפון תקין');
      document.getElementById('phone')?.focus();
      return;
    }

    if (!acceptTerms) {
      setErr('יש לאשר את תנאי השימוש');
      return;
    }

    setGoogleLoading(true);
    
    try {
      localStorage.setItem('pendingGooglePhone', phone);
      localStorage.setItem('pendingGoogleRole', role);
    } catch (e) {
      console.log('localStorage not available');
    }

    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (e) {
      setErr('שגיאה בהתחברות עם Google');
      setGoogleLoading(false);
    }
  };

  // Send verification code
  async function sendVerificationCode() {
    setVerifyLoading(true);
    setVerifyError('');
    try {
      const res = await fetch('/api/auth/send-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'שליחת הקוד נכשלה');
      }
      setCountdown(60);
    } catch (e) {
      setVerifyError(e.message || 'שגיאה בשליחת קוד');
    } finally {
      setVerifyLoading(false);
    }
  }

  // Verify code and complete registration
  async function verifyAndRegister() {
    if (verifyCode.length < 6) {
      setVerifyError('יש להזין קוד בן 6 ספרות');
      return;
    }
    setVerifyLoading(true);
    setVerifyError('');

    try {
      // Verify code
      const verifyRes = await fetch('/api/auth/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verifyCode }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.ok) {
        throw new Error(verifyData.message || 'קוד שגוי');
      }

      // Register user
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, email, password, role }),
      });
      const j = await res.json().catch(() => ({}));
      
      if (!res.ok || !j?.ok) {
        let errorMsg = j?.message || j?.error || 'הרשמה נכשלה';
        if (j?.error === 'phone exists') errorMsg = 'מספר הטלפון כבר רשום';
        else if (j?.error === 'email exists') errorMsg = 'האימייל כבר רשום';
        throw new Error(errorMsg);
      }

      // Auto-login
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      });

      setShowVerifyModal(false);
      setMsg('נרשמת בהצלחה!');

      if (loginRes.ok) {
        const targetPath = role === 'customer' ? '/products' : '/agent';
        setTimeout(() => router.push(targetPath), 500);
      } else {
        setTimeout(() => router.push('/login'), 1500);
      }
    } catch (e) {
      setVerifyError(e.message);
    } finally {
      setVerifyLoading(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setMsg('');

    if (!acceptTerms) {
      setErr('יש לאשר את תנאי השימוש');
      return;
    }

    if (!isPasswordValid(password)) {
      setErr('הסיסמה חייבת לכלול לפחות 8 תווים, מספר אחד ואות אחת');
      return;
    }

    if (!isPhoneValid(phone)) {
      setErr('מספר טלפון לא תקין');
      return;
    }

    setLoading(true);

    // Send verification code
    try {
      const res = await fetch('/api/auth/send-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'שליחת הקוד נכשלה');
      }
      setCountdown(60);
      setShowVerifyModal(true);
    } catch (e) {
      setErr(e.message || 'שגיאה בשליחת קוד אימות');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md">
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
          <div className="text-center mb-6">
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
            <p className="text-gray-500 text-sm">צור חשבון חדש תוך דקה</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                שם מלא
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="ישראל ישראלי"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 transition-all disabled:bg-gray-100"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                אימייל
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 transition-all disabled:bg-gray-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                טלפון
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="050-1234567"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setPhoneError(''); }}
                required
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-cyan-500 transition-all disabled:bg-gray-100 ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                סיסמה
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 transition-all disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? 'הסתר' : 'הצג'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">מינימום 8 תווים, מספר אחד ואות אחת</p>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                סוג משתמש
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 transition-all disabled:bg-gray-100"
              >
                <option value="customer">לקוח</option>
                <option value="agent">סוכן</option>
              </select>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 mt-1 rounded border-gray-300"
                style={{ accentColor: '#0891b2' }}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                מסכים/ה ל
                <a href="/terms" className="text-cyan-600 hover:underline mx-1">תנאי השימוש</a>
                ול
                <a href="/privacy" className="text-cyan-600 hover:underline mx-1">מדיניות הפרטיות</a>
              </label>
            </div>

            {/* Error */}
            {err && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {err}
                {err.includes('כבר') && (
                  <a href="/login" className="block mt-2 text-center bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                    עבור להתחברות
                  </a>
                )}
              </div>
            )}

            {/* Success */}
            {msg && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {msg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              {loading ? 'נרשם...' : 'הירשם'}
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

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 bg-white text-gray-700 font-medium py-3 px-6 rounded-lg transition-all hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50"
          >
            {googleLoading ? (
              'מתחבר...'
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                המשך עם Google
              </>
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            כבר יש לך חשבון?{' '}
            <a href="/login" className="font-semibold text-cyan-600 hover:text-cyan-700">
              התחבר כאן
            </a>
          </p>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">אימות אימייל</h2>
              <p className="text-gray-500 text-sm mt-2">
                שלחנו קוד בן 6 ספרות ל-<br />
                <span className="font-medium text-gray-700">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="הזן קוד 6 ספרות"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl text-center text-2xl tracking-[0.5em] font-bold focus:outline-none focus:border-cyan-500"
                dir="ltr"
                autoFocus
              />

              {verifyError && (
                <p className="text-red-500 text-sm text-center">{verifyError}</p>
              )}

              <button
                onClick={verifyAndRegister}
                disabled={verifyLoading || verifyCode.length < 6}
                className="w-full text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                {verifyLoading ? 'מאמת...' : 'אמת והירשם'}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={sendVerificationCode}
                  disabled={countdown > 0 || verifyLoading}
                  className="text-cyan-600 hover:underline disabled:text-gray-400"
                >
                  {countdown > 0 ? `שלח שוב (${countdown})` : 'שלח קוד חדש'}
                </button>
                <button
                  onClick={() => { setShowVerifyModal(false); setVerifyCode(''); setVerifyError(''); }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  חזור
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  );
}
