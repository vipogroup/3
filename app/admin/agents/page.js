import { requireAdmin } from "@/lib/auth/server";
import AgentsList from "@/components/admin/AgentsList";

export default async function AgentsPage() {
  await requireAdmin();
  
  return (
    <div className="w-full max-w-6xl ml-auto mr-0 p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">ניהול סוכנים</h1>
      <AgentsList />
    </div>
  );
}
