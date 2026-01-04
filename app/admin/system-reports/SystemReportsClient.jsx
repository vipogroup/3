'use client';

import { useState, useEffect } from 'react';

const TYPE_LABELS = {
  integration: { label: 'אינטגרציה', color: 'bg-purple-100 text-purple-800', icon: '🔗' },
  security: { label: 'אבטחה', color: 'bg-red-100 text-red-800', icon: '🔒' },
  performance: { label: 'ביצועים', color: 'bg-blue-100 text-blue-800', icon: '⚡' },
  audit: { label: 'ביקורת', color: 'bg-yellow-100 text-yellow-800', icon: '📋' },
  backup: { label: 'גיבוי', color: 'bg-green-100 text-green-800', icon: '💾' },
  custom: { label: 'כללי', color: 'bg-gray-100 text-gray-800', icon: '📄' },
};

const TABS = [
  { id: 'scan', label: '🔍 סריקה' },
  { id: 'reports', label: '📊 דוחות' },
  { id: 'history', label: '📜 היסטוריה' },
  { id: 'downloads', label: '📥 הורדות' },
];

export default function SystemReportsClient() {
  const [activeTab, setActiveTab] = useState('scan');
  const [reports, setReports] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showNewReport, setShowNewReport] = useState(false);
  const [filter, setFilter] = useState('all');
  const [generating, setGenerating] = useState(false);
  const [envAnalysis, setEnvAnalysis] = useState(null);

  useEffect(() => {
    loadReports();
    loadScans();
  }, [filter]);

  async function runSystemScan() {
    if (scanning) return;
    setScanning(true);
    setScanProgress({ status: 'running', message: 'מתחיל סריקה...' });
    setEnvAnalysis(null);
    
    try {
      const res = await fetch('/api/admin/system-reports/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ scope: 'full', generateReports: true }),
      });
      
      const json = await res.json();
      
      if (res.ok) {
        setScanProgress({ 
          status: 'completed', 
          message: `סריקה הושלמה! ציון: ${json.results?.score}% | ${json.reportsGenerated} דוחות נוצרו`,
        });
        setEnvAnalysis(json.envAnalysis);
        loadReports();
        loadScans();
      } else {
        setScanProgress({ status: 'failed', message: json.error || 'שגיאה בסריקה' });
      }
    } catch (err) {
      setScanProgress({ status: 'failed', message: 'שגיאת רשת' });
    } finally {
      setScanning(false);
    }
  }

  async function loadScans() {
    try {
      const res = await fetch('/api/admin/system-reports/scan?limit=10', { credentials: 'include' });
      const json = await res.json();
      if (res.ok) setScans(json.scans || []);
    } catch (err) {
      console.error('Failed to load scans:', err);
    }
  }

  async function generateReport(reportType) {
    if (generating) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/system-reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reportType }),
      });
      if (res.ok) {
        alert('דוח נוצר בהצלחה!');
        loadReports();
      }
    } catch (err) {
      alert('שגיאת רשת');
    } finally {
      setGenerating(false);
    }
  }

  async function loadReports() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('type', filter);
      const res = await fetch(`/api/admin/system-reports?${params}`, { credentials: 'include' });
      const json = await res.json();
      if (res.ok) setReports(json.reports || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadReport(id) {
    try {
      const res = await fetch(`/api/admin/system-reports/${id}`, { credentials: 'include' });
      const json = await res.json();
      if (res.ok) setSelectedReport(json.report);
    } catch (err) {
      console.error('Failed to load report:', err);
    }
  }

  async function deleteReport(id) {
    if (!confirm('האם למחוק את הדוח?')) return;
    try {
      const res = await fetch(`/api/admin/system-reports/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setReports(reports.filter(r => r.id !== id));
        if (selectedReport?.id === id) setSelectedReport(null);
      }
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  }

  function downloadReport(report, format) {
    const filename = `VIPO_${report.type}_${new Date(report.createdAt).toISOString().split('T')[0]}`;
    
    if (format === 'md') {
      const blob = new Blob([report.content], { type: 'text/markdown;charset=utf-8' });
      downloadBlob(blob, `${filename}.md`);
    } else if (format === 'json') {
      const data = { ...report, exportedAt: new Date().toISOString() };
      delete data.contentHtml;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
      downloadBlob(blob, `${filename}.json`);
    } else if (format === 'html') {
      const html = `<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="UTF-8"><title>${report.title}</title><style>body{font-family:sans-serif;max-width:900px;margin:0 auto;padding:40px;background:#f5f5f5}h1{color:#1e3a8a}pre{background:#eee;padding:15px;overflow-x:auto}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:12px;text-align:right}</style></head><body><h1>${report.title}</h1><p>תאריך: ${formatDate(report.createdAt)}</p><hr/><div>${formatMarkdownToHtml(report.content)}</div></body></html>`;
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      downloadBlob(blob, `${filename}.html`);
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function formatMarkdownToHtml(md) {
    if (!md) return '';
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/```[\s\S]*?```/g, (m) => `<pre>${m.slice(3, -3)}</pre>`)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br/>');
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🏢 System Reports & Audits Center
        </h1>
        <p className="text-gray-600 text-sm mt-1">Enterprise-grade system scanning, reporting & audit management</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: Scan */}
      {activeTab === 'scan' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-cyan-700 rounded-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-2">🔍 סריקת מערכת מלאה</h2>
            <p className="text-blue-100 mb-4 text-sm">סריקה מקיפה של כל רכיבי המערכת ויצירת 8 דוחות אוטומטיים</p>
            <div className="flex flex-wrap gap-3 items-center">
              <button onClick={runSystemScan} disabled={scanning} className="px-6 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-blue-50 disabled:opacity-50">
                {scanning ? '⏳ סורק...' : '🚀 הפעל סריקה מלאה'}
              </button>
              {scanProgress && (
                <div className={`px-4 py-2 rounded-lg text-sm ${scanProgress.status === 'completed' ? 'bg-green-500/20' : scanProgress.status === 'failed' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                  {scanProgress.message}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-bold mb-4">📋 אזורים נסרקים</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {['Database', 'Users', 'Orders', 'Products', 'Transactions', 'Permissions', 'Integrations', 'Security', 'Payments', 'System Keys'].map(a => (
                <div key={a} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm"><span className="text-green-500">✓</span>{a}</div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-bold mb-4">📊 דוחות שיווצרו אוטומטית</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['💰 Financial', '🛒 Orders', '👥 Users', '📋 Audit Trail', '🔗 Integrations', '🔍 Data Integrity', '🔒 Security', '⚡ Health'].map(r => (
                <div key={r} className="p-3 bg-blue-50 rounded-lg text-sm text-blue-900">{r}</div>
              ))}
            </div>
          </div>

          {/* Environment Variables Log */}
          {envAnalysis && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold mb-4">📋 לוג משתני סביבה - ניתוח ציון</h3>
              
              {/* Score Summary */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="text-sm text-gray-600">ציון נוכחי</div>
                    <div className="text-3xl font-bold text-blue-900">{envAnalysis.scoreBreakdown?.current || 0}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl">→</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">ציון פוטנציאלי</div>
                    <div className="text-3xl font-bold text-green-600">100%</div>
                  </div>
                  <div className="bg-yellow-100 px-4 py-2 rounded-lg">
                    <div className="text-sm text-yellow-800">חסר להשלמה</div>
                    <div className="text-xl font-bold text-yellow-900">+{100 - (envAnalysis.scoreBreakdown?.current || 0)}%</div>
                  </div>
                </div>
              </div>

              {/* Missing Variables */}
              {envAnalysis.missingVars?.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-red-700 mb-3">⚠️ משתנים חסרים ({envAnalysis.missingVars.length})</h4>
                  <div className="space-y-2">
                    {envAnalysis.missingVars.map(v => (
                      <div key={v.key} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <code className="bg-red-100 px-2 py-0.5 rounded text-red-800 text-sm font-mono">{v.key}</code>
                            <span className={`px-2 py-0.5 rounded text-xs ${v.priority === 'critical' ? 'bg-red-600 text-white' : v.priority === 'high' ? 'bg-orange-500 text-white' : 'bg-yellow-400 text-yellow-900'}`}>
                              {v.priority}
                            </span>
                            <span className="text-xs text-gray-500">{v.category}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{v.description}</p>
                        </div>
                        <div className="text-right mr-4">
                          <div className="text-lg font-bold text-green-600">+{v.percentageGain}%</div>
                          <div className="text-xs text-gray-500">אחרי השלמה</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Configured Variables */}
              {envAnalysis.configured?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-700 mb-3">✅ משתנים מוגדרים ({envAnalysis.configured.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {envAnalysis.configured.map(v => (
                      <div key={v.key} className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          <code className="text-sm font-mono">{v.key}</code>
                          {v.strength && (
                            <span className={`px-1.5 py-0.5 rounded text-xs ${v.strength === 'strong' ? 'bg-green-200 text-green-800' : v.strength === 'medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-orange-200 text-orange-800'}`}>
                              {v.strength === 'strong' ? 'חזק' : v.strength === 'medium' ? 'בינוני' : 'חלש'}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{v.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {scans.length > 0 && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold mb-4">📜 סריקות אחרונות</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr><th className="text-right p-3">Scan ID</th><th className="text-right p-3">תאריך</th><th className="text-right p-3">ציון</th><th className="text-right p-3">סטטוס</th></tr>
                </thead>
                <tbody>
                  {scans.map(s => (
                    <tr key={s.scanId} className="border-t">
                      <td className="p-3 font-mono text-xs">{s.scanId}</td>
                      <td className="p-3">{formatDate(s.createdAt)}</td>
                      <td className="p-3"><span className={`px-2 py-1 rounded ${s.results?.score >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{s.results?.score || 0}%</span></td>
                      <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${s.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB: Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => generateReport('integration')} disabled={generating} className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm disabled:opacity-50">🔗 אינטגרציות</button>
            <button onClick={() => generateReport('security')} disabled={generating} className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm disabled:opacity-50">🔒 אבטחה</button>
            <button onClick={() => generateReport('performance')} disabled={generating} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">⚡ ביצועים</button>
            <button onClick={() => generateReport('audit')} disabled={generating} className="px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm disabled:opacity-50">📋 ביקורת</button>
            <button onClick={() => generateReport('backup')} disabled={generating} className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm disabled:opacity-50">💾 גיבוי</button>
            <button onClick={() => setShowNewReport(true)} className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm">+ מותאם</button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {['all', 'integration', 'security', 'performance', 'audit'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-sm ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                {f === 'all' ? 'הכל' : TYPE_LABELS[f]?.icon + ' ' + TYPE_LABELS[f]?.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              {loading ? (
                <div className="text-center py-10"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div></div>
              ) : reports.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl"><p className="text-gray-500">אין דוחות</p></div>
              ) : (
                reports.map(r => (
                  <div key={r.id} onClick={() => loadReport(r.id)} className={`p-4 rounded-xl cursor-pointer ${selectedReport?.id === r.id ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{TYPE_LABELS[r.type]?.icon}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${TYPE_LABELS[r.type]?.color}`}>{TYPE_LABELS[r.type]?.label}</span>
                    </div>
                    <h3 className="font-medium truncate">{r.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(r.createdAt)}</p>
                  </div>
                ))
              )}
            </div>

            <div className="lg:col-span-2">
              {selectedReport ? (
                <div className="bg-white rounded-xl border-2 overflow-hidden">
                  <div className="p-6 text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                    <div className="flex justify-between">
                      <div>
                        <h2 className="text-xl font-bold">{selectedReport.title}</h2>
                        <p className="text-sm opacity-90">{formatDate(selectedReport.createdAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => downloadReport(selectedReport, 'md')} className="p-2 bg-white/20 rounded-lg" title="Markdown">📥</button>
                        <button onClick={() => downloadReport(selectedReport, 'html')} className="p-2 bg-white/20 rounded-lg" title="HTML">📄</button>
                        <button onClick={() => downloadReport(selectedReport, 'json')} className="p-2 bg-white/20 rounded-lg" title="JSON">📦</button>
                        <button onClick={() => deleteReport(selectedReport.id)} className="p-2 bg-red-500/50 rounded-lg" title="מחק">🗑️</button>
                      </div>
                    </div>
                    {selectedReport.stats?.score > 0 && (
                      <div className="flex gap-4 mt-4">
                        <div className="bg-white/20 rounded-lg px-3 py-2"><div className="text-2xl font-bold">{selectedReport.stats.score}%</div><div className="text-xs">ציון</div></div>
                        <div className="bg-white/20 rounded-lg px-3 py-2"><div className="text-2xl font-bold text-green-300">{selectedReport.stats.passed}</div><div className="text-xs">עברו</div></div>
                        <div className="bg-white/20 rounded-lg px-3 py-2"><div className="text-2xl font-bold text-red-300">{selectedReport.stats.failed}</div><div className="text-xs">נכשלו</div></div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 max-h-[500px] overflow-y-auto" style={{ direction: 'rtl' }} dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(selectedReport.content) }} />
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-10 text-center"><div className="text-6xl mb-4">📊</div><p className="text-gray-500">בחר דוח מהרשימה</p></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-bold mb-4">📜 היסטוריית דוחות וסריקות</h3>
          {reports.length === 0 && scans.length === 0 ? (
            <p className="text-gray-500 text-center py-10">אין היסטוריה</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr><th className="text-right p-3">סוג</th><th className="text-right p-3">כותרת</th><th className="text-right p-3">תאריך</th><th className="text-right p-3">סטטוס</th></tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => { setActiveTab('reports'); loadReport(r.id); }}>
                    <td className="p-3">{TYPE_LABELS[r.type]?.icon} דוח</td>
                    <td className="p-3">{r.title}</td>
                    <td className="p-3">{formatDate(r.createdAt)}</td>
                    <td className="p-3"><span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">published</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB: Downloads */}
      {activeTab === 'downloads' && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-bold mb-4">📥 מרכז הורדות</h3>
          <p className="text-gray-600 text-sm mb-4">הורד דוחות בפורמטים: CSV, JSON, HTML, Markdown</p>
          {reports.length === 0 ? (
            <p className="text-gray-500 text-center py-10">אין דוחות להורדה</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr><th className="text-right p-3">דוח</th><th className="text-right p-3">תאריך</th><th className="text-right p-3">הורדות</th></tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">{TYPE_LABELS[r.type]?.icon} {r.title}</td>
                    <td className="p-3">{formatDate(r.createdAt)}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => downloadReport(r, 'md')} className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">MD</button>
                      <button onClick={() => downloadReport(r, 'html')} className="px-2 py-1 bg-blue-100 rounded text-xs hover:bg-blue-200">HTML</button>
                      <button onClick={() => downloadReport(r, 'json')} className="px-2 py-1 bg-green-100 rounded text-xs hover:bg-green-200">JSON</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* New Report Modal */}
      {showNewReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <NewReportModal onClose={() => setShowNewReport(false)} onSave={() => { setShowNewReport(false); loadReports(); }} />
        </div>
      )}
    </div>
  );
}

function NewReportModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('integration');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title || !content) { alert('נא למלא כותרת ותוכן'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/system-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, type, content, summary: content.substring(0, 200), tags: [type] }),
      });
      if (res.ok) onSave();
      else alert('שגיאה בשמירה');
    } catch (err) {
      alert('שגיאת רשת');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
      <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
        <h2 className="text-xl font-bold">דוח חדש</h2>
      </div>
      <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
        <div>
          <label className="block text-sm font-medium mb-1">כותרת</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border-2 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">סוג דוח</label>
          <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-2 border-2 rounded-lg">
            <option value="integration">🔗 אינטגרציה</option>
            <option value="security">🔒 אבטחה</option>
            <option value="performance">⚡ ביצועים</option>
            <option value="audit">📋 ביקורת</option>
            <option value="backup">💾 גיבוי</option>
            <option value="custom">📄 כללי</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">תוכן (Markdown)</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full px-4 py-2 border-2 rounded-lg font-mono text-sm" rows={12} dir="ltr" />
        </div>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">ביטול</button>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-white rounded-lg disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
          {saving ? 'שומר...' : 'שמור דוח'}
        </button>
      </div>
    </div>
  );
}
