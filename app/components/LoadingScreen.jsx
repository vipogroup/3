'use client';

import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show loading screen for exactly 3 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setIsLoading(false), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 50%, #06b6d4 100%)'
      }}
    >
      <div className="text-center">
        {/* Logo */}
        <div className="mb-4">
          <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-3xl font-black" style={{ 
              background: 'linear-gradient(135deg, #1e3a8a, #0891b2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              VIPO
            </span>
          </div>
        </div>
        
        {/* Loading spinner */}
        <div className="flex justify-center mb-3">
          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        
        {/* Text */}
        <p className="text-white text-sm font-medium">טוען...</p>
      </div>
    </div>
  );
}
