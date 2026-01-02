'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MonitorPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({});
  const [statusLoading, setStatusLoading] = useState(false);
  const [serverInfo, setServerInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('status');
  const [errorLogs, setErrorLogs] = useState([]);
  const [errorStats, setErrorStats] = useState({});
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityStats, setActivityStats] = useState({});

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.user.role !== 'admin') {
        router.push('/');
        return;
      }
      setUser(data.user);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const checkSystemStatus = useCallback(async () => {
    setStatusLoading(true);
    const startTime = Date.now();
    try {
      const res = await fetch('/api/admin/system-status');
      const responseTime = Date.now() - startTime;
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data.results || {});
        setServerInfo({
          responseTime,
          timestamp: data.timestamp
        });
      }
    } catch (error) {
      console.error('Failed to check system status:', error);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  const fetchErrorLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/error-logs?limit=20');
      if (res.ok) {
        const data = await res.json();
        setErrorLogs(data.logs || []);
        setErrorStats(data.stats || {});
      }
    } catch (error) {
      console.error('Failed to fetch error logs:', error);
    }
  }, []);

  const fetchActivityLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/activity-logs?limit=20');
      if (res.ok) {
        const data = await res.json();
        setActivityLogs(data.logs || []);
        setActivityStats(data.stats || {});
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    }
  }, []);

  const markErrorResolved = async (id) => {
    try {
      await fetch('/api/admin/error-logs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, resolved: true })
      });
      fetchErrorLogs();
    } catch (error) {
      console.error('Failed to mark error as resolved:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      checkSystemStatus();
      fetchErrorLogs();
      fetchActivityLogs();
    }
  }, [user, checkSystemStatus, fetchErrorLogs, fetchActivityLogs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4" style={{ border: '4px solid rgba(8, 145, 178, 0.2)', borderTopColor: '#0891b2' }}></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const connectedCount = Object.values(systemStatus).filter(s => s?.status === 'connected').length;
  const warningCount = Object.values(systemStatus).filter(s => s?.status === 'warning').length;
  const errorCount = Object.values(systemStatus).filter(s => s?.status === 'error').length;
  const totalCount = Object.keys(systemStatus).length;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              מוניטור מערכת
            </h1>
            <p className="text-gray-500 text-sm mt-1">סטטוס שירותים וחיבורים בזמן אמת</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={checkSystemStatus}
              disabled={statusLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              <svg className={`w-4 h-4 ${statusLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {statusLoading ? 'בודק...' : 'רענן'}
            </button>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              חזרה
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                <p className="text-xs text-gray-500">סה״כ שירותים</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{connectedCount}</p>
                <p className="text-xs text-gray-500">מחוברים</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{warningCount}</p>
                <p className="text-xs text-gray-500">אזהרות</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{errorCount}</p>
                <p className="text-xs text-gray-500">שגיאות</p>
              </div>
            </div>
          </div>
        </div>

        {/* Server Info */}
        {serverInfo && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">מידע שרת</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">זמן תגובה</p>
                <p className="font-semibold text-gray-900">{serverInfo.responseTime}ms</p>
              </div>
              <div>
                <p className="text-gray-500">עדכון אחרון</p>
                <p className="font-semibold text-gray-900">{new Date(serverInfo.timestamp).toLocaleTimeString('he-IL')}</p>
              </div>
              <div>
                <p className="text-gray-500">סביבה</p>
                <p className="font-semibold text-gray-900">{process.env.NODE_ENV || 'development'}</p>
              </div>
              <div>
                <p className="text-gray-500">גרסה</p>
                <p className="font-semibold text-gray-900">1.0.0</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {[
            { id: 'status', label: 'סטטוס שירותים', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'errors', label: `לוג שגיאות ${errorStats.unresolved ? `(${errorStats.unresolved})` : ''}`, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
            { id: 'activity', label: 'לוג פעולות', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' } : {}}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'status' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">סטטוס שירותים</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(systemStatus).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border ${getStatusBg(value?.status)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 capitalize">{key}</span>
                    <span className={`w-3 h-3 rounded-full ${getStatusColor(value?.status)}`}></span>
                  </div>
                  <p className="text-sm text-gray-600">{value?.message || 'לא ידוע'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {activeTab === 'errors' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">לוג שגיאות</h2>
              <p className="text-xs text-gray-500">
                סה״כ: {errorStats.total || 0} | היום: {errorStats.today || 0} | לא טופלו: {errorStats.unresolved || 0}
              </p>
            </div>
            <button onClick={fetchErrorLogs} className="text-sm text-cyan-600 hover:text-cyan-700">רענן</button>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {errorLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">אין שגיאות!</p>
                <p className="text-sm">המערכת פועלת תקין</p>
              </div>
            ) : errorLogs.map((log, i) => (
              <div key={log._id || i} className={`p-4 ${log.resolved ? 'bg-gray-50' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${log.level === 'error' ? 'bg-red-100 text-red-700' : log.level === 'warn' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {log.level}
                      </span>
                      <span className="text-xs text-gray-500">{log.source}</span>
                      {log.resolved && <span className="text-xs text-green-600">טופל</span>}
                    </div>
                    <p className="text-sm text-gray-900 font-medium truncate">{log.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(log.createdAt).toLocaleString('he-IL')}
                      {log.url && ` • ${log.url}`}
                    </p>
                  </div>
                  {!log.resolved && (
                    <button
                      onClick={() => markErrorResolved(log._id)}
                      className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      סמן כטופל
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {activeTab === 'activity' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">לוג פעולות</h2>
              <p className="text-xs text-gray-500">
                סה״כ: {activityStats.total || 0} | היום: {activityStats.today || 0}
              </p>
            </div>
            <button onClick={fetchActivityLogs} className="text-sm text-cyan-600 hover:text-cyan-700">רענן</button>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {activityLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="font-medium">אין פעילות עדיין</p>
              </div>
            ) : activityLogs.map((log, i) => (
              <div key={log._id || i} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    log.action === 'create' ? 'bg-green-100 text-green-600' :
                    log.action === 'update' ? 'bg-blue-100 text-blue-600' :
                    log.action === 'delete' ? 'bg-red-100 text-red-600' :
                    log.action === 'login' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {log.action === 'create' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />}
                      {log.action === 'update' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />}
                      {log.action === 'delete' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />}
                      {log.action === 'login' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />}
                      {!['create', 'update', 'delete', 'login'].includes(log.action) && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">{log.description}</p>
                    <p className="text-xs text-gray-500">
                      {log.userEmail && `${log.userEmail} • `}
                      {new Date(log.createdAt).toLocaleString('he-IL')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* DevTools Instructions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">כלי מפתחים (DevTools)</h2>
            <button
              type="button"
              onClick={() => {
                // Log helpful info to console
                console.log('%c[DevTools] כלי מפתחים נפתחו!', 'font-size: 20px; color: #0891b2; font-weight: bold;');
                console.log('%c[Network] לצפייה בבקשות רשת', 'font-size: 14px; color: #059669;');
                console.log('%c[Application] לצפייה ב-LocalStorage/Cookies', 'font-size: 14px; color: #7c3aed;');
                console.log('%c[Console] לצפייה בשגיאות והודעות', 'font-size: 14px; color: #dc2626;');
                // This triggers the debugger which opens DevTools automatically
                // eslint-disable-next-line no-debugger
                debugger;
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              פתח DevTools
            </button>
          </div>
          <div className="p-4">
            <p className="text-gray-600 mb-4">לחץ על הכפתור למעלה או השתמש בקיצורי המקלדת:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-mono font-bold text-gray-900 mb-2">F12</p>
                <p className="text-sm text-gray-500">או</p>
                <p className="text-lg font-mono font-bold text-gray-900 mt-2">Ctrl + Shift + I</p>
                <p className="text-xs text-gray-500 mt-2">Windows / Linux</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-lg font-mono font-bold text-gray-900 mb-2">Cmd + Option + I</p>
                <p className="text-xs text-gray-500 mt-2">Mac</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">לחץ ימני על הדף</p>
                <p className="text-lg font-bold text-gray-900">בדוק / Inspect</p>
                <p className="text-xs text-gray-500 mt-2">כל הדפדפנים</p>
              </div>
            </div>
            
            {/* Quick Access Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">גישה מהירה לטאבים:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    console.clear();
                    console.log('%c[Console] הקונסול נוקה בהצלחה', 'font-size: 16px; color: #059669;');
                  }}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  נקה Console
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log('%c[Storage] מידע אחסון:', 'font-size: 14px; font-weight: bold; color: #7c3aed;');
                    console.table({
                      'LocalStorage Items': localStorage.length,
                      'SessionStorage Items': sessionStorage.length,
                      'Cookies': document.cookie.split(';').filter(c => c.trim()).length,
                    });
                    console.log('LocalStorage:', { ...localStorage });
                    console.log('SessionStorage:', { ...sessionStorage });
                  }}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  הצג Storage
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log('%c[Network] מידע רשת:', 'font-size: 14px; font-weight: bold; color: #0891b2;');
                    console.log('Online:', navigator.onLine ? 'כן' : 'לא');
                    console.log('Connection:', navigator.connection || 'לא זמין');
                    console.log('User Agent:', navigator.userAgent);
                    console.log('Language:', navigator.language);
                    console.log('Platform:', navigator.platform);
                  }}
                  className="px-3 py-2 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-medium hover:bg-cyan-200 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  מידע רשת
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('%c[Performance] מידע ביצועים:', 'font-size: 14px; font-weight: bold; color: #ea580c;');
                    console.table({
                      'DOM Load': Math.round(perfData?.domContentLoadedEventEnd || 0) + 'ms',
                      'Full Load': Math.round(perfData?.loadEventEnd || 0) + 'ms',
                      'Memory (MB)': Math.round((performance.memory?.usedJSHeapSize || 0) / 1048576),
                      'Time Since Load': Math.round(performance.now()) + 'ms',
                    });
                  }}
                  className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  ביצועים
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
