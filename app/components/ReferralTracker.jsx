'use client';

import { useEffect } from 'react';

/**
 * ReferralTracker - Tracks referral clicks and stores ref in localStorage
 * Captures ?ref= parameter, stores in localStorage, and logs the click to API
 */
export default function ReferralTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const url = new URL(window.location.href);
      const ref = url.searchParams.get('ref');

      if (ref) {
        // Store in localStorage as fallback
        localStorage.setItem('referrerId', ref);
        
        // Store in cookie for auto-coupon at checkout
        document.cookie = `autoCoupon=${encodeURIComponent(ref)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        
        console.log('Referral ID stored:', ref);

        // Check if we already logged this visit in this session
        const sessionKey = `refClick_${ref}`;
        if (!sessionStorage.getItem(sessionKey)) {
          // Log the click to the API
          fetch('/api/referral/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              refCode: ref,
              url: window.location.href,
              action: 'click',
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.ok) {
                // Mark as logged for this session
                sessionStorage.setItem(sessionKey, '1');
                console.log('Referral click logged');
              }
            })
            .catch((err) => console.error('Failed to log referral click:', err));
        }
      }
    } catch (err) {
      console.error('Failed to store referral:', err);
    }
  }, []);

  return null; // This component doesn't render anything
}
