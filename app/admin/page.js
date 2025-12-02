import { requireAdmin } from '@/lib/auth/server';
import dynamic from 'next/dynamic';

const AdminDashboardClient = dynamic(() => import('./components/AdminDashboardClient'), {
  ssr: false,
});

export default async function AdminDashboardPage() {
  await requireAdmin();

  return <AdminDashboardClient />;
}
