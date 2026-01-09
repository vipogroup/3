import { useEffect, useState } from 'react';
import { tasks } from '../lib/api';
import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Calendar,
  User,
} from 'lucide-react';

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  OPEN: { label: 'פתוח', color: 'bg-blue-100 text-blue-800', icon: Clock },
  DONE: { label: 'הושלם', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  OVERDUE: { label: 'באיחור', color: 'bg-red-100 text-red-800', icon: AlertCircle },
  CANCELED: { label: 'בוטל', color: 'bg-gray-100 text-gray-800', icon: Clock },
};

const typeLabels: Record<string, string> = {
  FOLLOW_UP: 'מעקב',
  CALL: 'שיחה',
  SEND_INFO: 'שליחת מידע',
  OTHER: 'אחר',
};

export default function Tasks() {
  const [tasksList, setTasksList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('OPEN');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'FOLLOW_UP',
    dueAt: '',
  });

  const fetchTasks = async () => {
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      
      const res = await tasks.list(params);
      setTasksList(res.data.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tasks.create(formData);
      setShowModal(false);
      setFormData({ title: '', description: '', type: 'FOLLOW_UP', dueAt: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await tasks.complete(id);
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const isOverdue = (dueAt: string) => {
    return new Date(dueAt) < new Date();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          {Object.entries(statusLabels).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>משימה חדשה</span>
        </button>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : tasksList.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">אין משימות</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-blue-600 hover:underline"
          >
            צור משימה ראשונה
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasksList.map((task) => {
            const StatusIcon = statusLabels[task.status]?.icon || Clock;
            const overdue = task.status === 'OPEN' && isOverdue(task.dueAt);
            
            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl p-4 shadow-sm ${
                  overdue ? 'border-r-4 border-red-500' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {task.status === 'OPEN' ? (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="mt-1 w-6 h-6 rounded-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 text-transparent hover:text-green-500" />
                    </button>
                  ) : (
                    <div className={`mt-1 p-1 rounded-full ${statusLabels[task.status]?.color}`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-medium ${task.status === 'DONE' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${statusLabels[task.status]?.color}`}>
                        {statusLabels[task.status]?.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className={overdue ? 'text-red-600 font-medium' : ''}>
                          {new Date(task.dueAt).toLocaleDateString('he-IL')}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {typeLabels[task.type] || task.type}
                      </span>
                      {(task.customer || task.lead) && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{task.customer?.name || task.lead?.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">משימה חדשה</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">כותרת *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סוג</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תאריך יעד *</label>
                <input
                  type="datetime-local"
                  value={formData.dueAt}
                  onChange={(e) => setFormData({ ...formData, dueAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  צור משימה
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
