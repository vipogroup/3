import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const result = await requireAdmin();
  if (!result?.ok) {
    redirect("/login?next=/admin");
  }

  return (
    <section className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="hidden md:block border-r p-4 space-y-3">
        <h2 className="text-lg font-semibold">Admin</h2>
        <nav className="grid gap-2 text-sm">
          <a href="/admin" className="hover:underline">Overview</a>
          <a href="/admin/products" className="hover:underline">Products</a>
          <a href="/admin/agents" className="hover:underline">Agents</a>
          <a href="/admin/customers" className="hover:underline">Customers</a>
          <a href="/admin/logs" className="hover:underline">Logs</a>
          <a href="/admin/reports" className="hover:underline">Reports</a>
        </nav>
      </aside>
      <main className="p-4 md:p-8">{children}</main>
    </section>
  );
}
