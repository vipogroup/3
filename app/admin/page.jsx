export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4">New signups (24h): —</div>
        <div className="border rounded-xl p-4">Sales (24h): —</div>
        <div className="border rounded-xl p-4">Commissions (24h): —</div>
      </div>
      <div className="border rounded-xl p-4">Recent activity —</div>
    </div>
  );
}
