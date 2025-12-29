'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

/**
 * Page that completes Google OAuth registration
 * Reads phone from localStorage and sends to server
 * Processes referral attribution
 */
export default function CompleteGooglePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function completeRegistration() {
      // Wait for session to be ready
      if (status === 'loading') return;
      
      if (status === 'unauthenticated') {
        router.push('/login');
        return;
      }

      try {
        // Read phone and name from localStorage
        let phone = null;
        let fullName = null;
        try {
          phone = localStorage.getItem('pendingGooglePhone');
          fullName = localStorage.getItem('pendingGoogleName');
        } catch (e) {
          console.log('localStorage not available');
        }

        // Send to server to complete registration
        const res = await fetch('/api/auth/complete-google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, fullName }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error('Complete Google error:', data);
        }

        // Clear localStorage
        try {
          localStorage.removeItem('pendingGooglePhone');
          localStorage.removeItem('pendingGoogleName');
          localStorage.removeItem('pendingGoogleRole');
        } catch (e) {
          console.log('localStorage not available');
        }

        // Redirect to products page
        router.push('/products');
      } catch (e) {
        console.error('Complete Google error:', e);
        setError('שגיאה בהשלמת ההרשמה');
        // Still redirect after error
        setTimeout(() => router.push('/products'), 2000);
      }
    }

    completeRegistration();
  }, [status, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        {error ? (
          <div className="text-red-600 mb-4">{error}</div>
        ) : (
          <>
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">משלים את ההרשמה...</p>
          </>
        )}
      </div>
    </main>
  );
}
