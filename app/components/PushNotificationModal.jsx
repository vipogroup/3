'use client';

import { useCallback, useEffect, useState } from 'react';
import { hasActiveSubscription, subscribeToPush, ensureNotificationPermission } from '@/app/lib/pushClient';

const MODAL_SHOWN_KEY = 'vipo_push_modal_shown';
const MODAL_DECLINED_KEY = 'vipo_push_modal_declined';

export default function PushNotificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('customer');
  const [step, setStep] = useState('ask'); // 'ask', 'success', 'error'

  useEffect(() => {
    async function checkAndShow() {
      console.log('PUSH_MODAL: Starting check...');
      
      // Wait for service worker to be ready
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.ready;
          console.log('PUSH_MODAL: Service worker is ready');
        } catch (swErr) {
          console.log('PUSH_MODAL: Service worker not ready', swErr);
        }
      }
      
      // Check if user is logged in
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' });
        if (!res.ok) {
          console.log('PUSH_MODAL: User not logged in');
          return;
        }
        
        const data = await res.json();
        if (!data?.user) return;
        
        // Don't show for admin
        if (data.user.role === 'admin') {
          console.log('PUSH_MODAL: User is admin, skipping');
          return;
        }
        
        setUserRole(data.user.role || 'customer');

        // Check if user already made a choice (accepted or declined)
        const declined = localStorage.getItem(MODAL_DECLINED_KEY);
        if (declined) {
          console.log('PUSH_MODAL: User already declined');
          return;
        }

        // Check if notifications are supported
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
          console.log('PUSH_MODAL: Notifications not supported');
          return;
        }

        // Check if already subscribed
        const subscribed = await hasActiveSubscription();
        console.log('PUSH_MODAL: Already subscribed?', subscribed);
        if (subscribed) return;

        // Check if permission was denied before
        if (Notification.permission === 'denied') {
          console.log('PUSH_MODAL: Permission denied');
          return;
        }

        // Don't mark as shown - modal stays until user makes a choice

        // Show modal after delay - 15 seconds to not interrupt user
        console.log('PUSH_MODAL: Will show modal in 15s');
        setTimeout(() => {
          console.log('PUSH_MODAL: Showing modal now');
          setIsOpen(true);
        }, 15000);
      } catch (err) {
        console.error('PUSH_MODAL: Error in checkAndShow', err);
      }
    }

    // Delay check to allow service worker to register
    const timer = setTimeout(checkAndShow, 2000);
    return () => clearTimeout(timer);
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
      
      // Auto close after success - short delay to show success message
      setTimeout(() => setIsOpen(false), 1500);
    } catch (err) {
      console.error('Push subscription failed:', err);
      setError('שגיאה בהפעלת התראות');
      setStep('error');
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  const handleClose = useCallback(() => {
    // Mark as declined so it won't show again
    try {
      localStorage.setItem(MODAL_DECLINED_KEY, new Date().toISOString());
    } catch (_) {}
    setIsOpen(false);
  }, []);

  if (!isOpen) return null;

  // עיצוב מקורי עם מיקום חדש
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] px-3 pb-3">
      <div 
        className="bg-white shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ 
          border: '2px solid transparent', 
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', 
          backgroundOrigin: 'border-box', 
          backgroundClip: 'padding-box, border-box', 
          boxShadow: '0 8px 25px rgba(8, 145, 178, 0.25)' 
        }}
      >
        {step === 'ask' && (
          <>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            
            <p className="text-xs text-gray-600 flex-1">
              הפעל התראות לקבלת מבצעים ועדכונים
            </p>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleEnable}
                disabled={loading}
                className="text-white text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-70"
                style={{ 
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', 
                  boxShadow: '0 2px 8px rgba(8, 145, 178, 0.3)' 
                }}
              >
                {loading ? '...' : 'הפעל'}
              </button>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-xs px-2 py-2"
              >
                לא עכשיו
              </button>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 flex-1">
              מעולה! תקבלו התראות לנייד
            </p>
          </>
        )}

        {step === 'error' && (
          <>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100">
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
            </div>
            <p className="text-xs text-red-500 flex-1">
              {error}
            </p>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-xs px-2 py-2 flex-shrink-0"
            >
              סגור
            </button>
          </>
        )}
      </div>
    </div>
  );
}
