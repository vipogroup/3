import { getUserFromCookies } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import AgentDashboardClient from './components/AgentDashboardClient';
import AgentHeader from './components/AgentHeader';
import AgentLinkSection from './components/AgentLinkSection';
import AgentStatsSection from './components/AgentStatsSection';
import AgentCommissionsClient from './components/AgentCommissionsClient';

export default async function AgentPage() {
  const user = await getUserFromCookies();
  if (!user) redirect('/login');

  return (
    <AgentDashboardClient>
      <main className="min-h-[calc(100vh-64px)] bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Header with Business Selector */}
          <AgentHeader />

          {/* Personal Link + Coupon Section - Dynamic per Business */}
          <AgentLinkSection />

          {/* Statistics Section - Dynamic per Business */}
          <AgentStatsSection />

          {/* Commissions Section */}
          <section className="mb-6">
            <AgentCommissionsClient />
          </section>
        </div>
      </main>
    </AgentDashboardClient>
  );
}

