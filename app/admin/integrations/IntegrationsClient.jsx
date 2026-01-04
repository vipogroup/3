'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function IntegrationsClient() {
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState({});
  const [integrations, setIntegrations] = useState({
    payplus: { connected: false, status: 'checking', lastCheck: null },
    priority: { connected: false, status: 'checking', lastCheck: null },
  });

  useEffect(() => {
    checkAllConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAllConnections() {
    setLoading(true);
    await Promise.all([
      checkPayPlusConnection(),
      checkPriorityConnection(),
    ]);
    setLoading(false);
  }

  async function checkPayPlusConnection() {
    try {
      const res = await fetch('/api/admin/payplus/transactions?limit=1');
      const data = await res.json();
      
      setIntegrations(prev => ({
        ...prev,
        payplus: {
          connected: res.ok,
          status: res.ok ? 'connected' : 'error',
          lastCheck: new Date().toISOString(),
          stats: data.stats,
          error: data.error,
        },
      }));
    } catch (err) {
      setIntegrations(prev => ({
        ...prev,
        payplus: {
          connected: false,
          status: 'error',
          lastCheck: new Date().toISOString(),
          error: err.message,
        },
      }));
    }
  }

  async function checkPriorityConnection() {
    try {
      const res = await fetch('/api/admin/priority/status');
      const data = await res.json();
      
      setIntegrations(prev => ({
        ...prev,
        priority: {
          connected: data.connected,
          status: data.connected ? 'connected' : (data.configured ? 'error' : 'not_configured'),
          lastCheck: new Date().toISOString(),
          environment: data.environment,
          companyCode: data.companyCode,
          stats: data.stats,
          error: data.connectionMessage,
        },
      }));
    } catch (err) {
      setIntegrations(prev => ({
        ...prev,
        priority: {
          connected: false,
          status: 'error',
          lastCheck: new Date().toISOString(),
          error: err.message,
        },
      }));
    }
  }

  async function testConnection(type) {
    setTesting(prev => ({ ...prev, [type]: true }));
    
    if (type === 'payplus') {
      await checkPayPlusConnection();
    } else if (type === 'priority') {
      await checkPriorityConnection();
    }
    
    setTesting(prev => ({ ...prev, [type]: false }));
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'connected':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">מחובר</span>;
      case 'error':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">שגיאה</span>;
      case 'not_configured':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">לא מוגדר</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">בודק...</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return (
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'not_configured':
        return (
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>אינטגרציות</span>
          </h1>
          <p className="text-gray-500 mt-1">ניהול חיבורים למערכות חיצוניות</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={checkAllConnections}
            disabled={loading}
            className="px-4 py-2 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>רענן הכל</span>
          </button>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 flex items-center gap-2 hover:bg-gray-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            חזרה
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        {/* PayPlus Card */}
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(integrations.payplus.status)}
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span>PayPlus</span>
                    <span className="text-sm font-normal text-gray-500">סליקת אשראי</span>
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    עיבוד תשלומים, החזרים וניהול עסקאות
                  </p>
                </div>
              </div>
              {getStatusBadge(integrations.payplus.status)}
            </div>

            {integrations.payplus.stats && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {integrations.payplus.stats.success?.count || 0}
                  </div>
                  <div className="text-sm text-green-600">עסקאות מוצלחות</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-700">
                    {integrations.payplus.stats.failed?.count || 0}
                  </div>
                  <div className="text-sm text-red-600">עסקאות נכשלות</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-700">
                    {integrations.payplus.stats.refund?.count || 0}
                  </div>
                  <div className="text-sm text-yellow-600">החזרים</div>
                </div>
              </div>
            )}

            {integrations.payplus.error && integrations.payplus.status === 'error' && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg text-red-700 text-sm">
                {integrations.payplus.error}
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-500">
              {integrations.payplus.lastCheck && (
                <span>בדיקה אחרונה: {new Date(integrations.payplus.lastCheck).toLocaleString('he-IL')}</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => testConnection('payplus')}
                disabled={testing.payplus}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 flex items-center gap-2"
              >
                {testing.payplus ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span>בדוק חיבור</span>
              </button>
              <a
                href="/admin/finance?tab=transactions"
                className="px-4 py-2 text-white rounded-lg"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                צפה בעסקאות
              </a>
            </div>
          </div>
        </div>

        {/* Priority Card */}
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(integrations.priority.status)}
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span>Priority ERP</span>
                    <span className="text-sm font-normal text-gray-500">מערכת הנהלת חשבונות</span>
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    סנכרון לקוחות, חשבוניות, קבלות וזיכויים
                  </p>
                </div>
              </div>
              {getStatusBadge(integrations.priority.status)}
            </div>

            {integrations.priority.status === 'connected' && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm text-blue-600 mb-1">סביבה</div>
                  <div className="font-semibold">{integrations.priority.environment || 'לא ידוע'}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm text-blue-600 mb-1">קוד חברה</div>
                  <div className="font-semibold font-mono">{integrations.priority.companyCode || 'לא ידוע'}</div>
                </div>
              </div>
            )}

            {integrations.priority.stats && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-green-700">{integrations.priority.stats.synced || 0}</div>
                  <div className="text-xs text-green-600">מסונכרנים</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-yellow-700">{integrations.priority.stats.pending || 0}</div>
                  <div className="text-xs text-yellow-600">ממתינים</div>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-red-700">{integrations.priority.stats.failed || 0}</div>
                  <div className="text-xs text-red-600">נכשלו</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-purple-700">{integrations.priority.stats.partial || 0}</div>
                  <div className="text-xs text-purple-600">חלקי</div>
                </div>
              </div>
            )}

            {integrations.priority.status === 'not_configured' && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">נדרשת הגדרה</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  כדי להפעיל את האינטגרציה עם Priority, יש להגדיר את משתני הסביבה הבאים:
                </p>
                <div className="bg-yellow-100 rounded p-2 font-mono text-xs text-yellow-800 space-y-1">
                  <div>PRIORITY_BASE_URL</div>
                  <div>PRIORITY_CLIENT_ID</div>
                  <div>PRIORITY_CLIENT_SECRET</div>
                  <div>PRIORITY_COMPANY_CODE</div>
                </div>
              </div>
            )}

            {integrations.priority.error && integrations.priority.status === 'error' && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg text-red-700 text-sm">
                {integrations.priority.error}
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-500">
              {integrations.priority.lastCheck && (
                <span>בדיקה אחרונה: {new Date(integrations.priority.lastCheck).toLocaleString('he-IL')}</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => testConnection('priority')}
                disabled={testing.priority}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 flex items-center gap-2"
              >
                {testing.priority ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span>בדוק חיבור</span>
              </button>
              <a
                href="/admin/finance?tab=priority"
                className="px-4 py-2 text-white rounded-lg"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                צפה במסמכים
              </a>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>מידע על האינטגרציות</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-700 mb-1">PayPlus</h4>
              <ul className="text-blue-600 space-y-1">
                <li>- קבלת Webhooks על תשלומים</li>
                <li>- עיבוד החזרים ו-Chargebacks</li>
                <li>- דוחות התאמות אוטומטיים</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 mb-1">Priority</h4>
              <ul className="text-blue-600 space-y-1">
                <li>- סנכרון לקוחות אוטומטי</li>
                <li>- יצירת חשבוניות וקבלות</li>
                <li>- טיפול בזיכויים</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
