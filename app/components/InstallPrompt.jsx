'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [hasInstalledPWA, setHasInstalledPWA] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // האזנה לאירוע beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // בדיקת פלטפורמה ומצב התקנה
  useEffect(() => {
    // בדיקה אם המשתמש במכשיר iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // בדיקה אם האפליקציה כבר מותקנת
    const checkInstallation = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone ||
        document.referrer.includes('android-app://');
      setHasInstalledPWA(isStandalone);
      if (isStandalone) setShowPrompt(false);
    };

    checkInstallation();
    window.addEventListener('appinstalled', checkInstallation);
    return () => window.removeEventListener('appinstalled', checkInstallation);
  }, []);

  // הצגת הבאנר ל-iOS
  useEffect(() => {
    if (isIOS && !hasInstalledPWA) {
      setShowPrompt(true);
    }
  }, [isIOS, hasInstalledPWA]);

  if (!showPrompt || hasInstalledPWA) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/192.png"
            alt="VIPO App"
            width={48}
            height={48}
            className="rounded-xl"
          />
          <div>
            <h3 className="font-bold text-gray-900">התקן את VIPO</h3>
            <p className="text-sm text-gray-600">
              {isIOS
                ? 'לחץ על ״שתף״ ובחר ״הוסף למסך הבית״'
                : 'התקן את האפליקציה לגישה מהירה'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isIOS ? (
            <button
              onClick={() => setShowPrompt(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                color: 'white',
              }}
            >
              הבנתי
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowPrompt(false)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                לא עכשיו
              </button>
              <button
                onClick={async () => {
                  if (deferredPrompt) {
                    try {
                      await deferredPrompt.prompt();
                      const { outcome } = await deferredPrompt.userChoice;
                      if (outcome === 'accepted') {
                        setShowPrompt(false);
                      }
                    } catch (err) {
                      console.error('Installation failed:', err);
                    } finally {
                      setDeferredPrompt(null);
                    }
                  } else {
                    setShowPrompt(false);
                  }
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                  color: 'white',
                }}
              >
                התקן
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
