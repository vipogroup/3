export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
import { requireAdmin } from '@/lib/auth/server';
import UsersList from '@/components/admin/UsersList';

export default async function UsersPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-3xl font-bold mb-6"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ניהול משתמשים
        </h1>
        <UsersList />
      </div>
    </div>
  );
}
