import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/server';
import OrdersList from '@/components/admin/OrdersList';

export default async function OrdersPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ניהול הזמנות
          </h1>
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            חזרה
          </Link>
        </div>
        <OrdersList />
      </div>
    </div>
  );
}
