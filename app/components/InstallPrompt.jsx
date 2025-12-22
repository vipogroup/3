'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [hasInstalledPWA, setHasInstalledPWA] = useState(false);

  useEffect(() => {
    // בדיקה אם המשתמש במכשיר iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // בדיקה אם האפליקציה כבר מותקנת
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    setHasInstalledPWA(isInstalled);

    // הצג את ההודעה רק אם:
    // 1. זה iOS (כי אין prompt אוטומטי)
    // 2. או שזה מכשיר אחר והאפליקציה לא מותקנת
    setShowPrompt(isIOSDevice || !isInstalled);
  }, []);

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
                onClick={() => {
                  if (window.deferredPrompt) {
                    window.deferredPrompt.prompt();
                    window.deferredPrompt.userChoice.then((choiceResult) => {
                      if (choiceResult.outcome === 'accepted') {
                        setShowPrompt(false);
                      }
                    });
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
