"use client";

import { useEffect } from "react";

/**
 * ReferralTracker - Fallback for localStorage when cookie fails
 * Captures ?ref= parameter and stores in localStorage
 */
export default function ReferralTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const url = new URL(window.location.href);
      const ref = url.searchParams.get("ref");
      
      if (ref) {
        // Store in localStorage as fallback
        localStorage.setItem("referrerId", ref);
        console.log("Referral ID stored:", ref);
      }
    } catch (err) {
      console.error("Failed to store referral:", err);
    }
  }, []);

  return null; // This component doesn't render anything
}
