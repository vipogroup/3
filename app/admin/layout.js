import { getUserFromCookies } from "@/lib/auth/server";
import AdminShell from "./AdminShell";

export default async function AdminLayout({ children }) {
  const user = await getUserFromCookies();

  return <AdminShell user={user}>{children}</AdminShell>;
}
