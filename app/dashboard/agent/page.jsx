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
  const [error, setError] = useState('');
  const [monthlyStats, setMonthlyStats] = useState({
    totalSales: 0,
    totalCommission: 0,
    count: 0,
  });
  const [coupon, setCoupon] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');

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

  // Fetch agent's sales data and coupon details
  useEffect(() => {
    if (!user) return;

    async function fetchAgentSales() {
      setLoading(true);
      try {
        // Fetch agent's sales
        const res = await fetch('/api/sales?self=true', {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch sales data');
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }

        setSales(data);

        // Calculate monthly stats
        const { fromISO, toISO } = getCurrentMonthRange();

        // Filter sales for current month
        const currentMonthSales = data.filter((sale) => {
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

        const couponRes = await fetch('/api/agent/coupon');
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

    fetchAgentSales();
  }, [user]);

  function copyCouponCode() {
    if (!coupon?.code) return;
    navigator.clipboard.writeText(coupon.code.toUpperCase());
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus(''), 2000);
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
