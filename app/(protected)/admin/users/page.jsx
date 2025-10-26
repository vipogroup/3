import { headers } from "next/headers";
import CreateUserForm from "./CreateUserForm";
import EditUserButton from "./EditUserButton";
import ResetPassButton from "./ResetPassButton";

async function fetchUsers() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3001";
  const proto = h.get("x-forwarded-proto") || "http";
  const base = process.env.PUBLIC_URL || `${proto}://${host}`;
  const res = await fetch(`${base}/api/users?page=1&limit=50`, {
    cache: "no-store",
    headers: { cookie: h.get("cookie") || "" },
  });
  if (!res.ok) throw new Error("Failed to load users");
  return res.json();
}

export default async function AdminUsersPage() {
  const { items = [] } = await fetchUsers();
  return (
    <main className="container" style={{ direction: "rtl", padding: 24 }}>
      <h1>ניהול משתמשים</h1>
      <CreateUserForm />
      <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>שם</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>טלפון</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>תפקיד</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>נוצר</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u._id}>
              <td style={{ padding: 8 }}>{u.fullName}</td>
              <td style={{ padding: 8 }}>{u.phone}</td>
              <td style={{ padding: 8 }}>{u.role}</td>
              <td style={{ padding: 8 }}>{u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}</td>
              <td style={{ padding: 8, display: "flex", gap: 8 }}>
                <EditUserButton user={u} />
                <ResetPassButton id={u._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
