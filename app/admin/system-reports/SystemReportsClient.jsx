'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const TYPE_LABELS = {
  integration: { label: 'אינטגרציה', color: 'bg-purple-100 text-purple-800', icon: '🔗' },
  security: { label: 'אבטחה', color: 'bg-red-100 text-red-800', icon: '🔒' },
  performance: { label: 'ביצועים', color: 'bg-blue-100 text-blue-800', icon: '⚡' },
  audit: { label: 'ביקורת', color: 'bg-yellow-100 text-yellow-800', icon: '📋' },
  backup: { label: 'גיבוי', color: 'bg-green-100 text-green-800', icon: '💾' },
  custom: { label: 'כללי', color: 'bg-gray-100 text-gray-800', icon: '📄' },
  // Enterprise Report Types
  executive: { label: 'הנהלה', color: 'bg-indigo-100 text-indigo-800', icon: '🚀' },
  financial: { label: 'כספים', color: 'bg-emerald-100 text-emerald-800', icon: '💰' },
  operational: { label: 'תפעולי', color: 'bg-orange-100 text-orange-800', icon: '🔑' },
  risk: { label: 'סיכונים', color: 'bg-rose-100 text-rose-800', icon: '⚠️' },
  meta: { label: 'מטא', color: 'bg-cyan-100 text-cyan-800', icon: '📊' },
};

// Exportable report categories
const EXPORTABLE_CATEGORIES = [
  'financial_payments',
  'orders_transactions', 
  'financial_reconciliation',
  'go_live_readiness',
];

const TABS = [
  { id: 'scan', label: '🔍 סריקה' },
  { id: 'reports', label: '📊 דוחות' },
  { id: 'enterprise', label: '🏢 Enterprise' },
  { id: 'seo', label: '📈 SEO Audits' },
  { id: 'social', label: '🌐 Social Audits', link: '/admin/social-audit' },
  { id: 'errors', label: '⚠️ שגיאות' },
  { id: 'history', label: '📜 היסטוריה' },
  { id: 'downloads', label: '📥 הורדות' },
];

export default function SystemReportsClient() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabParam || 'scan');
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
  const [issuesLog, setIssuesLog] = useState(null);
  const [errorLogs, setErrorLogs] = useState([]);
  const [errorStats, setErrorStats] = useState(null);
  const [errorsLoading, setErrorsLoading] = useState(false);
  // SEO Audit States
  const [seoData, setSeoData] = useState(null);
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoFilter, setSeoFilter] = useState({ severity: 'all', type: 'all' });
  const [selectedSeoReport, setSelectedSeoReport] = useState(null);

  // Update tab from URL parameter
  useEffect(() => {
    if (tabParam && TABS.some(t => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    loadReports();
    loadScans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (activeTab === 'errors') {
      loadErrorLogs();
    }
  }, [activeTab]);

  async function runSystemScan() {
    console.log('🚀 runSystemScan called, scanning:', scanning);
    if (scanning) {
      console.log('⚠️ Already scanning, returning');
      return;
    }
    console.log('✅ Starting scan...');
    setScanning(true);
    setScanProgress({ status: 'running', message: 'מתחיל סריקה...' });
    setEnvAnalysis(null);
    setIssuesLog(null);
    
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
        setIssuesLog(json.issuesLog);
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

  async function loadErrorLogs() {
    setErrorsLoading(true);
    try {
      const res = await fetch('/api/admin/error-logs?limit=50', { credentials: 'include' });
      const json = await res.json();
      if (res.ok) {
        setErrorLogs(json.logs || []);
        setErrorStats(json.stats || null);
      }
    } catch (err) {
      console.error('Failed to load error logs:', err);
    } finally {
      setErrorsLoading(false);
    }
  }

  async function markErrorResolved(id, resolved = true) {
    try {
      const res = await fetch('/api/admin/error-logs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, resolved }),
      });
      if (res.ok) loadErrorLogs();
    } catch (err) {
      console.error('Failed to update error:', err);
    }
  }

  // SEO Audit Functions
  async function runSeoAudit() {
    if (seoLoading) return;
    setSeoLoading(true);
    try {
      const res = await fetch('/api/admin/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'scan', reportTypes: ['technical_seo', 'content_coverage', 'web_vitals'] }),
      });
      const json = await res.json();
      if (res.ok) {
        setSeoData(json);
        setSelectedSeoReport(null);
      } else {
        alert(json.error || 'שגיאה בסריקת SEO');
      }
    } catch (err) {
      console.error('SEO audit failed:', err);
      alert('שגיאת רשת בסריקת SEO');
    } finally {
      setSeoLoading(false);
    }
  }

  async function loadSeoHistory() {
    try {
      const res = await fetch('/api/admin/seo-audit?limit=5', { credentials: 'include' });
      const json = await res.json();
      return json.reports || [];
    } catch (err) {
      console.error('Failed to load SEO history:', err);
      return [];
    }
  }

  function getSeoStatusColor(status) {
    switch (status) {
      case 'PASS': return 'bg-green-100 text-green-800 border-green-300';
      case 'WARN': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'FAIL': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  function getSeoScoreColor(score) {
    if (score >= 80) return '#22c55e';
    if (score >= 50) return '#eab308';
    return '#ef4444';
  }

  function filterSeoIssues(issues) {
    if (!issues) return [];
    return issues.filter(issue => {
      if (seoFilter.severity !== 'all' && issue.severity !== seoFilter.severity) return false;
      if (seoFilter.type !== 'all' && issue.issue_type !== seoFilter.type && issue.error_type !== seoFilter.type && issue.metric_name !== seoFilter.type) return false;
      return true;
    });
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

  async function exportReport(reportId, format) {
    try {
      const res = await fetch(`/api/admin/system-reports/export?reportId=${reportId}&format=${format}`, { 
        credentials: 'include' 
      });
      if (res.ok) {
        const blob = await res.blob();
        const contentDisposition = res.headers.get('Content-Disposition');
        const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || `report_${reportId}.${format === 'pdf' ? 'html' : format}`;
        downloadBlob(blob, filename);
      } else {
        const json = await res.json();
        alert(json.error || 'שגיאה בייצוא');
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('שגיאה בייצוא הדוח');
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

  async function copyReportToClipboard(report) {
    const text = `${report.title}\n${'='.repeat(report.title.length)}\n\nתאריך: ${formatDate(report.createdAt)}\nסיכום: ${report.summary || ''}\n\n${report.content}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('✅ הדוח הועתק ללוח!');
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('✅ הדוח הועתק ללוח!');
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            <svg className="w-8 h-8" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            מרכז דוחות ובקרת מערכת
          </h1>
          <p className="text-gray-600 text-sm mt-1">סריקה מקיפה, דוחות וביקורת מערכת</p>
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          חזרה לדשבורד
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {TABS.map(tab => (
          tab.link ? (
            <Link key={tab.id} href={tab.link} className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
              {tab.label}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          ) : (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>
              {tab.label}
            </button>
          )
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

          <div className="bg-gradient-to-r from-indigo-900 to-purple-700 rounded-xl p-6 text-white">
            <h3 className="font-bold mb-2">🏢 Enterprise Reports (NEW)</h3>
            <p className="text-indigo-200 text-sm mb-3">דוחות ברמת הנהלה שנוצרים אוטומטית בסריקה</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { icon: '🚀', name: 'Go-Live Readiness', critical: true },
                { icon: '💰', name: 'Financial Reconciliation', critical: true },
                { icon: '🔑', name: 'Missing Keys Impact' },
                { icon: '⚠️', name: 'Risk Matrix' },
                { icon: '📊', name: 'Reports Reliability' },
              ].map(r => (
                <div key={r.name} className={`p-2 rounded-lg text-xs ${r.critical ? 'bg-red-500/30 border border-red-400' : 'bg-white/10'}`}>
                  <span className="mr-1">{r.icon}</span>{r.name}
                  {r.critical && <span className="block text-red-300 text-[10px]">Critical</span>}
                </div>
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

          {/* Issues Log by Category */}
          {issuesLog && issuesLog.summary?.totalIssues > 0 && (
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">📋 לוג שגיאות - מה צריך לתקן</h3>
                <div className="flex gap-3 text-sm">
                  {issuesLog.summary.totalErrors > 0 && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                      🔴 {issuesLog.summary.totalErrors} שגיאות
                    </span>
                  )}
                  {issuesLog.summary.totalWarnings > 0 && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                      🟡 {issuesLog.summary.totalWarnings} אזהרות
                    </span>
                  )}
                  {issuesLog.summary.totalInfo > 0 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      🔵 {issuesLog.summary.totalInfo} המלצות
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(issuesLog.categories || {}).map(([key, category]) => {
                  if (category.items.length === 0) return null;
                  return (
                    <div key={key} className={`rounded-lg border-2 overflow-hidden ${
                      category.severity === 'error' ? 'border-red-300 bg-red-50' :
                      category.severity === 'warning' ? 'border-yellow-300 bg-yellow-50' :
                      category.severity === 'info' ? 'border-blue-300 bg-blue-50' :
                      'border-gray-200 bg-gray-50'
                    }`}>
                      <div className={`px-4 py-3 font-bold flex items-center justify-between ${
                        category.severity === 'error' ? 'bg-red-100 text-red-800' :
                        category.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        category.severity === 'info' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <span>{category.title}</span>
                        <span className="text-sm font-normal">{category.items.length} פריטים</span>
                      </div>
                      <div className="p-4 space-y-3">
                        {category.items.map((item, idx) => (
                          <div key={idx} className={`p-3 rounded-lg border ${
                            item.severity === 'error' ? 'bg-white border-red-200' :
                            item.severity === 'warning' ? 'bg-white border-yellow-200' :
                            'bg-white border-blue-200'
                          }`}>
                            <div className="flex items-start gap-3">
                              <span className="text-lg">
                                {item.severity === 'error' ? '🔴' : item.severity === 'warning' ? '🟡' : '🔵'}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{item.message}</div>
                                {item.fix && (
                                  <div className="mt-1 text-sm text-gray-600">
                                    <span className="font-medium text-green-700">💡 פתרון:</span> {item.fix}
                                  </div>
                                )}
                                {item.category && (
                                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                    {item.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All OK Message */}
          {issuesLog && issuesLog.summary?.totalIssues === 0 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">✅</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">מעולה! אין בעיות לתיקון</h3>
              <p className="text-green-600">כל הבדיקות עברו בהצלחה - המערכת תקינה</p>
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
                        <button onClick={() => copyReportToClipboard(selectedReport)} className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600" title="העתק">📋 העתק</button>
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

      {/* TAB: Enterprise */}
      {activeTab === 'enterprise' && (
        <div className="space-y-6">
          {/* Enterprise Header */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-700 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">🏢 Enterprise Reports Dashboard</h2>
            <p className="text-indigo-200">דוחות ברמת הנהלה להחלטות אסטרטגיות, כספיות ו-Go-Live</p>
          </div>

          {/* Enterprise Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.filter(r => r.isEnterprise || ['executive', 'financial', 'operational', 'risk', 'meta'].includes(r.type)).map(r => (
              <div key={r.id} onClick={() => loadReport(r.id)} className={`p-5 rounded-xl cursor-pointer transition-all ${selectedReport?.id === r.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'bg-white border-2 border-gray-100 hover:border-indigo-200 hover:shadow-lg'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${TYPE_LABELS[r.type]?.color || 'bg-gray-100'}`}>
                    {TYPE_LABELS[r.type]?.icon} {TYPE_LABELS[r.type]?.label || r.type}
                  </span>
                  {r.category === 'go_live_readiness' || r.category === 'financial_reconciliation' ? (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Critical</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Supporting</span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{r.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{r.summary}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(r.createdAt)}</span>
                  {r.stats?.score !== undefined && (
                    <span className={`font-bold ${r.stats.score >= 80 ? 'text-green-600' : r.stats.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {r.stats.score}%
                    </span>
                  )}
                </div>
              </div>
            ))}
            {reports.filter(r => r.isEnterprise || ['executive', 'financial', 'operational', 'risk', 'meta'].includes(r.type)).length === 0 && (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
                <div className="text-5xl mb-4">🏢</div>
                <p className="text-gray-500 mb-4">אין דוחות Enterprise עדיין</p>
                <button onClick={runSystemScan} disabled={scanning} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  {scanning ? '⏳ סורק...' : '🚀 הפעל סריקה ליצירת דוחות'}
                </button>
              </div>
            )}
          </div>

          {/* Selected Enterprise Report View */}
          {selectedReport && ['executive', 'financial', 'operational', 'risk', 'meta'].includes(selectedReport.type) && (
            <div className="bg-white rounded-xl border-2 overflow-hidden">
              <div className="p-6 text-white" style={{ background: 'linear-gradient(135deg, #312e81 0%, #7c3aed 100%)' }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{TYPE_LABELS[selectedReport.type]?.icon}</span>
                      <h2 className="text-xl font-bold">{selectedReport.title}</h2>
                    </div>
                    <p className="text-indigo-200 text-sm">{formatDate(selectedReport.createdAt)} | {selectedReport.createdByName || 'Admin'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => copyReportToClipboard(selectedReport)} className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600" title="העתק">
                      📋 העתק
                    </button>
                    {EXPORTABLE_CATEGORIES.includes(selectedReport.category) && (
                      <>
                        <button onClick={() => exportReport(selectedReport.id, 'csv')} className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600" title="CSV">
                          📊 CSV
                        </button>
                        <button onClick={() => exportReport(selectedReport.id, 'pdf')} className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600" title="PDF">
                          📄 PDF
                        </button>
                      </>
                    )}
                    <button onClick={() => downloadReport(selectedReport, 'md')} className="p-2 bg-white/20 rounded-lg" title="Markdown">📥</button>
                    <button onClick={() => downloadReport(selectedReport, 'html')} className="p-2 bg-white/20 rounded-lg" title="HTML">📄</button>
                    <button onClick={() => downloadReport(selectedReport, 'json')} className="p-2 bg-white/20 rounded-lg" title="JSON">📦</button>
                  </div>
                </div>
                {selectedReport.stats && (
                  <div className="flex gap-4 mt-4">
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-3xl font-bold">{selectedReport.stats.score}%</div>
                      <div className="text-xs text-indigo-200">ציון</div>
                    </div>
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-3xl font-bold text-green-300">{selectedReport.stats.passed}</div>
                      <div className="text-xs text-indigo-200">עברו</div>
                    </div>
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-3xl font-bold text-red-300">{selectedReport.stats.failed}</div>
                      <div className="text-xs text-indigo-200">נכשלו</div>
                    </div>
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-3xl font-bold text-yellow-300">{selectedReport.stats.warnings}</div>
                      <div className="text-xs text-indigo-200">אזהרות</div>
                    </div>
                  </div>
                )}
                {selectedReport.decision?.readyForProduction !== undefined && (
                  <div className={`mt-4 p-4 rounded-lg ${selectedReport.decision.readyForProduction ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
                    <div className="text-lg font-bold">
                      {selectedReport.decision.readyForProduction ? '✅ READY FOR PRODUCTION' : '❌ NOT READY FOR PRODUCTION'}
                    </div>
                    {selectedReport.decision.blockers?.length > 0 && (
                      <div className="text-sm mt-2">
                        {selectedReport.decision.blockers.filter(b => b.severity === 'critical').length} blockers
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="p-6 max-h-[500px] overflow-y-auto" style={{ direction: 'rtl' }} dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(selectedReport.content) }} />
            </div>
          )}
        </div>
      )}

      {/* TAB: SEO & Organic Growth Audits */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* SEO Header */}
          <div className="rounded-xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  SEO & Organic Growth Audits
                </h2>
                <p className="text-blue-100">אבחון מקיף של בעיות SEO, תוכן ו-Core Web Vitals</p>
              </div>
              <button
                onClick={runSeoAudit}
                disabled={seoLoading}
                className="px-5 py-2.5 bg-white/20 rounded-lg hover:bg-white/30 disabled:opacity-50 flex items-center gap-2 font-medium"
              >
                {seoLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    סורק...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    הפעל סריקת SEO
                  </>
                )}
              </button>
            </div>

            {/* Overall Score */}
            {seoData && (
              <div className="flex items-center gap-6 mt-6">
                <div className="bg-white/20 rounded-xl px-6 py-4 text-center">
                  <div className="text-4xl font-bold" style={{ color: getSeoScoreColor(seoData.overallScore) }}>
                    {seoData.overallScore}%
                  </div>
                  <div className="text-sm text-blue-100">ציון כללי</div>
                </div>
                <div className={`px-4 py-2 rounded-lg border-2 font-bold ${getSeoStatusColor(seoData.overallStatus)}`}>
                  {seoData.overallStatus === 'PASS' ? '✅ עובר' : seoData.overallStatus === 'WARN' ? '⚠️ אזהרה' : '❌ נכשל'}
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold text-red-200">{seoData.blockingIssuesCount || 0}</div>
                  <div className="text-xs">בעיות חוסמות</div>
                </div>
              </div>
            )}
          </div>

          {/* SEO Reports Grid */}
          {seoData?.reports && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Technical SEO Report */}
              {seoData.reports.technical_seo && (
                <div 
                  className={`bg-white rounded-xl border-2 p-5 cursor-pointer hover:shadow-lg transition-all ${selectedSeoReport === 'technical_seo' ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedSeoReport(selectedSeoReport === 'technical_seo' ? null : 'technical_seo')}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Technical SEO
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeoStatusColor(seoData.reports.technical_seo.status)}`}>
                      {seoData.reports.technical_seo.status}
                    </span>
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: getSeoScoreColor(seoData.reports.technical_seo.score) }}>
                    {seoData.reports.technical_seo.score}%
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>🔴 {seoData.reports.technical_seo.summary.critical_issues} קריטי</div>
                    <div>🟡 {seoData.reports.technical_seo.summary.warning_issues} אזהרות</div>
                    <div>📄 {seoData.reports.technical_seo.summary.total_pages_scanned} עמודים נסרקו</div>
                  </div>
                </div>
              )}

              {/* Content Coverage Report */}
              {seoData.reports.content_coverage && (
                <div 
                  className={`bg-white rounded-xl border-2 p-5 cursor-pointer hover:shadow-lg transition-all ${selectedSeoReport === 'content_coverage' ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedSeoReport(selectedSeoReport === 'content_coverage' ? null : 'content_coverage')}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Content & Coverage
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeoStatusColor(seoData.reports.content_coverage.status)}`}>
                      {seoData.reports.content_coverage.status}
                    </span>
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: getSeoScoreColor(seoData.reports.content_coverage.score) }}>
                    {seoData.reports.content_coverage.score}%
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>📝 {seoData.reports.content_coverage.summary.thin_content_pages} תוכן דל</div>
                    <div>🔗 {seoData.reports.content_coverage.summary.orphan_pages} עמודים יתומים</div>
                    <div>📊 ממוצע {seoData.reports.content_coverage.summary.avg_word_count} מילים</div>
                  </div>
                </div>
              )}

              {/* Core Web Vitals Report */}
              {seoData.reports.web_vitals && (
                <div 
                  className={`bg-white rounded-xl border-2 p-5 cursor-pointer hover:shadow-lg transition-all ${selectedSeoReport === 'web_vitals' ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedSeoReport(selectedSeoReport === 'web_vitals' ? null : 'web_vitals')}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Core Web Vitals
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeoStatusColor(seoData.reports.web_vitals.status)}`}>
                      {seoData.reports.web_vitals.status}
                    </span>
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: getSeoScoreColor(seoData.reports.web_vitals.score) }}>
                    {seoData.reports.web_vitals.score}%
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>⚡ LCP: {seoData.reports.web_vitals.summary.lcp_pass_rate}% עוברים</div>
                    <div>📐 CLS: {seoData.reports.web_vitals.summary.cls_pass_rate}% עוברים</div>
                    <div>🔧 {seoData.reports.web_vitals.summary.pages_need_attention} עמודים לטיפול</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Blocking Issues Alert */}
          {seoData?.blockingIssues?.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
              <h3 className="font-bold text-lg text-red-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                מה חוסם קידום אורגני עכשיו ({seoData.blockingIssues.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {seoData.blockingIssues.slice(0, 10).map((issue, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 border border-red-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-medium text-red-900">{issue.issue || issue.error_type}</div>
                        <div className="text-sm text-gray-600 mt-1">{issue.page_url}</div>
                        {issue.recommended_fix && (
                          <div className="text-xs text-blue-700 mt-2 bg-blue-50 px-2 py-1 rounded">
                            💡 {issue.recommended_fix}
                          </div>
                        )}
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-medium">
                        {issue.report}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Report Details */}
          {selectedSeoReport && seoData?.reports?.[selectedSeoReport] && (
            <div className="bg-white rounded-xl border-2 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl">{seoData.reports[selectedSeoReport].title}</h3>
                <button onClick={() => setSelectedSeoReport(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b">
                <select
                  value={seoFilter.severity}
                  onChange={(e) => setSeoFilter(f => ({ ...f, severity: e.target.value }))}
                  className="px-3 py-1.5 border rounded-lg text-sm"
                >
                  <option value="all">כל החומרות</option>
                  <option value="critical">🔴 קריטי</option>
                  <option value="warning">🟡 אזהרה</option>
                </select>
                <span className="text-sm text-gray-500 self-center">
                  {filterSeoIssues(seoData.reports[selectedSeoReport].issues).length} בעיות מוצגות
                </span>
              </div>

              {/* Recommendations */}
              {seoData.reports[selectedSeoReport].recommendations?.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-2">💡 המלצות</h4>
                  <ul className="space-y-1">
                    {seoData.reports[selectedSeoReport].recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                        <span>•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Issues List */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filterSeoIssues(seoData.reports[selectedSeoReport].issues).map((issue, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border-2 ${issue.severity === 'critical' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${issue.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {issue.severity === 'critical' ? '🔴 קריטי' : '🟡 אזהרה'}
                          </span>
                          <span className="text-xs text-gray-500">{issue.error_type || issue.issue_type || issue.metric_name}</span>
                        </div>
                        <div className="font-medium text-gray-900">{issue.issue || `${issue.metric_name}: ${issue.measured_value}`}</div>
                        <div className="text-sm text-gray-600 mt-1">📍 {issue.page_url}</div>
                        {issue.recommended_fix && (
                          <div className="text-xs text-blue-700 mt-2 bg-blue-50 px-2 py-1 rounded">
                            🔧 {issue.recommended_fix}
                          </div>
                        )}
                        {issue.recommended_action && (
                          <div className="text-xs text-blue-700 mt-2 bg-blue-50 px-2 py-1 rounded">
                            🔧 {issue.recommended_action}
                          </div>
                        )}
                        {issue.technical_fix_hint && (
                          <div className="text-xs text-blue-700 mt-2 bg-blue-50 px-2 py-1 rounded">
                            🔧 {issue.technical_fix_hint}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Data State */}
          {!seoData && !seoLoading && (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-700 mb-2">אין נתוני SEO</h3>
              <p className="text-gray-500 mb-4">הפעל סריקת SEO כדי לקבל אבחון מקיף של הבעיות</p>
              <button
                onClick={runSeoAudit}
                className="px-6 py-2.5 text-white rounded-lg font-medium"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                הפעל סריקת SEO
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB: Errors & Recommendations */}
      {activeTab === 'errors' && (
        <div className="space-y-6">
          {/* Header with Stats */}
          <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">⚠️ לוג שגיאות מערכת</h2>
                <p className="text-red-100">צפה בשגיאות, אזהרות והמלצות לשיפור</p>
              </div>
              <button
                onClick={loadErrorLogs}
                disabled={errorsLoading}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 disabled:opacity-50"
              >
                {errorsLoading ? '⏳ טוען...' : '🔄 רענן'}
              </button>
            </div>
            {errorStats && (
              <div className="flex gap-4 mt-4">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{errorStats.total}</div>
                  <div className="text-xs">סה״כ</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold text-red-200">{errorStats.errors}</div>
                  <div className="text-xs">שגיאות</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold text-yellow-200">{errorStats.warnings}</div>
                  <div className="text-xs">אזהרות</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold text-orange-200">{errorStats.unresolved}</div>
                  <div className="text-xs">לא נפתרו</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{errorStats.today}</div>
                  <div className="text-xs">היום</div>
                </div>
              </div>
            )}
          </div>

          {/* Recommendations Section */}
          {issuesLog && issuesLog.summary?.totalIssues > 0 && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold text-lg mb-4">💡 המלצות לשיפור מהסריקה האחרונה</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(issuesLog.categories || {}).map(([key, category]) => {
                  if (category.items.length === 0) return null;
                  return (
                    <div key={key} className={`p-4 rounded-lg border-2 ${
                      category.severity === 'error' ? 'border-red-300 bg-red-50' :
                      category.severity === 'warning' ? 'border-yellow-300 bg-yellow-50' :
                      'border-blue-300 bg-blue-50'
                    }`}>
                      <div className="font-bold mb-2">{category.title}</div>
                      <div className="text-sm text-gray-600">{category.items.length} פריטים</div>
                      <ul className="mt-2 space-y-1">
                        {category.items.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                            <span>{item.severity === 'error' ? '🔴' : item.severity === 'warning' ? '🟡' : '🔵'}</span>
                            <span className="line-clamp-1">{item.message}</span>
                          </li>
                        ))}
                        {category.items.length > 3 && (
                          <li className="text-xs text-gray-500">+{category.items.length - 3} נוספים...</li>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error Logs List */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-bold text-lg mb-4">📋 לוג שגיאות ({errorLogs.length})</h3>
            {errorsLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 rounded-full animate-spin mx-auto mb-2" style={{ border: '3px solid #ddd', borderTopColor: '#dc2626' }}></div>
                <p className="text-gray-500 text-sm">טוען שגיאות...</p>
              </div>
            ) : errorLogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">✅</div>
                <p className="text-gray-500 text-lg">אין שגיאות מערכת!</p>
                <p className="text-gray-400 text-sm">המערכת פועלת תקין</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {errorLogs.map((log) => (
                  <div key={log._id} className={`p-4 rounded-lg border-2 ${
                    log.resolved ? 'border-gray-200 bg-gray-50 opacity-60' :
                    log.level === 'error' ? 'border-red-300 bg-red-50' :
                    log.level === 'warn' ? 'border-yellow-300 bg-yellow-50' :
                    'border-blue-300 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            log.level === 'error' ? 'bg-red-100 text-red-700' :
                            log.level === 'warn' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {log.level === 'error' ? '🔴 שגיאה' : log.level === 'warn' ? '🟡 אזהרה' : '🔵 מידע'}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{log.source}</span>
                          {log.resolved && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">✓ נפתר</span>
                          )}
                        </div>
                        <p className="font-medium text-gray-900">{log.message}</p>
                        {log.url && (
                          <p className="text-xs text-gray-500 mt-1">📍 {log.url}</p>
                        )}
                        {log.stack && (
                          <details className="mt-2">
                            <summary className="text-xs text-blue-600 cursor-pointer hover:underline">Stack Trace</summary>
                            <pre className="mt-1 p-2 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto max-h-32" dir="ltr">
                              {log.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                      <div className="text-left flex flex-col items-end gap-2">
                        <span className="text-xs text-gray-500">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString('he-IL') : '-'}
                        </span>
                        {!log.resolved ? (
                          <button
                            onClick={() => markErrorResolved(log._id, true)}
                            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            ✓ סמן כנפתר
                          </button>
                        ) : (
                          <button
                            onClick={() => markErrorResolved(log._id, false)}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                          >
                            ↩ פתח מחדש
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          <p className="text-gray-600 text-sm mb-4">הורד דוחות בפורמטים: CSV, PDF, JSON, HTML, Markdown</p>
          {reports.length === 0 ? (
            <p className="text-gray-500 text-center py-10">אין דוחות להורדה</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr><th className="text-right p-3">דוח</th><th className="text-right p-3">סוג</th><th className="text-right p-3">תאריך</th><th className="text-right p-3">הורדות</th></tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span>{TYPE_LABELS[r.type]?.icon}</span>
                        <span className="font-medium">{r.title}</span>
                        {r.isEnterprise && <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] rounded">Enterprise</span>}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${TYPE_LABELS[r.type]?.color || 'bg-gray-100'}`}>
                        {TYPE_LABELS[r.type]?.label || r.type}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">{formatDate(r.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {EXPORTABLE_CATEGORIES.includes(r.category) && (
                          <>
                            <button onClick={() => exportReport(r.id, 'csv')} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs hover:bg-emerald-200 font-medium">CSV</button>
                            <button onClick={() => exportReport(r.id, 'pdf')} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 font-medium">PDF</button>
                          </>
                        )}
                        <button onClick={() => downloadReport(r, 'md')} className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">MD</button>
                        <button onClick={() => downloadReport(r, 'html')} className="px-2 py-1 bg-blue-100 rounded text-xs hover:bg-blue-200">HTML</button>
                        <button onClick={() => downloadReport(r, 'json')} className="px-2 py-1 bg-green-100 rounded text-xs hover:bg-green-200">JSON</button>
                      </div>
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
