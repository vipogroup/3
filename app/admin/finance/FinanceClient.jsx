'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * Finance Dashboard - דשבורד כספים מקיף
 * 
 * כולל:
 * - סקירה כללית (KPIs)
 * - עסקאות PayPlus
 * - מסמכי Priority
 * - עמלות סוכנים
 * - בקשות משיכה
 * - חריגות
 * - התאמות (Reconciliation)
 */

const tabs = [
  { id: 'overview', label: 'סקירה כללית', icon: null },
  { id: 'transactions', label: 'עסקאות PayPlus', icon: null },
  { id: 'priority', label: 'מסמכי Priority', icon: null },
  { id: 'commissions', label: 'עמלות סוכנים', icon: null },
  { id: 'withdrawals', label: 'בקשות משיכה', icon: null },
  { id: 'alerts', label: 'חריגות', icon: null },
  { id: 'reconciliation', label: 'התאמות', icon: null },
  { id: 'reports', label: 'דוחות מתקדמים', icon: null },
  { id: 'settings', label: 'הגדרות', icon: null },
];

export default function FinanceClient() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    overview: null,
    transactions: [],
    priority: null,
    commissions: null,
    withdrawals: [],
    alerts: [],
    reconciliation: null,
    reports: null,
    settings: null,
  });

  useEffect(() => {
    loadData(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function loadData(tab) {
    setLoading(true);
    try {
      switch (tab) {
        case 'overview':
          await loadOverview();
          break;
        case 'transactions':
          await loadTransactions();
          break;
        case 'priority':
          await loadPriorityStatus();
          break;
        case 'commissions':
          await loadCommissions();
          break;
        case 'withdrawals':
          await loadWithdrawals();
          break;
        case 'alerts':
          await loadAlerts();
          break;
        case 'reconciliation':
          await loadReconciliation();
          break;
        case 'reports':
          await loadReports();
          break;
        case 'settings':
          await loadSettings();
          break;
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadOverview() {
    const [transRes, commRes, withdrawRes] = await Promise.all([
      fetch('/api/admin/payplus/transactions?limit=5').then(r => r.json()),
      fetch('/api/admin/commissions').then(r => r.json()),
      fetch('/api/admin/withdrawals').then(r => r.json()),
    ]);

    setData(prev => ({
      ...prev,
      overview: {
        transactions: transRes.stats || {},
        commissions: commRes.summary || {},
        withdrawals: withdrawRes.summary || {},
        recentTransactions: transRes.events?.slice(0, 5) || [],
      },
    }));
  }

  async function loadTransactions() {
    const res = await fetch('/api/admin/payplus/transactions?limit=50');
    const json = await res.json();
    setData(prev => ({ ...prev, transactions: json.events || [], transactionStats: json.stats }));
  }

  async function loadPriorityStatus() {
    const res = await fetch('/api/admin/priority/status');
    const json = await res.json();
    setData(prev => ({ ...prev, priority: json }));
  }

  async function loadCommissions() {
    const res = await fetch('/api/admin/commissions');
    const json = await res.json();
    setData(prev => ({ ...prev, commissions: json }));
  }

  async function loadWithdrawals() {
    const res = await fetch('/api/admin/withdrawals');
    const json = await res.json();
    setData(prev => ({ ...prev, withdrawals: json.requests || [] }));
  }

  async function loadAlerts() {
    const [dlqRes, failedRes] = await Promise.all([
      fetch('/api/admin/payplus/dead-letter').then(r => r.json()),
      fetch('/api/admin/priority/status').then(r => r.json()),
    ]);

    setData(prev => ({
      ...prev,
      alerts: {
        deadLetter: dlqRes.events || [],
        priorityErrors: failedRes.recentErrors || [],
      },
    }));
  }

  async function loadReconciliation() {
    const res = await fetch('/api/admin/payplus/reconciliation');
    const json = await res.json();
    setData(prev => ({ ...prev, reconciliation: json }));
  }

  async function loadReports() {
    const [commRes, transRes, priorityRes] = await Promise.all([
      fetch('/api/admin/commissions').then(r => r.json()),
      fetch('/api/admin/payplus/transactions?limit=100').then(r => r.json()),
      fetch('/api/admin/priority/reconciliation').then(r => r.json()),
    ]);

    setData(prev => ({
      ...prev,
      reports: {
        commissions: commRes,
        transactions: transRes,
        priority: priorityRes,
      },
    }));
  }

  async function loadSettings() {
    setData(prev => ({
      ...prev,
      settings: {
        payplus: {
          env: process.env.NEXT_PUBLIC_PAYPLUS_ENV || 'sandbox',
          configured: true,
        },
        priority: {
          env: process.env.NEXT_PUBLIC_PRIORITY_ENV || 'sandbox',
          configured: false,
        },
        commission: {
          holdDays: 14,
          autoRelease: true,
        },
      },
    }));
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <svg className="w-7 h-7" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          כספים ודוחות
        </h1>
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
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === tab.id
                ? 'text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            style={activeTab === tab.id ? {
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)'
            } : {}}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewTab data={data.overview} />}
            {activeTab === 'transactions' && <TransactionsTab data={data.transactions} stats={data.transactionStats} />}
            {activeTab === 'priority' && <PriorityTab data={data.priority} />}
            {activeTab === 'commissions' && <CommissionsTab data={data.commissions} />}
            {activeTab === 'withdrawals' && <WithdrawalsTab data={data.withdrawals} onRefresh={() => loadWithdrawals()} />}
            {activeTab === 'alerts' && <AlertsTab data={data.alerts} onRefresh={() => loadAlerts()} />}
            {activeTab === 'reconciliation' && <ReconciliationTab data={data.reconciliation} />}
            {activeTab === 'reports' && <ReportsTab data={data.reports} />}
            {activeTab === 'settings' && <SettingsTab data={data.settings} />}
          </>
        )}
      </div>
    </div>
  );
}

// ============ Tab Components ============

function OverviewTab({ data }) {
  if (!data) return <div>אין נתונים</div>;

  const kpis = [
    { label: 'סה\u0027כ הכנסות', value: `₪${(data.transactions?.success?.totalAmount || 0).toLocaleString()}`, color: 'green' },
    { label: 'עמלות ממתינות', value: `₪${(data.commissions?.totalPending || 0).toLocaleString()}`, color: 'yellow' },
    { label: 'עמלות זמינות', value: `₪${(data.commissions?.totalAvailable || 0).toLocaleString()}`, color: 'blue' },
    { label: 'משיכות בהמתנה', value: data.withdrawals?.pendingCount || 0, color: 'purple' },
  ];

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border">
            <div className="text-sm text-gray-500 mb-1">{kpi.label}</div>
            <div className="text-2xl font-bold">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <h3 className="text-lg font-semibold mb-3">עסקאות אחרונות</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-right">תאריך</th>
              <th className="p-3 text-right">סכום</th>
              <th className="p-3 text-right">סטטוס</th>
              <th className="p-3 text-right">סוג</th>
            </tr>
          </thead>
          <tbody>
            {data.recentTransactions?.map((tx, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-3">{new Date(tx.createdAt).toLocaleDateString('he-IL')}</td>
                <td className="p-3">₪{tx.amount?.toLocaleString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    tx.type === 'success' ? 'bg-green-100 text-green-800' :
                    tx.type === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className="p-3">{tx.paymentMethod || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransactionsTab({ data, stats }) {
  return (
    <div>
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(stats).map(([type, stat]) => (
            <div key={type} className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-500 capitalize">{type}</div>
              <div className="text-xl font-bold">{stat.count}</div>
              <div className="text-sm text-gray-400">₪{stat.totalAmount?.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-right">מזהה</th>
              <th className="p-3 text-right">תאריך</th>
              <th className="p-3 text-right">סכום</th>
              <th className="p-3 text-right">סוג</th>
              <th className="p-3 text-right">סטטוס</th>
              <th className="p-3 text-right">הזמנה</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((tx, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">{tx.eventId?.slice(0, 8)}...</td>
                <td className="p-3">{new Date(tx.createdAt).toLocaleDateString('he-IL')}</td>
                <td className="p-3">₪{tx.amount?.toLocaleString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    tx.type === 'success' ? 'bg-green-100 text-green-800' :
                    tx.type === 'refund' ? 'bg-yellow-100 text-yellow-800' :
                    tx.type === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className="p-3">{tx.status}</td>
                <td className="p-3 font-mono text-xs">{tx.orderId?._id?.slice(-6) || tx.orderId?.slice(-6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PriorityTab({ data }) {
  if (!data) return <div>אין נתונים</div>;

  return (
    <div>
      {/* Connection Status */}
      <div className={`mb-6 p-4 rounded-lg ${data.connected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${data.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="font-semibold">{data.connected ? 'מחובר' : 'לא מחובר'}</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">{data.connectionMessage}</div>
        <div className="text-sm text-gray-500 mt-1">סביבה: {data.environment} - חברה: {data.companyCode}</div>
      </div>

      {/* Sync Stats */}
      {data.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm text-green-600">מסונכרנים</div>
            <div className="text-2xl font-bold text-green-700">{data.stats.synced}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-sm text-yellow-600">ממתינים</div>
            <div className="text-2xl font-bold text-yellow-700">{data.stats.pending}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-sm text-red-600">נכשלו</div>
            <div className="text-2xl font-bold text-red-700">{data.stats.failed}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-blue-600">חלקי</div>
            <div className="text-2xl font-bold text-blue-700">{data.stats.partial}</div>
          </div>
        </div>
      )}

      {/* Recent Errors */}
      {data.recentErrors?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">שגיאות אחרונות</h3>
          <div className="space-y-2">
            {data.recentErrors.map((err, idx) => (
              <div key={idx} className="bg-red-50 rounded p-3 text-sm">
                <div className="font-mono">{err.orderId}</div>
                <div className="text-red-600">{err.lastError?.errorMessage || 'שגיאה לא ידועה'}</div>
                <div className="text-gray-500 text-xs">{new Date(err.lastAttempt).toLocaleString('he-IL')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CommissionsTab({ data }) {
  if (!data) return <div>אין נתונים</div>;

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-500">סה&quot;כ עמלות</div>
          <div className="text-2xl font-bold">₪{data.summary?.totalAmount?.toLocaleString()}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="text-sm text-yellow-600">ממתינות</div>
          <div className="text-2xl font-bold">₪{data.summary?.totalPending?.toLocaleString()}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-sm text-green-600">זמינות</div>
          <div className="text-2xl font-bold">₪{data.summary?.totalAvailable?.toLocaleString()}</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-sm text-blue-600">נתבעו</div>
          <div className="text-2xl font-bold">₪{data.summary?.totalClaimed?.toLocaleString()}</div>
        </div>
      </div>

      {/* Agents Summary */}
      <h3 className="text-lg font-semibold mb-3">סיכום לפי סוכן</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-right">סוכן</th>
              <th className="p-3 text-right">קופון</th>
              <th className="p-3 text-right">סכום הרוויח</th>
              <th className="p-3 text-right">יתרה נוכחית</th>
              <th className="p-3 text-right">הזמנות</th>
            </tr>
          </thead>
          <tbody>
            {data.agentsSummary?.map((agent, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3">{agent.fullName}</td>
                <td className="p-3 font-mono">{agent.couponCode || '-'}</td>
                <td className="p-3">₪{agent.totalEarned?.toLocaleString()}</td>
                <td className="p-3">₪{agent.currentBalance?.toLocaleString()}</td>
                <td className="p-3">{agent.ordersCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WithdrawalsTab({ data, onRefresh }) {
  const [processing, setProcessing] = useState(null);

  async function handleAction(id, action) {
    const actionLabels = {
      'approve': 'לאשר את הבקשה',
      'reject': 'לדחות את הבקשה',
      'complete': 'לסמן כהושלם',
      'pay_via_priority': 'ליצור מסמך תשלום ב-Priority'
    };
    
    if (!confirm(`האם ${actionLabels[action] || action}?`)) return;
    
    setProcessing(id);
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      const json = await res.json();
      
      if (res.ok) {
        if (json.priorityPaymentId) {
          alert(`מסמך תשלום נוצר בהצלחה!\nמספר מסמך: ${json.priorityPaymentId}`);
        }
        onRefresh();
      } else {
        alert(json.error || 'שגיאה בביצוע הפעולה');
      }
    } catch (err) {
      alert('שגיאת רשת');
    } finally {
      setProcessing(null);
    }
  }

  const STATUS_LABELS = {
    pending: { label: 'ממתין לאישור', color: 'bg-yellow-100 text-yellow-800' },
    approved: { label: 'מאושר - ממתין לתשלום', color: 'bg-blue-100 text-blue-800' },
    processing: { label: 'בתהליך תשלום', color: 'bg-cyan-100 text-cyan-800' },
    completed: { label: 'הושלם', color: 'bg-green-100 text-green-800' },
    rejected: { label: 'נדחה', color: 'bg-red-100 text-red-800' },
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-right">סוכן</th>
              <th className="p-3 text-right">סכום</th>
              <th className="p-3 text-right">סטטוס</th>
              <th className="p-3 text-right">Priority</th>
              <th className="p-3 text-right">תאריך</th>
              <th className="p-3 text-right">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((req, idx) => {
              const statusInfo = STATUS_LABELS[req.status] || { label: req.status, color: 'bg-gray-100 text-gray-800' };
              const isProcessing = processing === req._id;
              
              return (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">{req.user?.fullName || req.userId?.fullName || 'לא ידוע'}</div>
                    <div className="text-xs text-gray-500">{req.user?.phone || ''}</div>
                  </td>
                  <td className="p-3 font-bold">₪{req.amount?.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="p-3">
                    {req.priorityPaymentDocId ? (
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-mono">
                        {req.priorityPaymentDocId}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="p-3 text-sm">{new Date(req.createdAt).toLocaleDateString('he-IL')}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {/* Pending - approve/reject */}
                      {req.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleAction(req._id, 'approve')}
                            disabled={isProcessing}
                            className="px-2 py-1 text-white rounded text-xs disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                          >
                            {isProcessing ? '...' : 'אישור'}
                          </button>
                          <button 
                            onClick={() => handleAction(req._id, 'reject')}
                            disabled={isProcessing}
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:opacity-50"
                          >
                            דחייה
                          </button>
                        </>
                      )}
                      
                      {/* Approved - pay via Priority or complete manually */}
                      {req.status === 'approved' && (
                        <>
                          <button 
                            onClick={() => handleAction(req._id, 'pay_via_priority')}
                            disabled={isProcessing}
                            className="px-2 py-1 text-white rounded text-xs disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                            title="יצירת מסמך תשלום ב-Priority ERP"
                          >
                            {isProcessing ? '...' : 'Priority'}
                          </button>
                          <button 
                            onClick={() => handleAction(req._id, 'complete')}
                            disabled={isProcessing}
                            className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                            title="סימון כהושלם (העברה ידנית)"
                          >
                            הושלם ידנית
                          </button>
                        </>
                      )}
                      
                      {/* Processing - can complete after Priority payment */}
                      {req.status === 'processing' && (
                        <button 
                          onClick={() => handleAction(req._id, 'complete')}
                          disabled={isProcessing}
                          className="px-2 py-1 text-white rounded text-xs disabled:opacity-50"
                          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                        >
                          {isProcessing ? '...' : 'סיום'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AlertsTab({ data, onRefresh }) {
  if (!data) return <div>אין נתונים</div>;

  async function retryDeadLetter(eventId) {
    const res = await fetch('/api/admin/payplus/dead-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'retry', eventId }),
    });
    
    if (res.ok) {
      onRefresh();
    }
  }

  return (
    <div>
      {/* Dead Letter Queue */}
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <span>☠️</span>
        <span>Dead Letter Queue ({data.deadLetter?.length || 0})</span>
      </h3>
      
      {data.deadLetter?.length > 0 ? (
        <div className="space-y-2 mb-8">
          {data.deadLetter.map((event, idx) => (
            <div key={idx} className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-mono text-sm">{event.eventId}</div>
                  <div className="text-red-600">{event.deadLetterReason}</div>
                  <div className="text-gray-500 text-xs">{new Date(event.deadLetterAt).toLocaleString('he-IL')}</div>
                </div>
                <button
                  onClick={() => retryDeadLetter(event.eventId)}
                  className="px-3 py-1 text-white rounded text-sm"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                >
                  נסה שוב
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-green-50 rounded-lg p-4 mb-8 text-green-700">
          אין אירועים ב-Dead Letter Queue
        </div>
      )}

      {/* Priority Errors */}
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <span>שגיאות Priority ({data.priorityErrors?.length || 0})</span>
      </h3>
      
      {data.priorityErrors?.length > 0 ? (
        <div className="space-y-2">
          {data.priorityErrors.map((err, idx) => (
            <div key={idx} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="font-mono text-sm">{err.orderId}</div>
              <div className="text-yellow-700">{err.lastError?.errorMessage}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-green-50 rounded-lg p-4 text-green-700">
          אין שגיאות Priority
        </div>
      )}
    </div>
  );
}

function ReconciliationTab({ data }) {
  if (!data) return <div>אין נתונים</div>;

  return (
    <div>
      {/* Summary */}
      {data.summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500">סכום אירועים</div>
            <div className="text-2xl font-bold">{data.summary.totalEvents}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm text-green-600">תואמים</div>
            <div className="text-2xl font-bold">{data.summary.matched}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-sm text-red-600">אי-התאמות</div>
            <div className="text-2xl font-bold">{data.summary.mismatches}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-sm text-yellow-600">הזמנות חסרות</div>
            <div className="text-2xl font-bold">{data.summary.missingOrders}</div>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-right">הזמנה</th>
              <th className="p-3 text-right">סכום PayPlus</th>
              <th className="p-3 text-right">סכום הזמנה</th>
              <th className="p-3 text-right">הפרש</th>
              <th className="p-3 text-right">סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {data.items?.slice(0, 50).map((item, idx) => (
              <tr key={idx} className={`border-b ${item.status === 'mismatch' ? 'bg-red-50' : ''}`}>
                <td className="p-3 font-mono text-xs">{item.orderId?.slice(-8)}</td>
                <td className="p-3">₪{item.paymentAmount?.toLocaleString()}</td>
                <td className="p-3">₪{item.orderAmount?.toLocaleString() || '-'}</td>
                <td className="p-3">
                  {item.diff > 0 && <span className="text-red-600">₪{item.diff.toLocaleString()}</span>}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.status === 'matched' ? 'bg-green-100 text-green-800' :
                    item.status === 'mismatch' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsTab({ data }) {
  if (!data) return <div>אין נתונים</div>;

  const exportToCsv = (type) => {
    let csvContent = '';
    let filename = '';
    
    if (type === 'commissions') {
      filename = 'commissions-report.csv';
      csvContent = 'Agent,Total Earned,Current Balance,Orders\n';
      data.commissions?.agentsSummary?.forEach(agent => {
        csvContent += `${agent.fullName},${agent.totalEarned},${agent.currentBalance},${agent.ordersCount}\n`;
      });
    } else if (type === 'transactions') {
      filename = 'transactions-report.csv';
      csvContent = 'Date,Amount,Type,Status,Order ID\n';
      data.transactions?.events?.forEach(tx => {
        csvContent += `${tx.createdAt},${tx.amount},${tx.type},${tx.status},${tx.orderId}\n`;
      });
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">ייצוא דוחות</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h4 className="font-semibold mb-2">דוח עמלות</h4>
          <p className="text-sm text-gray-600 mb-3">סיכום עמלות לפי סוכן</p>
          <button
            onClick={() => exportToCsv('commissions')}
            className="w-full px-4 py-2 text-white rounded-lg text-sm"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            ייצא CSV
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h4 className="font-semibold mb-2">דוח עסקאות</h4>
          <p className="text-sm text-gray-600 mb-3">כל העסקאות מ-PayPlus</p>
          <button
            onClick={() => exportToCsv('transactions')}
            className="w-full px-4 py-2 text-white rounded-lg text-sm"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            ייצא CSV
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h4 className="font-semibold mb-2">דוח Priority</h4>
          <p className="text-sm text-gray-600 mb-3">התאמות מול Priority</p>
          <button
            onClick={() => window.open('/api/admin/priority/reconciliation?format=csv', '_blank')}
            className="w-full px-4 py-2 text-white rounded-lg text-sm"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            ייצא CSV
          </button>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">סיכום כללי</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600">עסקאות מוצלחות</div>
          <div className="text-2xl font-bold">{data.transactions?.stats?.success?.count || 0}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600">סך הכנסות</div>
          <div className="text-2xl font-bold">₪{(data.transactions?.stats?.success?.totalAmount || 0).toLocaleString()}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-sm text-yellow-600">עמלות ששולמו</div>
          <div className="text-2xl font-bold">₪{(data.commissions?.summary?.totalClaimed || 0).toLocaleString()}</div>
        </div>
        <div className="bg-cyan-50 rounded-lg p-4">
          <div className="text-sm text-cyan-600">אחוז סנכרון</div>
          <div className="text-2xl font-bold">{data.priority?.summary?.completionRate || 0}%</div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ data }) {
  if (!data) return <div>אין נתונים</div>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">הגדרות אינטגרציה</h3>
      
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              <span>PayPlus</span>
            </h4>
            <span className={`px-2 py-1 rounded text-xs ${
              data.payplus?.configured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {data.payplus?.configured ? 'מוגדר' : 'לא מוגדר'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <p>סביבה: <span className="font-mono">{data.payplus?.env}</span></p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center gap-2">
              <span>Priority ERP</span>
            </h4>
            <span className={`px-2 py-1 rounded text-xs ${
              data.priority?.configured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {data.priority?.configured ? 'מוגדר' : 'ממתין להגדרה'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <p>סביבה: <span className="font-mono">{data.priority?.env}</span></p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center gap-2">
              <span>הגדרות עמלות</span>
            </h4>
          </div>
          <div className="text-sm text-gray-600 space-y-2">
            <p>תקופת המתנה: <span className="font-semibold">{data.commission?.holdDays} ימים</span></p>
            <p>שחרור אוטומטי: <span className="font-semibold">{data.commission?.autoRelease ? 'כן' : 'לא'}</span></p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">משתני סביבה נדרשים</h4>
          <div className="text-sm text-blue-700 font-mono space-y-1">
            <p>PAYPLUS_API_KEY</p>
            <p>PAYPLUS_SECRET</p>
            <p>PAYPLUS_WEBHOOK_SECRET</p>
            <p>PRIORITY_BASE_URL</p>
            <p>PRIORITY_CLIENT_ID</p>
            <p>PRIORITY_CLIENT_SECRET</p>
            <p>PRIORITY_COMPANY_CODE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
