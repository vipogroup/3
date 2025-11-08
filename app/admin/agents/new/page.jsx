import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/auth";

const BASE_URL =
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3001";

export const dynamic = "force-dynamic";

export default async function AdminAgentNewPage() {
  await requireAdmin();

  async function createAgent(formData) {
    "use server";

    await requireAdmin();

    const cookieString = cookies().toString();
    const ratePercent = Number(formData.get("commissionRate") || "0");
    const payload = {
      name: formData.get("name")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      phone: formData.get("phone")?.toString().trim() || "",
      commissionRate: ratePercent / 100,
    };

    const response = await fetch(`${BASE_URL}/api/admin/agents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieString,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.error || "Failed to create agent");
    }

    revalidatePath("/admin/agents");
    redirect("/admin/agents?flash=created");
  }

  return (
    <section className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Agent</h1>
        <p className="text-sm text-muted-foreground">
          ניתן ליצור סוכן חדש או להפעיל משתמש קיים כסוכן במערכת.
        </p>
      </div>

      <form action={createAgent} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Full name</label>
          <input
            id="name"
            name="name"
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
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="optional@example.com"
          />
          <p className="text-xs text-muted-foreground">
            אם האימייל קיים במערכת – המשתמש הקיים יעודכן ויהפוך לסוכן.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Phone</label>
          <input
            id="phone"
            name="phone"
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="* חובה רק לסוכן חדש"
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
            defaultValue="10"
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <p className="text-xs text-muted-foreground">
            הערך נשמר באחוזים – לדוגמה 10 כמייצג 10%.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <a href="/admin/agents" className="text-sm text-muted-foreground hover:underline">
            Cancel
          </a>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create Agent
          </button>
        </div>
      </form>
    </section>
  );
}
