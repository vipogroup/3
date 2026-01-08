import { getUserFromCookies } from '@/lib/auth/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import CopyCouponButton from './components/CopyCouponButton';
import KPICard from './components/KPICard';
import ShareButton from './components/ShareButton';
import AgentCommissionsClient from './components/AgentCommissionsClient';
import ProductsGallery from './components/ProductsGallery';
import StatisticsSection from './components/StatisticsSection';

const TrophyIcon = ({ className = 'w-10 h-10' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M8 21h8" />
    <path d="M10 17h4" />
    <path d="M8.2 13.8l-1.3 3.7a1 1 0 00.95 1.3h8.3a1 1 0 00.94-1.3l-1.3-3.7" />
    <path d="M7 4h10v3a5 5 0 01-5 5 5 5 0 01-5-5V4z" />
    <path d="M5 4h14" />
    <path d="M7 7H5a3 3 0 003 3" />
    <path d="M17 7h2a3 3 0 01-3 3" />
  </svg>
);

const ChainIcon = ({ className = 'w-8 h-8' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9.18 14.82a3 3 0 010-4.24l3.18-3.18a3 3 0 014.24 4.24l-.88.88" />
    <path d="M14.82 9.18a3 3 0 010 4.24l-3.18 3.18a3 3 0 11-4.24-4.24l.88-.88" />
  </svg>
);

const ShoppingBagIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 9l1 11h10l1-11H6z" />
    <path d="M9 9V7a3 3 0 016 0v2" />
  </svg>
);

const CartIcon = ({ className = 'w-8 h-8' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 5h2l1 10h12l2-6H7" />
    <circle cx="9" cy="19" r="1.5" />
    <circle cx="17" cy="19" r="1.5" />
  </svg>
);

const WalletIcon = ({ className = 'w-8 h-8' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M21 10h-6a2 2 0 100 4h6" />
  </svg>
);

const HourglassIcon = ({ className = 'w-8 h-8' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 3h10" />
    <path d="M7 21h10" />
    <path d="M9 3v3a3 3 0 001.76 2.74L12 10l1.24-1.26A3 3 0 0015 6V3" />
    <path d="M15 21v-3a3 3 0 00-1.76-2.74L12 14l-1.24 1.26A3 3 0 009 18v3" />
  </svg>
);

const ChartIcon = ({ className = 'w-8 h-8' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 20h16" />
    <path d="M8 20v-7" />
    <path d="M12 20v-11" />
    <path d="M16 20v-5" />
  </svg>
);

const TrendIcon = ({ className = 'w-8 h-8' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 16l5-5 4 4 7-7" />
    <path d="M16 8h4v4" />
  </svg>
);

const DiamondIcon = ({ className = 'w-8 h-8' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 9l9 12 9-12-4-6H7l-4 6z" />
    <path d="M3 9h18" />
    <path d="M7 3l5 18 5-18" />
  </svg>
);

const EyeIcon = ({ className = 'w-8 h-8' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const TargetIcon = ({ className = 'w-8 h-8' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1.5" />
  </svg>
);

const numberFormatter = new Intl.NumberFormat('he-IL');
const currencyFormatter = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  maximumFractionDigits: 0,
});

const formatNumber = (value = 0) => numberFormatter.format(Math.max(0, Number(value) || 0));
const formatCurrency = (value = 0) => currencyFormatter.format(Math.max(0, Number(value) || 0));
const formatPercent = (value = 0) => `${Math.max(0, Number(value) || 0)}%`;

const ACTIVE_SALE_STATUSES = ['pending', 'processing', 'paid', 'confirmed', 'in_progress'];

function normalizeObjectId(id) {
  if (!id) return null;
  try {
    return typeof id === 'string' ? new ObjectId(id) : new ObjectId(id);
  } catch {
    return null;
  }
}

function calcLevel(xp) {
  const safeXp = Math.max(0, xp || 0);
  const level = Math.floor(safeXp / 1500) + 1;
  const nextLevelXp = level * 1500;
  return { level, nextLevelXp };
}

async function getAgentStats(agentId, originBaseUrl = null) {
  const agentObjectId = normalizeObjectId(agentId);
  if (!agentObjectId) {
    return {
      totalReferrals: 0,
      activeSales: 0,
      totalSales: 0,
      totalRevenue: 0,
      totalCommission: 0,
      pendingCommission: 0,
      level: 1,
      xp: 0,
      nextLevelXp: 1500,
      referralCode: null,
      referralLink: null,
      conversionRate: 0,
      avgCommission: 0,
      monthlyVisits: 0,
      clicks: 0,
      goals: {
        sales: { target: 10, current: 0 },
        revenue: { target: 20000, current: 0 },
        referrals: { target: 50, current: 0 },
      },
    };
  }

  const db = await getDb();
  const users = db.collection('users');
  const orders = db.collection('orders');
  const referralLogs = db.collection('referral_logs');

  const agentDoc = await users.findOne(
    { _id: agentObjectId },
    {
      projection: {
        referralsCount: 1,
        referralCount: 1,
        commissionBalance: 1,
        totalSales: 1,
        referralId: 1,
        couponCode: 1,
      },
    },
  );

  const totalReferralsBase =
    agentDoc?.referralsCount ??
    agentDoc?.referralCount ??
    (await users.countDocuments({ referredBy: agentObjectId }));

  // Query for orders linked to this agent via refAgentId OR agentId (coupon)
  const agentOrdersFilter = { $or: [{ refAgentId: agentObjectId }, { agentId: agentObjectId }] };

  const [totalSales, activeSales, totalsAgg, pendingAgg, clicksAgg] = await Promise.all([
    orders.countDocuments(agentOrdersFilter),
    orders.countDocuments({ ...agentOrdersFilter, status: { $in: ACTIVE_SALE_STATUSES } }),
    orders
      .aggregate([
        { $match: agentOrdersFilter },
        {
          $group: {
            _id: null,
            totalCommission: { $sum: '$commissionAmount' },
            totalRevenue: { $sum: '$totalAmount' },
          },
        },
      ])
      .toArray(),
    orders
      .aggregate([
        { $match: { ...agentOrdersFilter, status: { $in: ['pending', 'processing'] } } },
        { $group: { _id: null, pendingCommission: { $sum: '$commissionAmount' } } },
      ])
      .toArray(),
    referralLogs
      .aggregate([
        { $match: { agentId: agentObjectId } },
        { $group: { _id: '$action', total: { $sum: 1 } } },
      ])
      .toArray(),
  ]);

  const totalRevenue = totalsAgg[0]?.totalRevenue || 0;
  const totalCommission = totalsAgg[0]?.totalCommission || 0;
  const pendingCommission = pendingAgg[0]?.pendingCommission || 0;
  const clicks = clicksAgg.find((c) => c._id === 'click')?.total || 0;
  const views = clicksAgg.find((c) => c._id === 'view')?.total || 0;

  const monthlyWindow = new Date();
  monthlyWindow.setDate(monthlyWindow.getDate() - 30);
  const monthlyVisits = await referralLogs.countDocuments({
    agentId: agentObjectId,
    ts: { $gte: monthlyWindow },
  });

  // Fetch recent orders for this agent (orders made with their coupon)
  const recentOrders = await orders
    .find(agentOrdersFilter)
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  // Fetch agent's own orders (orders they made as a customer)
  // createdBy can be stored as ObjectId or String, so we check both
  const myOrders = await orders
    .find({ $or: [{ createdBy: agentObjectId }, { createdBy: agentObjectId.toString() }] })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  const conversionRate = clicks > 0 ? Number(((totalSales / clicks) * 100).toFixed(1)) : 0;
  const avgCommission = totalSales > 0 ? Number((totalCommission / totalSales).toFixed(2)) : 0;

  const xp = Math.round(totalSales * 250 + totalReferralsBase * 120 + totalCommission * 0.5);
  const { level, nextLevelXp } = calcLevel(xp);

  const referralCode = agentDoc?.referralId || agentDoc?.couponCode || agentObjectId.toString();
  // Short link format: /r/CODE
  const baseUrl = (originBaseUrl || 'https://vipo-group.com').replace(/\/$/, '');
  const referralLink = `${baseUrl}/r/${encodeURIComponent(referralCode)}`;

  // Available balance from user document
  const availableBalance = agentDoc?.commissionBalance || 0;

  return {
    totalReferrals: totalReferralsBase,
    activeSales,
    totalSales,
    totalRevenue,
    totalCommission,
    pendingCommission,
    availableBalance,
    level,
    xp,
    nextLevelXp,
    referralCode,
    referralLink,
    conversionRate,
    avgCommission,
    monthlyVisits,
    clicks,
    goals: {
      sales: { target: 10, current: totalSales },
      revenue: { target: 20000, current: totalRevenue },
      referrals: { target: 50, current: totalReferralsBase },
    },
    recentOrders: recentOrders.map((o) => ({
      _id: String(o._id),
      createdAt: o.createdAt,
      customerName: o.customer?.fullName || 'לקוח',
      totalAmount: o.totalAmount || 0,
      commissionAmount: o.commissionAmount || 0,
      status: o.status || 'pending',
    })),
    myOrders: myOrders.map((o) => ({
      _id: String(o._id),
      createdAt: o.createdAt,
      totalAmount: o.totalAmount || 0,
      itemsCount: o.items?.length || 0,
      status: o.status || 'pending',
    })),
  };
}

export default async function AgentPage() {
  const user = await getUserFromCookies();
  if (!user) redirect('/login');

  const requestHeaders = headers();
  const proto = requestHeaders.get('x-forwarded-proto') || requestHeaders.get('x-forwarded-protocol') || 'http';
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');
  const originBaseUrl = host ? `${proto}://${host}` : null;

  const stats = await getAgentStats(user._id, originBaseUrl);
  const xpProgress = stats.nextLevelXp > 0 ? ((stats.xp / stats.nextLevelXp) * 100).toFixed(0) : 0;

  const goalDefinitions = [
    { key: 'sales', label: 'מכירות', color: 'bg-blue-600', formatter: formatNumber },
    { key: 'revenue', label: 'הכנסות', color: 'bg-emerald-600', formatter: formatCurrency },
    { key: 'referrals', label: 'הפניות', color: 'bg-blue-600', formatter: formatNumber },
  ];

  const kpiCards = [
    {
      title: 'מכירות פעילות',
      value: formatNumber(stats.activeSales),
      iconName: 'bag',
    },
    {
      title: 'סה״כ הזמנות',
      value: formatNumber(stats.totalSales),
      iconName: 'cart',
    },
    {
      title: 'סה״כ מכירות',
      value: formatCurrency(stats.totalRevenue),
      iconName: 'wallet',
    },
    {
      title: 'המתנה לתשלום',
      value: formatCurrency(stats.pendingCommission),
      iconName: 'hourglass',
    },
    {
      title: 'יתרה למשיכה',
      value: formatCurrency(stats.availableBalance),
      iconName: 'diamond',
      highlight: true,
    },
  ];


  return (
    <main className="min-h-[calc(100vh-64px)] bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-1"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            דשבורד סוכן
          </h1>
          <div
            className="h-1 w-24 rounded-full"
            style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)' }}
          />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {kpiCards.map(({ title, value, iconName }) => (
            <KPICard key={title} title={title} value={value} iconName={iconName} />
          ))}
        </div>

        {/* Commissions Section */}
        <section className="mb-6">
          <AgentCommissionsClient />
        </section>

        {/* Products Gallery Section */}
        <section
          className="mb-6 rounded-xl p-5"
          style={{
            border: '2px solid transparent',
            backgroundImage:
              'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 4px 15px rgba(8, 145, 178, 0.12)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: '#1e3a8a' }}>
              מוצרים לשיתוף
            </h2>
            <Link
              href="/agent/products"
              className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: '#0891b2', background: 'rgba(8, 145, 178, 0.1)' }}
            >
              לכל המוצרים
            </Link>
          </div>
          <ProductsGallery couponCode={stats.referralCode} referralLink={stats.referralLink} />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Coupon Code Section */}
          <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header with gradient */}
            <div
              className="px-5 py-4"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-white">קוד קופון שלך</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Share Link - Primary */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <span className="text-base font-bold" style={{ color: '#1e3a8a' }}>לינק לשיתוף</span>
                </div>
                <div
                  className="relative rounded-xl overflow-hidden p-4"
                  style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(8, 145, 178, 0.08) 100%)', border: '2px solid rgba(8, 145, 178, 0.3)' }}
                >
                  <div
                    className="rounded-lg p-3 text-sm font-mono bg-white mb-3 text-center"
                    style={{ border: '1px solid #e2e8f0', color: '#1e3a8a' }}
                  >
                    {stats.referralLink || '-'}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CopyCouponButton code={stats.referralLink} label="העתק" successMessage="הלינק הועתק!" />
                    <ShareButton link={stats.referralLink} />
                  </div>
                  <p className="text-xs text-gray-600 mt-3 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>הלינק כולל את קוד הקופון - הלקוח יראה הנחה אוטומטית!</span>
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-4" />

              {/* Coupon Code Display - Secondary/Smaller */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">קוד הקופון (לשימוש ידני)</span>
                  <CopyCouponButton code={stats.referralCode} />
                </div>
                {stats.referralCode ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="flex-1 text-center py-2 px-3 rounded-lg text-base font-bold tracking-wider"
                      style={{ backgroundColor: '#f1f5f9', color: '#1e3a8a', border: '1px solid #e2e8f0' }}
                    >
                      {stats.referralCode.toUpperCase()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2 rounded-lg bg-gray-50 border border-dashed border-gray-200">
                    <span className="text-gray-400 text-sm">לא הוגדר</span>
                  </div>
                )}
              </div>
            </div>
          </section>
          {/* Statistics Section - With Click-to-Toggle Descriptions */}
          <StatisticsSection stats={stats} />
        </div>

        {/* Recent Orders Section */}
        <section
          className="mt-6 rounded-xl p-5"
          style={{
            border: '2px solid transparent',
            backgroundImage:
              'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 4px 15px rgba(8, 145, 178, 0.12)',
          }}
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: '#1e3a8a' }}>
            הזמנות אחרונות
          </h2>
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}>
                    <th className="text-right py-3 px-2 font-semibold" style={{ color: '#1e3a8a' }}>תאריך</th>
                    <th className="text-right py-3 px-2 font-semibold" style={{ color: '#1e3a8a' }}>לקוח</th>
                    <th className="text-right py-3 px-2 font-semibold" style={{ color: '#1e3a8a' }}>סכום</th>
                    <th className="text-right py-3 px-2 font-semibold" style={{ color: '#1e3a8a' }}>עמלה</th>
                    <th className="text-right py-3 px-2 font-semibold" style={{ color: '#1e3a8a' }}>סטטוס</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="border-b" style={{ borderColor: 'rgba(8, 145, 178, 0.1)' }}>
                      <td className="py-3 px-2 text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString('he-IL')}
                      </td>
                      <td className="py-3 px-2 text-gray-900 font-medium">{order.customerName}</td>
                      <td className="py-3 px-2 text-gray-700">{formatCurrency(order.totalAmount)}</td>
                      <td className="py-3 px-2 font-semibold" style={{ color: '#0891b2' }}>
                        {formatCurrency(order.commissionAmount)}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{
                            background:
                              order.status === 'paid'
                                ? 'rgba(16, 185, 129, 0.1)'
                                : order.status === 'pending'
                                ? 'rgba(245, 158, 11, 0.1)'
                                : 'rgba(107, 114, 128, 0.1)',
                            color:
                              order.status === 'paid'
                                ? '#059669'
                                : order.status === 'pending'
                                ? '#d97706'
                                : '#6b7280',
                            border: `1px solid ${
                              order.status === 'paid'
                                ? 'rgba(16, 185, 129, 0.3)'
                                : order.status === 'pending'
                                ? 'rgba(245, 158, 11, 0.3)'
                                : 'rgba(107, 114, 128, 0.3)'
                            }`,
                          }}
                        >
                          {order.status === 'paid' ? 'שולם' : order.status === 'pending' ? 'ממתין' : order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>אין הזמנות עדיין</p>
              <p className="text-sm mt-1">שתף את קוד הקופון שלך כדי להתחיל להרוויח!</p>
            </div>
          )}
        </section>

        {/* My Orders Section (Agent's own purchases) */}
        <section
          className="mt-6 rounded-xl p-5"
          style={{
            border: '2px solid transparent',
            backgroundImage:
              'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 4px 15px rgba(8, 145, 178, 0.12)',
          }}
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: '#1e3a8a' }}>
            ההזמנות שלי
          </h2>
          {stats.myOrders && stats.myOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}>
                    <th className="text-right py-3 px-2 font-semibold" style={{ color: '#1e3a8a' }}>תאריך</th>
                    <th className="text-right py-3 px-2 font-semibold" style={{ color: '#1e3a8a' }}>מוצרים</th>
                    <th className="text-right py-3 px-2 font-semibold" style={{ color: '#1e3a8a' }}>סכום</th>
                    <th className="text-right py-3 px-2 font-semibold" style={{ color: '#1e3a8a' }}>סטטוס</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.myOrders.map((order) => (
                    <tr key={order._id} className="border-b" style={{ borderColor: 'rgba(8, 145, 178, 0.1)' }}>
                      <td className="py-3 px-2 text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString('he-IL')}
                      </td>
                      <td className="py-3 px-2 text-gray-900 font-medium">{order.itemsCount} פריטים</td>
                      <td className="py-3 px-2 text-gray-700">{formatCurrency(order.totalAmount)}</td>
                      <td className="py-3 px-2">
                        <span
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{
                            background:
                              order.status === 'paid'
                                ? 'rgba(16, 185, 129, 0.1)'
                                : order.status === 'pending'
                                ? 'rgba(245, 158, 11, 0.1)'
                                : 'rgba(107, 114, 128, 0.1)',
                            color:
                              order.status === 'paid'
                                ? '#059669'
                                : order.status === 'pending'
                                ? '#d97706'
                                : '#6b7280',
                            border: `1px solid ${
                              order.status === 'paid'
                                ? 'rgba(16, 185, 129, 0.3)'
                                : order.status === 'pending'
                                ? 'rgba(245, 158, 11, 0.3)'
                                : 'rgba(107, 114, 128, 0.3)'
                            }`,
                          }}
                        >
                          {order.status === 'paid' ? 'שולם' : order.status === 'pending' ? 'ממתין' : order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>עדיין לא ביצעת הזמנות</p>
              <Link
                href="/products"
                className="inline-block mt-3 px-4 py-2 rounded-lg text-white font-medium text-sm"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                לצפייה במוצרים
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
