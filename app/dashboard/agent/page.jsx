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
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          הביצועים שלי
        </h1>
        <div
          className="h-1 w-24 rounded-full mt-2"
          style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)' }}
        />
      </div>

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
          {/* Stats Grid - Compact 2x2 on mobile */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border" style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}>
              <p className="text-xs text-gray-500">יתרת עמלות</p>
              <p className="text-xl font-bold" style={{ color: '#1e3a8a' }}>{formatCurrencyILS(agentStats?.stats?.commissionBalance || 0)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border" style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}>
              <p className="text-xs text-gray-500">שווי הזמנות</p>
              <p className="text-xl font-bold" style={{ color: '#1e3a8a' }}>{formatCurrencyILS(agentStats?.stats?.totalOrderValue || 0)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border" style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}>
              <p className="text-xs text-gray-500">סה״כ הזמנות</p>
              <p className="text-xl font-bold" style={{ color: '#1e3a8a' }}>{agentStats?.stats?.totalSales || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border" style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}>
              <p className="text-xs text-gray-500">עמלות החודש</p>
              <p className="text-xl font-bold" style={{ color: '#0891b2' }}>{formatCurrencyILS(monthlyStats.totalCommission)}</p>
            </div>
          </div>

          {/* Coupon & Link - Compact */}
          <div
            className="rounded-xl p-4 mb-4"
            style={{
              border: '2px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            {/* Coupon Code */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500">קוד קופון</p>
                <code className="text-lg font-bold tracking-wider" style={{ color: '#1e3a8a' }}>
                  {(coupon?.code || '---').toUpperCase()}
                </code>
              </div>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {coupon?.discountPercent ?? 0}% הנחה
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {coupon?.commissionPercent ?? 0}% עמלה
                </span>
              </div>
            </div>
            <button
              onClick={copyCouponCode}
              disabled={!coupon?.code}
              className="w-full py-2 text-white rounded-lg text-sm font-medium mb-3 disabled:bg-gray-400"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              {copyStatus === 'copied' ? '✓ הקוד הועתק' : 'העתק קוד'}
            </button>

            {/* Share Link */}
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500 mb-2">לינק לשיתוף (כולל קופון)</p>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs break-all text-gray-600 mb-2">
                {agentStats?.referral?.link || '-'}
              </div>
              <button
                onClick={copyReferralLink}
                disabled={!agentStats?.referral?.link}
                className="w-full py-2 text-white rounded-lg text-sm font-medium disabled:bg-gray-400"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                {refLinkCopyStatus === 'copied' ? '✓ הלינק הועתק' : 'העתק לינק'}
              </button>
            </div>
          </div>

          {/* Recent Sales - Compact List */}
          <div className="bg-white rounded-xl p-4 shadow-sm border" style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: '#1e3a8a' }}>מכירות אחרונות</p>
            {sales.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">אין מכירות עדיין</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {sales.slice(0, 5).map((sale) => (
                  <div key={sale._id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{sale.customerName}</p>
                      <p className="text-xs text-gray-500">{new Date(sale.createdAt).toLocaleDateString('he-IL')}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold" style={{ color: '#1e3a8a' }}>{formatCurrencyILS(sale.salePrice)}</p>
                      <p className="text-xs text-green-600">+{formatCurrencyILS(sale.commission)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </MainLayout>
  );
}
