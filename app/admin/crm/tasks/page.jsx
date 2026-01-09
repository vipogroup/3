'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Clock,
  AlertCircle,
  Calendar,
  User,
  Phone,
  CheckCircle,
  XCircle
} from 'lucide-react';

const STATUS_LABELS = {
  pending: { label: 'ממתין', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  in_progress: { label: 'בביצוע', color: 'bg-blue-100 text-blue-800', icon: Clock },
  completed: { label: 'הושלם', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'בוטל', color: 'bg-gray-100 text-gray-800', icon: XCircle },
};

const TYPE_LABELS = {
  follow_up: 'מעקב',
  call: 'שיחה',
  meeting: 'פגישה',
  email: 'אימייל',
  whatsapp: 'וואטסאפ',
  other: 'אחר',
};

const PRIORITY_COLORS = {
  low: 'border-l-gray-400',
  normal: 'border-l-blue-400',
  high: 'border-l-orange-400',
  urgent: 'border-l-red-500',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({});
  const [overdueCount, setOverdueCount] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    myTasks: true,
  });
  const [showNewModal, setShowNewModal] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.myTasks) params.set('myTasks', 'true');

      const res = await fetch(`/api/crm/tasks?${params}`);
      const data = await res.json();
      
      setTasks(data.tasks || []);
      setStatusCounts(data.statusCounts || {});
      setOverdueCount(data.overdueCount || 0);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.myTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleComplete = async (taskId) => {
    try {
      await fetch(`/api/crm/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('למחוק משימה זו?')) return;
    
    try {
      await fetch(`/api/crm/tasks/${taskId}`, { method: 'DELETE' });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const isOverdue = (task) => {
    return task.status === 'pending' && new Date(task.dueAt) < new Date();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            משימות
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            ניהול משימות ותזכורות
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          משימה חדשה
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilters(f => ({ ...f, status: '' }))}
            className={`px-4 py-2 rounded-lg ${
              !filters.status ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            הכל
          </button>
          <button
            onClick={() => setFilters(f => ({ ...f, status: 'pending' }))}
            className={`px-4 py-2 rounded-lg ${
              filters.status === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            ממתינות ({statusCounts.pending || 0})
          </button>
          <button
            onClick={() => setFilters(f => ({ ...f, status: 'completed' }))}
            className={`px-4 py-2 rounded-lg ${
              filters.status === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            הושלמו ({statusCounts.completed || 0})
          </button>
        </div>

        {overdueCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            {overdueCount} משימות באיחור
          </div>
        )}

        <label className="flex items-center gap-2 mr-auto">
          <input
            type="checkbox"
            checked={filters.myTasks}
            onChange={(e) => setFilters(f => ({ ...f, myTasks: e.target.checked }))}
            className="rounded"
          />
          <span className="text-gray-700 dark:text-gray-300">רק המשימות שלי</span>
        </label>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500">טוען...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">אין משימות</div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 border-l-4 ${PRIORITY_COLORS[task.priority]} ${
                isOverdue(task) ? 'bg-red-50 dark:bg-red-900/20' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => handleComplete(task._id)}
                  disabled={task.status === 'completed'}
                  className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    task.status === 'completed'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {task.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-medium ${
                        task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${STATUS_LABELS[task.status]?.color}`}>
                      {STATUS_LABELS[task.status]?.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(task.dueAt).toLocaleDateString('he-IL')}
                      {isOverdue(task) && (
                        <span className="text-red-500 font-medium mr-1">(באיחור)</span>
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {task.assignedTo?.fullName || '-'}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {TYPE_LABELS[task.type]}
                    </span>
                    {task.leadId && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {task.leadId.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Task Modal */}
      {showNewModal && (
        <NewTaskModal 
          onClose={() => setShowNewModal(false)} 
          onSuccess={() => {
            setShowNewModal(false);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
}

function NewTaskModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'follow_up',
    priority: 'normal',
    dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/crm/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          dueAt: new Date(form.dueAt),
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        alert('שגיאה ביצירת המשימה');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('שגיאה ביצירת המשימה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          משימה חדשה
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              כותרת *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              תיאור
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                סוג
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                {Object.entries(TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                עדיפות
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="low">נמוכה</option>
                <option value="normal">רגילה</option>
                <option value="high">גבוהה</option>
                <option value="urgent">דחופה</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              תאריך יעד *
            </label>
            <input
              type="datetime-local"
              required
              value={form.dueAt}
              onChange={(e) => setForm(f => ({ ...f, dueAt: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'שומר...' : 'שמור'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
