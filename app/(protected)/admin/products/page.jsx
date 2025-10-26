import { headers } from "next/headers";
import CreateProductForm from "./CreateProductForm";
import EditProductButton from "./EditProductButton";
import DeleteProductButton from "./DeleteProductButton";

async function fetchProducts() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3001";
  const proto = h.get("x-forwarded-proto") || "http";
  const base = process.env.PUBLIC_URL || `${proto}://${host}`;
  const url = new URL(`${base}/api/products`);
  const res = await fetch(url, { cache: "no-store", headers: { cookie: h.get("cookie") || "" } });
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export default async function AdminProductsPage() {
  const { items = [] } = await fetchProducts();
  return (
    <main className="container" style={{ direction: "rtl", padding: 24 }}>
      <h1>ניהול מוצרים</h1>
      <CreateProductForm />
      <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>SKU</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>כותרת</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>מחיר</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>מטבע</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>פעיל</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p._id}>
              <td style={{ padding: 8 }}>{p.sku}</td>
              <td style={{ padding: 8 }}>{p.title}</td>
              <td style={{ padding: 8 }}>{p.price}</td>
              <td style={{ padding: 8 }}>{p.currency}</td>
              <td style={{ padding: 8 }}>{p.active ? "✓" : "✗"}</td>
              <td style={{ padding: 8, display: "flex", gap: 8 }}>
                <EditProductButton product={p} />
                <DeleteProductButton id={p._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
