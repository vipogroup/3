import { headers } from "next/headers";
import StatusSelect from "./StatusSelect";
import Toolbar from "./Toolbar";

async function fetchOrders(searchParams) {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3001";
  const proto = h.get("x-forwarded-proto") || "http";
  const base = process.env.PUBLIC_URL || `${proto}://${host}`;
  const url = new URL(`${base}/api/orders`);
  if (searchParams?.status) url.searchParams.set("status", searchParams.status);
  if (searchParams?.q) url.searchParams.set("q", searchParams.q);
  const res = await fetch(url, { cache: "no-store", headers: { cookie: h.get("cookie") || "" } });
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

export default async function AdminOrdersPage({ searchParams }) {
  const { items = [] } = await fetchOrders(searchParams);
  return (
    <main className="container" style={{ direction: "rtl", padding: 24 }}>
      <h1>ניהול הזמנות</h1>
      <Toolbar initialQ={searchParams?.q || ""} initialStatus={searchParams?.status || ""} />
      <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>לקוח</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>טלפון</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>סטטוס</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>סה"כ</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>פריטים</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {items.map((o) => (
            <tr key={o._id}>
              <td style={{ padding: 8 }}>{o.customer?.fullName || ""}</td>
              <td style={{ padding: 8 }}>{o.customer?.phone || ""}</td>
              <td style={{ padding: 8 }}>
                <StatusSelect id={o._id} value={o.status} />
              </td>
              <td style={{ padding: 8 }}>{o.total}</td>
              <td style={{ padding: 8 }}>{Array.isArray(o.items) ? o.items.length : 0}</td>
              <td style={{ padding: 8 }}>
                <details>
                  <summary>הצג</summary>
                  <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(o, null, 2)}</pre>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
