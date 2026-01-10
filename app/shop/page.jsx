'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FeaturedCarousel from '@/app/components/FeaturedCarousel';
import EditableTextField from '@/app/components/EditableTextField';
import { useSiteTexts } from '@/lib/useSiteTexts';

function ShopPageContent() {
  const { getText, editMode, canEdit, enableEditMode, disableEditMode } = useSiteTexts();
  const [user, setUser] = useState(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handlePasswordSubmit = () => {
    const success = enableEditMode(passwordInput);
    if (success) {
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

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
              <EditableTextField textKey="SHOP_MARQUEE_1" fallback="רוצים להרוויח כסף?" as="span" className="text-white font-bold text-lg" />
              <EditableTextField textKey="SHOP_MARQUEE_2" fallback="הפכו לסוכן וקבלו 10% עמלה על כל מכירה!" as="span" className="text-white font-semibold text-lg" />
              <EditableTextField textKey="SHOP_MARQUEE_CTA" fallback="לחצו כאן להצטרפות" as="span" className="bg-white text-blue-900 px-4 py-1 rounded-full font-bold text-sm" />
            </div>
          </div>
          <div className="marquee-content" aria-hidden="true">
            <div className="flex items-center gap-4 whitespace-nowrap">
              <EditableTextField textKey="SHOP_MARQUEE_1" fallback="רוצים להרוויח כסף?" as="span" className="text-white font-bold text-lg" />
              <EditableTextField textKey="SHOP_MARQUEE_2" fallback="הפכו לסוכן וקבלו 10% עמלה על כל מכירה!" as="span" className="text-white font-semibold text-lg" />
              <EditableTextField textKey="SHOP_MARQUEE_CTA" fallback="לחצו כאן להצטרפות" as="span" className="bg-white text-blue-900 px-4 py-1 rounded-full font-bold text-sm" />
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
          <EditableTextField textKey="SHOP_HERO_SUBTITLE" fallback="נלחמים ביוקר המחיה - מוצרים במחירים משתלמים" as="p" className="text-white/90 text-base font-medium" />
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
                  <EditableTextField textKey="SHOP_CARD_BADGE_AVAILABLE" fallback="משלוח מהיר" as="span" />
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
                
                <EditableTextField textKey="SHOP_CARD_TITLE_AVAILABLE" fallback="מוצרים במלאי" as="h3" className="font-bold text-base mb-1" style={{ color: '#1e3a8a' }} />
                <EditableTextField textKey="SHOP_CARD_DESC_AVAILABLE" fallback="מוצרים מוכנים למשלוח ישירות אליך!" as="p" className="text-xs text-gray-500 mb-3" />
                
                {/* Button */}
                <div 
                  className="text-white px-4 py-2 rounded-full font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', border: '2px solid #1e3a8a' }}
                >
                  <EditableTextField textKey="SHOP_CARD_BTN_AVAILABLE" fallback="לחץ כאן" as="span" />
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
                  <EditableTextField textKey="SHOP_CARD_BADGE_GROUP" fallback="עד 50% הנחה" as="span" />
                </div>
                
                {/* Icon - People */}
                <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: 'rgba(251, 191, 36, 0.2)' }}>
                  <svg className="w-7 h-7" style={{ color: '#d97706' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                
                <EditableTextField textKey="SHOP_CARD_TITLE_GROUP" fallback="רכישה קבוצתית" as="h3" className="font-bold text-base mb-1" style={{ color: '#d97706' }} />
                <EditableTextField textKey="SHOP_CARD_DESC_GROUP" fallback="הצטרפו למילוי מכולה ותהנו מהנחות מטורפות!" as="p" className="text-xs mb-3" style={{ color: '#d97706' }} />
                
                {/* Button */}
                <div className="px-4 py-2 rounded-full font-bold text-sm" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#d97706', border: '2px solid #d97706' }}>
                  <EditableTextField textKey="SHOP_CARD_BTN_GROUP" fallback="לחץ כאן" as="span" />
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
      <FeaturedCarousel darkBackground={false} title="מוצרים נבחרים" textKey="SHOP_CAROUSEL_TITLE" />

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
              <EditableTextField textKey="SHOP_MODAL_TITLE" fallback="הפוך לסוכן!" as="h3" className="text-3xl font-bold text-gray-900 mb-2" />
              <EditableTextField textKey="SHOP_MODAL_SUBTITLE" fallback="צור הכנסה פאסיבית על ידי שיתוף מוצרים" as="p" className="text-gray-600" />
            </div>

            <div
              className="rounded-xl p-6 mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)',
                border: '2px solid rgba(8, 145, 178, 0.3)',
              }}
            >
              <EditableTextField textKey="SHOP_MODAL_BENEFITS_TITLE" fallback="מה תקבל כסוכן?" as="h4" className="font-bold mb-3 text-lg" style={{ color: primaryColor }} />
              <ul className="space-y-2" style={{ color: primaryColor }}>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <EditableTextField textKey="SHOP_MODAL_BENEFIT_1" fallback="עמלות של 10% על כל מכירה שתבצע" as="span" />
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <EditableTextField textKey="SHOP_MODAL_BENEFIT_2" fallback="קוד קופון ייחודי לשיתוף עם חברים" as="span" />
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <EditableTextField textKey="SHOP_MODAL_BENEFIT_3" fallback="דשבורד סוכן מתקדם עם סטטיסטיקות" as="span" />
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <EditableTextField textKey="SHOP_MODAL_BENEFIT_4" fallback="מעקב אחר הרווחים בזמן אמת" as="span" />
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <EditableTextField textKey="SHOP_MODAL_BENEFIT_5" fallback="בונוסים ותגמולים למוכרים מצטיינים" as="span" />
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <EditableTextField textKey="SHOP_MODAL_NOTE_LABEL" fallback="שים לב:" as="strong" />{' '}
                {!user
                  ? <EditableTextField textKey="SHOP_MODAL_NOTE_GUEST" fallback="תצטרך להירשם כדי להפוך לסוכן." as="span" />
                  : <EditableTextField textKey="SHOP_MODAL_NOTE_USER" fallback="השדרוג הוא חד-פעמי ולא ניתן לבטל אותו." as="span" />}{' '}
                <EditableTextField textKey="SHOP_MODAL_NOTE_END" fallback="לאחר השדרוג תקבל גישה לדשבורד הסוכנים ותוכל להתחיל להרוויח!" as="span" />
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
                    <EditableTextField textKey="SHOP_MODAL_BTN_UPGRADING" fallback="משדרג..." as="span" />
                  </span>
                ) : !user ? (
                  <EditableTextField textKey="SHOP_MODAL_BTN_REGISTER" fallback="הירשם כסוכן עכשיו!" as="span" />
                ) : (
                  <EditableTextField textKey="SHOP_MODAL_BTN_UPGRADE" fallback="כן, אני רוצה להפוך לסוכן!" as="span" />
                )}
              </button>
              <button
                onClick={() => setShowAgentModal(false)}
                disabled={upgrading}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-all disabled:opacity-50"
              >
                <EditableTextField textKey="SHOP_MODAL_BTN_LATER" fallback="אולי מאוחר יותר" as="span" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Mode Button - Only for admin/business_admin */}
      {canEdit && (
        <button
          onClick={() => editMode ? disableEditMode() : setShowPasswordModal(true)}
          className="fixed bottom-20 left-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105"
          style={{
            background: editMode 
              ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' 
              : 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
            color: 'white',
            fontWeight: '600',
          }}
        >
          {editMode ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              סיום עריכה
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <EditableTextField textKey="SHOP_EDIT_BTN_START" fallback="מצב עריכה" as="span" />
            </>
          )}
        </button>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowPasswordModal(false);
            setPasswordInput('');
            setPasswordError(false);
          }}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between mb-4">
              <EditableTextField textKey="SHOP_PWD_MODAL_TITLE" fallback="כניסה למצב עריכה" as="h3" className="text-xl font-bold" style={{ color: '#1e3a8a' }} />
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordInput('');
                  setPasswordError(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <EditableTextField textKey="SHOP_PWD_MODAL_DESC" fallback="הזן סיסמה כדי לערוך טקסטים בדף" as="p" className="text-gray-600 text-sm mb-4" />
            
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="סיסמה"
              className={`w-full px-4 py-3 border-2 rounded-lg text-lg ${
                passwordError ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              autoFocus
            />
            
            {passwordError && (
              <EditableTextField textKey="SHOP_PWD_MODAL_ERROR" fallback="סיסמה שגויה" as="p" className="text-red-500 text-sm mt-2" />
            )}
            
            <button
              onClick={handlePasswordSubmit}
              className="w-full mt-4 px-4 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              <EditableTextField textKey="SHOP_PWD_MODAL_BTN" fallback="כניסה" as="span" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Mode Indicator */}
      {editMode && (
        <div 
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', color: 'white' }}
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <EditableTextField textKey="SHOP_EDIT_MODE_INDICATOR" fallback="מצב עריכה פעיל - לחץ על טקסט לעריכה" as="span" />
          </span>
        </div>
      )}
    </div>
  );
}

// Main export - uses global SiteTextsProvider from layout
export default function ShopPage() {
  return <ShopPageContent />;
}
