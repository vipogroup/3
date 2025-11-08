import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { requireAdmin } from "@/lib/auth";

const BASE_URL =
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3001";

const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "ממתין" },
  { value: "paid", label: "שולם" },
  { value: "shipped", label: "נשלח" },
  { value: "completed", label: "הושלם" },
  { value: "cancelled", label: "בוטל" },
];

export const dynamic = "force-dynamic";

export default async function AdminOrderEditPage({ params }) {
  await requireAdmin();

  const cookieHeader = cookies().toString();
  const response = await fetch(`${BASE_URL}/api/admin/orders/${params.id}`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (response.status === 404) {
    redirect("/admin/orders");
  }

  if (!response.ok) {
    throw new Error("Failed to load order");
  }

  const { item } = await response.json();
  const order = item;

  async function updateOrder(formData) {
    "use server";

    await requireAdmin();

    const cookieString = cookies().toString();
    const status = formData.get("status")?.toString() || order.status;
    const note = formData.get("note")?.toString() || "";

    const res = await fetch(`${BASE_URL}/api/admin/orders/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieString,
      },
      body: JSON.stringify({ status, note }),
      cache: "no-store",
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      throw new Error(payload?.error || "Failed to update order");
    }

    revalidatePath("/admin/orders");
    redirect("/admin/orders?flash=updated");
  }

  return (
    <section className="max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">עריכת הזמנה</h1>
        <p className="text-sm text-muted-foreground">עדכן סטטוס והערות פנימיות להזמנה.</p>
      </header>

      <form action={updateOrder} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            סטטוס הזמנה
          </label>
          <select
            id="status"
            name="status"
            defaultValue={order.status}
            className="w-full rounded-md border px-3 py-2 text-sm"
            required
          >
            {ORDER_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="note" className="text-sm font-medium">
            הערה פנימית
          </label>
          <textarea
            id="note"
            name="note"
            rows={4}
            defaultValue={order.note || ""}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1 rounded-lg border px-4 py-3 text-sm">
          <p className="font-medium text-foreground">פרטי הזמנה</p>
          <div className="flex justify-between text-muted-foreground">
            <span>מוצר</span>
            <span>{order.product?.title ?? "—"}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>לקוח</span>
            <span>{order.customer?.name ?? "—"}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>סוכן</span>
            <span>{order.agent?.name ?? "—"}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <a href={`/admin/orders/${order._id}`} className="text-sm text-muted-foreground hover:underline">
            Cancel
          </a>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
}
