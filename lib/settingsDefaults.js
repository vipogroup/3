export const DEFAULT_SETTINGS = {
  // General
  siteName: 'VIPO',
  siteDescription: 'מערכת מתקדמת לניהול סוכנים ומוצרים',
  logoUrl: '',
  faviconUrl: '',

  // Colors
  primaryColor: '#9333ea',
  secondaryColor: '#2563eb',
  accentColor: '#00bcd4',
  successColor: '#16a34a',
  warningColor: '#eab308',
  dangerColor: '#dc2626',
  backgroundColor: '#f7fbff',
  textColor: '#0d1b2a',

  // Typography & layout
  fontFamily: "'Inter', 'Heebo', sans-serif",
  lineHeight: 1.5,
  letterSpacing: '0.01em',
  direction: 'rtl',
  themePreset: 'vipo',

  // Contact
  email: 'info@vipo.com',
  phone: '050-1234567',
  address: 'תל אביב, ישראל',
  whatsapp: '972501234567',

  // Social Media
  facebook: '',
  instagram: '',
  twitter: '',
  linkedin: '',

  // Features
  enableRegistration: true,
  enableGroupBuy: true,
  enableGamification: true,
  enableNotifications: true,
  enableDarkMode: false,

  // SEO
  metaTitle: 'VIPO - מערכת ניהול סוכנים',
  metaDescription: 'מערכת מתקדמת לניהול סוכנים, מוצרים ורכישות קבוצתיות',
  metaKeywords: 'סוכנים, מוצרים, רכישה קבוצתית, VIPO',

  // Google Analytics & Marketing
  googleAnalyticsId: '',
  googleTagManagerId: '',
  googleSearchConsoleVerification: '',

  // Email
  smtpHost: '',
  smtpPort: '587',
  smtpUser: '',
  smtpPassword: '',
  emailFrom: 'noreply@vipo.com',
};

export function withDefaultSettings(partial = {}) {
  return {
    ...DEFAULT_SETTINGS,
    ...partial,
  };
}
