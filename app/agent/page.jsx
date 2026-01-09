import { getUserFromCookies } from '@/lib/auth/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import CopyCouponButton from './components/CopyCouponButton';
import ShareButton from './components/ShareButton';
import AgentCommissionsClient from './components/AgentCommissionsClient';
import StatisticsSection from './components/StatisticsSection';
import OrdersAccordions from './components/OrdersAccordions';

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

        {/* Personal Link + Products Section */}
        <section
          className="rounded-xl overflow-hidden mb-6"
          style={{
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 4px 15px rgba(8, 145, 178, 0.12)',
          }}
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-base font-bold" style={{ color: '#1e3a8a' }}>הקישור האישי שלך</h3>
            <p className="text-[11px] text-gray-500">שתף את הקישור - ההנחה כבר מובנית בו!</p>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 min-w-0">
                <p className="text-xs font-mono text-gray-600 truncate" dir="ltr">{stats.referralLink || '-'}</p>
              </div>
              <CopyCouponButton code={stats.referralLink} label="העתק" variant="primary" />
              <ShareButton link={stats.referralLink} />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 min-w-0">
                <p className="text-[10px] text-gray-400">קוד קופון</p>
                <p
                  className="text-sm font-bold tracking-wider"
                  style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stats.referralCode?.toUpperCase() || '-'}
                </p>
              </div>
              <CopyCouponButton code={stats.referralCode} label="העתק" variant="outline" />
            </div>
            {/* Link to products */}
            <Link
              href="/agent/products"
              className="flex items-center justify-center gap-2 mt-3 py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-lg hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              <span>בחר מוצרים לשיתוף עם הקוד שלך</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-6">
          <StatisticsSection stats={stats} />
        </section>

        {/* Commissions Section */}
        <section className="mb-6">
          <AgentCommissionsClient />
        </section>

        {/* Orders Accordions */}
        <OrdersAccordions 
          recentOrders={stats.recentOrders} 
          myOrders={stats.myOrders}
        />
      </div>
    </main>
  );
}
