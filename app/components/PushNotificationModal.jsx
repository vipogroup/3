'use client';

import { useCallback, useEffect, useState } from 'react';
import { hasActiveSubscription, subscribeToPush, ensureNotificationPermission } from '@/app/lib/pushClient';

const MODAL_SHOWN_KEY = 'vipo_push_modal_shown';

export default function PushNotificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('customer');
  const [step, setStep] = useState('ask'); // 'ask', 'success', 'error'

  useEffect(() => {
    async function checkAndShow() {
      // Check if user is logged in
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' });
        if (!res.ok) return;
        
        const data = await res.json();
        if (!data?.user) return;
        
        // Don't show for admin
        if (data.user.role === 'admin') return;
        
        setUserRole(data.user.role || 'customer');

        // Check if already shown in this session
        const sessionShown = sessionStorage.getItem(MODAL_SHOWN_KEY);
        if (sessionShown) return;

        // Check if notifications are supported
        if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

        // Check if already subscribed
        const subscribed = await hasActiveSubscription();
        if (subscribed) return;

        // Check if permission was denied before
        if (Notification.permission === 'denied') return;

        // Mark as shown for this session
        sessionStorage.setItem(MODAL_SHOWN_KEY, 'true');

        // Show modal after short delay
        setTimeout(() => setIsOpen(true), 1500);
      } catch (_) {}
    }

    checkAndShow();
  }, []);

  const handleEnable = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const permission = await ensureNotificationPermission();
      
      if (!permission.granted) {
        if (permission.reason === 'ios_install_required') {
          setError('ב-iPhone יש להוסיף את האתר למסך הבית תחילה');
        } else if (permission.reason === 'denied') {
          setError('ההרשאה נדחתה. ניתן לשנות בהגדרות הדפדפן');
        } else {
          setError('לא ניתן להפעיל התראות במכשיר זה');
        }
        setStep('error');
        setLoading(false);
        return;
      }

      await subscribeToPush({
        tags: [userRole],
        consentAt: new Date().toISOString(),
        consentVersion: '1.0',
        consentMeta: { source: 'login_modal', role: userRole },
      });

      setStep('success');
      
      // Auto close after success
      setTimeout(() => setIsOpen(false), 2000);
    } catch (err) {
      console.error('Push subscription failed:', err);
      setError('שגיאה בהפעלת התראות');
      setStep('error');
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        role="presentation"
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        style={{ animation: 'fadeInUp 0.3s ease-out' }}
      >
        {step === 'ask' && (
          <>
            {/* Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="mb-2 text-center text-xl font-bold text-gray-900">
              קבלו עדכונים ישירות לנייד
            </h2>

            {/* Description */}
            <p className="mb-6 text-center text-sm text-gray-600">
              הפעילו התראות כדי לקבל עדכונים על מוצרים חדשים, מבצעים והודעות חשובות - גם כשהאתר סגור
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleEnable}
                disabled={loading}
                className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2C6.477 2 2 6.477 2 12h2z" />
                    </svg>
                    מפעיל...
                  </span>
                ) : (
                  'כן, אני רוצה לקבל עדכונים'
                )}
              </button>
              
              <button
                onClick={handleClose}
                className="w-full rounded-xl py-3 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
              >
                לא עכשיו
              </button>
            </div>
          </>
        )}

        {step === 'success' && (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">מעולה!</h2>
            <p className="text-sm text-gray-600">תקבלו התראות ישירות לנייד</p>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">לא הצלחנו להפעיל</h2>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={handleClose}
              className="rounded-xl px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              סגור
            </button>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute left-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
