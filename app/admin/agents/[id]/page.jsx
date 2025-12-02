'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params?.id;

  const [agent, setAgent] = useState(null);
  const [stats, setStats] = useState(null);
  const [visits, setVisits] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAgentData = useCallback(async () => {
    if (!agentId) return;
    try {
      setLoading(true);
      setError('');

      // Fetch agent details
      const agentRes = await fetch(`/api/agents/${agentId}`);
      if (!agentRes.ok) throw new Error('Failed to fetch agent');
      const agentData = await agentRes.json();
      setAgent(agentData.agent);

      // Fetch agent statistics
      const statsRes = await fetch(`/api/agents/${agentId}/stats`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
        setVisits(statsData.visits || []);
        setReferrals(statsData.referrals || []);
        setSales(statsData.sales || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    if (agentId) {
      fetchAgentData();
    }
  }, [agentId, fetchAgentData]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען נתוני סוכן...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="font-bold">שגיאה</h3>
          <p>{error || 'לא נמצא סוכן'}</p>
          <button
            onClick={() => router.push('/admin/agents')}
            className="mt-4 text-blue-600 hover:underline"
          >
            ← חזור לרשימת סוכנים
          </button>
        </div>
      </div>
    );
  }

  const conversionRate =
    stats?.totalVisits > 0 ? ((stats?.totalSales / stats?.totalVisits) * 100).toFixed(1) : 0;

  const couponCode = agent?.couponCode?.toUpperCase() || '---';
  const discountPercent = agent?.discountPercent ?? 0;
  const commissionPercent = agent?.commissionPercent ?? 0;
  const couponStatus = agent?.couponStatus === 'inactive' ? 'לא פעיל' : 'פעיל';
  const couponStatusClass =
    agent?.couponStatus === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/agents')}
          className="text-blue-600 hover:underline mb-2 flex items-center gap-2"
        >
          ← חזור לרשימת סוכנים
        </button>
        <h1 className="text-3xl font-bold">סטטיסטיקות סוכן: {agent.fullName}</h1>
        <p className="text-gray-600">
          {agent.email} • {agent.phone}
        </p>
      </div>

      {/* Coupon Details */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-purple-900 mb-3">🎟️ קוד הקופון של הסוכן</h3>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <code className="text-2xl font-bold text-purple-700 bg-white px-4 py-2 rounded-lg border border-purple-100">
              {couponCode}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(couponCode)}
              disabled={couponCode === '---'}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              📋 העתק קוד
            </button>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-white px-3 py-1 rounded-full border border-purple-100">
              הנחה ללקוח: <strong>{discountPercent}%</strong>
            </span>
            <span className="bg-white px-3 py-1 rounded-full border border-purple-100">
              עמלה לסוכן: <strong>{commissionPercent}%</strong>
            </span>
            <span
              className={`px-3 py-1 rounded-full border border-purple-100 ${couponStatusClass}`}
            >
              סטטוס קופון: <strong>{couponStatus}</strong>
            </span>
          </div>
        </div>
        <p className="text-sm text-purple-800 mt-3">
          הזמנות שנוצרו עם הקוד הזה משויכות אוטומטית לסוכן במערכת.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{'סה&quot;כ כניסות'}</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.totalVisits || 0}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{'סה&quot;כ הפניות'}</p>
              <p className="text-3xl font-bold text-green-600">{stats?.totalReferrals || 0}</p>
            </div>
            <div className="text-4xl">🤝</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{'סה&quot;כ מכירות'}</p>
              <p className="text-3xl font-bold text-purple-600">{stats?.totalSales || 0}</p>
            </div>
            <div className="text-4xl">🛒</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">שיעור המרה</p>
              <p className="text-3xl font-bold text-orange-600">{conversionRate}%</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex gap-4 px-6">
            <button className="py-4 px-2 border-b-2 border-blue-600 font-medium text-blue-600">
              📊 כניסות למוצרים
            </button>
            <button className="py-4 px-2 text-gray-600 hover:text-gray-900">
              👥 משתמשים מופנים
            </button>
            <button className="py-4 px-2 text-gray-600 hover:text-gray-900">🛒 מכירות</button>
          </div>
        </div>

        {/* Product Visits Table */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">כניסות למוצרים דרך הלינק הייחודי</h3>

          {visits.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-2">📭</p>
              <p>עדיין אין כניסות למוצרים דרך הלינק של הסוכן</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">תאריך</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">מוצר</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">IP</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                    User Agent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visits.map((visit, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {new Date(visit.ts).toLocaleString('he-IL')}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {visit.productName || visit.productId || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{visit.ip || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">
                      {visit.ua ? visit.ua.substring(0, 50) + '...' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Product Purchase Summary */}
        {stats?.productStats && stats.productStats.length > 0 && (
          <div className="p-6 border-t">
            <h3 className="text-xl font-bold mb-4">סיכום רכישות לפי מוצר</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.productStats.map((product, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{product.productName}</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      👥 כניסות: <span className="font-bold">{product.visits}</span>
                    </p>
                    <p>
                      🛒 רכישות: <span className="font-bold">{product.purchases}</span>
                    </p>
                    <p>
                      {'💰 סה&quot;כ:'} <span className="font-bold">₪{product.totalRevenue}</span>
                    </p>
                    <p>
                      📈 המרה:{' '}
                      <span className="font-bold">
                        {product.visits > 0
                          ? ((product.purchases / product.visits) * 100).toFixed(1)
                          : 0}
                        %
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Referrals List */}
      {referrals.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-xl font-bold mb-4">👥 משתמשים שהופנו על ידי הסוכן</h3>
          <div className="space-y-2">
            {referrals.map((ref) => (
              <div
                key={ref._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{ref.fullName}</p>
                  <p className="text-sm text-gray-600">{ref.email}</p>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(ref.createdAt).toLocaleDateString('he-IL')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
