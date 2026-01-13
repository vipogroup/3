'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatCurrencyILS } from '@/app/utils/date';
import { useTheme } from '@/app/context/ThemeContext';
import TunnelButton from './TunnelButton';

function HomeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-5h-4v5H5a1 1 0 01-1-1v-9.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h4l1 5-2.5 1.5a11 11 0 004 4L15 11l5 1v4c0 .83-.67 1.5-1.5 1.5A15.5 15.5 0 013 5.5C3 4.67 3.67 4 4.5 4H7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.6 9.5h16.8M3.6 14.5h16.8M12 3c-2 3-3 6-3 9s1 6 3 9c2-3 3-6 3-9s-1-6-3-9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CogIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 2.5h3l.7 2.2a7 7 0 011.9.8l2.3-1.1 2.1 2.1-1.1 2.3c.3.62.6 1.26.8 1.93L22 13.5v3l-2.2.7c-.2.67-.5 1.31-.8 1.93l1.1 2.3-2.1 2.1-2.3-1.1c-.62.3-1.26.6-1.93.8L13.5 22h-3l-.7-2.2a7 7 0 01-1.9-.8l-2.3 1.1-2.1-2.1 1.1-2.3a7 7 0 01-.8-1.93L2 13.5v-3l2.2-.7c.2-.67.5-1.31.8-1.93l-1.1-2.3 2.1-2.1 2.3 1.1c.62-.3 1.26-.6 1.93-.8L10.5 2.5z"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MagnifierIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EnvelopeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 7l7.5 6 7.5-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacebookIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 9H16l.5-3h-3V4.5c0-.8.2-1.5 1.5-1.5H16.5V1a17 17 0 00-2.5-.2c-2.5 0-4 1.5-4 4.2V6h-3v3h3v9h3V9z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function TwitterIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 5.5a6.5 6.5 0 01-2 .6 3.4 3.4 0 001.5-1.9 6.2 6.2 0 01-2.1.9 3.3 3.3 0 00-5.7 2.2c0 .26.03.52.08.76A9.4 9.4 0 013.6 4.8a3.4 3.4 0 001 4.5 3.2 3.2 0 01-1.5-.4v.04a3.3 3.3 0 002.7 3.2 3.4 3.4 0 01-1.5.06 3.3 3.3 0 003.1 2.3A6.7 6.7 0 013 16.5a9.3 9.3 0 005 1.5c6 0 9.3-5.1 9.3-9.5v-.43A6.6 6.6 0 0021 5.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.5 3.5a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5zM3 8h3v12H3zM9 8h2.9v1.6h.04a3.18 3.18 0 012.86-1.6c3.06 0 3.6 2 3.6 4.5V20h-3v-5.6c0-1.33-.03-3-1.84-3-1.84 0-2.12 1.44-2.12 2.9V20H9z" />
    </svg>
  );
}

function SaveIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 3h10l4 4v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 3v6h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="8" y="13" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function SettingsForm() {
  const pathname = usePathname();
  const isBusinessPage = pathname?.startsWith('/business');
  const backLink = isBusinessPage ? '/business' : '/admin';
  
  const {
    settings: themeSettings,
    updateSettings,
    saveSettings,
    loading: themeLoading,
    error: themeError,
  } = useTheme();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [designPassword, setDesignPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const initialSettings = useMemo(() => ({ ...themeSettings }), [themeSettings]);
  const [settings, setSettings] = useState(initialSettings);

  // Load settings from ThemeContext
  useEffect(() => {
    setSettings({ ...themeSettings });
  }, [themeSettings]);

  const mergedError = error || themeError || '';
  const isBusy = themeLoading || saving;

  const handleChange = (field, value) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);

    // Apply changes immediately (live preview)
    updateSettings(newSettings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // בדיקה אם זה דשבורד מנהל ראשי ויש שינויים בעיצוב
    const isAdminDashboard = !isBusinessPage;
    const hasDesignChanges = 
      JSON.stringify(initialSettings.primaryColor) !== JSON.stringify(settings.primaryColor) ||
      JSON.stringify(initialSettings.secondaryColor) !== JSON.stringify(settings.secondaryColor) ||
      JSON.stringify(initialSettings.backgroundGradient) !== JSON.stringify(settings.backgroundGradient) ||
      JSON.stringify(initialSettings.cardGradient) !== JSON.stringify(settings.cardGradient) ||
      JSON.stringify(initialSettings.buttonGradient) !== JSON.stringify(settings.buttonGradient);
    
    // אם זה מנהל ראשי ויש שינויים בעיצוב - דרוש סיסמה
    if (isAdminDashboard && hasDesignChanges) {
      setShowPasswordModal(true);
      return;
    }
    
    // אחרת - שמור ישירות
    await performSave();
  };
  
  const performSave = async (password = null) => {
    setSaving(true);
    setPasswordError('');

    try {
      await saveSettings(settings, password);
      setSuccess('ההגדרות נשמרו בהצלחה! השינויים יוחלו על כל האתר.');
      setTimeout(() => setSuccess(''), 3000);
      setShowPasswordModal(false);
      setDesignPassword('');
    } catch (err) {
      if (err.message?.includes('סיסמה') || err.message?.includes('password')) {
        setPasswordError(err.message);
      } else {
        setError(err.message || 'שגיאה בשמירת ההגדרות');
        setShowPasswordModal(false);
      }
    } finally {
      setSaving(false);
    }
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!designPassword) {
      setPasswordError('נא להזין סיסמה');
      return;
    }
    performSave(designPassword);
  };

  const tabs = [
    { id: 'general', label: 'כללי', Icon: HomeIcon },
    { id: 'contact', label: 'יצירת קשר', Icon: PhoneIcon },
    { id: 'social', label: 'רשתות חברתיות', Icon: GlobeIcon },
    { id: 'features', label: 'תכונות', Icon: CogIcon },
    { id: 'seo', label: 'SEO', Icon: MagnifierIcon },
    { id: 'email', label: 'אימייל', Icon: EnvelopeIcon },
  ];

  return (
    <div className="min-h-screen bg-white p-3 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white px-3 sm:px-6 py-4 sm:py-6 mb-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2 sm:gap-3"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <CogIcon className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#0891b2' }} />
                הגדרות מערכת
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                נהל את כל הגדרות האתר, לוגו, צבעים ופונקציות
              </p>
            </div>
            <Link
              href={backLink}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              חזרה
            </Link>
          </div>
        </div>

        {/* Status Messages */}
        {(isBusy || mergedError || success) && (
          <div className="mb-4 space-y-3">
            {isBusy && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                טוען נתונים... אנא המתן.
              </div>
            )}
            {mergedError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {mergedError}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-t-lg sm:rounded-t-xl shadow-md overflow-x-auto">
          <div className="flex border-b-2" style={{ borderColor: '#e5e7eb' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-4 font-semibold transition-all whitespace-nowrap text-sm sm:text-base"
                style={{
                  background:
                    activeTab === tab.id
                      ? 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)'
                      : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span
                  className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg"
                  style={{
                    background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.2)' : '#f3f4f6',
                    color: activeTab === tab.id ? 'white' : '#374151',
                  }}
                >
                  <tab.Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-b-lg sm:rounded-b-xl shadow-md p-4 sm:p-6"
        >
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">הגדרות כלליות</h2>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">שם האתר</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="VIPO"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">תיאור האתר</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleChange('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="תיאור קצר של האתר"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">לוגו (URL)</label>
                <input
                  type="url"
                  value={settings.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="https://..."
                />
                {settings.logoUrl && (
                  <div className="mt-4 relative h-16 w-16">
                    <Image
                      src={settings.logoUrl}
                      alt="לוגו האתר"
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Favicon (URL)</label>
                <input
                  type="url"
                  value={settings.faviconUrl}
                  onChange={(e) => handleChange('faviconUrl', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="https://..."
                />
              </div>

              {/* Mobile Tunnel Button */}
              <TunnelButton />
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">פרטי יצירת קשר</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">אימייל</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="info@vipo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">טלפון</label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="050-1234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    value={settings.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="972501234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">כתובת</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="תל אביב, ישראל"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">רשתות חברתיות</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    key: 'facebook',
                    label: 'Facebook',
                    Icon: FacebookIcon,
                    placeholder: 'https://facebook.com/...',
                  },
                  {
                    key: 'instagram',
                    label: 'Instagram',
                    Icon: InstagramIcon,
                    placeholder: 'https://instagram.com/...',
                  },
                  {
                    key: 'twitter',
                    label: 'Twitter',
                    Icon: TwitterIcon,
                    placeholder: 'https://twitter.com/...',
                  },
                  {
                    key: 'linkedin',
                    label: 'LinkedIn',
                    Icon: LinkedinIcon,
                    placeholder: 'https://linkedin.com/...',
                  },
                ].map((social) => (
                  <div key={social.key}>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                        <social.Icon />
                      </span>
                      {social.label}
                    </label>
                    <input
                      type="url"
                      value={settings[social.key]}
                      onChange={(e) => handleChange(social.key, e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                      placeholder={social.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">תכונות מערכת</h2>

              <div className="space-y-4">
                {[
                  {
                    key: 'enableRegistration',
                    label: 'אפשר הרשמה',
                    desc: 'אפשר למשתמשים חדשים להירשם',
                  },
                  { key: 'enableGroupBuy', label: 'רכישה קבוצתית', desc: 'אפשר רכישות קבוצתיות' },
                  {
                    key: 'enableGamification',
                    label: 'Gamification',
                    desc: 'מערכת רמות, XP ותגים',
                  },
                  { key: 'enableNotifications', label: 'התראות', desc: 'שלח התראות למשתמשים' },
                  { key: 'enableDarkMode', label: 'מצב כהה', desc: 'אפשר מצב כהה באתר' },
                ].map((feature) => (
                  <div
                    key={feature.key}
                    className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl"
                  >
                    <div>
                      <div className="font-bold text-gray-900">{feature.label}</div>
                      <div className="text-sm text-gray-600">{feature.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[feature.key]}
                        onChange={(e) => handleChange(feature.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:right-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">הגדרות SEO</h2>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">כותרת Meta</label>
                <input
                  type="text"
                  value={settings.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="VIPO - מערכת ניהול סוכנים"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">תיאור Meta</label>
                <textarea
                  value={settings.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="תיאור האתר למנועי חיפוש"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">מילות מפתח</label>
                <input
                  type="text"
                  value={settings.metaKeywords}
                  onChange={(e) => handleChange('metaKeywords', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="סוכנים, מוצרים, רכישה קבוצתית"
                />
                <p className="text-sm text-gray-600 mt-1">הפרד מילות מפתח בפסיקים</p>
              </div>

              <hr className="my-6 border-gray-200" />
              <h3 className="text-lg font-bold text-gray-900 mb-4">Google Analytics & Marketing</h3>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Google Analytics ID</label>
                <input
                  type="text"
                  value={settings.googleAnalyticsId || ''}
                  onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-sm text-gray-600 mt-1">Measurement ID מ-Google Analytics 4</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Google Tag Manager ID</label>
                <input
                  type="text"
                  value={settings.googleTagManagerId || ''}
                  onChange={(e) => handleChange('googleTagManagerId', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="GTM-XXXXXXX"
                />
                <p className="text-sm text-gray-600 mt-1">Container ID מ-Google Tag Manager (אופציונלי)</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Google Search Console Verification</label>
                <input
                  type="text"
                  value={settings.googleSearchConsoleVerification || ''}
                  onChange={(e) => handleChange('googleSearchConsoleVerification', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="google-site-verification=XXXXX"
                />
                <p className="text-sm text-gray-600 mt-1">קוד אימות מ-Search Console (אופציונלי)</p>
              </div>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">הגדרות אימייל (SMTP)</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => handleChange('smtpHost', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">SMTP Port</label>
                  <input
                    type="text"
                    value={settings.smtpPort}
                    onChange={(e) => handleChange('smtpPort', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="587"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">SMTP User</label>
                  <input
                    type="text"
                    value={settings.smtpUser}
                    onChange={(e) => handleChange('smtpUser', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="user@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleChange('smtpPassword', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="••••••••"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Email From</label>
                  <input
                    type="email"
                    value={settings.emailFrom}
                    onChange={(e) => handleChange('emailFrom', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="noreply@vipo.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="mt-6 bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-xl font-semibold">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold rounded-xl transition-all"
            >
              איפוס
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`inline-flex items-center gap-2 px-8 py-3 text-white font-bold rounded-xl transition-all shadow-lg ${
                saving ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              {saving ? (
                <span>שומר...</span>
              ) : (
                <>
                  <SaveIcon className="w-5 h-5" />
                  <span>שמור הגדרות</span>
                </>
              )}
            </button>
          </div>
        </form>
        
        {/* Password Modal - רק למנהל ראשי */}
        {showPasswordModal && !isBusinessPage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">הגנה על העיצוב</h3>
                <p className="text-gray-600 text-sm">
                  שינויים בעיצוב המערכת דורשים סיסמת אישור
                </p>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    סיסמת עיצוב
                  </label>
                  <input
                    type="password"
                    value={designPassword}
                    onChange={(e) => {
                      setDesignPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 text-center text-lg tracking-widest"
                    placeholder="••••"
                    autoFocus
                    disabled={saving}
                  />
                  {passwordError && (
                    <p className="text-red-600 text-sm mt-2 font-semibold">{passwordError}</p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setDesignPassword('');
                      setPasswordError('');
                    }}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold rounded-xl transition-all disabled:opacity-50"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !designPassword}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'שומר...' : 'אישור'}
                  </button>
                </div>
              </form>
              
              <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-xs text-yellow-800 text-center">
                  סיסמה זו מגנה על העיצוב של המערכת מפני שינויים לא מורשים
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
