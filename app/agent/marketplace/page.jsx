'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgentMarketplacePage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const res = await fetch('/api/agent/marketplace', { credentials: 'include' });
      const data = await res.json();
      if (data.ok) {
        setBusinesses(data.businesses || []);
      }
    } catch (err) {
      console.error('Failed to load marketplace:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (tenantId, tenantName) => {
    setJoining(tenantId);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/agent/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tenantId }),
      });

      const data = await res.json();

      if (data.ok) {
        setSuccess(`הצטרפת בהצלחה ל${tenantName}! קוד הקופון שלך: ${data.couponCode}`);
        loadBusinesses();
      } else {
        setError(data.error || 'שגיאה בהצטרפות');
      }
    } catch (err) {
      setError('שגיאה בהצטרפות לעסק');
    } finally {
      setJoining(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען עסקים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-[#1e3a8a] to-[#0891b2] text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/agent" className="text-white/80 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">שוק העסקים</h1>
          </div>
          <p className="text-white/80">בחר עסקים לעבוד איתם ולהרוויח עמלות</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {/* Businesses Grid */}
        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-gray-500 text-lg">אין עסקים זמינים כרגע</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Business Logo/Header */}
                <div className="h-24 bg-gradient-to-l from-[#1e3a8a]/10 to-[#0891b2]/10 flex items-center justify-center">
                  {business.logo ? (
                    <img src={business.logo} alt={business.name} className="h-16 w-16 object-contain" />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-l from-[#1e3a8a] to-[#0891b2] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {business.name?.charAt(0) || 'W'}
                    </div>
                  )}
                </div>

                {/* Business Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{business.name}</h3>
                  {business.description && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{business.description}</p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span>{business.productsCount} מוצרים</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{business.commissionPercent}% עמלה</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {business.isJoined ? (
                    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-green-50 text-green-700 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">מחובר</span>
                    </div>
                  ) : business.isPending ? (
                    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-yellow-50 text-yellow-700 rounded-lg">
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="font-medium">ממתין לאישור</span>
                    </div>
                  ) : business.wasBlocked ? (
                    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-red-50 text-red-700 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <span className="font-medium">חסום</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoin(business.id, business.name)}
                      disabled={joining === business.id}
                      className="w-full py-2 px-4 bg-gradient-to-l from-[#1e3a8a] to-[#0891b2] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {joining === business.id ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>מצטרף...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>הצטרף</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
