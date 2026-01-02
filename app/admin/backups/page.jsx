'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function BackupsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
  const tab = searchParams.get('tab') || 'main';
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backups, setBackups] = useState([]);
  const [message, setMessage] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState('');
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreFile, setRestoreFile] = useState(null);

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
        
        // Load backups list
        await loadBackups();
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  async function loadBackups() {
    try {
      const res = await fetch('/api/admin/backups');
      if (res.ok) {
        const data = await res.json();
        setBackups(data.backups || []);
      }
    } catch (error) {
      console.error('Failed to load backups:', error);
    }
  }

  async function runAction(actionType, actionName) {
    setIsRunning(true);
    setCurrentAction(actionName);
    setProgress(0);
    setMessage(`מבצע ${actionName}...`);
    
    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        const increment = actionType === 'deploy' ? 2 : actionType === 'update' ? 3 : 5;
        return Math.min(prev + increment, 90);
      });
    }, 500);
    
    try {
      const res = await fetch('/api/admin/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionType })
      });
      const data = await res.json();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (res.ok) {
        let msg = `✅ ${data.message || actionName + ' הושלם בהצלחה!'}`;
        
        // If backup, download the backup file
        if (actionType === 'backup' && data.downloadReady && data.backup) {
          const blob = new Blob([JSON.stringify(data.backup, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `backup-${data.backup.timestamp.replace(/[:.]/g, '-')}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          msg = `✅ ${data.message} - הקובץ הורד למחשב!`;
        }
        
        // Show commands if provided
        if (data.commands) {
          msg += '\n\n📋 פקודות:\n' + data.commands.join('\n');
        }
        if (data.info) {
          msg += '\n\nℹ️ ' + data.info;
        }
        
        setMessage(msg);
        if (actionType === 'backup') await loadBackups();
      } else {
        setMessage('❌ שגיאה: ' + (data.error || data.details || 'הפעולה נכשלה'));
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      setMessage('❌ שגיאה: ' + error.message);
    } finally {
      setTimeout(() => {
        setIsRunning(false);
        setProgress(0);
        setCurrentAction('');
      }, 2000);
    }
  }

  const runBackup = () => runAction('backup', 'גיבוי');
  const runDeploy = () => runAction('deploy', 'Deploy ל-Vercel');
  const runUpdate = () => runAction('update', 'עדכון מערכת');
  const runServer = () => runAction('server', 'הפעלת שרת מקומי');

  // Handle file upload for restore
  function handleRestoreFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setRestoreFile(file);
    }
  }

  async function runRestore() {
    if (!restoreFile) {
      setMessage('❌ יש לבחור קובץ גיבוי תחילה');
      return;
    }

    // Confirm before restore
    if (!confirm('⚠️ שחזור יחליף את כל הנתונים הקיימים במערכת!\n\nהאם אתה בטוח שברצונך להמשיך?')) {
      return;
    }

    setIsRunning(true);
    setCurrentAction('שחזור מגיבוי');
    setProgress(0);
    setMessage('קורא קובץ גיבוי...');

    try {
      // Read the file
      const fileContent = await restoreFile.text();
      let backupData;
      
      try {
        backupData = JSON.parse(fileContent);
      } catch (parseErr) {
        setMessage('❌ קובץ הגיבוי לא תקין - לא ניתן לפרסר JSON');
        setIsRunning(false);
        return;
      }

      setProgress(30);
      setMessage('משחזר נתונים...');

      const res = await fetch('/api/admin/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore', backupData })
      });

      const data = await res.json();
      setProgress(100);

      if (res.ok) {
        let msg = `✅ ${data.message}`;
        if (data.restored) {
          msg += '\n\n📋 קולקציות ששוחזרו:\n';
          msg += data.restored.map(c => `• ${c.name}: ${c.count} רשומות`).join('\n');
        }
        if (data.errors && data.errors.length > 0) {
          msg += '\n\n⚠️ שגיאות:\n';
          msg += data.errors.map(e => `• ${e.collection}: ${e.error}`).join('\n');
        }
        setMessage(msg);
        setShowRestoreModal(false);
        setRestoreFile(null);
      } else {
        setMessage('❌ שגיאה: ' + (data.error || 'השחזור נכשל'));
      }
    } catch (error) {
      setMessage('❌ שגיאה: ' + error.message);
    } finally {
      setTimeout(() => {
        setIsRunning(false);
        setProgress(0);
        setCurrentAction('');
      }, 2000);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white p-4 sm:p-6 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            <span className="flex items-center gap-3">
              <svg className="w-8 h-8" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              גיבוי ועדכון מערכת
            </span>
          </h1>
          <Link href="/admin" className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', color: 'white' }}>
            חזרה לדשבורד
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg whitespace-pre-line ${message.includes('✅') ? 'bg-green-50 text-green-800' : message.includes('❌') ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
            {message}
          </div>
        )}

        {/* Progress Bar */}
        {isRunning && (
          <div className="mb-6 p-4 rounded-xl bg-white shadow-md" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{currentAction}</span>
              <span className="text-sm font-bold" style={{ color: '#0891b2' }}>{progress}%</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${progress}%`,
                  background: progress === 100 
                    ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' 
                    : 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)'
                }}
              />
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span>מעבד... אנא המתן</span>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Backup */}
          <div className="p-6 rounded-xl bg-white shadow-md" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #16a34a, #22c55e)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </span>
              <div>
                <h3 className="font-bold text-gray-900">גיבוי חדש</h3>
                <p className="text-sm text-gray-500">יצירת גיבוי של בסיס הנתונים</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={runBackup} 
              disabled={isRunning}
              className="w-full py-2 px-4 rounded-lg text-white font-medium transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' }}
            >
              {isRunning ? 'מבצע...' : '1. בצע גיבוי עכשיו'}
            </button>
          </div>

          {/* Update System */}
          <div className="p-6 rounded-xl bg-white shadow-md" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #2563eb, #3b82f6)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </span>
              <div>
                <h3 className="font-bold text-gray-900">2. עדכון מערכת</h3>
                <p className="text-sm text-gray-500">משיכת קוד חדש מ-GitHub</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={runUpdate}
              disabled={isRunning}
              className="w-full py-2 px-4 rounded-lg text-white font-medium transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' }}
            >
              {isRunning ? 'מעדכן...' : '2. עדכן מערכת עכשיו'}
            </button>
          </div>

          {/* Restore */}
          <div className="p-6 rounded-xl bg-white shadow-md" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #d97706, #fbbf24)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
              <div>
                <h3 className="font-bold text-gray-900">שחזור גיבוי</h3>
                <p className="text-sm text-gray-500">שחזור מקובץ JSON</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setShowRestoreModal(true)}
              disabled={isRunning}
              className="w-full py-2 px-4 rounded-lg text-white font-medium transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)' }}
            >
              {isRunning ? 'משחזר...' : 'שחזר מגיבוי'}
            </button>
          </div>

          {/* Deploy */}
          <div className="p-6 rounded-xl bg-white shadow-md" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #7c3aed, #a78bfa)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </span>
              <div>
                <h3 className="font-bold text-gray-900">5. Deploy לVercel</h3>
                <p className="text-sm text-gray-500">העלאה אוטומטית לפרודקשן</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={runDeploy}
              disabled={isRunning}
              className="w-full py-2 px-4 rounded-lg text-white font-medium transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' }}
            >
              {isRunning ? 'מעלה...' : 'העלה לVercel עכשיו'}
            </button>
          </div>

          {/* Start Server */}
          <div className="p-6 rounded-xl bg-white shadow-md" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #0891b2, #06b6d4)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </span>
              <div>
                <h3 className="font-bold text-gray-900">3. הפעל שרת פנימי</h3>
                <p className="text-sm text-gray-500">הפעלת השרת המקומי לפיתוח</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={runServer}
              disabled={isRunning}
              className="w-full py-2 px-4 rounded-lg text-white font-medium transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' }}
            >
              {isRunning ? 'מפעיל...' : '3. הפעל שרת עכשיו'}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">השרת יפעל בכתובת: http://localhost:3001</p>
          </div>
        </div>

        {/* Scripts Info */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            סקריפטים זמינים
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-2">backup.cmd</h3>
              <p className="text-sm text-gray-600 mb-2">גיבוי בסיס הנתונים</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block">backups\database\backup.cmd</code>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-2">update-all.cmd</h3>
              <p className="text-sm text-gray-600 mb-2">עדכון כל המערכת</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block">backups\database\update-all.cmd</code>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-2">upgrade-backup.cmd</h3>
              <p className="text-sm text-gray-600 mb-2">שדרוג וגיבוי</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block">backups\database\upgrade-backup.cmd</code>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-2">deploy-vercel.cmd</h3>
              <p className="text-sm text-gray-600 mb-2">העלאה לVercel</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block">backups\database\deploy-vercel.cmd</code>
            </div>
          </div>
        </div>

        {/* Backups History */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            היסטוריית גיבויים
          </h2>
          {backups.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-medium text-gray-600">שם הגיבוי</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">תאריך</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">גודל</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {backups.map((backup, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{backup.name}</td>
                      <td className="py-3 px-4 text-gray-600">{backup.date}</td>
                      <td className="py-3 px-4 text-gray-600">{backup.size}</td>
                      <td className="py-3 px-4">
                        <span className="text-gray-400 text-sm">גיבוי מקומי</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <p>הגיבויים נמצאים בתיקייה המקומית</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">backups/database/</code>
            </div>
          )}
        </div>
      </div>

      {/* Restore Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" dir="rtl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                שחזור מגיבוי
              </h3>
              <button 
                onClick={() => { setShowRestoreModal(false); setRestoreFile(null); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>שחזור יחליף את כל הנתונים הקיימים במערכת! מומלץ לבצע גיבוי לפני.</span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                בחר קובץ גיבוי (JSON)
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
              {restoreFile && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  נבחר: {restoreFile.name}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={runRestore}
                disabled={!restoreFile || isRunning}
                className="flex-1 py-2 px-4 rounded-lg text-white font-medium transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)' }}
              >
                {isRunning ? 'משחזר...' : 'התחל שחזור'}
              </button>
              <button
                onClick={() => { setShowRestoreModal(false); setRestoreFile(null); }}
                className="py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function BackupsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    }>
      <BackupsContent />
    </Suspense>
  );
}
