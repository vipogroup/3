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
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Hidden audio element for alerts */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/alert.mp3" type="audio/mpeg" />
      </audio>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            חזרה לדשבורד
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            לוגים און-ליין
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Search filter */}
          <input
            type="text"
            placeholder="חיפוש..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm w-48"
          />

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg ${soundEnabled ? 'bg-green-600' : 'bg-gray-700'}`}
            title={soundEnabled ? 'צליל פעיל' : 'צליל מושתק'}
          >
            {soundEnabled ? '🔔' : '🔕'}
          </button>

          {/* Start/Stop */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-lg font-medium ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
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
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            🗑️ נקה
          </button>
        </div>
      </div>

      {/* 4-Panel Grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[calc(100vh-120px)]">
        
        {/* Panel 1: Live Logs */}
        <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-blue-600 px-4 py-2 flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2">
              📋 לוגים בזמן אמת
              <span className="bg-blue-800 px-2 py-0.5 rounded text-sm">{logs.length}</span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 font-mono text-sm">
            {filterItems(logs).map((log, i) => (
              <div key={log.id || i} className="py-1 border-b border-gray-700 hover:bg-gray-700/50">
                <span className="text-gray-500">{formatTime(log.timestamp)}</span>
                <span className="text-green-400 mx-2">[{log.action || 'LOG'}]</span>
                <span className="text-gray-300">{log.details || log.message}</span>
                {log.user && <span className="text-cyan-400 mr-2">({log.user})</span>}
                {log.ip && <span className="text-gray-500 text-xs mr-2">IP: {log.ip}</span>}
              </div>
            ))}
            <div ref={logsEndRef} />
            {logs.length === 0 && (
              <div className="text-gray-500 text-center py-8">אין לוגים עדיין...</div>
            )}
          </div>
        </div>

        {/* Panel 2: Errors */}
        <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-red-600 px-4 py-2 flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2">
              ❌ שגיאות
              <span className="bg-red-800 px-2 py-0.5 rounded text-sm">{errors.length}</span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 font-mono text-sm">
            {filterItems(errors).map((error, i) => (
              <div key={error.id || i} className="py-2 border-b border-gray-700 hover:bg-gray-700/50">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{formatTime(error.timestamp)}</span>
                  {error.statusCode && (
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      error.statusCode >= 500 ? 'bg-red-600' : 'bg-orange-600'
                    }`}>
                      {error.statusCode}
                    </span>
                  )}
                  <span className="text-yellow-400">{error.method}</span>
                  <span className="text-gray-400">{error.path}</span>
                </div>
                <div className="text-red-400 mt-1">{error.message}</div>
                {error.stack && (
                  <details className="mt-1">
                    <summary className="text-gray-500 cursor-pointer text-xs">Stack trace</summary>
                    <pre className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">{error.stack}</pre>
                  </details>
                )}
              </div>
            ))}
            <div ref={errorsEndRef} />
            {errors.length === 0 && (
              <div className="text-gray-500 text-center py-8">אין שגיאות 🎉</div>
            )}
          </div>
        </div>

        {/* Panel 3: Security Alerts */}
        <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-orange-600 px-4 py-2 flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2">
              🚨 התראות אבטחה
              <span className="bg-orange-800 px-2 py-0.5 rounded text-sm">{alerts.length}</span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {filterItems(alerts).map((alert, i) => (
              <div 
                key={alert.id || i} 
                className={`p-3 mb-2 rounded-lg border-r-4 ${
                  alert.severity === 'critical' ? 'bg-red-900/50 border-red-500' :
                  alert.severity === 'high' ? 'bg-orange-900/50 border-orange-500' :
                  alert.severity === 'medium' ? 'bg-yellow-900/50 border-yellow-500' :
                  'bg-gray-700/50 border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getAlertIcon(alert.alertType)}</span>
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-xs text-gray-400">
                        {formatTime(alert.timestamp)} | IP: {alert.ip || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
            <div ref={alertsEndRef} />
            {alerts.length === 0 && (
              <div className="text-gray-500 text-center py-8">אין התראות אבטחה 🛡️</div>
            )}
          </div>
        </div>

        {/* Panel 4: Windsurf / Quick Actions */}
        <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-purple-600 px-4 py-2">
            <h2 className="font-bold">🛠️ כלים ופעולות מהירות</h2>
          </div>
          <div className="flex-1 p-4 grid grid-cols-2 gap-4 content-start">
            {/* Quick action buttons */}
            <a
              href="https://codeium.com/windsurf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-opacity"
            >
              <span className="text-3xl mb-2">🌊</span>
              <span className="font-medium">Windsurf</span>
            </a>

            <Link
              href="/admin/monitor"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg hover:opacity-90 transition-opacity"
            >
              <span className="text-3xl mb-2">📊</span>
              <span className="font-medium">מוניטור מערכת</span>
            </Link>

            <Link
              href="/admin/security"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg hover:opacity-90 transition-opacity"
            >
              <span className="text-3xl mb-2">🔒</span>
              <span className="font-medium">אבטחה</span>
            </Link>

            <Link
              href="/admin/backups"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-lg hover:opacity-90 transition-opacity"
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
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg hover:opacity-90 transition-opacity"
            >
              <span className="text-3xl mb-2">🏥</span>
              <span className="font-medium">בדיקת בריאות</span>
            </button>

            <Link
              href="/admin/users"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-600 to-rose-600 rounded-lg hover:opacity-90 transition-opacity"
            >
              <span className="text-3xl mb-2">👥</span>
              <span className="font-medium">משתמשים</span>
            </Link>

            {/* Stats */}
            <div className="col-span-2 bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-medium mb-3">📈 סטטיסטיקה</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">{logs.length}</div>
                  <div className="text-xs text-gray-400">לוגים</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">{errors.length}</div>
                  <div className="text-xs text-gray-400">שגיאות</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">{alerts.length}</div>
                  <div className="text-xs text-gray-400">התראות</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
