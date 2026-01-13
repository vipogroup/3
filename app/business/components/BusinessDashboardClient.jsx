'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { isMenuAllowed } from '@/lib/businessMenuConfig';

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
        d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3"
      />
      <circle cx="4" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="16" r="2" stroke="currentColor" strokeWidth="1.5" />
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
      return { label: 'סוכן', className: 'bg-cyan-100 text-cyan-700', Icon: AgentIcon };
    case 'admin':
    case 'business_admin':
      return { label: 'מנהל', className: 'bg-red-100 text-red-700', Icon: UserCircleIcon };
    default:
      return { label: 'לקוח', className: 'bg-blue-100 text-blue-700', Icon: UserCircleIcon };
  }
}

export default function BusinessDashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTenantId = searchParams.get('tenantId');
  
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatingTenant, setImpersonatingTenant] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);

  const loadData = useCallback(async () => {
    try {
      // Get current user
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        router.push('/login');
        return;
      }
      const userData = await userRes.json();

      // Only allow business_admin or admin
      if (userData.user.role !== 'business_admin' && userData.user.role !== 'admin' && userData.user.role !== 'super_admin') {
        router.push('/');
        return;
      }

      // Determine tenantId: from URL (admin viewing), or from user's token (business_admin)
      let effectiveTenantId = urlTenantId || userData.user.tenantId;
      
      // Admin viewing via URL parameter
      if (userData.user.role === 'admin' && urlTenantId) {
        setIsImpersonating(true);
        setImpersonatingTenant(urlTenantId);
        effectiveTenantId = urlTenantId;
      }
      
      // No tenantId available
      if (!effectiveTenantId) {
        if (userData.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/login');
        }
        return;
      }

      setUser(userData.user);

      // Get tenant info using effectiveTenantId
      const tenantRes = await fetch(`/api/tenants/${effectiveTenantId}`);
      if (tenantRes.ok) {
        const tenantData = await tenantRes.json();
        setTenant(tenantData.tenant);
      }

      // Get dashboard data
      const dashRes = await fetch(`/api/business/stats?tenantId=${effectiveTenantId}`);
      if (dashRes.ok) {
        const data = await dashRes.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Failed to load business dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [router, urlTenantId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Helper function to check if a menu is allowed
  const canShowMenu = useCallback((menuId) => {
    // Super admin impersonating always sees everything
    if (isImpersonating) return true;
    // Check tenant's allowedMenus
    return isMenuAllowed(menuId, tenant?.allowedMenus);
  }, [tenant?.allowedMenus, isImpersonating]);

  // Check if any menu in a category is allowed
  const hasVisibleItemsInCategory = useCallback((menuIds) => {
    return menuIds.some(menuId => canShowMenu(menuId));
  }, [canShowMenu]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div
          className="bg-white rounded-xl p-8"
          style={{
            border: '2px solid transparent',
            backgroundImage:
              'linear-gradient(white, white), linear-gradient(135deg, var(--primary), var(--secondary))',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 4px 20px rgba(8, 145, 178, 0.15)',
          }}
        >
          <div
            className="animate-spin rounded-full h-16 w-16 mx-auto mb-4"
            style={{
              border: '4px solid rgba(8, 145, 178, 0.2)',
              borderTopColor: 'var(--secondary)',
            }}
          ></div>
          <p className="text-gray-600 text-center font-medium">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData || {};

  // Exit impersonation and close tab (since it was opened in a new tab)
  const handleExitImpersonation = async () => {
    try {
      const res = await fetch('/api/admin/impersonate', {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (res.ok) {
        // Close the current tab - the admin dashboard stays open in the original tab
        window.close();
        // Fallback if window.close() doesn't work (some browsers block it)
        setTimeout(() => {
          window.location.href = '/admin/tenants';
        }, 100);
      } else {
        const data = await res.json();
        alert(data.error || 'שגיאה ביציאה');
      }
    } catch (err) {
      alert('שגיאה ביציאה מהתחזות');
    }
  };

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <main className="min-h-screen bg-cyan-50 p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            <span
              className="flex items-center gap-2 sm:gap-3"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <DashboardIcon
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                style={{ color: 'var(--secondary)' }}
              />
              דשבורד העסק שלי
            </span>
          </h1>
          {tenant && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90 border-2"
                style={{ 
                  borderColor: 'var(--secondary)',
                  color: 'var(--secondary)',
                  background: 'white'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                שתף את החנות
              </button>
              <Link
                href={`/t/${tenant.slug}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                צפה בחנות
              </Link>
            </div>
          )}
        </div>

        {/* Tenant Info */}
        {tenant && (
          <div className="mb-6 p-4 rounded-xl" style={{ 
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)',
            border: '2px solid rgba(8, 145, 178, 0.2)'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{tenant.name}</h2>
                <p className="text-sm text-gray-600">/{tenant.slug}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                tenant.status === 'active' ? 'bg-green-100 text-green-700' : 
                tenant.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-gray-100 text-gray-700'
              }`}>
                {tenant.status === 'active' ? 'פעיל' : tenant.status === 'pending' ? 'ממתין לאישור' : tenant.status}
              </span>
            </div>
          </div>
        )}

        {/* Accordion Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* 1. ניהול משתמשים */}
          {hasVisibleItemsInCategory(['users', 'agents']) && (
          <div className="rounded-xl overflow-hidden" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, var(--primary), var(--secondary))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
            <button onClick={() => toggleCategory('users')} className="w-full flex items-center justify-between p-4 text-right transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
                  <UsersIcon className="w-5 h-5" />
                </span>
                <span className="text-base font-bold" style={{ color: 'var(--primary)' }}>ניהול משתמשים</span>
              </div>
              <svg className={`w-5 h-5 transition-transform ${openCategory === 'users' ? 'rotate-180' : ''}`} style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openCategory === 'users' && (
            <div className="p-4 pt-0 grid grid-cols-2 gap-3">
              {canShowMenu('users') && (
              <Link href="/business/users" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <UsersIcon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                <span className="text-sm font-medium text-gray-900">ניהול משתמשים</span>
              </Link>
              )}
              {canShowMenu('agents') && (
              <Link href="/business/agents" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <AgentIcon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                <span className="text-sm font-medium text-gray-900">ניהול סוכנים</span>
              </Link>
              )}
            </div>
            )}
          </div>
          )}

          {/* 2. קטלוג ומכירות */}
          {hasVisibleItemsInCategory(['products', 'orders', 'products_new']) && (
          <div className="rounded-xl overflow-hidden" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, var(--primary), var(--secondary))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
            <button onClick={() => toggleCategory('catalog')} className="w-full flex items-center justify-between p-4 text-right transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
                  <CubeIcon className="w-5 h-5" />
                </span>
                <span className="text-base font-bold" style={{ color: 'var(--primary)' }}>קטלוג ומכירות</span>
              </div>
              <svg className={`w-5 h-5 transition-transform ${openCategory === 'catalog' ? 'rotate-180' : ''}`} style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openCategory === 'catalog' && (
            <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {canShowMenu('products') && (
              <Link href="/business/products" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <CubeIcon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                <span className="text-sm font-medium text-gray-900">ניהול מוצרים</span>
              </Link>
              )}
              {canShowMenu('orders') && (
              <Link href="/business/orders" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <CartIcon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                <span className="text-sm font-medium text-gray-900">ניהול הזמנות</span>
              </Link>
              )}
              {canShowMenu('products_new') && (
              <Link href="/business/products/new" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <PlusCircleIcon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                <span className="text-sm font-medium text-gray-900">הוסף מוצר</span>
              </Link>
              )}
            </div>
            )}
          </div>
          )}

          {/* 3. כספים ודוחות */}
          {hasVisibleItemsInCategory(['reports', 'commissions', 'withdrawals', 'transactions', 'analytics']) && (
          <div className="rounded-xl overflow-hidden" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, var(--primary), var(--secondary))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
            <button onClick={() => toggleCategory('finance')} className="w-full flex items-center justify-between p-4 text-right transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
                  <CoinStackIcon className="w-5 h-5" />
                </span>
                <span className="text-base font-bold" style={{ color: 'var(--primary)' }}>כספים ודוחות</span>
              </div>
              <svg className={`w-5 h-5 transition-transform ${openCategory === 'finance' ? 'rotate-180' : ''}`} style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openCategory === 'finance' && (
            <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {canShowMenu('reports') && (
              <Link href="/business/reports" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <ChartBarIcon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                <span className="text-sm font-medium text-gray-900">דוחות</span>
              </Link>
              )}
              {canShowMenu('commissions') && (
              <Link href="/business/commissions" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <CoinStackIcon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                <span className="text-sm font-medium text-gray-900">עמלות</span>
              </Link>
              )}
              {canShowMenu('withdrawals') && (
              <Link href="/business/withdrawals" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <CoinStackIcon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                <span className="text-sm font-medium text-gray-900">בקשות משיכה</span>
              </Link>
              )}
              {canShowMenu('transactions') && (
              <Link href="/business/transactions" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="text-sm font-medium text-gray-900">עסקאות</span>
              </Link>
              )}
              {canShowMenu('analytics') && (
              <Link href="/business/analytics" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">אנליטיקס</span>
              </Link>
              )}
            </div>
            )}
          </div>
          )}

          {/* 4. הגדרות ושיווק */}
          {hasVisibleItemsInCategory(['settings', 'marketing', 'notifications', 'integrations', 'crm', 'bot_manager', 'site_texts', 'branding']) && (
          <div className="rounded-xl overflow-hidden" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, var(--primary), var(--secondary))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 2px 10px rgba(8, 145, 178, 0.1)' }}>
            <button onClick={() => toggleCategory('settings')} className="w-full flex items-center justify-between p-4 text-right transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
                  <SettingsIcon className="w-5 h-5" />
                </span>
                <span className="text-base font-bold" style={{ color: 'var(--primary)' }}>הגדרות ושיווק</span>
              </div>
              <svg className={`w-5 h-5 transition-transform ${openCategory === 'settings' ? 'rotate-180' : ''}`} style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openCategory === 'settings' && (
            <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {canShowMenu('settings') && (
              <Link href="/business/settings" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <SettingsIcon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                <span className="text-sm font-medium text-gray-900">הגדרות חנות</span>
              </Link>
              )}
              {canShowMenu('marketing') && (
              <Link href="/business/marketing" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <SparkIcon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                <span className="text-sm font-medium text-gray-900">שיווק</span>
              </Link>
              )}
              {canShowMenu('notifications') && (
              <Link href="/business/notifications" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-sm font-medium text-gray-900">התראות</span>
              </Link>
              )}
              {canShowMenu('integrations') && (
              <Link href="/business/integrations" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm font-medium text-gray-900">אינטגרציות</span>
              </Link>
              )}
              {canShowMenu('crm') && (
              <Link href="/business/crm" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">CRM</span>
              </Link>
              )}
              {canShowMenu('bot_manager') && (
              <Link href="/business/bot-manager" className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-all border border-cyan-200">
                <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="text-sm font-medium text-cyan-900">ניהול בוט צאט</span>
              </Link>
              )}
              {canShowMenu('site_texts') && (
              <Link href="/business/site-texts" className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-all border border-cyan-200">
                <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-medium text-purple-900">ניהול טקסטים</span>
              </Link>
              )}
              {canShowMenu('branding') && (
              <Link href="/business/branding" className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-all border border-cyan-200">
                <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span className="text-sm font-medium text-cyan-900">מיתוג וצבעים</span>
              </Link>
              )}
            </div>
            )}
          </div>
          )}
        </div>

        {/* Main Content Grid - Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          {/* New Users Section */}
          {canShowMenu('new_users_widget') && (
          <section className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2
                className="text-base sm:text-lg font-bold flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <UserPlusIcon
                  className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7"
                  style={{ color: 'var(--secondary)' }}
                />
                <span>משתמשים חדשים</span>
              </h2>
            </div>
            <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
              {stats?.newUsers?.length > 0 ? (
                stats.newUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-start justify-between p-3 sm:p-4 rounded-lg transition-all"
                    style={{
                      border: '2px solid #e5e7eb',
                      background: 'white',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--secondary)';
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
                          <span>הופנה על ידי: {user.referrerName}</span>
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
          )}

          {/* Recent Orders Section */}
          {canShowMenu('recent_orders_widget') && (
          <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2
                className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <ClipboardIcon
                  className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7"
                  style={{ color: 'var(--secondary)' }}
                />
                <span>הזמנות אחרונות</span>
              </h2>
            </div>

            {stats?.recentOrders?.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--secondary)' }}>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: 'var(--primary)' }}
                        >
                          מוצר
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: 'var(--primary)' }}
                        >
                          לקוח
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: 'var(--primary)' }}
                        >
                          סכום
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: 'var(--primary)' }}
                        >
                          עמלה
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: 'var(--primary)' }}
                        >
                          סטטוס
                        </th>
                        <th
                          className="text-right py-3 px-3 text-sm font-semibold"
                          style={{ color: 'var(--primary)' }}
                        >
                          תאריך
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order) => (
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
                            style={{ color: 'var(--primary)' }}
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
                  {stats.recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 rounded-lg transition-all"
                      style={{
                        border: '2px solid #e5e7eb',
                        background: 'white',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--secondary)';
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
                          <span className="font-semibold mr-1" style={{ color: 'var(--primary)' }}>
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
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && tenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowShareModal(false)}>
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>שתף את החנות שלך</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Store Link */}
              <div className="p-4 rounded-xl bg-gray-50 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="font-bold text-gray-900">קישור לחנות</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">שתף קישור זה כדי שאנשים יוכלו לראות את המוצרים שלך</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/t/${tenant.slug}`}
                    className="flex-1 px-3 py-2 bg-white border rounded-lg text-sm text-gray-700"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/t/${tenant.slug}`);
                      setCopiedLink('store');
                      setTimeout(() => setCopiedLink(null), 2000);
                    }}
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all"
                    style={{ background: copiedLink === 'store' ? '#16a34a' : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}
                  >
                    {copiedLink === 'store' ? 'הועתק!' : 'העתק'}
                  </button>
                </div>
              </div>

              {/* Customer Registration Link */}
              <div className="p-4 rounded-xl bg-gray-50 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="font-bold text-gray-900">קישור להרשמת לקוחות</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">שתף קישור זה כדי שלקוחות חדשים יירשמו ישירות לחנות שלך</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?tenant=${tenant.slug}`}
                    className="flex-1 px-3 py-2 bg-white border rounded-lg text-sm text-gray-700"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/register?tenant=${tenant.slug}`);
                      setCopiedLink('register');
                      setTimeout(() => setCopiedLink(null), 2000);
                    }}
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all"
                    style={{ background: copiedLink === 'register' ? '#16a34a' : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}
                  >
                    {copiedLink === 'register' ? 'הועתק!' : 'העתק'}
                  </button>
                </div>
              </div>

              {/* Agent Registration Link */}
              <div className="p-4 rounded-xl bg-gray-50 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-bold text-gray-900">קישור להרשמת סוכנים</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">שתף קישור זה כדי שסוכנים חדשים יצטרפו לחנות שלך</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register-agent?tenant=${tenant.slug}`}
                    className="flex-1 px-3 py-2 bg-white border rounded-lg text-sm text-gray-700"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/register-agent?tenant=${tenant.slug}`);
                      setCopiedLink('agent');
                      setTimeout(() => setCopiedLink(null), 2000);
                    }}
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all"
                    style={{ background: copiedLink === 'agent' ? '#16a34a' : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}
                  >
                    {copiedLink === 'agent' ? 'הועתק!' : 'העתק'}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              לקוחות שנרשמים דרך הקישור שלך יהיו שייכים לחנות שלך
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
