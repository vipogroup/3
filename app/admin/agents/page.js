import { requireAdmin } from "@/lib/auth/server";
import AgentsList from "@/components/admin/AgentsList";

export default async function AgentsPage() {
  await requireAdmin();
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">ניהול סוכנים</h1>
      <AgentsList />
    </div>
  );
}
