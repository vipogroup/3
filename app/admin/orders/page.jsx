import Link from "next/link";
import { cookies } from "next/headers";

import { requireAdmin } from "@/lib/auth";

const BASE_URL =
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3001";

const STATUS_LABELS = {
  pending: "ממתין",
  paid: "שולם",
  shipped: "נשלח",
  completed: "הושלם",
  cancelled: "בוטל",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({ searchParams }) {
  await requireAdmin();

  const cookieHeader = cookies().toString();
  const response = await fetch(`${BASE_URL}/api/admin/orders`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  let payload = { items: [] };
  let loadError = null;

  if (response.ok) {
    payload = await response.json();
  } else {
    loadError = (await response.json().catch(() => null))?.error ?? "Failed to load orders";
  }

  const orders = payload.items ?? [];
  const flash = parseFlash(searchParams?.flash);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">ניהול הזמנות</h1>
          <p className="text-sm text-muted-foreground">
            סקירה מהירה של הזמנות אחרונות, כולל סטטוס ורשומות קשורות.
          </p>
        </div>
      </header>

      {flash && (
        <div className="rounded-md border border-primary/40 bg-primary/10 px-4 py-3 text-sm">
          {flash}
        </div>
      )}

      {loadError && (
        <div className="rounded-md border border-red-200 bg-red-100 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Order ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Product
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Customer
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Agent
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Price
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Created
              </th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  אין הזמנות להצגה כרגע.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{order._id}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {order.product?.title ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {order.customer?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {order.agent?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    ₪{Number(order.price ?? 0).toLocaleString("he-IL")}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-muted-foreground">
                    {STATUS_LABELS[order.status] ?? order.status}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString("he-IL") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="inline-flex items-center rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function parseFlash(value) {
  if (!value) return null;
  try {
    const decoded = decodeURIComponent(value);
    switch (decoded) {
      case "created":
        return "הזמנה נוצרה בהצלחה";
      case "updated":
        return "הזמנה עודכנה";
      default:
        return decoded;
    }
  } catch {
    return null;
  }
}
