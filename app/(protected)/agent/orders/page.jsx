import { headers } from "next/headers";
import Link from "next/link";

async function fetchMyOrders(searchParams) {
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

export default async function AgentOrdersPage({ searchParams }) {
  const { items = [] } = await fetchMyOrders(searchParams);
  return (
    <main className="container" style={{ direction: "rtl", padding: 24 }}>
      <h1>הזמנות שלי</h1>
      <div style={{ margin: "8px 0" }}>
        <Link href="/agent/orders/new">+ הזמנה חדשה</Link>
      </div>
      <OrdersFilter />
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
              <td style={{ padding: 8 }}>{o.status}</td>
              <td style={{ padding: 8 }}>{o.total}</td>
              <td style={{ padding: 8 }}>{Array.isArray(o.items) ? o.items.length : 0}</td>
              <td style={{ padding: 8 }}>
                <Link href={`/agent/orders/${o._id}`}>פתח</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

function OrdersFilter() {
  return (
    <form action="" method="GET" style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
      <select name="status" defaultValue="">
        <option value="">כל הסטטוסים</option>
        <option value="new">new</option>
        <option value="qualified">qualified</option>
        <option value="paid">paid</option>
        <option value="shipped">shipped</option>
        <option value="delivered">delivered</option>
        <option value="canceled">canceled</option>
      </select>
      <input name="q" placeholder="חפש טלפון/sku" />
      <button type="submit">סנן</button>
    </form>
  );
}
