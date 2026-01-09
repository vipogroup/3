'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  MessageSquare, 
  CheckSquare, 
  TrendingUp,
  ArrowUpRight,
  Clock
} from 'lucide-react';

export default function CrmDashboard() {
  const [stats, setStats] = useState({
    leads: { total: 0, new: 0 },
    conversations: { total: 0, open: 0 },
    tasks: { total: 0, pending: 0, overdue: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [leadsRes, conversationsRes, tasksRes] = await Promise.all([
        fetch('/api/crm/leads?limit=1'),
        fetch('/api/crm/conversations?limit=1'),
        fetch('/api/crm/tasks?limit=1'),
      ]);

      const [leadsData, conversationsData, tasksData] = await Promise.all([
        leadsRes.json(),
        conversationsRes.json(),
        tasksRes.json(),
      ]);

      setStats({
        leads: {
          total: leadsData.pagination?.total || 0,
          new: leadsData.statusCounts?.new || 0,
        },
        conversations: {
          total: conversationsData.pagination?.total || 0,
          open: (conversationsData.statusCounts?.new || 0) + (conversationsData.statusCounts?.open || 0),
        },
        tasks: {
          total: tasksData.pagination?.total || 0,
          pending: tasksData.statusCounts?.pending || 0,
          overdue: tasksData.overdueCount || 0,
        },
      });
    } catch (error) {
      console.error('Error fetching CRM stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'לידים',
      href: '/admin/crm/leads',
      icon: Users,
      color: 'bg-blue-500',
      stats: [
        { label: 'סה"כ', value: stats.leads.total },
        { label: 'חדשים', value: stats.leads.new, highlight: true },
      ],
    },
    {
      title: 'שיחות',
      href: '/admin/crm/inbox',
      icon: MessageSquare,
      color: 'bg-green-500',
      stats: [
        { label: 'סה"כ', value: stats.conversations.total },
        { label: 'פתוחות', value: stats.conversations.open, highlight: true },
      ],
    },
    {
      title: 'משימות',
      href: '/admin/crm/tasks',
      icon: CheckSquare,
      color: 'bg-purple-500',
      stats: [
        { label: 'ממתינות', value: stats.tasks.pending },
        { label: 'באיחור', value: stats.tasks.overdue, highlight: true, danger: true },
      ],
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          מערכת CRM
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          ניהול לידים, שיחות ומשימות
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {card.title}
            </h3>
            <div className="flex gap-4">
              {card.stats.map((stat, idx) => (
                <div key={idx}>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${
                    stat.danger ? 'text-red-500' : 
                    stat.highlight ? 'text-blue-600' : 
                    'text-gray-900 dark:text-white'
                  }`}>
                    {loading ? '...' : stat.value}
                  </p>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          פעולות מהירות
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/crm/leads?action=new"
            className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>ליד חדש</span>
          </Link>
          <Link
            href="/admin/crm/inbox?action=new"
            className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span>שיחה חדשה</span>
          </Link>
          <Link
            href="/admin/crm/tasks?action=new"
            className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <CheckSquare className="w-5 h-5" />
            <span>משימה חדשה</span>
          </Link>
          <Link
            href="/admin/crm/tasks?filter=overdue"
            className="flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <Clock className="w-5 h-5" />
            <span>משימות באיחור</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
