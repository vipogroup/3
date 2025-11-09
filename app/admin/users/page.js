export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
import { requireAdmin } from "@/lib/auth/server";
import UsersList from "@/components/admin/UsersList";

export default async function UsersPage() {
  await requireAdmin();
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">ניהול משתמשים</h1>
      <UsersList />
    </div>
  );
}
