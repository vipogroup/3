'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function JoinClient({ refId, productId }) {
  const router = useRouter();
  const [status, setStatus] = useState('idle'); // idle, loading, success, error, already_agent
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const safeRef = useMemo(() => (typeof refId === 'string' ? refId.trim() : null), [refId]);
  const safeProduct = useMemo(
    () => (typeof productId === 'string' ? productId.trim() : null),
    [productId],
  );

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data?.user || null);
        }
      } catch (_) {
        // Not logged in
      }
    };
    checkAuth();
  }, []);

  // Save referrer ID
  useEffect(() => {
    if (!safeRef) return;
    try {
      localStorage.setItem('referrerId', safeRef);
    } catch (err) {
      console.warn('Failed to persist referrerId', err);
    }
  }, [safeRef]);

  const handleUpgradeToAgent = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/users/upgrade-to-agent', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.coupon ? `קוד הקופון שלך: ${data.coupon}` : 'הפכת לסוכן בהצלחה!');
        // Redirect to agent dashboard after 2 seconds
        setTimeout(() => {
          router.push('/agent');
          router.refresh();
        }, 2000);
      } else {
        if (data.error === 'You are already an agent') {
          setStatus('already_agent');
          setMessage('אתה כבר סוכן! מעביר אותך לדשבורד...');
          setTimeout(() => router.push('/agent'), 1500);
        } else {
          setStatus('error');
          setMessage(data.error || 'שגיאה בשדרוג לסוכן');
        }
      }
    } catch (err) {
      setStatus('error');
      setMessage('שגיאת שרת, נסה שוב');
    }
  };

  // If user is not logged in
  if (!user) {
    return (
      <section className="text-center py-12">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-900 to-cyan-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">התחבר כדי להפוך לסוכן</h2>
          <p className="text-gray-600 mb-6">עליך להתחבר למערכת כדי להפוך לסוכן ולהתחיל להרוויח</p>
          <Link 
            href="/login?redirect=/join"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-900 to-cyan-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            התחבר עכשיו
          </Link>
        </div>
      </section>
    );
  }

  // If user is already an agent
  if (user.role === 'agent') {
    return (
      <section className="text-center py-12">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-green-600">אתה כבר סוכן!</h2>
          <p className="text-gray-600 mb-6">יש לך כבר חשבון סוכן פעיל</p>
          <Link 
            href="/agent"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-900 to-cyan-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            עבור לדשבורד הסוכן
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="text-center py-12">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-900 to-cyan-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">הפוך לסוכן VIPO</h2>
        <p className="text-gray-600 mb-6">
          שתף מוצרים עם החברים שלך וקבל 10% מכל רכישה!
        </p>

        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-bold">{message}</p>
            <p className="text-sm mt-1">מעביר אותך לדשבורד...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            <p>{message}</p>
          </div>
        )}

        {status === 'already_agent' && (
          <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg">
            <p>{message}</p>
          </div>
        )}

        {(status === 'idle' || status === 'error') && (
          <button
            onClick={handleUpgradeToAgent}
            disabled={status === 'loading'}
            className="w-full px-8 py-4 bg-gradient-to-r from-blue-900 to-cyan-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                מעבד...
              </span>
            ) : (
              'הפוך לסוכן עכשיו - חינם!'
            )}
          </button>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>בתור סוכן תוכל:</p>
          <ul className="mt-2 space-y-1">
            <li>לשתף מוצרים ברשתות החברתיות</li>
            <li>לקבל 10% עמלה מכל רכישה</li>
            <li>לעקוב אחרי ההכנסות שלך בדשבורד</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
