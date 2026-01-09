import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { inbox, leads, tasks, customers, whatsapp } from '../lib/api';
import {
  Inbox,
  UserPlus,
  Users,
  CheckSquare,
  Clock,
  AlertCircle,
  MessageCircle,
  Wifi,
  Phone,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stats {
  newConversations: number;
  totalLeads: number;
  totalCustomers: number;
  openTasks: number;
  overdueTasks: number;
}

interface Lead {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  source?: string;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    newConversations: 0,
    totalLeads: 0,
    totalCustomers: 0,
    openTasks: 0,
    overdueTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [whatsappStatus, setWhatsappStatus] = useState<{ configured: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingWhatsApp, setSendingWhatsApp] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [inboxRes, leadsRes, customersRes, tasksRes, myTasksRes, recentLeadsRes] = await Promise.all([
          inbox.list({ status: 'NEW', limit: '1' }),
          leads.list({ limit: '1' }),
          customers.list({ limit: '1' }),
          tasks.list({ status: 'OPEN', limit: '1' }),
          tasks.myTasks(),
          leads.list({ limit: '5' }),
        ]);

        setStats({
          newConversations: inboxRes.data.pagination?.total || 0,
          totalLeads: leadsRes.data.pagination?.total || 0,
          totalCustomers: customersRes.data.pagination?.total || 0,
          openTasks: tasksRes.data.pagination?.total || 0,
          overdueTasks: myTasksRes.data.filter((t: any) => new Date(t.dueAt) < new Date()).length,
        });

        setRecentTasks(myTasksRes.data.slice(0, 5));
        setRecentLeads(recentLeadsRes.data.data || []);

        // Check WhatsApp status
        try {
          const waStatus = await whatsapp.status();
          setWhatsappStatus(waStatus.data);
        } catch {
          setWhatsappStatus({ configured: false });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSendWhatsApp = async (lead: Lead) => {
    if (!lead.phone) return;
    setSendingWhatsApp(lead.id);
    try {
      await whatsapp.sendToLead(lead.id, undefined, 'welcome');
      alert('הודעת וואטסאפ נשלחה בהצלחה!');
    } catch (error) {
      console.error('WhatsApp send error:', error);
      alert('שגיאה בשליחת הודעה');
    } finally {
      setSendingWhatsApp(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: 'bg-blue-100 text-blue-800',
      CONTACTED: 'bg-yellow-100 text-yellow-800',
      QUALIFIED: 'bg-green-100 text-green-800',
      CONVERTED: 'bg-purple-100 text-purple-800',
      LOST: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      NEW: 'חדש',
      CONTACTED: 'נוצר קשר',
      QUALIFIED: 'מתאים',
      CONVERTED: 'הומר',
      LOST: 'אבד',
    };
    return labels[status] || status;
  };

  const statCards = [
    {
      name: 'שיחות חדשות',
      value: stats.newConversations,
      icon: Inbox,
      gradient: 'from-purple-500 to-purple-600',
      href: '/inbox?status=NEW',
    },
    {
      name: 'לידים',
      value: stats.totalLeads,
      icon: UserPlus,
      gradient: 'from-blue-500 to-blue-600',
      href: '/leads',
    },
    {
      name: 'לקוחות',
      value: stats.totalCustomers,
      icon: Users,
      gradient: 'from-cyan-500 to-cyan-600',
      href: '/customers',
    },
    {
      name: 'משימות פתוחות',
      value: stats.openTasks,
      icon: CheckSquare,
      gradient: 'from-amber-500 to-orange-500',
      href: '/tasks',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome - Purple gradient like VIPO */}
      <div className="bg-gradient-to-l from-purple-600 via-purple-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">שלום, {user?.name}! 👋</h1>
        <p className="text-purple-100">
          ברוך הבא למערכת ה-CRM של VIPO. הנה סיכום היום שלך.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-md`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Overdue Alert */}
      {stats.overdueTasks > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <div>
            <p className="font-medium text-red-800">
              יש לך {stats.overdueTasks} משימות באיחור!
            </p>
            <Link to="/tasks?overdue=true" className="text-sm text-red-600 hover:underline">
              צפה במשימות
            </Link>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900">לידים אחרונים</h2>
              {whatsappStatus?.configured && (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <Wifi className="w-3 h-3" />
                  WhatsApp מחובר
                </span>
              )}
            </div>
            <Link to="/leads" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              הצג הכל
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {recentLeads.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>אין לידים עדיין</p>
              </div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(lead.status)}`}>
                          {getStatusLabel(lead.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        {lead.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </span>
                        )}
                        {lead.source && (
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {lead.source === 'VIPO_ORDER' ? 'הזמנה מ-VIPO' : lead.source}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lead.phone && whatsappStatus?.configured && (
                        <button
                          onClick={() => handleSendWhatsApp(lead)}
                          disabled={sendingWhatsApp === lead.id}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="שלח הודעת וואטסאפ"
                        >
                          {sendingWhatsApp === lead.id ? (
                            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <MessageCircle className="w-5 h-5" />
                          )}
                        </button>
                      )}
                      <Link
                        to={`/leads?id=${lead.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">המשימות שלי</h2>
            <Link to="/tasks" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              הצג הכל
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {recentTasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>אין משימות פתוחות</p>
              </div>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        {task.customer?.name || task.lead?.name || 'ללא לקוח'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span
                        className={
                          new Date(task.dueAt) < new Date()
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }
                      >
                        {new Date(task.dueAt).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-semibold text-gray-900 mb-4">פעולות מהירות</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/leads"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <UserPlus className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-gray-700">הוסף ליד</span>
          </Link>
          <Link
            to="/inbox"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <MessageCircle className="w-6 h-6 text-green-600" />
            <span className="text-sm text-gray-700">שיחות חדשות</span>
          </Link>
          <Link
            to="/tasks"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
          >
            <CheckSquare className="w-6 h-6 text-orange-600" />
            <span className="text-sm text-gray-700">משימות</span>
          </Link>
          <Link
            to="/customers"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <Users className="w-6 h-6 text-purple-600" />
            <span className="text-sm text-gray-700">לקוחות</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
