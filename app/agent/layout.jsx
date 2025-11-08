export const dynamic = "force-dynamic";

export default function AgentLayout({ children }) {
  return (
    <section className="min-h-screen bg-[var(--bg,#0f172a)] text-[var(--fg,#f8fafc)]">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
          <p className="text-sm opacity-70">
            נתוני ביצועים, מכירות, לידים וקישורי Referral
          </p>
        </header>
        {children}
      </div>
    </section>
  );
}
