import { getUserFromCookies } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              דשבורד סוכן
            </h1>
            <p className="text-gray-600">ברוך הבא! כאן תוכל לעקוב אחר הביצועים שלך</p>
          </div>
          <Link
            href="/agent/products"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg"
          >
            🛍️ המוצרים שלי
          </Link>
        </div>

        {/* Level & XP Card */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">רמה {stats.level}</h2>
              <p className="text-purple-100">
                {stats.xp} / {stats.nextLevelXp} XP
              </p>
            </div>
            <div className="text-5xl">🏆</div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-purple-100 mt-2">
            עוד {stats.nextLevelXp - stats.xp} XP לרמה הבאה!
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">סה"כ הפניות</h3>
              <span className="text-3xl">🔗</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalReferrals}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">מכירות פעילות</h3>
              <span className="text-3xl">🛒</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeSales}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">סה"כ הכנסות</h3>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ₪{stats.totalEarnings.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">ממתין לתשלום</h3>
              <span className="text-3xl">⏳</span>
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              ₪{stats.pendingEarnings.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Referral Links Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                קישורים אישיים
              </h2>
              <span className="text-3xl">🔗</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">קוד הפניה שלך:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white px-4 py-2 rounded-lg font-mono text-sm">
                    REF123456
                  </code>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all">
                    העתק
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                שתף את הקוד שלך עם לקוחות פוטנציאליים וקבל עמלה על כל מכירה!
              </p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg">
                צור קישור חדש
              </button>
            </div>
          </section>

          {/* Commission Stats Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                עמלות וסטטיסטיקות
              </h2>
              <span className="text-3xl">📊</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600">שיעור המרה</p>
                  <p className="text-2xl font-bold text-green-600">26.7%</p>
                </div>
                <span className="text-3xl">📈</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600">ממוצע עמלה</p>
                  <p className="text-2xl font-bold text-purple-600">₪1,285</p>
                </div>
                <span className="text-3xl">💎</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600">ביקורים החודש</p>
                  <p className="text-2xl font-bold text-blue-600">234</p>
                </div>
                <span className="text-3xl">👀</span>
              </div>
            </div>
          </section>
        </div>

        {/* Goals Section */}
        <section className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">יעדים החודש</h2>
            <span className="text-3xl">🎯</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border-2 border-gray-200 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">10 מכירות</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "80%" }}></div>
              </div>
              <p className="text-xs text-gray-500">8 / 10 הושלמו</p>
            </div>
            <div className="p-4 border-2 border-gray-200 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">₪20,000 הכנסות</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
              <p className="text-xs text-gray-500">₪12,000 / ₪20,000</p>
            </div>
            <div className="p-4 border-2 border-gray-200 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">50 הפניות</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "90%" }}></div>
              </div>
              <p className="text-xs text-gray-500">45 / 50 הושלמו</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
