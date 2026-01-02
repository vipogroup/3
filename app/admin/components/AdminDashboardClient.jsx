'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { hasPermission, ADMIN_PERMISSIONS, isSuperAdminUser } from '@/lib/superAdmins';

function DashboardIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="9" width="8" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PlusCircleIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8.5v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 12h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function UsersIcon({ className = 'w-10 h-10' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M4 19.5v-.75A5.75 5.75 0 019.75 13h4.5A5.75 5.75 0 0120 18.75v.75"
      />
      <circle cx="12" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CartIcon({ className = 'w-10 h-10' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 2.25h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0h12.752a.75.75 0 01.736.92l-1.5 6a.75.75 0 01-.736.58H6.72a.75.75 0 01-.736-.58L4.106 4.522m13.813 10.477a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-8.25 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
      />
    </svg>
  );
}

function CubeIcon({ className = 'w-10 h-10' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 7.5L12 2.25 3 7.5m18 0L12 12.75m9-5.25v9l-9 5.25m0-9L3 7.5m9 5.25v9l-9-5.25v-9"
      />
    </svg>
  );
}

function CoinStackIcon({ className = 'w-10 h-10' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="6.5" rx="7" ry="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 6.5v7c0 1.93 3.134 3.5 7 3.5s7-1.57 7-3.5v-7"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 10.5c0 1.93 3.134 3.5 7 3.5s7-1.57 7-3.5"
      />
    </svg>
  );
}

function CursorIcon({ className = 'w-10 h-10' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.25 4.25l8.5 9.5-3.8.7 2.2 5.8-2.05.75-2.05-5.95-3.8.7z"
      />
    </svg>
  );
}

function UserPlusIcon({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M4 20v-.75A5.25 5.25 0 019.25 14h1.5"
      />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M16 8v4" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M14 10h4" />
    </svg>
  );
}

function SparkIcon({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4l1.76 4.95L18.7 10.7l-4.94 1.76L12 17.4l-1.76-4.94L5.3 10.7l4.94-1.75z"
      />
    </svg>
  );
}

function ClipboardIcon({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 3h6a1 1 0 011 1v1h1.5A1.5 1.5 0 0119.5 6v12A1.5 1.5 0 0118 19.5H6A1.5 1.5 0 014.5 18V6A1.5 1.5 0 016 5h1V4a1 1 0 011-1z"
      />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M9 9h6" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M9 13h6" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M9 17h4" />
    </svg>
  );
}

function AgentIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6.5" cy="16.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="16.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10.4 9.4L8.3 13.6" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M13.6 9.4l2.1 4.2" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8.5 16.5h7" />
    </svg>
  );
}

function ShieldIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4l7 2.8v5.7c0 4-2.9 7.8-7 8.5-4.1-.7-7-4.5-7-8.5V6.8L12 4z"
      />
    </svg>
  );
}

function UserCircleIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M8.5 17.5a3.5 3.5 0 017 0"
      />
    </svg>
  );
}

function LinkMarkIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15.5" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M11.5 12h1" />
    </svg>
  );
}

function ChartBarIcon({ className = 'w-10 h-10' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 20h16"
      />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8 20v-8" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12 20v-12" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M16 20v-5" />
    </svg>
  );
}

function getRoleBadge(role) {
  switch (role) {
    case 'agent':
      return { label: 'סוכן', className: 'bg-purple-100 text-purple-700', Icon: AgentIcon };
    case 'admin':
      return { label: 'מנהל', className: 'bg-red-100 text-red-700', Icon: ShieldIcon };
    default:
      return { label: 'לקוח', className: 'bg-blue-100 text-blue-700', Icon: UserCircleIcon };
  }
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState(null);
  const [infoTooltip, setInfoTooltip] = useState(null);
  const [systemStatus, setSystemStatus] = useState({});
  const [statusLoading, setStatusLoading] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [securityData, setSecurityData] = useState(null);
  const [securityLoading, setSecurityLoading] = useState(false);

  const backupInfoTexts = {
    backup: 'יוצר גיבוי חדש של כל הקבצים והנתונים במערכת. מומלץ לבצע לפני כל עדכון גדול.',
    update: 'מושך את הקוד העדכני מהשרת (git pull) ומתקין תלויות חדשות (npm install). השתמש כשיש עדכונים בקוד.',
    server: 'מפעיל את השרת המקומי לפיתוח בפורט 3001. סוגר שרת קיים אם יש ומפעיל חדש.',
    manual: 'מציג את כל הפקודות הידניות שניתן להריץ בטרמינל. לשימוש מתקדם בלבד.',
    deploy: 'מעלה את הגרסה העדכנית לשרת Vercel בפרודקשן. האתר יתעדכן תוך כ-2 דקות.',
    restore: 'משחזר גיבוי קודם. שים לב: פעולה זו תדרוס את הנתונים הנוכחיים!'
  };

  const systemsInfoTexts = {
    github: 'מאגר הקוד של הפרויקט. כאן נשמר כל הקוד והיסטוריית השינויים. לחץ לפתיחת GitHub.',
    mongodb: 'מסד הנתונים הראשי של המערכת. כאן נשמרים משתמשים, הזמנות, מוצרים וכל הנתונים.',
    vercel: 'פלטפורמת האחסון של האתר בפרודקשן. Deploy אוטומטי מ-GitHub.',
    render: 'לא בשימוש בפרויקט זה. ניתן להסיר מהרשימה.',
    cloudinary: 'שירות אחסון תמונות ומדיה בענן. משמש להעלאת תמונות מוצרים ותוכן.',
    firebase: 'לא בשימוש בפרויקט זה. ניתן להסיר מהרשימה.',
    sendgrid: 'שירות שליחת אימיילים. משמש לאימות אימייל בהרשמה, הודעות מערכת ועוד.',
    twilio: 'שירות SMS/WhatsApp לשליחת קודי OTP לאימות משתמשים.',
    resend: 'שירות שליחת אימיילים. משמש לאימות אימייל, הודעות מערכת ועוד.',
    npm: 'מנהל החבילות של Node.js - ספריות הקוד של הפרויקט.'
  };

  const loadData = useCallback(async () => {
    try {
      // Get current user
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        router.push('/login');
        return;
      }
      const userData = await userRes.json();

      if (userData.user.role !== 'admin') {
        router.push('/');
        return;
      }

      setUser(userData.user);

      // Get dashboard data
      const dashRes = await fetch('/api/admin/dashboard');
      if (dashRes.ok) {
        const data = await dashRes.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Failed to load admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const checkSystemStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const res = await fetch('/api/admin/system-status');
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data.results || {});
      }
    } catch (error) {
      console.error('Failed to check system status:', error);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Check system status when systems category is opened
  useEffect(() => {
    if (openCategory === 'systems' && Object.keys(systemStatus).length === 0) {
      checkSystemStatus();
    }
  }, [openCategory, systemStatus, checkSystemStatus]);

  // Fetch alert count
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/admin/alerts?unread=true');
        if (res.ok) {
          const data = await res.json();
          setAlertCount(data.unreadCount || 0);
        }
      } catch (e) {
        console.error('Failed to fetch alerts:', e);
      }
    };
    if (user) {
      fetchAlerts();
      const interval = setInterval(fetchAlerts, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [user]);

  // Fetch security data when security category is opened
  const checkSecurity = useCallback(async () => {
    setSecurityLoading(true);
    try {
      const res = await fetch('/api/admin/security-scan');
      if (res.ok) {
        const data = await res.json();
        setSecurityData(data);
      }
    } catch (e) {
      console.error('Failed to fetch security data:', e);
    } finally {
      setSecurityLoading(false);
    }
  }, []);

  useEffect(() => {
    if (openCategory === 'security' && !securityData) {
      checkSecurity();
    }
  }, [openCategory, securityData, checkSecurity]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div
          className="bg-white rounded-xl p-8"
          style={{
            border: '2px solid transparent',
            backgroundImage:
              'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 4px 20px rgba(8, 145, 178, 0.15)',
          }}
        >
          <div
            className="animate-spin rounded-full h-16 w-16 mx-auto mb-4"
            style={{
              border: '4px solid rgba(8, 145, 178, 0.2)',
              borderTopColor: '#0891b2',
            }}
          ></div>
          <p className="text-gray-600 text-center font-medium">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};

  // Helper function to check permissions
  const canAccess = (permission) => hasPermission(user, permission);
  const isSuperAdmin = isSuperAdminUser(user);

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <main className="min-h-screen bg-white p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            <span
              className="flex items-center gap-2 sm:gap-3"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <DashboardIcon
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                style={{ color: '#0891b2' }}
              />
              דשבורד מנהל
            </span>
          </h1>
          {isSuperAdmin && (
            <div className="flex items-center gap-2">
              <Link
                href="/admin/monitor"
                className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {alertCount > 9 ? '9+' : alertCount}
                  </span>
                )}
              </Link>
              <Link
                href="/admin/monitor"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                מוניטור
              </Link>
            </div>
          )}
        </div>

        {/* Accordion Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* 1. ניהול משתמשים */}
          {(canAccess(ADMIN_PERMISSIONS.VIEW_USERS) || canAccess(ADMIN_PERMISSIONS.VIEW_AGENTS)) && (
          <div className="rounded-xl overflow-hidden" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
            <button onClick={() => toggleCategory('users')} className="w-full flex items-center justify-between p-4 text-right transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <UsersIcon className="w-5 h-5" />
                </span>
                <span className="text-base font-bold" style={{ color: '#1e3a8a' }}>ניהול משתמשים</span>
              </div>
              <svg className={`w-5 h-5 transition-transform ${openCategory === 'users' ? 'rotate-180' : ''}`} style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openCategory === 'users' && (
            <div className="p-4 pt-0 grid grid-cols-2 gap-3">
              {canAccess(ADMIN_PERMISSIONS.VIEW_USERS) && (
              <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <UsersIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
                <span className="text-sm font-medium text-gray-900">ניהול משתמשים</span>
              </Link>
              )}
              {canAccess(ADMIN_PERMISSIONS.VIEW_AGENTS) && (
              <Link href="/admin/agents" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <AgentIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
                <span className="text-sm font-medium text-gray-900">ניהול סוכנים</span>
              </Link>
              )}
            </div>
            )}
          </div>
          )}

          {/* 2. קטלוג ומכירות */}
          {(canAccess(ADMIN_PERMISSIONS.VIEW_PRODUCTS) || canAccess(ADMIN_PERMISSIONS.VIEW_ORDERS)) && (
          <div className="rounded-xl overflow-hidden" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
            <button onClick={() => toggleCategory('catalog')} className="w-full flex items-center justify-between p-4 text-right transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <CubeIcon className="w-5 h-5" />
                </span>
                <span className="text-base font-bold" style={{ color: '#1e3a8a' }}>קטלוג ומכירות</span>
              </div>
              <svg className={`w-5 h-5 transition-transform ${openCategory === 'catalog' ? 'rotate-180' : ''}`} style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openCategory === 'catalog' && (
            <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {canAccess(ADMIN_PERMISSIONS.VIEW_PRODUCTS) && (
              <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <CubeIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
                <span className="text-sm font-medium text-gray-900">ניהול מוצרים</span>
              </Link>
              )}
              {canAccess(ADMIN_PERMISSIONS.VIEW_ORDERS) && (
              <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <CartIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
                <span className="text-sm font-medium text-gray-900">ניהול הזמנות</span>
              </Link>
              )}
              {canAccess(ADMIN_PERMISSIONS.EDIT_PRODUCTS) && (
              <Link href="/admin/products/new" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <PlusCircleIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
                <span className="text-sm font-medium text-gray-900">הוסף מוצר</span>
              </Link>
              )}
            </div>
            )}
          </div>
          )}

          {/* 3. כספים ודוחות */}
          {(canAccess(ADMIN_PERMISSIONS.VIEW_REPORTS) || canAccess(ADMIN_PERMISSIONS.VIEW_COMMISSIONS)) && (
          <div className="rounded-xl overflow-hidden" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
            <button onClick={() => toggleCategory('finance')} className="w-full flex items-center justify-between p-4 text-right transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <CoinStackIcon className="w-5 h-5" />
                </span>
                <span className="text-base font-bold" style={{ color: '#1e3a8a' }}>כספים ודוחות</span>
              </div>
              <svg className={`w-5 h-5 transition-transform ${openCategory === 'finance' ? 'rotate-180' : ''}`} style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openCategory === 'finance' && (
            <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {canAccess(ADMIN_PERMISSIONS.VIEW_REPORTS) && (
              <Link href="/admin/reports" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <ChartBarIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
                <span className="text-sm font-medium text-gray-900">דוחות</span>
              </Link>
              )}
              {canAccess(ADMIN_PERMISSIONS.VIEW_ANALYTICS) && (
              <Link href="/admin/analytics" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <ChartBarIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
                <span className="text-sm font-medium text-gray-900">ניתוח נתונים</span>
              </Link>
              )}
              {canAccess(ADMIN_PERMISSIONS.VIEW_REPORTS) && (
              <Link href="/admin/transactions" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <CoinStackIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
                <span className="text-sm font-medium text-gray-900">עסקאות</span>
              </Link>
              )}
              {canAccess(ADMIN_PERMISSIONS.VIEW_COMMISSIONS) && (
              <Link href="/admin/commissions" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <CoinStackIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
                <span className="text-sm font-medium text-gray-900">עמלות</span>
              </Link>
              )}
              {canAccess(ADMIN_PERMISSIONS.VIEW_COMMISSIONS) && (
              <Link href="/dashboard/admin/withdrawals" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <CoinStackIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
                <span className="text-sm font-medium text-gray-900">בקשות משיכה</span>
              </Link>
              )}
            </div>
            )}
          </div>
          )}

          {/* 4. הגדרות ושיווק */}
          {(canAccess(ADMIN_PERMISSIONS.MANAGE_NOTIFICATIONS) || canAccess(ADMIN_PERMISSIONS.VIEW_SETTINGS)) && (
          <div className="rounded-xl overflow-hidden" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
            <button onClick={() => toggleCategory('settings')} className="w-full flex items-center justify-between p-4 text-right transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <SettingsIcon className="w-5 h-5" />
                </span>
                <span className="text-base font-bold" style={{ color: '#1e3a8a' }}>הגדרות ושיווק</span>
              </div>
              <svg className={`w-5 h-5 transition-transform ${openCategory === 'settings' ? 'rotate-180' : ''}`} style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openCategory === 'settings' && (
            <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {canAccess(ADMIN_PERMISSIONS.MANAGE_NOTIFICATIONS) && (
              <Link href="/admin/notifications" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <SettingsIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
                <span className="text-sm font-medium text-gray-900">התראות</span>
              </Link>
              )}
              {canAccess(ADMIN_PERMISSIONS.MANAGE_NOTIFICATIONS) && (
              <Link href="/admin/marketing-assets" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <SparkIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
                <span className="text-sm font-medium text-gray-900">שיווק</span>
              </Link>
              )}
              {canAccess(ADMIN_PERMISSIONS.VIEW_SETTINGS) && (
              <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <SettingsIcon className="w-5 h-5" style={{ color: '#0891b2' }} />
                <span className="text-sm font-medium text-gray-900">הגדרות</span>
              </Link>
              )}
            </div>
            )}
          </div>
          )}

          {/* 5. מערכות וחיבורים - רק למנהלים ראשיים */}
          {isSuperAdmin && (
          <div className="rounded-xl overflow-hidden" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
            <button onClick={() => toggleCategory('systems')} className="w-full flex items-center justify-between p-4 text-right transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </span>
                <span className="text-base font-bold" style={{ color: '#1e3a8a' }}>מערכות וחיבורים</span>
              </div>
              <svg className={`w-5 h-5 transition-transform ${openCategory === 'systems' ? 'rotate-180' : ''}`} style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openCategory === 'systems' && (
            <div className="p-4 pt-0 relative">
              {/* Refresh Button */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">{statusLoading ? 'בודק חיבורים...' : 'סטטוס מערכות'}</span>
                <button 
                  onClick={checkSystemStatus} 
                  disabled={statusLoading}
                  className="text-xs text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                >
                  <svg className={`w-3 h-3 ${statusLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  רענן
                </button>
              </div>
              
              {/* Info Tooltip Modal for Systems */}
              {infoTooltip && systemsInfoTexts[infoTooltip] && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setInfoTooltip(null)}>
                  <div className="bg-white rounded-xl p-4 max-w-sm mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">מידע</h4>
                      <button onClick={() => setInfoTooltip(null)} className="p-1 hover:bg-gray-100 rounded-full">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{systemsInfoTexts[infoTooltip]}</p>
                    {systemStatus[infoTooltip] && (
                      <div className={`mt-3 p-2 rounded-lg text-xs ${systemStatus[infoTooltip].status === 'connected' ? 'bg-green-50 text-green-700' : systemStatus[infoTooltip].status === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                        {systemStatus[infoTooltip].message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <a href="https://github.com/vipogroup" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all relative">
                  <span className={`absolute top-2 left-2 w-2 h-2 rounded-full ${systemStatus.github?.status === 'connected' ? 'bg-green-500' : systemStatus.github?.status === 'warning' ? 'bg-amber-500' : systemStatus.github?.status === 'error' ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                  <svg className="w-5 h-5" style={{ color: '#333' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900">GitHub</span>
                </a>
                <button onClick={() => setInfoTooltip('github')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all relative">
                  <span className={`absolute top-2 left-2 w-2 h-2 rounded-full ${systemStatus.mongodb?.status === 'connected' ? 'bg-green-500' : systemStatus.mongodb?.status === 'warning' ? 'bg-amber-500' : systemStatus.mongodb?.status === 'error' ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                  <svg className="w-5 h-5" style={{ color: '#47A248' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900">MongoDB</span>
                </a>
                <button onClick={() => setInfoTooltip('mongodb')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all relative">
                  <span className={`absolute top-2 left-2 w-2 h-2 rounded-full ${systemStatus.vercel?.status === 'connected' ? 'bg-green-500' : systemStatus.vercel?.status === 'warning' ? 'bg-amber-500' : systemStatus.vercel?.status === 'error' ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                  <svg className="w-5 h-5" style={{ color: '#000' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 22.525H0l12-21.05 12 21.05z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Vercel</span>
                </a>
                <button onClick={() => setInfoTooltip('vercel')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://render.com" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all relative">
                  <span className={`absolute top-2 left-2 w-2 h-2 rounded-full ${systemStatus.render?.status === 'connected' ? 'bg-green-500' : systemStatus.render?.status === 'warning' ? 'bg-amber-500' : systemStatus.render?.status === 'error' ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                  <svg className="w-5 h-5" style={{ color: '#46E3B7' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 19.5a7.5 7.5 0 110-15 7.5 7.5 0 010 15z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Render</span>
                </a>
                <button onClick={() => setInfoTooltip('render')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all relative">
                  <span className={`absolute top-2 left-2 w-2 h-2 rounded-full ${systemStatus.cloudinary?.status === 'connected' ? 'bg-green-500' : systemStatus.cloudinary?.status === 'warning' ? 'bg-amber-500' : systemStatus.cloudinary?.status === 'error' ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                  <svg className="w-5 h-5" style={{ color: '#3448C5' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 16.5h-9v-3h9v3zm0-4.5h-9V9h9v3z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Cloudinary</span>
                </a>
                <button onClick={() => setInfoTooltip('cloudinary')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all relative">
                  <span className={`absolute top-2 left-2 w-2 h-2 rounded-full ${systemStatus.firebase?.status === 'connected' ? 'bg-green-500' : systemStatus.firebase?.status === 'warning' ? 'bg-amber-500' : systemStatus.firebase?.status === 'error' ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                  <svg className="w-5 h-5" style={{ color: '#FFCA28' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.89 15.673L6.255.461A.542.542 0 017.27.289l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0l8.92-4.427zM14.3 7.148l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Firebase</span>
                </a>
                <button onClick={() => setInfoTooltip('firebase')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://app.sendgrid.com" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all relative">
                  <span className={`absolute top-2 left-2 w-2 h-2 rounded-full ${systemStatus.sendgrid?.status === 'connected' ? 'bg-green-500' : systemStatus.sendgrid?.status === 'warning' ? 'bg-amber-500' : systemStatus.sendgrid?.status === 'error' ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                  <svg className="w-5 h-5" style={{ color: '#1A82E2' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 17H7v-4h4v4zm0-6H7V7h4v4zm6 6h-4v-4h4v4zm0-6h-4V7h4v4z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900">SendGrid</span>
                </a>
                <button onClick={() => setInfoTooltip('sendgrid')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all relative">
                  <span className={`absolute top-2 left-2 w-2 h-2 rounded-full ${systemStatus.twilio?.status === 'connected' ? 'bg-green-500' : systemStatus.twilio?.status === 'warning' ? 'bg-amber-500' : systemStatus.twilio?.status === 'error' ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                  <svg className="w-5 h-5" style={{ color: '#F22F46' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.381 0 0 5.381 0 12s5.381 12 12 12 12-5.381 12-12S18.619 0 12 0zm0 20.5c-4.687 0-8.5-3.813-8.5-8.5S7.313 3.5 12 3.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5zm3.5-11a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm5 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Twilio</span>
                </a>
                <button onClick={() => setInfoTooltip('twilio')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all relative">
                  <span className={`absolute top-2 left-2 w-2 h-2 rounded-full ${systemStatus.resend?.status === 'connected' ? 'bg-green-500' : systemStatus.resend?.status === 'warning' ? 'bg-amber-500' : systemStatus.resend?.status === 'error' ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                  <svg className="w-5 h-5" style={{ color: '#000' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0l8 5 8-5H4zm0 2v10h16V8l-8 5-8-5z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Resend</span>
                </a>
                <button onClick={() => setInfoTooltip('resend')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://www.npmjs.com/package/web-push" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all relative">
                  <span className={`absolute top-2 left-2 w-2 h-2 rounded-full ${systemStatus.npm?.status === 'connected' ? 'bg-green-500' : systemStatus.npm?.status === 'warning' ? 'bg-amber-500' : systemStatus.npm?.status === 'error' ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                  <svg className="w-5 h-5" style={{ color: '#CB3837' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-900">NPM</span>
                </a>
                <button onClick={() => setInfoTooltip('npm')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              </div>
            </div>
            )}
          </div>
          )}

          {/* 6. גיבוי ועדכון מערכת - רק למנהלים ראשיים */}
          {isSuperAdmin && (
          <div className="rounded-xl overflow-hidden" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
            <button onClick={() => toggleCategory('backup')} className="w-full flex items-center justify-between p-4 text-right transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </span>
                <span className="text-base font-bold" style={{ color: '#1e3a8a' }}>גיבוי ועדכון מערכת</span>
              </div>
              <svg className={`w-5 h-5 transition-transform ${openCategory === 'backup' ? 'rotate-180' : ''}`} style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openCategory === 'backup' && (
            <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 gap-3 relative">
              {/* Info Tooltip Modal */}
              {infoTooltip && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setInfoTooltip(null)}>
                  <div className="bg-white rounded-xl p-4 max-w-sm mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">מידע</h4>
                      <button onClick={() => setInfoTooltip(null)} className="p-1 hover:bg-gray-100 rounded-full">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{backupInfoTexts[infoTooltip]}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Link href="/admin/backups?action=backup" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-all">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: '#16a34a' }}>1</span>
                  <span className="text-sm font-medium text-gray-900">גיבוי חדש</span>
                </Link>
                <button onClick={() => setInfoTooltip('backup')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/admin/backups?action=update" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: '#2563eb' }}>2</span>
                  <span className="text-sm font-medium text-gray-900">עדכון מערכת</span>
                </Link>
                <button onClick={() => setInfoTooltip('update')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/admin/backups?action=server" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-cyan-50 hover:bg-cyan-100 transition-all">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: '#0891b2' }}>3</span>
                  <span className="text-sm font-medium text-gray-900">הפעל שרת פנימי</span>
                </Link>
                <button onClick={() => setInfoTooltip('server')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/admin/backups" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: '#6b7280' }}>4</span>
                  <span className="text-sm font-medium text-gray-900">בדיקה ידנית</span>
                </Link>
                <button onClick={() => setInfoTooltip('manual')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/admin/backups?action=deploy" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-all">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: '#7c3aed' }}>5</span>
                  <span className="text-sm font-medium text-gray-900">Deploy לVercel</span>
                </Link>
                <button onClick={() => setInfoTooltip('deploy')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/admin/backups?action=restore" className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-all">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: '#d97706' }}>!</span>
                  <span className="text-sm font-medium text-gray-900">שחזור גיבוי</span>
                </Link>
                <button onClick={() => setInfoTooltip('restore')} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold transition-all">i</button>
              </div>
            </div>
            )}
          </div>
          )}

          {/* 7. משימות ותיקונים - רק למנהלים ראשיים */}
          {isSuperAdmin && (
          <div className="rounded-xl overflow-hidden" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
            <button onClick={() => toggleCategory('tasks')} className="w-full flex items-center justify-between p-4 text-right transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </span>
                <span className="text-base font-bold" style={{ color: '#1e3a8a' }}>משימות ותיקונים</span>
              </div>
              <svg className={`w-5 h-5 transition-transform ${openCategory === 'tasks' ? 'rotate-180' : ''}`} style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openCategory === 'tasks' && (
            <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link href="/admin/tasks" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <svg className="w-5 h-5" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-sm font-medium text-gray-900">כל המשימות</span>
              </Link>
              <Link href="/admin/tasks?filter=pending" className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-all">
                <svg className="w-5 h-5" style={{ color: '#d97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">ממתינות</span>
              </Link>
              <Link href="/admin/tasks?filter=completed" className="flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-all">
                <svg className="w-5 h-5" style={{ color: '#16a34a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">הושלמו</span>
              </Link>
              <Link href="/admin/tasks?action=new" className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all">
                <svg className="w-5 h-5" style={{ color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-gray-900">הוסף משימה</span>
              </Link>
              <Link href="/admin/tasks?filter=bugs" className="flex items-center gap-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-all">
                <svg className="w-5 h-5" style={{ color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">באגים</span>
              </Link>
              <Link href="/admin/tasks?filter=features" className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-all">
                <svg className="w-5 h-5" style={{ color: '#7c3aed' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">פיצרים חדשים</span>
              </Link>
            </div>
            )}
          </div>
          )}

          {/* 8. אבטחת מערכת - רק למנהלים ראשיים */}
          {isSuperAdmin && (
          <div className="rounded-xl overflow-hidden" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
            <button onClick={() => toggleCategory('security')} className="w-full flex items-center justify-between p-4 text-right transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold" style={{ color: '#1e3a8a' }}>אבטחת מערכת</span>
                  {securityData && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${securityData.overallScore >= 85 ? 'bg-green-100 text-green-700' : securityData.overallScore >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {securityData.overallScore}%
                    </span>
                  )}
                </div>
              </div>
              <svg className={`w-5 h-5 transition-transform ${openCategory === 'security' ? 'rotate-180' : ''}`} style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openCategory === 'security' && (
            <div className="p-4 pt-0">
              {securityLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '3px solid rgba(8, 145, 178, 0.2)', borderTopColor: '#0891b2' }}></div>
                  <span className="mr-3 text-gray-600">סורק אבטחה...</span>
                </div>
              ) : securityData ? (
                <div className="space-y-4">
                  {/* Overall Score */}
                  <div className={`p-4 rounded-lg ${securityData.overallScore >= 85 ? 'bg-green-50 border border-green-200' : securityData.overallScore >= 70 ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">ציון אבטחה כללי</span>
                      <span className={`text-2xl font-bold ${securityData.overallScore >= 85 ? 'text-green-600' : securityData.overallScore >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                        {securityData.overallScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${securityData.overallScore >= 85 ? 'bg-green-500' : securityData.overallScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${securityData.overallScore}%` }}></div>
                    </div>
                  </div>

                  {/* Category Scores */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {securityData.categories && Object.entries(securityData.categories).map(([key, cat]) => (
                      <div key={key} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">{cat.name}</span>
                          <span className={`text-sm font-bold ${cat.score >= 80 ? 'text-green-600' : cat.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{cat.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${cat.score >= 80 ? 'bg-green-500' : cat.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${cat.score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Recommendations */}
                  {securityData.recommendations && securityData.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm">המלצות לשיפור:</h4>
                      {securityData.recommendations.slice(0, 3).map((rec, i) => (
                        <div key={i} className={`p-3 rounded-lg ${rec.priority === 'critical' ? 'bg-red-50 border border-red-200' : rec.priority === 'high' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'}`}>
                          <div className="flex items-start gap-2">
                            <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${rec.priority === 'critical' ? 'bg-red-500' : rec.priority === 'high' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                              <p className="text-xs text-gray-600">{rec.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button onClick={checkSecurity} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      סרוק שוב
                    </button>
                    <Link href="/admin/security" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      דוח מלא
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500">לחץ לסריקת אבטחה</div>
              )}
            </div>
            )}
          </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          {/* New Users Section */}
          <section className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2
                className="text-base sm:text-lg font-bold flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <UserPlusIcon
                  className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7"
                  style={{ color: '#0891b2' }}
                />
                <span>משתמשים חדשים</span>
              </h2>
            </div>
            <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
              {dashboardData?.newUsers?.length > 0 ? (
                dashboardData.newUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-start justify-between p-3 sm:p-4 rounded-lg transition-all"
                    style={{
                      border: '2px solid #e5e7eb',
                      background: 'white',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#0891b2';
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {user.fullName || user.email || user.phone}
                        </p>
                        {(() => {
                          const {
                            label,
                            className: roleClass,
                            Icon: RoleIcon,
                          } = getRoleBadge(user.role);
                          return (
                            <span className={`text-xs px-2 py-1 rounded-full ${roleClass}`}>
                              <span className="flex items-center gap-1">
                                <RoleIcon className="w-4 h-4" />
                                {label}
                              </span>
                            </span>
                          );
                        })()}
                      </div>
                      {user.referrerName && (
                        <p className="text-xs text-green-600 mb-1 flex items-center gap-1">
                          <LinkMarkIcon className="w-4 h-4" />
                          <span>
                            {'הופנה ע&quot;י:'} {user.referrerName}
                          </span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('he-IL')} בשעה{' '}
                        {new Date(user.createdAt).toLocaleTimeString('he-IL', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">אין משתמשים חדשים</div>
              )}
            </div>
          </section>

          {/* Recent Orders Section */}
          <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2
                className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <ClipboardIcon
                  className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7"
                  style={{ color: '#0891b2' }}
                />
                <span>הזמנות אחרונות</span>
              </h2>
            </div>

            {dashboardData?.recentOrders?.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '2px solid #0891b2' }}>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: '#1e3a8a' }}
                        >
                          מוצר
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: '#1e3a8a' }}
                        >
                          לקוח
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: '#1e3a8a' }}
                        >
                          סכום
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: '#1e3a8a' }}
                        >
                          עמלה
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: '#1e3a8a' }}
                        >
                          סטטוס
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: '#1e3a8a' }}
                        >
                          תאריך
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b border-gray-100 transition-all"
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)')
                          }
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                        >
                          <td className="py-3 px-3 text-sm">{order.productName}</td>
                          <td className="py-3 px-3 text-sm">{order.customerName}</td>
                          <td
                            className="py-3 px-3 text-sm font-semibold"
                            style={{ color: '#1e3a8a' }}
                          >
                            ₪{(order.totalAmount || 0).toLocaleString()}
                          </td>
                          <td
                            className="py-3 px-3 text-sm font-semibold"
                            style={{ color: '#16a34a' }}
                          >
                            ₪{(order.commissionAmount || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : order.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('he-IL')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {dashboardData.recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 rounded-lg transition-all"
                      style={{
                        border: '2px solid #e5e7eb',
                        background: 'white',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0891b2';
                        e.currentTarget.style.background =
                          'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.background = 'white';
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            {order.productName}
                          </p>
                          <p className="text-xs text-gray-500">{order.customerName}</p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">סכום:</span>
                          <span className="font-semibold mr-1" style={{ color: '#1e3a8a' }}>
                            ₪{(order.totalAmount || 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">עמלה:</span>
                          <span className="font-semibold mr-1" style={{ color: '#16a34a' }}>
                            ₪{(order.commissionAmount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">אין הזמנות עדיין</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
