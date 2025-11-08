import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { requireAdmin } from "@/lib/auth";

const BASE_URL =
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3001";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }) {
  await requireAdmin();

  const cookieHeader = cookies().toString();
  const response = await fetch(`${BASE_URL}/api/admin/orders/${params.id}`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (response.status === 404) {
    return notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to load order");
  }

  const { item } = await response.json();
  const order = item;

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">הזמנה #{order._id}</h1>
          <p className="text-sm text-muted-foreground">פרטי הזמנה מלאה.</p>
        </div>
        <Link
          href={`/admin/orders/${order._id}/edit`}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          Edit Order
        </Link>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">מוצר</h2>
          {order.product ? (
            <dl className="space-y-2 text-sm">
              <InfoRow label="שם מוצר" value={order.product.title} />
              {order.product.slug ? (
                <InfoRow
                  label="עמוד מוצר"
                  value={
                    <Link
                      href={`/p/${order.product.slug}`}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      צפה במוצר
                    </Link>
                  }
                />
              ) : null}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">לא נמצא מוצר.</p>
          )}
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">נתוני רכישה</h2>
          <dl className="space-y-2 text-sm">
            <InfoRow label="כמות" value={order.quantity} />
            <InfoRow label="מחיר" value={`₪${Number(order.price ?? 0).toLocaleString("he-IL")}`} />
            <InfoRow label="סטטוס" value={formatStatus(order.status)} />
            <InfoRow label="הערה" value={order.note || "—"} />
          </dl>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">לקוח</h2>
          {order.customer ? (
            <dl className="space-y-2 text-sm">
              <InfoRow label="שם" value={order.customer.name || "—"} />
              <InfoRow label="אימייל" value={order.customer.email || "—"} />
              <InfoRow
                label="קישור ללקוח"
                value={
                  <Link
                    href={`/admin/customers/${order.customer._id}`}
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    הצג לקוח
                  </Link>
                }
              />
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">לא מקושר לקוח.</p>
          )}
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">סוכן</h2>
          {order.agent ? (
            <dl className="space-y-2 text-sm">
              <InfoRow label="שם" value={order.agent.name || "—"} />
              <InfoRow label="אימייל" value={order.agent.email || "—"} />
              <InfoRow
                label="קישור לסוכן"
                value={
                  <Link
                    href={`/admin/agents/${order.agent._id}/edit`}
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    ערוך סוכן
                  </Link>
                }
              />
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">אין סוכן משויך להזמנה זו.</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold">היסטוריית זמן</h2>
        <dl className="space-y-2 text-sm">
          <InfoRow
            label="נוצר"
            value={order.createdAt ? new Date(order.createdAt).toLocaleString("he-IL") : "—"}
          />
          <InfoRow
            label="עודכן"
            value={order.updatedAt ? new Date(order.updatedAt).toLocaleString("he-IL") : "—"}
          />
        </dl>
      </div>
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

function formatStatus(status) {
  switch (status) {
    case "pending":
      return "ממתין";
    case "paid":
      return "שולם";
    case "shipped":
      return "נשלח";
    case "completed":
      return "הושלם";
    case "cancelled":
      return "בוטל";
    default:
      return status;
  }
}
