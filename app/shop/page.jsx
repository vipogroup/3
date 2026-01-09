'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FeaturedCarousel from '@/app/components/FeaturedCarousel';

export default function ShopPage() {
  const [user, setUser] = useState(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const gradientPrimary = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
  const gradientReverse = 'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
  const primaryColor = '#1e3a8a';
  const secondaryColor = '#0891b2';

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }
    fetchUser();
  }, []);

  async function handleUpgradeToAgent() {
    try {
      setUpgrading(true);
      const res = await fetch('/api/users/upgrade-to-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        alert('ברכות! הפכת לסוכן בהצלחה!');
        window.location.href = '/agent';
      } else {
        const data = await res.json();
        alert('שגיאה: ' + (data.error || 'לא ניתן לשדרג לסוכן'));
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('שגיאה בשדרוג לסוכן');
    } finally {
      setUpgrading(false);
      setShowAgentModal(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      {/* Marquee Banner - For customers and guests */}
      {(!user || user?.role === 'customer') && (
      <div
        className="relative overflow-hidden py-3 cursor-pointer"
        style={{ background: gradientPrimary }}
        onClick={() => setShowAgentModal(true)}
      >
        <div className="marquee-container">
          <div className="marquee-content">
            <div className="flex items-center gap-4 whitespace-nowrap">
              <span className="text-white font-bold text-lg">
                רוצים להרוויח כסף?
              </span>
              <span className="text-white font-semibold text-lg">
                הפכו לסוכן וקבלו 10% עמלה על כל מכירה!
              </span>
              <span className="bg-white text-blue-900 px-4 py-1 rounded-full font-bold text-sm">
                לחצו כאן להצטרפות
              </span>
            </div>
          </div>
          <div className="marquee-content" aria-hidden="true">
            <div className="flex items-center gap-4 whitespace-nowrap">
              <span className="text-white font-bold text-lg">
                רוצים להרוויח כסף?
              </span>
              <span className="text-white font-semibold text-lg">
                הפכו לסוכן וקבלו 10% עמלה על כל מכירה!
              </span>
              <span className="bg-white text-blue-900 px-4 py-1 rounded-full font-bold text-sm">
                לחצו כאן להצטרפות
              </span>
            </div>
          </div>
        </div>
      </div>
      )}

      <style jsx>{`
        .marquee-container {
          display: flex;
          animation: marquee 10s linear infinite;
        }
        .marquee-content {
          display: flex;
          flex-shrink: 0;
          min-width: 100%;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(50%);
          }
        }
        .marquee-container:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Hero Section */}
      <div 
        className="relative pt-8 pb-16 px-4"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
      >
        {/* VIPO Title */}
        <div className="text-center mb-8">
          <p className="text-white/90 text-base font-medium">נלחמים ביוקר המחיה - מוצרים במחירים משתלמים</p>
        </div>

        {/* Selection Cards */}
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-4">
            {/* Available Now Card */}
            <Link href={user?.tenantSlug ? `/t/${user.tenantSlug}?type=available` : '/products?type=available'} className="block group no-underline" style={{ textDecoration: 'none' }}>
              <div 
                className="relative rounded-2xl p-4 text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                style={{ background: '#f0f9ff', boxShadow: '0 8px 32px rgba(8, 145, 178, 0.25)' }}
              >
                {/* Badge */}
                <div 
                  className="absolute top-0 right-0 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                >
                  משלוח מהיר
                </div>
                
                {/* Icon */}
                <div 
                  className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)' }}
                >
                  <svg className="w-7 h-7" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                
                <h3 className="font-bold text-base mb-1" style={{ color: '#1e3a8a' }}>מוצרים במלאי</h3>
                <p className="text-xs text-gray-500 mb-3">מוצרים מוכנים למשלוח<br/>ישירות אליך!</p>
                
                {/* Button */}
                <div 
                  className="text-white px-4 py-2 rounded-full font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', border: '2px solid #1e3a8a' }}
                >
                  לחץ כאן
                </div>
              </div>
            </Link>

            {/* Group Purchase Card */}
            <Link href={user?.tenantSlug ? `/t/${user.tenantSlug}?type=group` : '/products?type=group'} className="block group no-underline" style={{ textDecoration: 'none' }}>
              <div 
                className="relative rounded-2xl p-4 text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                style={{ background: '#fff7ed', boxShadow: '0 8px 32px rgba(251, 191, 36, 0.35)' }}
              >
                {/* HOT Badge */}
                <div className="absolute top-0 right-0 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg animate-pulse" style={{ background: '#d97706' }}>
                  עד 50% הנחה
                </div>
                
                {/* Icon - People */}
                <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: 'rgba(251, 191, 36, 0.2)' }}>
                  <svg className="w-7 h-7" style={{ color: '#d97706' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                
                <h3 className="font-bold text-base mb-1" style={{ color: '#d97706' }}>רכישה קבוצתית</h3>
                <p className="text-xs mb-3" style={{ color: '#d97706' }}>הצטרפו למילוי מכולה<br/>ותהנו מהנחות מטורפות!</p>
                
                {/* Button */}
                <div className="px-4 py-2 rounded-full font-bold text-sm" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#d97706', border: '2px solid #d97706' }}>
                  לחץ כאן
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0 120V80Q360 20 720 80T1440 80V120H0Z" fill="#ffffff"/>
          </svg>
        </div>
      </div>

      {/* Products Section - New Carousel */}
      <FeaturedCarousel darkBackground={false} title="מוצרים נבחרים" />

      {/* Upgrade to Agent Modal */}
      {showAgentModal && (!user || user?.role === 'customer') && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="text-center mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: gradientPrimary }}
              >
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">הפוך לסוכן!</h3>
              <p className="text-gray-600">צור הכנסה פאסיבית על ידי שיתוף מוצרים</p>
            </div>

            <div
              className="rounded-xl p-6 mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)',
                border: '2px solid rgba(8, 145, 178, 0.3)',
              }}
            >
              <h4 className="font-bold mb-3 text-lg" style={{ color: primaryColor }}>
                מה תקבל כסוכן?
              </h4>
              <ul className="space-y-2" style={{ color: primaryColor }}>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <span><strong>עמלות של 10%</strong> על כל מכירה שתבצע</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <span><strong>קוד קופון ייחודי</strong> לשיתוף עם חברים</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <span><strong>דשבורד סוכן מתקדם</strong> עם סטטיסטיקות</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <span><strong>מעקב אחר הרווחים</strong> בזמן אמת</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <span><strong>בונוסים ותגמולים</strong> למוכרים מצטיינים</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>שים לב:</strong>{' '}
                {!user
                  ? 'תצטרך להירשם כדי להפוך לסוכן. '
                  : 'השדרוג הוא חד-פעמי ולא ניתן לבטל אותו. '}
                לאחר {!user ? 'ההרשמה' : 'השדרוג'} תקבל גישה לדשבורד הסוכנים ותוכל להתחיל להרוויח!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (!user) {
                    window.location.href = '/register?role=agent';
                  } else {
                    handleUpgradeToAgent();
                  }
                }}
                disabled={upgrading}
                className="flex-1 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: gradientPrimary }}
                onMouseEnter={(e) => {
                  if (!upgrading) e.currentTarget.style.background = gradientReverse;
                }}
                onMouseLeave={(e) => {
                  if (!upgrading) e.currentTarget.style.background = gradientPrimary;
                }}
              >
                {upgrading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    משדרג...
                  </span>
                ) : !user ? (
                  'הירשם כסוכן עכשיו!'
                ) : (
                  'כן, אני רוצה להפוך לסוכן!'
                )}
              </button>
              <button
                onClick={() => setShowAgentModal(false)}
                disabled={upgrading}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-all disabled:opacity-50"
              >
                אולי מאוחר יותר
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
