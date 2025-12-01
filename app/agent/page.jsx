import { getUserFromCookies } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const TrophyIcon = ({ className = "w-10 h-10" }) => (
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

const ChainIcon = ({ className = "w-8 h-8" }) => (
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

const ShoppingBagIcon = ({ className = "w-5 h-5" }) => (
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

const CartIcon = ({ className = "w-8 h-8" }) => (
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

const WalletIcon = ({ className = "w-8 h-8" }) => (
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

const HourglassIcon = ({ className = "w-8 h-8" }) => (
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

const ChartIcon = ({ className = "w-8 h-8" }) => (
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

const TrendIcon = ({ className = "w-8 h-8" }) => (
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

const DiamondIcon = ({ className = "w-8 h-8" }) => (
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

const EyeIcon = ({ className = "w-8 h-8" }) => (
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

const TargetIcon = ({ className = "w-8 h-8" }) => (
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

async function getAgentStats() {
  // TODO: Replace with real database queries
  return {
    totalReferrals: 45,
    activeSales: 12,
    totalEarnings: 15420,
    pendingEarnings: 3200,
    level: 3,
    xp: 4500,
    nextLevelXp: 6000,
  };
}

export default async function AgentPage() {
  const user = await getUserFromCookies();
  if (!user) redirect("/login");
  
  const stats = await getAgentStats();
  const xpProgress = ((stats.xp / stats.nextLevelXp) * 100).toFixed(0);

  const kpiCards = [
    {
      title: 'סה״כ הפניות',
      value: stats.totalReferrals,
      icon: ChainIcon,
      accent: "text-blue-600",
    },
    {
      title: "מכירות פעילות",
      value: stats.activeSales,
      icon: CartIcon,
      accent: "text-purple-600",
    },
    {
      title: 'סה״כ מכירות',
      value: `₪${stats.totalEarnings.toLocaleString()}`,
      icon: WalletIcon,
      accent: "text-emerald-600",
    },
    {
      title: "המתנה לתשלום",
      value: `₪${stats.pendingEarnings.toLocaleString()}`,
      icon: HourglassIcon,
      accent: "text-amber-500",
    },
  ];

  return (
    <main
      className="min-h-screen p-4 sm:p-8 bg-gradient-to-b from-slate-50 via-white to-slate-50"
      style={{
        background: "linear-gradient(160deg, rgba(99,102,241,0.18) 0%, rgba(236,233,255,0.25) 40%, rgba(255,255,255,0.6) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2 md:gap-4">
              <Link
                href="/agent"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all font-medium shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                אזור אישי
              </Link>
              <Link
                href="/agent/products"
                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 text-gray-700 rounded-xl transition-all font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                מוצרים
              </Link>
              <Link
                href="/agent/sales"
                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 text-gray-700 rounded-xl transition-all font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                מכירות
              </Link>
            </div>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-medium w-full md:w-auto shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              התנתק
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              דשבורד סוכן
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-lg">
              ברוך הבא! כאן תוכל לעקוב אחר הביצועים, הקישורים והעמלות שלך במקום אחד.
            </p>
          </div>
          <Link
            href="/agent/products"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <ShoppingBagIcon /> המוצרים שלי
          </Link>
        </div>

        {/* Level & XP Card */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-2xl shadow-md p-5 sm:p-6 mb-8 text-white">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h2 className="text-2xl font-bold">רמה {stats.level}</h2>
              <p className="text-indigo-100 text-sm sm:text-base">
                {stats.xp} / {stats.nextLevelXp} XP
              </p>
            </div>
            <TrophyIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white/90" />
          </div>
          <div className="w-full bg-white/25 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-indigo-100 mt-2">
            עוד {stats.nextLevelXp - stats.xp} XP לרמה הבאה!
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {kpiCards.map(({ title, value, icon: Icon, accent }) => (
            <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-slate-600">{title}</span>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${accent}`} />
              </div>
              <p className="mt-3 text-xl sm:text-2xl font-semibold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
          {/* Referral Links Section */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                קישורים אישיים
              </h2>
              <ChainIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs sm:text-sm text-slate-600 mb-2">קוד ההפניה שלך</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center text-blue-600">
                    <ChainIcon className="w-5 h-5" />
                  </div>
                  <code className="flex-1 bg-white px-3 py-2 rounded-lg font-mono text-sm">
                    REF123456
                  </code>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all text-sm">
                    העתק
                  </button>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                שתף את הקוד שלך עם לקוחות פוטנציאליים וקבל עמלה על כל מכירה. מומלץ להוסיף גם תיאור קצר של הערך שאתה מעניק.
              </p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-sm text-sm">
                צור קישור חדש
              </button>
            </div>
          </section>

          {/* Commission Stats Section */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                עמלות וסטטיסטיקות
              </h2>
              <DiamondIcon className="w-6 h-6 text-purple-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">ממוצע עמלה</p>
                  <p className="text-2xl font-bold text-purple-600">₪1,285</p>
                </div>
                <WalletIcon className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">ביקורים החודש</p>
                  <p className="text-2xl font-bold text-blue-600">234</p>
                </div>
                <EyeIcon className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">שיעור המרה</p>
                  <p className="text-2xl font-bold text-emerald-600">26.7%</p>
                </div>
                <TrendIcon className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </section>
        </div>

        {/* Goals Section */}
        <section className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">יעדים החודש</h2>
            <TargetIcon className="w-6 h-6 text-rose-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{ label: "10 מכירות", progress: 0.8, caption: "8 / 10 הושלמו", color: "bg-blue-600" }, { label: "₪20,000 הכנסות", progress: 0.6, caption: "₪12,000 / ₪20,000", color: "bg-emerald-600" }, { label: "50 הפניות", progress: 0.9, caption: "45 / 50 הושלמו", color: "bg-purple-600" }].map(({ label, progress, caption, color }) => (
              <div key={label} className="p-4 border border-slate-200 rounded-xl space-y-2">
                <p className="text-sm text-slate-600">{label}</p>
                <div className="w-full bg-slate-200/70 rounded-full h-2">
                  <div className={`${color} h-2 rounded-full`} style={{ width: `${Math.round(progress * 100)}%` }}></div>
                </div>
                <p className="text-xs text-slate-500">{caption}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
