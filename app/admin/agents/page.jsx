import Link from "next/link";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/auth";

const BASE_URL =
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3001";

export const dynamic = "force-dynamic";

export default async function AdminAgents({ searchParams }) {
  await requireAdmin();

  const cookieHeader = cookies().toString();
  const response = await fetch(`${BASE_URL}/api/admin/agents`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  let payload;
  let loadError = null;

  if (response.ok) {
    payload = await response.json();
  } else {
    loadError = (await response.json().catch(() => null))?.error ?? "Failed to load agents";
    payload = { items: [] };
  }

  const agents = payload.items ?? [];
  const flash = parseFlash(searchParams?.flash);
  const rateFormatter = new Intl.NumberFormat("he-IL", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">ניהול סוכנים</h1>
          <p className="text-sm text-muted-foreground">
            החזק את צוות הסוכנים מעודכן, נהל סטטוס עמלות והפעלת חשבונות.
          </p>
        </div>
        <Link
          href="/admin/agents/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
        >
          + Create Agent
        </Link>
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
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Agent ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Commission
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {agents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  אין סוכנים להצגה כרגע.
                </td>
              </tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent._id}>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{agent.fullName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{agent.email || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{agent.agentId || "—"}</td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {rateFormatter.format(agent.commissionRate ?? 0)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge isActive={agent.isActive} />
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <Link
                      href={`/admin/agents/${agent._id}/edit`}
                      className="font-medium text-primary hover:underline"
                    >
                      Edit
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
        return "הסוכן נוצר בהצלחה";
      case "updated":
        return "הפרטים עודכנו";
      case "deleted":
        return "הסוכן הושבת";
      default:
        return decoded;
    }
  } catch {
    return null;
  }
}

function StatusBadge({ isActive }) {
  const styles = isActive
    ? "bg-emerald-100 text-emerald-700"
    : "bg-amber-100 text-amber-700";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${styles}`}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
