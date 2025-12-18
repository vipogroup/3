'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user already accepted cookies
    const accepted = localStorage.getItem('cookieConsent');
    if (!accepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-white">
          <svg className="w-8 h-8 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-sm sm:text-base">
            <span className="font-semibold">אתר זה משתמש בעוגיות (Cookies)</span>
            <span className="text-gray-300 mr-1">כדי לשפר את חווית הגלישה שלך ולשמור על פרטי ההתחברות.</span>
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={acceptCookies}
            className="px-6 py-2.5 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            אישור
          </button>
          <a
            href="/privacy"
            className="px-4 py-2.5 text-gray-300 hover:text-white font-medium transition-colors"
          >
            מדיניות פרטיות
          </a>
        </div>
      </div>
    </div>
  );
}
