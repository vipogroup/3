'use client';

import { useEffect, useState, useCallback } from 'react';

const STATUS_LABELS = {
  pending: { label: 'ממתין לשחרור', color: 'bg-yellow-100 text-yellow-800' },
  available: { label: 'זמין למשיכה', color: 'bg-green-100 text-green-800' },
  claimed: { label: 'נמשך', color: 'bg-blue-100 text-blue-800' },
  cancelled: { label: 'בוטל', color: 'bg-red-100 text-red-800' },
};

export default function CommissionsClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('agents'); // 'agents' | 'orders'
  const [filters, setFilters] = useState({
    agentId: '',
    status: '',
    from: '',
    to: '',
  });
  const [selectedAgent, setSelectedAgent] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (filters.agentId) params.append('agentId', filters.agentId);
    if (filters.status) params.append('status', filters.status);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);

    try {
      const res = await fetch(`/api/admin/commissions?${params}`, { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-white p-3 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">טוען נתוני עמלות...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white p-3 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            נסה שוב
          </button>
        </div>
      </main>
    );
  }

  const { summary, agentsSummary, commissions, agents } = data || {};

  return (
    <main className="min-h-screen bg-white p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ניהול עמלות סוכנים
          </h1>
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-lg text-white font-medium transition-all"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            רענן נתונים
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            className="rounded-xl p-4 sm:p-5 shadow-md"
            style={{
              border: '2px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <p className="text-xs sm:text-sm text-gray-500 mb-1">ממתין לשחרור</p>
            <p className="text-lg sm:text-2xl font-bold" style={{ color: '#eab308' }}>
              ₪{(summary?.totalPending || 0).toLocaleString()}
            </p>
          </div>
          <div
            className="rounded-xl p-4 sm:p-5 shadow-md"
            style={{
              border: '2px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <p className="text-xs sm:text-sm text-gray-500 mb-1">זמין למשיכה</p>
            <p className="text-lg sm:text-2xl font-bold" style={{ color: '#16a34a' }}>
              ₪{(summary?.totalAvailable || 0).toLocaleString()}
            </p>
          </div>
          <div
            className="rounded-xl p-4 sm:p-5 shadow-md"
            style={{
              border: '2px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <p className="text-xs sm:text-sm text-gray-500 mb-1">נמשך</p>
            <p className="text-lg sm:text-2xl font-bold" style={{ color: '#1e3a8a' }}>
              ₪{(summary?.totalClaimed || 0).toLocaleString()}
            </p>
          </div>
          <div
            className="rounded-xl p-4 sm:p-5 shadow-md"
            style={{
              border: '2px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <p className="text-xs sm:text-sm text-gray-500 mb-1">סה״כ עמלות</p>
            <p className="text-lg sm:text-2xl font-bold" style={{ color: '#0891b2' }}>
              ₪{(summary?.totalAmount || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
          <h3 className="font-bold mb-4" style={{ color: '#1e3a8a' }}>פילטרים</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">סוכן</label>
              <select
                value={filters.agentId}
                onChange={(e) => setFilters({ ...filters, agentId: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option value="">כל הסוכנים</option>
                {agents?.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.fullName} ({agent.couponCode || 'ללא קופון'})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">סטטוס עמלה</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option value="">הכל</option>
                <option value="pending">ממתין לשחרור</option>
                <option value="available">זמין למשיכה</option>
                <option value="claimed">נמשך</option>
                <option value="cancelled">בוטל</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">מתאריך</label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">עד תאריך</label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === 'agents'
                ? 'border-b-2 -mb-[2px]'
                : 'text-gray-500'
            }`}
            style={activeTab === 'agents' ? { borderColor: '#0891b2', color: '#1e3a8a' } : {}}
          >
            סיכום לפי סוכן ({agentsSummary?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === 'orders'
                ? 'border-b-2 -mb-[2px]'
                : 'text-gray-500'
            }`}
            style={activeTab === 'orders' ? { borderColor: '#0891b2', color: '#1e3a8a' } : {}}
          >
            כל העמלות ({commissions?.length || 0})
          </button>
        </div>

        {/* Agents Summary Tab */}
        {activeTab === 'agents' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead style={{ borderBottom: '2px solid #0891b2' }}>
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#1e3a8a' }}>סוכן</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#1e3a8a' }}>קופון</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>הזמנות</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>ממתין</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>זמין למשיכה</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>יתרה נוכחית</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>סה״כ הרוויח</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {agentsSummary?.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        אין נתונים להצגה
                      </td>
                    </tr>
                  ) : (
                    agentsSummary?.map((agent) => (
                      <tr
                        key={agent.agentId}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium">{agent.fullName}</div>
                          <div className="text-xs text-gray-500">{agent.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <code className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                            {agent.couponCode?.toUpperCase() || '-'}
                          </code>
                        </td>
                        <td className="px-4 py-3 text-center font-medium">{agent.ordersCount}</td>
                        <td className="px-4 py-3 text-center" style={{ color: '#eab308' }}>
                          ₪{agent.pendingAmount?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-3 text-center" style={{ color: '#16a34a' }}>
                          ₪{agent.availableAmount?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-3 text-center font-bold" style={{ color: '#1e3a8a' }}>
                          ₪{agent.currentBalance?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-3 text-center font-bold" style={{ color: '#0891b2' }}>
                          ₪{agent.totalEarned?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => {
                              setFilters({ ...filters, agentId: agent.agentId });
                              setActiveTab('orders');
                            }}
                            className="px-3 py-1 text-sm rounded-lg text-white"
                            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                          >
                            צפה בעמלות
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-4">
              {agentsSummary?.length === 0 ? (
                <p className="text-center text-gray-500 py-8">אין נתונים להצגה</p>
              ) : (
                agentsSummary?.map((agent) => (
                  <div key={agent.agentId} className="p-4 rounded-xl border-2 border-gray-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{agent.fullName}</p>
                        <p className="text-xs text-gray-500">{agent.phone}</p>
                      </div>
                      <code className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                        {agent.couponCode?.toUpperCase() || '-'}
                      </code>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">הזמנות:</span>
                        <span className="mr-1 font-medium">{agent.ordersCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">ממתין:</span>
                        <span className="mr-1" style={{ color: '#eab308' }}>₪{agent.pendingAmount?.toLocaleString() || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">זמין:</span>
                        <span className="mr-1" style={{ color: '#16a34a' }}>₪{agent.availableAmount?.toLocaleString() || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">יתרה:</span>
                        <span className="mr-1 font-bold" style={{ color: '#1e3a8a' }}>₪{agent.currentBalance?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                      <div>
                        <span className="text-gray-500 text-sm">סה״כ הרוויח:</span>
                        <span className="mr-1 font-bold" style={{ color: '#0891b2' }}>₪{agent.totalEarned?.toLocaleString() || 0}</span>
                      </div>
                      <button
                        onClick={() => {
                          setFilters({ ...filters, agentId: agent.agentId });
                          setActiveTab('orders');
                        }}
                        className="px-3 py-1 text-sm rounded-lg text-white"
                        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                      >
                        צפה בעמלות
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead style={{ borderBottom: '2px solid #0891b2' }}>
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#1e3a8a' }}>תאריך</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#1e3a8a' }}>סוכן</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#1e3a8a' }}>לקוח</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>סכום הזמנה</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>עמלה</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>סטטוס</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#1e3a8a' }}>תאריך שחרור</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions?.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        אין עמלות להצגה
                      </td>
                    </tr>
                  ) : (
                    commissions?.map((c) => {
                      const statusInfo = STATUS_LABELS[c.commissionStatus] || STATUS_LABELS.pending;
                      return (
                        <tr key={c.orderId} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                          <td className="px-4 py-3 text-sm">{formatDateTime(c.orderDate)}</td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium">{c.agent?.fullName || 'לא ידוע'}</div>
                            <code className="text-xs bg-purple-50 text-purple-600 px-1 rounded">
                              {c.agent?.couponCode?.toUpperCase() || '-'}
                            </code>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm">{c.customerName}</div>
                            <div className="text-xs text-gray-500">{c.customerPhone}</div>
                          </td>
                          <td className="px-4 py-3 text-center">₪{c.orderTotal?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-center font-bold" style={{ color: '#16a34a' }}>
                            ₪{c.commissionAmount?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">
                            {formatDate(c.commissionAvailableAt)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-4">
              {commissions?.length === 0 ? (
                <p className="text-center text-gray-500 py-8">אין עמלות להצגה</p>
              ) : (
                commissions?.map((c) => {
                  const statusInfo = STATUS_LABELS[c.commissionStatus] || STATUS_LABELS.pending;
                  return (
                    <div key={c.orderId} className="p-4 rounded-xl border-2 border-gray-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500">{formatDateTime(c.orderDate)}</p>
                          <p className="font-medium">{c.agent?.fullName || 'לא ידוע'}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">לקוח:</span>
                        <span className="mr-1">{c.customerName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-gray-100">
                        <div>
                          <span className="text-gray-500">סכום הזמנה:</span>
                          <span className="mr-1">₪{c.orderTotal?.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">עמלה:</span>
                          <span className="mr-1 font-bold" style={{ color: '#16a34a' }}>
                            ₪{c.commissionAmount?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {c.commissionAvailableAt && (
                        <div className="text-xs text-gray-500">
                          תאריך שחרור: {formatDate(c.commissionAvailableAt)}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
