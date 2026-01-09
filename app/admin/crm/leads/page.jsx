'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Phone,
  Mail,
  MoreVertical,
  UserCheck,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';

const STATUS_LABELS = {
  new: { label: 'חדש', color: 'bg-blue-100 text-blue-800' },
  contacted: { label: 'נוצר קשר', color: 'bg-yellow-100 text-yellow-800' },
  qualified: { label: 'מתאים', color: 'bg-green-100 text-green-800' },
  converted: { label: 'הומר', color: 'bg-purple-100 text-purple-800' },
  lost: { label: 'אבוד', color: 'bg-red-100 text-red-800' },
};

const SOURCE_LABELS = {
  website: 'אתר',
  whatsapp: 'וואטסאפ',
  phone: 'טלפון',
  referral: 'הפניה',
  agent: 'סוכן',
  manual: 'ידני',
  other: 'אחר',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, [filters.status]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.search) params.set('search', filters.search);

      const res = await fetch(`/api/crm/leads?${params}`);
      const data = await res.json();
      
      setLeads(data.leads || []);
      setStatusCounts(data.statusCounts || {});
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleConvert = async (leadId) => {
    if (!confirm('להמיר ליד זה ללקוח?')) return;
    
    try {
      const res = await fetch(`/api/crm/leads/${leadId}/convert`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchLeads();
        alert('הליד הומר ללקוח בהצלחה');
      }
    } catch (error) {
      console.error('Error converting lead:', error);
    }
  };

  const handleDelete = async (leadId) => {
    if (!confirm('למחוק ליד זה?')) return;
    
    try {
      await fetch(`/api/crm/leads/${leadId}`, { method: 'DELETE' });
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            לידים
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            ניהול לידים ומעקב אחרי לקוחות פוטנציאליים
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          ליד חדש
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilters(f => ({ ...f, status: '' }))}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            !filters.status 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          הכל ({Object.values(statusCounts).reduce((a, b) => a + b, 0)})
        </button>
        {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setFilters(f => ({ ...f, status: key }))}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filters.status === key 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            {label} ({statusCounts[key] || 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="חיפוש לפי שם, טלפון או אימייל..."
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </form>

      {/* Leads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">שם</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">טלפון</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">מקור</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">סטטוס</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">אחראי</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">תאריך</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    טוען...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    אין לידים להצגה
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {lead.name}
                      </div>
                      {lead.email && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a 
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Phone className="w-4 h-4" />
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {SOURCE_LABELS[lead.source] || lead.source}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className={`px-2 py-1 rounded text-sm font-medium ${STATUS_LABELS[lead.status]?.color}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {lead.assignedTo?.fullName || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(lead.createdAt).toLocaleDateString('he-IL')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {lead.status !== 'converted' && (
                          <button
                            onClick={() => handleConvert(lead._id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="המר ללקוח"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="מחק"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Lead Modal */}
      {showNewModal && (
        <NewLeadModal 
          onClose={() => setShowNewModal(false)} 
          onSuccess={() => {
            setShowNewModal(false);
            fetchLeads();
          }}
        />
      )}
    </div>
  );
}

function NewLeadModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'manual',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        onSuccess();
      } else {
        alert('שגיאה ביצירת הליד');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('שגיאה ביצירת הליד');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          ליד חדש
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              שם *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              טלפון *
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              אימייל
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              מקור
            </label>
            <select
              value={form.source}
              onChange={(e) => setForm(f => ({ ...f, source: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              הערות
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
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
