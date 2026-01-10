'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LiveLogsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [errors, setErrors] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState('');
  const audioRef = useRef(null);
  const logsEndRef = useRef(null);
  const errorsEndRef = useRef(null);
  const alertsEndRef = useRef(null);

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
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
    }
    checkAuth();
  }, [router]);

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    try {
      const url = lastFetch 
        ? `/api/admin/live-logs?since=${lastFetch}`
        : '/api/admin/live-logs';
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        
        // Add new logs
        if (data.logs?.length > 0) {
          setLogs(prev => [...data.logs, ...prev].slice(0, 100));
        }
        if (data.errors?.length > 0) {
          setErrors(prev => [...data.errors, ...prev].slice(0, 100));
          // Play sound for new errors
          if (soundEnabled && audioRef.current && lastFetch) {
            audioRef.current.play().catch(() => {});
          }
        }
        if (data.alerts?.length > 0) {
          setAlerts(prev => [...data.alerts, ...prev].slice(0, 100));
          // Play sound for new alerts
          if (soundEnabled && audioRef.current && lastFetch) {
            audioRef.current.play().catch(() => {});
          }
        }
        
        setLastFetch(data.timestamp);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  }, [lastFetch, soundEnabled]);

  // Auto-refresh
  useEffect(() => {
    if (!isRunning || loading) return;
    
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    
    return () => clearInterval(interval);
  }, [isRunning, loading, fetchLogs]);

  // Scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    errorsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [errors]);

  useEffect(() => {
    alertsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [alerts]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'failed_login': return '🔐';
      case 'brute_force': return '⚠️';
      case 'suspicious_ip': return '🌐';
      case 'unauthorized_access': return '🚫';
      case 'sql_injection': return '💉';
      case 'xss_attempt': return '📝';
      case 'rate_limit': return '⏱️';
      default: return '🔔';
    }
  };

  const filterItems = (items) => {
    if (!filter) return items;
    return items.filter(item => 
      JSON.stringify(item).toLowerCase().includes(filter.toLowerCase())
    );
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyan-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#0891b2', borderTopColor: 'transparent' }}></div>
          <p className="text-gray-600 font-medium">טוען לוגים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyan-50 p-4 sm:p-6">
      {/* Hidden audio element for alerts */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/alert.mp3" type="audio/mpeg" />
      </audio>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin" 
            className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            חזרה לדשבורד
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            לוגים און-ליין
            <span className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search filter */}
          <input
            type="text"
            placeholder="חיפוש..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-2 border-gray-200 focus:border-cyan-500 rounded-xl px-4 py-2 text-sm w-48 outline-none transition-colors"
          />

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl transition-all ${soundEnabled ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-gray-100 text-gray-600 border-2 border-gray-300'}`}
            title={soundEnabled ? 'צליל פעיל' : 'צליל מושתק'}
          >
            {soundEnabled ? '🔔' : '🔕'}
          </button>

          {/* Start/Stop */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2.5 rounded-xl font-medium transition-all ${
              isRunning 
                ? 'bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-200' 
                : 'text-white border-2 border-transparent hover:opacity-90'
            }`}
            style={!isRunning ? { background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' } : {}}
          >
            {isRunning ? '⏸️ עצור' : '▶️ הפעל'}
          </button>

          {/* Clear logs */}
          <button
            onClick={() => {
              setLogs([]);
              setErrors([]);
              setAlerts([]);
            }}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-300 rounded-xl transition-all"
          >
            🗑️ נקה
          </button>
        </div>
      </div>

      {/* 4-Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6" style={{ minHeight: 'calc(100vh - 180px)' }}>
        
        {/* Panel 1: Live Logs */}
        <div className="bg-white rounded-xl overflow-hidden flex flex-col shadow-md" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
            <h2 className="font-bold flex items-center gap-2 text-white">
              📋 לוגים בזמן אמת
              <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{logs.length}</span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 font-mono text-sm bg-gray-50 max-h-80">
            {filterItems(logs).map((log, i) => (
              <div key={log.id || i} className="py-2 border-b border-gray-200 hover:bg-cyan-50 transition-colors">
                <span className="text-gray-500">{formatTime(log.timestamp)}</span>
                <span className="text-cyan-600 font-medium mx-2">[{log.action || 'LOG'}]</span>
                <span className="text-gray-700">{log.details || log.message}</span>
                {log.user && <span className="text-blue-600 mr-2">({log.user})</span>}
                {log.ip && <span className="text-gray-400 text-xs mr-2">IP: {log.ip}</span>}
              </div>
            ))}
            <div ref={logsEndRef} />
            {logs.length === 0 && (
              <div className="text-gray-400 text-center py-8">אין לוגים עדיין...</div>
            )}
          </div>
        </div>

        {/* Panel 2: Errors */}
        <div className="bg-white rounded-xl overflow-hidden flex flex-col shadow-md" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #dc2626, #f97316)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)' }}>
            <h2 className="font-bold flex items-center gap-2 text-white">
              ❌ שגיאות
              <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{errors.length}</span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 font-mono text-sm bg-gray-50 max-h-80">
            {filterItems(errors).map((error, i) => (
              <div key={error.id || i} className="py-2 border-b border-gray-200 hover:bg-red-50 transition-colors">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-500">{formatTime(error.timestamp)}</span>
                  {error.statusCode && (
                    <span className={`px-2 py-0.5 rounded text-xs text-white ${
                      error.statusCode >= 500 ? 'bg-red-500' : 'bg-orange-500'
                    }`}>
                      {error.statusCode}
                    </span>
                  )}
                  <span className="text-orange-600 font-medium">{error.method}</span>
                  <span className="text-gray-600">{error.path}</span>
                </div>
                <div className="text-red-600 mt-1 font-medium">{error.message}</div>
                {error.stack && (
                  <details className="mt-1">
                    <summary className="text-gray-400 cursor-pointer text-xs hover:text-gray-600">Stack trace</summary>
                    <pre className="text-xs text-gray-500 mt-1 whitespace-pre-wrap bg-gray-100 p-2 rounded">{error.stack}</pre>
                  </details>
                )}
              </div>
            ))}
            <div ref={errorsEndRef} />
            {errors.length === 0 && (
              <div className="text-gray-400 text-center py-8">אין שגיאות 🎉</div>
            )}
          </div>
        </div>

        {/* Panel 3: Security Alerts */}
        <div className="bg-white rounded-xl overflow-hidden flex flex-col shadow-md" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #f59e0b, #eab308)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)' }}>
            <h2 className="font-bold flex items-center gap-2 text-white">
              🚨 התראות אבטחה
              <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{alerts.length}</span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 max-h-80">
            {filterItems(alerts).map((alert, i) => (
              <div 
                key={alert.id || i} 
                className={`p-3 mb-2 rounded-xl border-r-4 transition-all hover:shadow-md ${
                  alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                  alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                  alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-gray-50 border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getAlertIcon(alert.alertType)}</span>
                    <div>
                      <div className="font-medium text-gray-800">{alert.message}</div>
                      <div className="text-xs text-gray-500">
                        {formatTime(alert.timestamp)} | IP: {alert.ip || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
            <div ref={alertsEndRef} />
            {alerts.length === 0 && (
              <div className="text-gray-400 text-center py-8">אין התראות אבטחה 🛡️</div>
            )}
          </div>
        </div>

        {/* Panel 4: Windsurf / Quick Actions */}
        <div className="bg-white rounded-xl overflow-hidden flex flex-col shadow-md" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #8b5cf6, #6366f1)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
          <div className="px-4 py-3" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
            <h2 className="font-bold text-white">🛠️ כלים ופעולות מהירות</h2>
          </div>
          <div className="flex-1 p-4 grid grid-cols-2 gap-3 content-start">
            {/* Quick action buttons */}
            <a
              href="https://codeium.com/windsurf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 text-white"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              <span className="text-3xl mb-2">🌊</span>
              <span className="font-medium">Windsurf</span>
            </a>

            <Link
              href="/admin/monitor"
              className="flex flex-col items-center justify-center p-4 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 text-white"
              style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' }}
            >
              <span className="text-3xl mb-2">📊</span>
              <span className="font-medium">מוניטור מערכת</span>
            </Link>

            <Link
              href="/admin/security"
              className="flex flex-col items-center justify-center p-4 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 text-white"
              style={{ background: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)' }}
            >
              <span className="text-3xl mb-2">🔒</span>
              <span className="font-medium">אבטחה</span>
            </Link>

            <Link
              href="/admin/backups"
              className="flex flex-col items-center justify-center p-4 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 text-white"
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)' }}
            >
              <span className="text-3xl mb-2">💾</span>
              <span className="font-medium">גיבויים</span>
            </Link>

            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/admin/system-status');
                  const data = await res.json();
                  alert(`סטטוס מערכת:\n${JSON.stringify(data.results, null, 2)}`);
                } catch {
                  alert('שגיאה בבדיקת סטטוס');
                }
              }}
              className="flex flex-col items-center justify-center p-4 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 text-white"
              style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' }}
            >
              <span className="text-3xl mb-2">🏥</span>
              <span className="font-medium">בדיקת בריאות</span>
            </button>

            <Link
              href="/admin/users"
              className="flex flex-col items-center justify-center p-4 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 text-white"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' }}
            >
              <span className="text-3xl mb-2">👥</span>
              <span className="font-medium">משתמשים</span>
            </Link>

            {/* Stats */}
            <div className="col-span-2 bg-gradient-to-br from-gray-50 to-cyan-50 rounded-xl p-4 border-2 border-gray-200">
              <h3 className="font-medium mb-3 text-gray-700">📈 סטטיסטיקה</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold" style={{ color: '#0891b2' }}>{logs.length}</div>
                  <div className="text-xs text-gray-500">לוגים</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">{errors.length}</div>
                  <div className="text-xs text-gray-500">שגיאות</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">{alerts.length}</div>
                  <div className="text-xs text-gray-500">התראות</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
