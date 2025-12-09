'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/app/components/layout/MainLayout';
import KpiCard from '../components/KpiCard';
import AgentChart from './components/AgentChart';
import RecentSalesTable from './components/RecentSalesTable';
import { getCurrentMonthRange, formatCurrencyILS } from '@/app/utils/date';

export const dynamic = 'force-dynamic';

export default function AgentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [agentStats, setAgentStats] = useState(null);
  const [error, setError] = useState('');
  const [monthlyStats, setMonthlyStats] = useState({
    totalSales: 0,
    totalCommission: 0,
    count: 0,
  });
  const [coupon, setCoupon] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [refLinkCopyStatus, setRefLinkCopyStatus] = useState('');

  // Check if user is agent and redirect if not
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!res.ok) {
          router.push('/dashboard');
          return;
        }

        const data = await res.json();
        if (!data.user || data.user.role !== 'agent') {
          router.push('/dashboard');
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/dashboard');
      }
    }

    checkAuth();
  }, [router]);

  const normalizeOrderToSale = (order) => {
    if (!order) return null;
    const primaryItem = Array.isArray(order.items) && order.items.length > 0 ? order.items[0] : null;

    return {
      _id: order._id,
      createdAt: order.createdAt || order.updatedAt,
      salePrice: order.totalAmount ?? order?.totals?.totalAmount ?? 0,
      commission: order.commissionAmount ?? 0,
      status: order.status || 'pending',
      customerName: order.customerName || order.customer?.name || 'לקוח',
      customerPhone: order.customerPhone || order.customer?.phone || '',
      customerEmail: order.customerEmail || order.customer?.email || '',
      productId: primaryItem
        ? {
            name: primaryItem.name || primaryItem.sku || 'מוצר',
            price: primaryItem.unitPrice || primaryItem.totalPrice || null,
          }
        : null,
    };
  };

  // Fetch agent stats, order data, and coupon details
  useEffect(() => {
    if (!user) return;

    async function fetchDashboardData() {
      setLoading(true);
      try {
        const [statsRes, ordersRes, couponRes] = await Promise.all([
          fetch('/api/agent/stats', { cache: 'no-store' }),
          fetch('/api/orders?limit=200', { cache: 'no-store' }),
          fetch('/api/agent/coupon', { cache: 'no-store' }),
        ]);

        if (!statsRes.ok) {
          throw new Error('Failed to fetch agent stats');
        }

        const statsPayload = await statsRes.json();
        if (!statsPayload?.ok || !statsPayload?.stats) {
          throw new Error('Invalid stats response');
        }
        setAgentStats(statsPayload);

        if (!ordersRes.ok) {
          throw new Error('Failed to fetch orders data');
        }

        const ordersPayload = await ordersRes.json();
        const ordersItems = Array.isArray(ordersPayload?.items) ? ordersPayload.items : [];
        const normalizedSales = ordersItems
          .map(normalizeOrderToSale)
          .filter(Boolean)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setSales(normalizedSales);

        // Calculate monthly stats
        const { fromISO, toISO } = getCurrentMonthRange();

        // Filter sales for current month
        const currentMonthSales = normalizedSales.filter((sale) => {
          const saleDate = new Date(sale.createdAt).toISOString().split('T')[0];
          return saleDate >= fromISO && saleDate <= toISO;
        });

        // Calculate totals
        const totalSales = currentMonthSales.reduce((sum, sale) => sum + sale.salePrice, 0);
        const totalCommission = currentMonthSales.reduce((sum, sale) => sum + sale.commission, 0);
        const count = currentMonthSales.length;

        setMonthlyStats({
          totalSales,
          totalCommission,
          count,
        });

        if (couponRes.ok) {
          const couponData = await couponRes.json();
          setCoupon(couponData?.coupon || null);
        } else {
          setCoupon(null);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setError('טעינת הנתונים נכשלה, נסה שוב');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  function copyCouponCode() {
    if (!coupon?.code) return;
    navigator.clipboard.writeText(coupon.code.toUpperCase());
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus(''), 2000);
  }

  function copyReferralLink() {
    const link = agentStats?.referral?.link;
    if (!link) return;
    navigator.clipboard.writeText(link);
    setRefLinkCopyStatus('copied');
    setTimeout(() => setRefLinkCopyStatus(''), 2000);
  }

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">הביצועים שלי</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <>
          {/* Aggregated agent stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <KpiCard
              title="יתרת עמלות זמינה"
              value={formatCurrencyILS(agentStats?.stats?.commissionBalance || 0)}
              subtitle="מעודכן מכל הזמנה עם קוד הקופון שלך"
            />
            <KpiCard
              title="שווי הזמנות מצטבר"
              value={formatCurrencyILS(agentStats?.stats?.totalOrderValue || 0)}
              subtitle="סכום כל ההזמנות שיוחסו אליך"
            />
            <KpiCard
              title={'סה"כ הזמנות'}
              value={agentStats?.stats?.totalSales || 0}
              subtitle="כולל כל ההזמנות שהושלמו עם הקוד שלך"
            />
          </div>

          {/* Coupon */}
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">קוד הקופון שלך</h2>
                <p className="text-sm text-gray-600">
                  שתף את הקוד כדי להעניק ללקוחות {coupon?.discountPercent ?? 0}% הנחה ולקבל עמלה של{' '}
                  {coupon?.commissionPercent ?? 0}%.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <code className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-lg tracking-widest">
                  {(coupon?.code || '---').toUpperCase()}
                </code>
                <button
                  onClick={copyCouponCode}
                  disabled={!coupon?.code}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition"
                >
                  {copyStatus === 'copied' ? '✓ הועתק' : 'העתק קוד'}
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="font-semibold text-purple-600">הנחה ללקוח</p>
                <p>{coupon?.discountPercent ?? 0}%</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="font-semibold text-purple-600">עמלה עבורך</p>
                <p>{coupon?.commissionPercent ?? 0}%</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="font-semibold text-purple-600">סטטוס</p>
                <p>{coupon?.status === 'active' ? 'פעיל' : 'לא פעיל'}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">לינק לשיתוף</h3>
              <p className="text-sm text-gray-600 mb-3">
                שתף את הלינק כדי שמבקרים יזוהו כסוכנים שלך (נרשם בלוג הקליקים).
              </p>
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="flex-1">
                  <div className="bg-gray-50 border rounded-lg px-4 py-2 text-sm break-all">
                    {agentStats?.referral?.link || '-'}
                  </div>
                </div>
                <button
                  onClick={copyReferralLink}
                  disabled={!agentStats?.referral?.link}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition"
                >
                  {refLinkCopyStatus === 'copied' ? '✓ הועתק' : 'העתק לינק'}
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                מזהה הסוכן: {agentStats?.referral?.code?.toUpperCase() || '---'}
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <KpiCard title="מכירות החודש" value={formatCurrencyILS(monthlyStats.totalSales)} />
            <KpiCard title="עמלות החודש" value={formatCurrencyILS(monthlyStats.totalCommission)} />
            <KpiCard title="עסקאות החודש" value={monthlyStats.count} />
          </div>

          {/* Daily Sales Chart */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">מגמת מכירות</h2>
            <AgentChart data={sales} />
          </div>

          {/* Recent Sales Table */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">מכירות אחרונות</h2>
            <RecentSalesTable rows={sales} />
          </div>
        </>
      )}
    </MainLayout>
  );
}
