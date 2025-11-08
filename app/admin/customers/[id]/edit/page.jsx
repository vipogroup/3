import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/auth";

const BASE_URL =
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3001";

export const dynamic = "force-dynamic";

export default async function AdminCustomerEditPage({ params }) {
  await requireAdmin();

  const cookieHeader = cookies().toString();
  const response = await fetch(`${BASE_URL}/api/admin/customers/${params.id}`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (response.status === 404) {
    redirect("/admin/customers");
  }

  if (!response.ok) {
    throw new Error("Failed to load customer");
  }

  const { item } = await response.json();
  const customer = item;

  async function updateCustomer(formData) {
    "use server";

    await requireAdmin();

    const cookieString = cookies().toString();
    const payload = {
      name: formData.get("name")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      note: formData.get("note")?.toString() || "",
      isActive: formData.get("isActive") === "on",
    };

    const res = await fetch(`${BASE_URL}/api/admin/customers/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieString,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      const result = await res.json().catch(() => null);
      throw new Error(result?.error || "Failed to update customer");
    }

    revalidatePath("/admin/customers");
    redirect("/admin/customers?flash=updated");
  }

  return (
    <section className="max-w-2xl space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">עריכת לקוח</h1>
        <p className="text-sm text-muted-foreground">עדכן פרטי לקוח ומידע פנימי.</p>
      </header>

      <form action={updateCustomer} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Full name</label>
          <input
            id="name"
            name="name"
            defaultValue={customer.name}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={customer.email || ""}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="note" className="text-sm font-medium">Admin note</label>
          <textarea
            id="note"
            name="note"
            rows={4}
            defaultValue={customer.note || ""}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <fieldset className="space-y-1 rounded-lg border px-4 py-3">
          <legend className="text-sm font-semibold">Meta</legend>
          <Row label="Referral source" value={customer.refSource || "ישיר"} />
          <Row
            label="Joined"
            value={customer.joinedAt ? new Date(customer.joinedAt).toLocaleString("he-IL") : "—"}
          />
        </fieldset>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={customer.isActive}
            className="h-4 w-4 rounded border"
          />
          Active customer
        </label>

        <div className="flex items-center justify-end gap-3">
          <a href="/admin/customers" className="text-sm text-muted-foreground hover:underline">
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

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
