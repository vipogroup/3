'use client';

import { formatCurrencyILS } from '@/app/utils/date';

/**
 * Leaderboard table component for displaying top agents
 * @param {Object} props - Component props
 * @param {Array} props.rows - Array of agent performance objects
 */
export default function LeaderboardTable({ rows = [] }) {
  // Sort rows by totalSales in descending order
  const sortedRows = [...rows].sort((a, b) => b.totalSales - a.totalSales);

  // Limit to top 10 agents
  const topAgents = sortedRows.slice(0, 10);

  // Format agent name or use placeholder
  const formatAgentName = (agent) => {
    if (agent.agentName) return agent.agentName;
    if (agent.agentId) {
      // Create a short ID from the full ID
      const shortId = agent.agentId.toString().slice(-6);
      return `סוכן #${shortId}`;
    }
    return 'לא ידוע';
  };

  if (topAgents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">אין נתונים להצגה</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                סוכן
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                עסקאות
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                סך מכירות
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                סך עמלות
              </th>
            </tr>
          </thead>
          <tbody>
            {topAgents.map((agent, index) => (
              <tr key={agent.agentId || index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700 border-b">
                  {formatAgentName(agent)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 border-b text-right">
                  {agent.count}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 border-b text-right">
                  {formatCurrencyILS(agent.totalSales)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 border-b text-right">
                  {formatCurrencyILS(agent.totalCommission)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > 10 && (
        <div className="px-4 py-2 bg-gray-50 border-t text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800">צפה בכל</button>
        </div>
      )}
    </div>
  );
}
