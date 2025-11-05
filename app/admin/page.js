import { requireAdmin } from "@/lib/auth/server";

// Placeholder function - will be replaced with real API calls
async function getStats() {
  // TODO: Replace with real database queries
  return {
    totalUsers: 142,
    totalAgents: 23,
    totalProducts: 87,
    totalOrders: 456,
    pendingOrders: 12,
    revenue: 125430,
  };
}

export default async function AdminDashboard() {
  await requireAdmin();
  const stats = await getStats();
  
  const kpiCards = [
    {
      title: "סה״כ משתמשים",
      value: stats.totalUsers,
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: "סוכנים פעילים",
      value: stats.totalAgents,
      icon: "👔",
      color: "bg-green-500",
    },
    {
      title: "מוצרים במלאי",
      value: stats.totalProducts,
      icon: "📦",
      color: "bg-purple-500",
    },
    {
      title: "סה״כ הזמנות",
      value: stats.totalOrders,
      icon: "🛒",
      color: "bg-orange-500",
    },
    {
      title: "הזמנות ממתינות",
      value: stats.pendingOrders,
      icon: "⏳",
      color: "bg-yellow-500",
    },
    {
      title: "הכנסות (₪)",
      value: stats.revenue.toLocaleString(),
      icon: "💰",
      color: "bg-emerald-500",
    },
  ];
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">סקירה כללית של המערכת</p>
      </div>
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">פעולות מהירות</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/agents"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="font-semibold">הוסף סוכן</div>
          </a>
          <a
            href="/admin/products"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
          >
            <div className="text-2xl mb-2">📦</div>
            <div className="font-semibold">הוסף מוצר</div>
          </a>
          <a
            href="/admin/orders"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-center"
          >
            <div className="text-2xl mb-2">🛒</div>
            <div className="font-semibold">צפה בהזמנות</div>
          </a>
          <a
            href="/admin/settings"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all text-center"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <div className="font-semibold">הגדרות</div>
          </a>
        </div>
      </div>
    </div>
  );
}
