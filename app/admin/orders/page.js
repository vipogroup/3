import { requireAdmin } from '@/lib/auth/server';
import OrdersList from '@/components/admin/OrdersList';

export default async function OrdersPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-6"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ניהול הזמנות
        </h1>
        <OrdersList />
      </div>
    </div>
  );
}
