'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Agent Onboarding Page
 * Collects optional phone and payout details for first-time Google sign-in users
 */
export default function AgentOnboardingPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [payoutDetails, setPayoutDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/agents/onboarding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone, payoutDetails }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'שגיאה בשמירת הפרטים');
        setLoading(false);
        return;
      }

      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (e) {
      console.error('[ONBOARDING] Error:', e);
      setError('שגיאה בחיבור לשרת');
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    setError('');

    try {
      // Mark onboarding as complete without saving details
      const res = await fetch('/api/agents/onboarding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ skip: true }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'שגיאה');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (e) {
      console.error('[ONBOARDING] Skip error:', e);
      setError('שגיאה בחיבור לשרת');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8"
          style={{
            border: '2px solid transparent',
            backgroundImage:
              'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ברוך הבא ל-VIPO!
            </h1>
            <p className="text-gray-600">
              רק עוד כמה פרטים קטנים ואתה מוכן להתחיל להרוויח
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                מספר טלפון <span className="text-gray-400">(אופציונלי)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="050-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 transition-all disabled:bg-gray-100"
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-1">
                לקבלת עדכונים והתראות
              </p>
            </div>

            {/* Payout Details Field */}
            <div>
              <label htmlFor="payoutDetails" className="block text-sm font-medium text-gray-700 mb-2">
                פרטי תשלום <span className="text-gray-400">(אופציונלי)</span>
              </label>
              <textarea
                id="payoutDetails"
                name="payoutDetails"
                placeholder="שם בנק, מספר חשבון, או PayPal..."
                value={payoutDetails}
                onChange={(e) => setPayoutDetails(e.target.value)}
                disabled={loading}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 transition-all disabled:bg-gray-100 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                איך תרצה לקבל את העמלות שלך
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
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
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  שומר...
                </span>
              ) : (
                'שמור והמשך לדשבורד'
              )}
            </button>

            {/* Skip Button */}
            <button
              type="button"
              onClick={handleSkip}
              disabled={loading}
              className="w-full text-gray-600 font-medium py-2 px-6 rounded-lg transition-all hover:bg-gray-100 disabled:cursor-not-allowed"
            >
              דלג, אמלא אחר כך
            </button>
          </form>

          {/* Info */}
          <p className="text-center text-xs text-gray-500 mt-6">
            תמיד תוכל לעדכן את הפרטים האלה בהגדרות החשבון שלך
          </p>
        </div>
      </div>
    </main>
  );
}
