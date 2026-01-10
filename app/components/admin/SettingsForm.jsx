'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatCurrencyILS } from '@/app/utils/date';
import { useTheme } from '@/app/context/ThemeContext';
import { getAllPresets, applyPreset } from '@/app/lib/themePresets';
import TunnelButton from './TunnelButton';
import ColorPicker from './ColorPicker';
import GradientPicker from './GradientPicker';

function PaletteIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.5a8.5 8.5 0 018.5 8.5c0 2.1-1.4 3.5-3.5 3.5h-1.75a1.75 1.75 0 100 3.5h.25c.83 0 1.5.67 1.5 1.5S16.33 22 15.5 22H12A8.5 8.5 0 113.5 13c0-5.25 3.5-9.5 8.5-9.5z"
      />
      <circle cx="7.5" cy="10" r="1.2" fill="currentColor" />
      <circle cx="9.5" cy="6.5" r="1.2" fill="currentColor" />
      <circle cx="14.5" cy="6.5" r="1.2" fill="currentColor" />
      <circle cx="17" cy="10.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

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

function BrushIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 2.75L21.25 9.5 12 18.75l-4 1 1-4L18.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 14.5L4 19.5l1.5 1.5 5-5"
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

function LightbulbIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3a6.5 6.5 0 00-4 11.7V17a1 1 0 001 1h6a1 1 0 001-1v-2.3A6.5 6.5 0 0012 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 21h4M10.5 18.5h3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
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

function StepBadge({ index }) {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">
      {index}
    </span>
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
  const [activeTab, setActiveTab] = useState('presets');

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

  const handlePresetSelect = (presetName) => {
    const presetSettings = applyPreset(presetName);
    if (presetSettings) {
      const newSettings = { ...settings, ...presetSettings };
      setSettings(newSettings);
      updateSettings(newSettings);
      setSuccess(`סגנון ${presetName} הוחל בהצלחה!`);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await saveSettings(settings);
      setSuccess('ההגדרות נשמרו בהצלחה! השינויים יוחלו על כל האתר.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'שגיאה בשמירת ההגדרות');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'presets', label: 'תצוגה מקדימה', Icon: PaletteIcon },
    { id: 'general', label: 'כללי', Icon: HomeIcon },
    { id: 'colors', label: 'צבעים', Icon: BrushIcon },
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
          {/* Presets Tab */}
          {activeTab === 'presets' && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                תצוגה מקדימה - בחר סגנון
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
                בחר סגנון מוכן של אתר מכירות מפורסם. כל הצבעים והעיצוב של המערכת ישתנו מיידית!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {getAllPresets().map((preset) => {
                  const gradientPreview =
                    preset.colors?.backgroundGradient || preset.backgroundGradient || '';
                  const secondaryGradient =
                    preset.cardGradient || preset.colors?.cardGradient || '';
                  const buttonPreview =
                    preset.buttonGradient ||
                    preset.colors?.buttonGradient ||
                    preset.colors?.primaryColor ||
                    '#4f46e5';

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset.id)}
                      className="relative bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all duration-300 text-left"
                      style={{
                        borderColor: '#e5e7eb',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0891b2';
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow =
                          '0 20px 25px -5px rgba(8, 145, 178, 0.1), 0 10px 10px -5px rgba(8, 145, 178, 0.04)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Preview Gradient */}
                      <div
                        className="h-20 sm:h-24 mb-4 sm:mb-5 rounded-xl shadow-md flex items-center justify-center text-5xl sm:text-6xl text-white"
                        style={{
                          background: gradientPreview || preset.colors?.primaryColor || '#4f46e5',
                        }}
                      >
                        <span className="drop-shadow-lg">{preset.preview}</span>
                      </div>

                      {/* Name */}
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
                        {preset.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-gray-600 mb-4 text-center">
                        {preset.description}
                      </p>

                      {/* Color Swatches */}
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        <div
                          className="h-12 rounded-lg shadow-md"
                          style={{ backgroundColor: preset.colors.primaryColor }}
                          title="Primary"
                        ></div>
                        <div
                          className="h-12 rounded-lg shadow-md"
                          style={{ backgroundColor: preset.colors.secondaryColor }}
                          title="Secondary"
                        ></div>
                        <div
                          className="h-12 rounded-lg shadow-md"
                          style={{ backgroundColor: preset.colors.accentColor }}
                          title="Accent"
                        ></div>
                        <div
                          className="h-12 rounded-lg shadow-md"
                          style={{ backgroundColor: preset.colors.successColor }}
                          title="Success"
                        ></div>
                      </div>

                      {/* Gradient Preview */}
                      {(gradientPreview || secondaryGradient) && (
                        <div className="space-y-2 mb-4">
                          {gradientPreview && (
                            <div
                              className="h-11 rounded-lg shadow-inner border border-white/40"
                              style={{
                                background: gradientPreview,
                              }}
                              title="Gradient"
                            ></div>
                          )}
                          {secondaryGradient && (
                            <div
                              className="h-9 rounded-lg shadow-inner border border-white/60"
                              style={{
                                background: secondaryGradient,
                              }}
                              title="Card Gradient"
                            ></div>
                          )}
                        </div>
                      )}

                      {/* Apply Button */}
                      <div className="text-center">
                        <span
                          className="inline-block text-white font-bold px-6 py-2 rounded-xl shadow-md"
                          style={{
                            background: buttonPreview,
                          }}
                        >
                          החל סגנון
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Info Card */}
              <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <LightbulbIcon className="w-6 h-6" />
                  <h3 className="text-xl font-bold">איך זה עובד?</h3>
                </div>
                <ul className="space-y-2">
                  {[
                    'בחר סגנון מהאפשרויות למעלה',
                    'הצבעים ישתנו מיידית בכל המערכת',
                    'אפשר לערוך ידנית בטאב "צבעים"',
                    'לחץ "שמור הגדרות" לשמירה קבועה',
                  ].map((step, index) => (
                    <li key={step} className="flex items-start gap-3">
                      <StepBadge index={index + 1} />
                      <span className="text-sm sm:text-base">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

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

          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    ערכת צבעים
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    לחץ על כל צבע לפתיחת הפלטה המלאה
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'primaryColor', label: 'צבע ראשי', desc: 'כפתורים וקישורים' },
                  { key: 'secondaryColor', label: 'צבע משני', desc: 'אלמנטים משניים' },
                  { key: 'accentColor', label: 'צבע הדגשה', desc: 'הדגשות ואייקונים' },
                  { key: 'successColor', label: 'צבע הצלחה', desc: 'הודעות הצלחה' },
                  { key: 'warningColor', label: 'צבע אזהרה', desc: 'הודעות אזהרה' },
                  { key: 'dangerColor', label: 'צבע שגיאה', desc: 'הודעות שגיאה' },
                  { key: 'backgroundColor', label: 'צבע רקע', desc: 'רקע האתר' },
                  { key: 'textColor', label: 'צבע טקסט', desc: 'טקסט ראשי' },
                ].map((color, index) => (
                  <ColorPicker
                    key={color.key}
                    value={settings[color.key]}
                    onChange={(value) => handleChange(color.key, value)}
                    label={color.label}
                    description={color.desc}
                    showBrandPresets={index === 0}
                    onApplyPreset={index === 0 ? (presetColors) => {
                      Object.entries(presetColors).forEach(([key, value]) => {
                        handleChange(key, value);
                      });
                      setSuccess('סגנון מותג הוחל בהצלחה!');
                      setTimeout(() => setSuccess(''), 3000);
                    } : undefined}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">גרדיאנטים מתקדמים</h3>
                  <p className="text-sm text-gray-600">
                    כאן ניתן לעדכן את הערכים של הגרדיאנטים (אפשר להזין גם צבע אחיד בצורת HEX).
                  </p>
                </div>

                {[
                  { key: 'backgroundGradient', label: 'גרדיאנט רקע', desc: 'הרקע הכללי של האתר' },
                  { key: 'cardGradient', label: 'גרדיאנט כרטיסים', desc: 'רקע כרטיסי תוכן' },
                  { key: 'buttonGradient', label: 'גרדיאנט כפתורים', desc: 'רקע כפתורי פעולה' },
                ].map((gradient) => (
                  <GradientPicker
                    key={gradient.key}
                    value={settings[gradient.key] || ''}
                    onChange={(value) => handleChange(gradient.key, value)}
                    label={gradient.label}
                    description={gradient.desc}
                  />
                ))}
              </div>

              {/* Preview */}
              <div className="mt-8 p-6 border-2 border-dashed border-gray-300 rounded-xl">
                <h3 className="text-lg font-bold mb-4">תצוגה מקדימה</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    style={{ backgroundColor: settings.primaryColor }}
                    className="px-6 py-2 text-white rounded-lg"
                  >
                    Primary
                  </button>
                  <button
                    style={{ backgroundColor: settings.secondaryColor }}
                    className="px-6 py-2 text-white rounded-lg"
                  >
                    Secondary
                  </button>
                  <button
                    style={{ backgroundColor: settings.accentColor }}
                    className="px-6 py-2 text-white rounded-lg"
                  >
                    Accent
                  </button>
                  <button
                    style={{ backgroundColor: settings.successColor }}
                    className="px-6 py-2 text-white rounded-lg"
                  >
                    Success
                  </button>
                  <button
                    style={{ backgroundColor: settings.warningColor }}
                    className="px-6 py-2 text-white rounded-lg"
                  >
                    Warning
                  </button>
                  <button
                    style={{ backgroundColor: settings.dangerColor }}
                    className="px-6 py-2 text-white rounded-lg"
                  >
                    Danger
                  </button>
                </div>
              </div>
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
                      <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:right-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
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
              className={`inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg ${
                saving ? 'opacity-75 cursor-not-allowed' : ''
              }`}
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
      </div>
    </div>
  );
}
