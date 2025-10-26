export const dynamic = "force-dynamic";

import { headers } from "next/headers";

export default async function ProductsPage() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const protocol = h.get("x-forwarded-proto") || "http";
  const baseUrl = process.env.PUBLIC_URL || `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  const products = Array.isArray(data.items) ? data.items : [];

  return (
    <main>
      <h1>מוצרים</h1>
      <ul>
        {products.map((p, i) => (
          <li key={p._id || i}>{p.title || p.name || "Unnamed"}</li>
        ))}
      </ul>
    </main>
  );
}
