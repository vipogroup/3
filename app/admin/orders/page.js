import { requireAdmin } from "@/lib/auth/server";
import OrdersList from "@/components/admin/OrdersList";

export default async function OrdersPage() {
  await requireAdmin();
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">ניהול הזמנות</h1>
      <OrdersList />
    </div>
  );
}
