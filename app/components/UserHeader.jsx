'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCartContext } from '@/app/context/CartContext';
import PushNotificationsToggle from '@/app/components/PushNotificationsToggle';
import { hasActiveSubscription, subscribeToPush, unsubscribeFromPush, ensureNotificationPermission } from '@/app/lib/pushClient';
import { getFilteredNavItems } from '@/lib/adminNavigation';
import { hasPermission } from '@/lib/superAdmins';
import { ADMIN_PERMISSIONS } from '@/lib/superAdmins';

export default function UserHeader() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const pathname = usePathname();
  const { totals, isEmpty } = useCartContext();
  const [adminNavItems, setAdminNavItems] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' });
        if (!ignore && res.ok) {
          const data = await res.json();
          const userData = data?.user || null;
          setUser(userData);
          
          // Filter admin nav items based on permissions
          if (userData && userData.role === 'admin') {
            const hasPermissionFn = (permission) => hasPermission(userData, permission);
            const filteredItems = getFilteredNavItems(userData, hasPermissionFn);
            setAdminNavItems(filteredItems);
          }
        }
      } catch (_) {
        // ignore
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // Fetch unread messages count
  useEffect(() => {
    if (!user) return;
    let ignore = false;
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/messages/unread-count', { cache: 'no-store', credentials: 'include' });
        if (!ignore && res.ok) {
          const data = await res.json();
          setUnreadCount(data?.count || 0);
        }
      } catch (_) {
        // ignore
      }
    };
    fetchUnread();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, [user]);

  // Check push notification status
  useEffect(() => {
    if (!user) return;
    let ignore = false;
    const checkPush = async () => {
      try {
        const isSubscribed = await hasActiveSubscription();
        if (!ignore) setPushEnabled(isSubscribed);
      } catch (_) {}
    };
    checkPush();
    return () => { ignore = true; };
  }, [user]);

  // Toggle push notifications
  const handleTogglePush = useCallback(async () => {
    if (pushLoading) return;
    setPushLoading(true);
    try {
      if (pushEnabled) {
        // Disable notifications
        await unsubscribeFromPush();
        setPushEnabled(false);
      } else {
        // Enable notifications
        const permission = await ensureNotificationPermission();
        if (!permission.granted) {
          if (permission.reason === 'ios_install_required') {
            alert('ב-iPhone יש להוסיף את האתר למסך הבית תחילה');
          } else if (permission.reason === 'denied') {
            alert('ההרשאה נדחתה. ניתן לשנות בהגדרות הדפדפן');
          } else {
            alert('לא ניתן להפעיל התראות במכשיר זה');
          }
          return;
        }
        const userRole = user?.role || 'customer';
        await subscribeToPush({
          tags: [userRole],
          consentAt: new Date().toISOString(),
          consentVersion: '1.0',
          consentMeta: { source: 'header_menu', role: userRole },
        });
        setPushEnabled(true);
        // Clear the declined flag so modal won't show
        try { localStorage.removeItem('vipo_push_modal_declined'); } catch (_) {}
      }
    } catch (err) {
      console.error('Push toggle failed:', err);
      alert('שגיאה בשינוי הגדרות התראות');
    } finally {
      setPushLoading(false);
    }
  }, [pushEnabled, pushLoading, user]);

  const role = user?.role;
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user state and redirect
      setUser(null);
      router.push('/login');
      router.refresh();
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    }

    if (showAccountMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showAccountMenu]);

  // Auto-close account menu after 10 seconds
  useEffect(() => {
    if (!showAccountMenu) return;

    const timer = setTimeout(() => {
      setShowAccountMenu(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [showAccountMenu]);

  const navItems = useMemo(() => {
    return [{ href: '/products', label: 'מוצרים', icon: 'products' }];
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white shadow-md"
      style={{
        borderBottom: '2px solid transparent',
        backgroundImage:
          'linear-gradient(white, white), linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 transition-all duration-300"
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span
              className="font-bold text-3xl"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              VIPO
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 justify-end w-full">
          {/* Install App Button */}
          <button
            onClick={() => {
              if (window.deferredPrompt) {
                window.deferredPrompt.prompt();
              } else {
                // אם זה iOS, הצג הנחיות להתקנה
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                if (isIOS) {
                  alert('להתקנת האפליקציה: לחץ על כפתור ״שתף״ ובחר ״הוסף למסך הבית״');
                }
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)',
              color: '#1e3a8a',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(8, 145, 178, 0.15)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="hidden sm:inline">התקן אפליקציה</span>
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-2 sm:gap-3">
            {navItems.map(({ href, label }) => {
              const isActive = pathname === href;

              const getIcon = () => {
                if (href === '/products' || label === 'מוצרים') {
                  return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  );
                }
                if (href === '/agent' || label === 'דשבורד') {
                  return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  );
                }
                if (href === '/admin' || label === 'ניהול') {
                  return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  );
                }
                return null;
              };

              return (
                <Link
                  key={href}
                  href={href}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300"
                  style={{
                    color: isActive ? '#1e3a8a' : '#4b5563',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)'
                      : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#0891b2';
                      e.currentTarget.style.background = 'rgba(8, 145, 178, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#4b5563';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                  title={label}
                >
                  {getIcon()}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/cart"
            className="relative p-2 rounded-full transition-all duration-300"
            style={{ color: pathname === '/cart' ? '#1e3a8a' : '#4b5563' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0891b2';
              e.currentTarget.style.background = 'rgba(8, 145, 178, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = pathname === '/cart' ? '#1e3a8a' : '#4b5563';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {!isEmpty && (
              <span
                className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1"
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}
              >
                {Math.min(99, totals.totalQuantity)}
              </span>
            )}
          </Link>

          {user && (
            <Link
              href="/messages"
              className="relative p-2 rounded-full transition-all duration-300"
              style={{ color: pathname === '/messages' ? '#1e3a8a' : '#4b5563' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#0891b2';
                e.currentTarget.style.background = 'rgba(8, 145, 178, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = pathname === '/messages' ? '#1e3a8a' : '#4b5563';
                e.currentTarget.style.background = 'transparent';
              }}
              title="הודעות"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1"
                  style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' }}
                >
                  {Math.min(99, unreadCount)}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                style={{ color: pushEnabled ? '#16a34a' : '#ef4444' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                  e.currentTarget.style.background = pushEnabled ? 'rgba(22, 163, 74, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden sm:inline">החשבון שלי</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showAccountMenu && (
                <div
                  className="absolute left-0 mt-2 w-56 bg-white rounded-xl py-2 z-50"
                  style={{
                    border: '2px solid transparent',
                    backgroundImage:
                      'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    boxShadow: '0 8px 25px rgba(8, 145, 178, 0.25)',
                  }}
                >
                  {/* User Info */}
                  <div className="px-4 py-2 border-b border-gray-200 space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">מחובר כ:</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.fullName || user?.name || 'משתמש'}
                      </p>
                    </div>
                  </div>

                  {/* Push Notifications Toggle Button */}
                  <div className="border-b border-gray-200">
                    <button
                      onClick={handleTogglePush}
                      disabled={pushLoading}
                      className="flex items-center gap-2 w-full text-right px-4 py-3 text-sm font-medium transition-colors"
                      style={{
                        color: pushEnabled ? '#16a34a' : '#ef4444',
                        background: pushEnabled ? 'rgba(22, 163, 74, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      <span className="flex-1">
                        {pushLoading ? 'מעדכן...' : pushEnabled ? 'התראות מופעלות' : 'אפשר התראות דחיפה'}
                      </span>
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: pushEnabled ? '#16a34a' : '#ef4444' }}
                      />
                    </button>
                    {/* Test Push Button - only show when enabled */}
                    {pushEnabled && (
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch('/api/push/send-test', {
                              method: 'POST',
                              credentials: 'include',
                            });
                            const data = await res.json();
                            if (data.ok) {
                              alert('✅ ' + (data.message || 'התראה נשלחה בהצלחה!'));
                            } else {
                              alert('❌ ' + (data.error || 'שגיאה בשליחת התראה'));
                            }
                          } catch (err) {
                            alert('❌ שגיאה: ' + err.message);
                          }
                        }}
                        className="flex items-center gap-2 w-full text-right px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        שלח התראת בדיקה
                      </button>
                    )}
                    {/* Reset Push Button - for fixing iOS issues */}
                    {pushEnabled && (
                      <button
                        onClick={async () => {
                          if (!confirm('פעולה זו תמחק את כל רישומי ההתראות שלך ותירשם מחדש. להמשיך?')) {
                            return;
                          }
                          try {
                            // Step 1: Delete all subscriptions from server
                            const resetRes = await fetch('/api/push/reset', {
                              method: 'POST',
                              credentials: 'include',
                            });
                            const resetData = await resetRes.json();
                            if (!resetRes.ok) {
                              alert('❌ שגיאה במחיקת רישומים: ' + (resetData.error || 'Unknown error'));
                              return;
                            }
                            
                            // Step 2: Unsubscribe locally
                            if ('serviceWorker' in navigator && 'PushManager' in window) {
                              const registration = await navigator.serviceWorker.ready;
                              const subscription = await registration.pushManager.getSubscription();
                              if (subscription) {
                                await subscription.unsubscribe();
                              }
                            }
                            
                            // Step 3: Re-subscribe
                            const { subscribeToPush } = await import('@/app/lib/pushClient');
                            await subscribeToPush({ tags: [], forcePrompt: true });
                            
                            alert('✅ ההתראות אופסו ונרשמו מחדש בהצלחה! נסה לשלוח התראת בדיקה.');
                          } catch (err) {
                            console.error('Reset push error:', err);
                            alert('❌ שגיאה: ' + err.message);
                          }
                        }}
                        className="flex items-center gap-2 w-full text-right px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        אפס והירשם מחדש להתראות
                      </button>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {role === 'agent' && (
                      <>
                        <Link
                          href="/agent"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          הביצועים שלי
                        </Link>
                        <Link
                          href="/my-orders"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                          ההזמנות שלי
                        </Link>
                        <Link
                          href="/agent/marketing"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7l9 6 9-6-9-4-9 4z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7v10l9 4 9-4V7"
                            />
                          </svg>
                          תוכן שיווקי
                        </Link>
                        <Link
                          href="/messages"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 8h10M7 12h6m5 8H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2z"
                            />
                          </svg>
                          מרכז הודעות
                        </Link>
                      </>
                    )}

                    {role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
                        style={{ color: '#1e3a8a' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(30, 58, 138, 0.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        דשבורד מנהל
                      </Link>
                    )}

                    {role === 'customer' && (
                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        ההזמנות שלי
                      </Link>
                    )}

                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      הפרופיל שלי
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 pt-1">
                    <button
                      onClick={() => {
                        if (window.confirm('האם לרענן את האפליקציה כדי לקבל את העדכונים האחרונים?')) {
                          window.location.reload(true);
                        }
                      }}
                      className="flex items-center gap-2 w-full text-right px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      עדכון גרסה
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      התנתקות
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                boxShadow: '0 2px 8px rgba(8, 145, 178, 0.2)',
                color: '#fff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(8, 145, 178, 0.2)';
              }}
            >
              התחבר
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
