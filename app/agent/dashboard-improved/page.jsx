"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ContactManagerButton from "@/app/components/agent/ContactManagerButton";
import { buildManagerWhatsAppUrl } from "@/lib/whatsapp";
import AgentChart from "@/app/dashboard/agent/components/AgentChart";
import RecentSalesTable from "@/app/dashboard/agent/components/RecentSalesTable";

const LEVELS = [
  { level: 1, threshold: 0, title: "סוכן חדש" },
  { level: 2, threshold: 5, title: "בדרך להצלחה" },
  { level: 3, threshold: 15, title: "סוכן מקצוען" },
  { level: 4, threshold: 30, title: "סוכן אלוף" },
  { level: 5, threshold: 60, title: "אגדת VIPO" },
];

function calculateLevelProgress(totalSales = 0) {
  if (!Number.isFinite(totalSales) || totalSales < 0) {
    totalSales = 0;
  }

  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (totalSales >= level.threshold) {
      currentLevel = level;
    } else {
      break;
    }
  }

  const currentIndex = LEVELS.findIndex((lvl) => lvl.level === currentLevel.level);
  const nextLevel = LEVELS[currentIndex + 1] ?? null;
  const span = nextLevel ? Math.max(1, nextLevel.threshold - currentLevel.threshold) : 1;
  const xpSinceLevelStart = totalSales - currentLevel.threshold;
  const progressPercent = nextLevel
    ? Math.min(100, Math.round((xpSinceLevelStart / span) * 100))
    : 100;

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentXp: totalSales,
    nextLevel: nextLevel?.level ?? null,
    nextLevelXp: nextLevel?.threshold ?? null,
    progressPercent,
    xpToNextLevel: nextLevel ? Math.max(0, nextLevel.threshold - totalSales) : 0,
  };
}

const WaveIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 12c.6-2.5 2.5-4 5-4s4.4 1.5 5 4c.6 2.5 2.5 4 5 4s4.4-1.5 5-4" />
  </svg>
);

const TrophyIcon = ({ className = "w-10 h-10" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M7 4h10" />
    <path d="M5 4a4 4 0 004 4h6a4 4 0 004-4" />
    <path d="M16 4v1a4 4 0 11-8 0V4" />
  </svg>
);

const ShoppingBagIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const LogoutIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const LinkIcon = ({ className = "w-7 h-7" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const CartIcon = ({ className = "w-7 h-7" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="9" cy="21" r="1" fill="currentColor" />
    <circle cx="20" cy="21" r="1" fill="currentColor" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const WalletIcon = ({ className = "w-7 h-7" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

const ChartIcon = ({ className = "w-7 h-7" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

const TagIcon = ({ className = "w-8 h-8" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <circle cx="7" cy="7" r="1.5" fill="currentColor" />
  </svg>
);

const UsersIcon = ({ className = "w-8 h-8" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DiamondIcon = ({ className = "w-8 h-8" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />
  </svg>
);

export default function AgentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [sales, setSales] = useState([]);
  const [referredCustomers, setReferredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Get current user
      const userRes = await fetch("/api/auth/me");
      if (!userRes.ok) {
        router.push("/login");
        return;
      }
      const userData = await userRes.json();
      
      if (userData.user.role !== "agent") {
        router.push("/");
        return;
      }
      
      setUser(userData.user);

      // Fetch coupon information
      const couponRes = await fetch("/api/agent/coupon");
      if (couponRes.ok) {
        const couponData = await couponRes.json();
        if (couponData?.coupon) {
          setCoupon(couponData.coupon);
        }
      }

      // Get agent stats
      const statsRes = await fetch(`/api/agent/stats?agentId=${userData.user._id}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else {
        // Default stats if API doesn't exist yet
        setStats({
          totalReferrals: userData.user.referralsCount || 0,
          totalSales: userData.user.totalSales || 0,
          commissionBalance: userData.user.commissionBalance || 0,
          clicks: 0,
          views: 0,
          conversionRate: 0,
        });
      }

      // Get referred customers
      const customersRes = await fetch(`/api/agent/customers?agentId=${userData.user._id}`);
      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setReferredCustomers(customersData.customers || []);
      }

      // Get recent sales for chart & table
      const salesRes = await fetch("/api/sales?self=true", { cache: "no-store" });
      if (salesRes.ok) {
        const salesData = await salesRes.json();
        if (Array.isArray(salesData)) {
          setSales(salesData);
        } else {
          setSales([]);
        }
      } else {
        setSales([]);
      }

    } catch (error) {
      console.error("Failed to load agent data:", error);
    } finally {
      setLoading(false);
    }
  }

  function copyCouponCode() {
    if (!coupon?.code) return;
    navigator.clipboard.writeText(coupon.code.toUpperCase());
    setCopied(true);
    setCopiedStatus("code");
    setTimeout(() => {
      setCopied(false);
      setCopiedStatus("");
    }, 2000);
  }

  function copyCouponMessage() {
    if (!coupon?.code) return;
    const message = `היי! הקוד שלי לרכישה עם הנחה הוא ${coupon.code.toUpperCase()}. הזן אותו בקופה ותקבל/י ${coupon.discountPercent || 0}% הנחה.`;
    navigator.clipboard.writeText(message);
    setCopied(true);
    setCopiedStatus("message");
    setTimeout(() => {
      setCopied(false);
      setCopiedStatus("");
    }, 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
              דשבורד סוכן
            </h1>
            <p className="text-gray-600 flex items-center gap-2 text-lg font-medium">
              <WaveIcon className="w-5 h-5 text-purple-500" /> שלום {user?.fullName || "סוכן"}!
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <ContactManagerButton agentName={user.fullName || "סוכן VIPO"} agentId={user.agentId || user._id} />
            )}
            <Link
              href="/agent/products"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-xl flex items-center gap-2 hover:-translate-y-0.5"
            >
              <ShoppingBagIcon className="w-5 h-5" /> המוצרים שלי
            </Link>
            <form action="/api/auth/logout" method="post" className="contents">
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-xl flex items-center gap-2 hover:-translate-y-0.5"
              >
                <LogoutIcon className="w-5 h-5" /> התנתק
              </button>
            </form>
          </div>
        </div>

        {/* Level Progress */}
        <section className="mb-10">
          {(() => {
            const totalSales = stats?.totalSales ?? 0;
            const levelProgress = calculateLevelProgress(totalSales);
            const currentXpLabel = levelProgress.currentXp.toLocaleString("he-IL");
            const nextXpLabel = levelProgress.nextLevelXp
              ? levelProgress.nextLevelXp.toLocaleString("he-IL")
              : null;

            return (
              <div className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 text-white rounded-3xl shadow-xl p-6 md:p-8 overflow-hidden relative">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <span className="text-xs uppercase tracking-[0.4em] text-white/60 block mb-2">
                      מסלול נאמנות
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-1">
                      רמה {levelProgress.level}
                    </h2>
                    <p className="text-white/80 text-sm md:text-base font-medium">
                      {levelProgress.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm">
                      <TrophyIcon className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70 font-medium mb-1">לקוחות שסגרת</p>
                      <p className="text-3xl md:text-4xl font-extrabold leading-none">
                        {currentXpLabel}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs md:text-sm font-semibold text-white/70 mb-2">
                    <span>XP {currentXpLabel}</span>
                    <span>
                      {nextXpLabel ? `יעד הבא · ${nextXpLabel} XP` : "הגעת לרמה המקסימלית"}
                    </span>
                  </div>
                  <div className="h-3 md:h-3.5 bg-white/25 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${levelProgress.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs md:text-sm text-white/85 font-medium mt-3">
                    {levelProgress.nextLevel ? (
                      <>
                        עוד <span className="font-semibold">{levelProgress.xpToNextLevel}</span> לקוחות כדי
                        להגיע לרמה {levelProgress.nextLevel}
                      </>
                    ) : (
                      "תותח! הגעת לרמה הגבוהה ביותר שלנו."
                    )}
                  </p>
                </div>
              </div>
            );
          })()}
        </section>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl p-7 transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 tracking-wide">{'סה&quot;כ הפניות'}</h3>
              <div className="p-2.5 bg-purple-50 rounded-xl">
                <LinkIcon className="text-purple-500 w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">
              {stats?.totalReferrals || 0}
            </p>
            <p className="text-xs text-gray-500 font-medium">לקוחות שהבאתי</p>
          </div>

          <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl p-7 transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 tracking-wide">{'סה&quot;כ מכירות'}</h3>
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <CartIcon className="text-blue-500 w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">
              {stats?.totalSales || 0}
            </p>
            <p className="text-xs text-gray-500 font-medium">רכישות שבוצעו</p>
          </div>

          <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl p-7 transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 tracking-wide">יתרת עמלות</h3>
              <div className="p-2.5 bg-green-50 rounded-xl">
                <WalletIcon className="text-green-500 w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-green-600 mb-1 tracking-tight">
              ₪{(stats?.commissionBalance || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 font-medium">זמין למשיכה</p>
          </div>

          <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl p-7 transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 tracking-wide">שיעור המרה</h3>
              <div className="p-2.5 bg-indigo-50 rounded-xl">
                <ChartIcon className="text-indigo-500 w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-blue-600 mb-1 tracking-tight">
              {stats?.conversionRate || 0}%
            </p>
            <p className="text-xs text-gray-500 font-medium">קליקים למכירות</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Coupon Code Section */}
          <section className="bg-white rounded-3xl shadow-md hover:shadow-xl p-7 transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">קוד הקופון שלך</h2>
                <p className="text-sm text-gray-500 mt-1.5 font-medium">
                  שתף את הקוד כדי שלקוחות יקבלו {coupon?.discountPercent ?? 0}% הנחה
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <TagIcon className="text-blue-500 w-6 h-6" />
              </div>
            </div>
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 mb-2 tracking-wide">קוד קופון:</p>
                    <code className="block bg-white px-5 py-4 rounded-xl font-mono text-xl font-bold tracking-widest text-center sm:text-left shadow-sm border border-blue-100">
                      {coupon?.code ? coupon.code.toUpperCase() : "טוען..."}
                    </code>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={copyCouponCode}
                      disabled={!coupon?.code}
                      className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      {copied && copiedStatus === "code" ? "✓ הועתק!" : "העתק קוד"}
                    </button>
                    <button
                      onClick={copyCouponMessage}
                      disabled={!coupon?.code}
                      className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      {copied && copiedStatus === "message" ? "✓ הודעה הועתקה" : "העתק הודעה"}
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700">
                  <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="font-bold text-blue-600 text-xs tracking-wide mb-1">הנחה ללקוח</p>
                    <p className="text-lg font-extrabold text-gray-900">{coupon?.discountPercent ?? 0}%</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="font-bold text-purple-600 text-xs tracking-wide mb-1">עמלה עבורך</p>
                    <p className="text-lg font-extrabold text-gray-900">{coupon?.commissionPercent ?? 0}%</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="font-bold text-gray-600 text-xs tracking-wide mb-1">סטטוס</p>
                    <p className="text-lg font-extrabold text-gray-900">{coupon?.status === "active" ? "פעיל" : "לא פעיל"}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium leading-relaxed">
                שלח את הקוד ללקוחות – כל רכישה עם הקוד תזכה אותם בהנחה ותעניק לך עמלה!
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <a
                  href={buildManagerWhatsAppUrl(`היי, כאן ${user?.fullName || "סוכן"}. קוד הקופון שלי הוא ${coupon?.code?.toUpperCase() || "..."}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span>WhatsApp</span>
                </a>
                <button
                  onClick={copyCouponMessage}
                  disabled={!coupon?.code}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span>{copied && copiedStatus === "message" ? "✓ הודעה הועתקה" : "העתק להודעה"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Customers List Section */}
          <section className="bg-white rounded-3xl shadow-md hover:shadow-xl p-7 transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                לקוחות שהבאתי
              </h2>
              <div className="p-3 bg-purple-50 rounded-xl">
                <UsersIcon className="text-purple-500 w-6 h-6" />
              </div>
            </div>
            <div className="space-y-3">
              {referredCustomers.length > 0 ? (
                referredCustomers.slice(0, 5).map((customer, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-purple-200"
                  >
                    <div>
                      <p className="font-bold text-gray-900">
                        {customer.fullName || customer.email || customer.phone}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {new Date(customer.createdAt).toLocaleDateString("he-IL")}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 font-semibold text-lg">עדיין אין לקוחות</p>
                  <p className="text-sm text-gray-400 mt-2 font-medium">
                    התחל לשתף את הקישור שלך!
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Commission Breakdown */}
        <section className="mt-8 bg-white rounded-3xl shadow-md hover:shadow-xl p-7 transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">פירוט עמלות</h2>
            <div className="p-3 bg-blue-50 rounded-xl">
              <DiamondIcon className="text-blue-500 w-6 h-6" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 shadow-sm hover:shadow-md transition-all">
              <p className="text-sm font-bold text-gray-600 mb-2 tracking-wide">עמלות מאושרות</p>
              <p className="text-3xl font-extrabold text-green-600 tracking-tight">
                ₪{(stats?.commissionBalance || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200/50 shadow-sm hover:shadow-md transition-all">
              <p className="text-sm font-bold text-gray-600 mb-2 tracking-wide">ממתין לאישור</p>
              <p className="text-3xl font-extrabold text-yellow-600 tracking-tight">₪0</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 shadow-sm hover:shadow-md transition-all">
              <p className="text-sm font-bold text-gray-600 mb-2 tracking-wide">כבר שולם</p>
              <p className="text-3xl font-extrabold text-blue-600 tracking-tight">₪0</p>
            </div>
          </div>
        </section>

        {/* Sales Insights */}
        <section className="mt-10 grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl p-7 transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">מגמת מכירות חודשית</h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  מבט על סך המכירות שבוצעו במהלך החודש הנוכחי
                </p>
              </div>
            </div>
            <AgentChart data={sales} className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100 p-4 h-72" />
          </div>

          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl p-7 transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">מכירות אחרונות</h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  עשר העסקאות האחרונות שנרשמו עבורך במערכת
                </p>
              </div>
            </div>
            <RecentSalesTable rows={sales} className="bg-transparent border-0 shadow-none rounded-none" />
          </div>
        </section>
      </div>
    </main>
  );
}
