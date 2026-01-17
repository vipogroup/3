import { getUserFromCookies } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
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

          {/* Quick Actions - Marketplace Link */}
          <section className="mb-6">
            <Link
              href="/agent/marketplace"
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-l from-[#1e3a8a]/5 to-[#0891b2]/5 border border-[#0891b2]/20 hover:border-[#0891b2]/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-l from-[#1e3a8a] to-[#0891b2] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">שוק העסקים</h3>
                  <p className="text-xs text-gray-500">הצטרף לעסקים נוספים והרוויח עמלות</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </section>

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

