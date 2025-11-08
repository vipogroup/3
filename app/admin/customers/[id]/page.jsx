import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

const BASE_URL =
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3001";

export const dynamic = "force-dynamic";

export default async function AdminCustomerDetailPage({ params }) {
  await requireAdmin();

  const cookieHeader = cookies().toString();
  const response = await fetch(`${BASE_URL}/api/admin/customers/${params.id}`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to load customer");
  }

  const { item } = await response.json();
  const customer = item;

  return (
    <section className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">פרטי לקוח</h1>
          <p className="text-sm text-muted-foreground">מבט מעמיק על לקוח יחיד, כולל מקור הפניה והערות פנימיות.</p>
        </div>
        <Link
          href={`/admin/customers/${customer._id}/edit`}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          ערוך לקוח
        </Link>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">מידע כללי</h2>
          <dl className="space-y-2 text-sm">
            <Row label="שם מלא" value={customer.name} />
            <Row label="אימייל" value={customer.email || "—"} />
            <Row label="טלפון" value={customer.phone || "—"} />
            <Row
              label="תאריך הצטרפות"
              value={customer.joinedAt ? new Date(customer.joinedAt).toLocaleString("he-IL") : "—"}
            />
            <Row label="סטטוס" value={customer.isActive ? "Active" : "Inactive"} />
          </dl>
        </article>

        <article className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">מקור הפניה</h2>
          {customer.agent ? (
            <dl className="space-y-2 text-sm">
              <Row label="Agent" value={customer.agent.name} />
              <Row label="Agent Email" value={customer.agent.email || "—"} />
              <Row label="Agent ID" value={customer.agent.agentId || "—"} />
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">הלקוח הגיע ישירות או ללא שיוך לסוכן.</p>
          )}
        </article>
      </div>

      <article className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">הערת אדמין</h2>
        <p className="rounded-md border bg-muted/30 px-4 py-3 text-sm">
          {customer.note?.trim() ? customer.note : "אין הערה רשומה ללקוח זה."}
        </p>
      </article>

      <article className="space-y-4 rounded-lg border border-dashed bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">היסטוריית רכישות</h2>
        <p>תרשים רכש ועמלות יוצג כאן בשלב הבא.</p>
      </article>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
