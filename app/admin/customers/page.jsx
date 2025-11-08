import Link from "next/link";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/auth";

const BASE_URL =
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3001";

export const dynamic = "force-dynamic";

export default async function AdminCustomers({ searchParams }) {
  await requireAdmin();

  const cookieHeader = cookies().toString();
  const response = await fetch(`${BASE_URL}/api/admin/customers`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  let payload;
  let loadError = null;

  if (response.ok) {
    payload = await response.json();
  } else {
    loadError = (await response.json().catch(() => null))?.error ?? "Failed to load customers";
    payload = { items: [] };
  }

  const customers = payload.items ?? [];
  const flash = parseFlash(searchParams?.flash);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">ניהול לקוחות</h1>
          <p className="text-sm text-muted-foreground">
            צפייה ועריכת לקוחות, כולל מקור הפניה ותאריכי הצטרפות.
          </p>
        </div>
        <Link
          href="/admin/agents"
          className="text-sm text-primary hover:underline"
        >
          נהל סוכנים
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
                Joined
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Referral Source
              </th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  אין לקוחות להצגה כרגע.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{customer.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{customer.email || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {customer.joinedAt ? new Date(customer.joinedAt).toLocaleDateString("he-IL") : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {customer.refSource ? customer.refSource : "ישיר"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm space-x-3">
                    <Link href={`/admin/customers/${customer._id}`} className="text-primary hover:underline">
                      View
                    </Link>
                    <span className="text-muted-foreground">·</span>
                    <Link href={`/admin/customers/${customer._id}/edit`} className="text-primary hover:underline">
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
      case "updated":
        return "הפרטים עודכנו";
      default:
        return decoded;
    }
  } catch {
    return null;
  }
}
