import { requireAdmin } from "@/lib/auth/server";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  await requireAdmin();
  
  return <SettingsForm />;
}
