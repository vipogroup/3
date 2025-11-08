import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/auth";

const BASE_URL =
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3001";

export const dynamic = "force-dynamic";

export default async function AdminAgentEditPage({ params }) {
  await requireAdmin();

  const cookieHeader = cookies().toString();
  const response = await fetch(`${BASE_URL}/api/admin/agents/${params.id}`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to load agent");
  }

  const { item } = await response.json();
  const agent = item;
  const commissionPercent = (agent.commissionRate ?? 0) * 100;

  async function updateAgent(formData) {
    "use server";

    await requireAdmin();

    const ratePercent = Number(formData.get("commissionRate") || "0");
    const payload = {
      fullName: formData.get("name")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      phone: formData.get("phone")?.toString().trim() || "",
      commissionRate: ratePercent / 100,
      isActive: formData.get("isActive") === "on",
    };

    const cookieString = cookies().toString();
    const res = await fetch(`${BASE_URL}/api/admin/agents/${params.id}`, {
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
      throw new Error(result?.error || "Failed to update agent");
    }

    revalidatePath("/admin/agents");
    redirect("/admin/agents?flash=updated");
  }

  async function toggleAgent() {
    "use server";

    await requireAdmin();

    const cookieString = cookies().toString();
    const res = await fetch(`${BASE_URL}/api/admin/agents/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieString,
      },
      body: JSON.stringify({ isActive: !agent.isActive }),
      cache: "no-store",
    });

    if (!res.ok) {
      const result = await res.json().catch(() => null);
      throw new Error(result?.error || "Failed to update agent status");
    }

    revalidatePath("/admin/agents");
    redirect("/admin/agents?flash=updated");
  }

  async function deactivateAgent() {
    "use server";

    await requireAdmin();

    const cookieString = cookies().toString();
    const res = await fetch(`${BASE_URL}/api/admin/agents/${params.id}`, {
      method: "DELETE",
      headers: {
        Cookie: cookieString,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const result = await res.json().catch(() => null);
      throw new Error(result?.error || "Failed to deactivate agent");
    }

    revalidatePath("/admin/agents");
    redirect("/admin/agents?flash=deleted");
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Edit Agent</h1>
        <p className="text-sm text-muted-foreground">
          עדכן פרטי סוכן, עמלה וסטטוס פעילות.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <form action={updateAgent} className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Full name</label>
            <input
              id="name"
              name="name"
              defaultValue={agent.fullName}
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
              defaultValue={agent.email || ""}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Phone</label>
            <input
              id="phone"
              name="phone"
              defaultValue={agent.phone || ""}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="commissionRate" className="text-sm font-medium">Commission rate (%)</label>
            <input
              id="commissionRate"
              name="commissionRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              defaultValue={commissionPercent.toFixed(2)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={agent.isActive}
              className="h-4 w-4 rounded border"
            />
            Active agent
          </label>

          <div className="flex items-center justify-end gap-3">
            <a href="/admin/agents" className="text-sm text-muted-foreground hover:underline">
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

        <aside className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold">Agent Details</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Agent ID</dt>
                <dd className="font-mono">{agent.agentId || "—"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd>{agent.isActive ? "Active" : "Inactive"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Commission total</dt>
                <dd>₪{(agent.commissionTotal ?? 0).toLocaleString("he-IL")}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Total sales</dt>
                <dd>₪{(agent.totalSales ?? 0).toLocaleString("he-IL")}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            נתוני ביצועים מפורטים יופיעו כאן בהמשך (KPIs, המרות, עמלות).
          </div>

          <div className="space-y-2">
            <form action={toggleAgent}>
              <button
                type="submit"
                className="w-full rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {agent.isActive ? "Mark as Inactive" : "Mark as Active"}
              </button>
            </form>

            <form action={deactivateAgent}>
              <button
                type="submit"
                className="w-full rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Disable Agent
              </button>
            </form>
          </div>
        </aside>
      </div>
    </section>
  );
}
