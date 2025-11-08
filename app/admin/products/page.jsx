import Link from "next/link";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/auth";

const BASE_URL =
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3001";

export const dynamic = "force-dynamic";

export default async function AdminProducts({ searchParams }) {
  await requireAdmin();

  const cookieHeader = cookies().toString();
  const response = await fetch(`${BASE_URL}/api/admin/products`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  let payload;
  let loadError = null;

  if (response.ok) {
    payload = await response.json();
  } else {
    loadError = (await response.json().catch(() => null))?.error ?? "Failed to load products";
    payload = { items: [] };
  }

  const products = payload.items ?? [];
  const flash = parseFlash(searchParams?.flash);
  const priceFormatter = new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 2,
  });

  return (
    <section className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">ניהול מוצרים</h1>
          <p className="text-sm text-muted-foreground">
            צור, עדכן ומחק מוצרים המשווקים לסוכנים וללקוחות.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
        >
          + Add Product
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
                Title
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Slug
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Price
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Active
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Updated
              </th>
              <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  אין מוצרים להצגה כרגע.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{product.title}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{product.slug}</td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {priceFormatter.format(product.price || 0)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        product.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {product.updatedAt ? new Date(product.updatedAt).toLocaleString("he-IL") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
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
        return "המוצר נוצר בהצלחה";
      case "updated":
        return "המוצר עודכן בהצלחה";
      case "deleted":
        return "המוצר נמחק";
      default:
        return decoded;
    }
  } catch {
    return null;
  }
}
