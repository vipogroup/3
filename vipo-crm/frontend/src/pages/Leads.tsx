import { useEffect, useState } from 'react';
import { leads } from '../lib/api';
import { Plus, Search, Phone, Mail, UserCheck, Trash2, Edit, Loader2 } from 'lucide-react';

const statusLabels: Record<string, { label: string; color: string }> = {
  NEW: { label: 'חדש', color: 'bg-blue-100 text-blue-800' },
  CONTACTED: { label: 'נוצר קשר', color: 'bg-yellow-100 text-yellow-800' },
  QUALIFIED: { label: 'מתאים', color: 'bg-purple-100 text-purple-800' },
  CONVERTED: { label: 'הומר', color: 'bg-green-100 text-green-800' },
  LOST: { label: 'אבוד', color: 'bg-red-100 text-red-800' },
};

export default function Leads() {
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', source: '', notes: '' });

  const fetchLeads = async () => {
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await leads.list(params);
      setLeadsList(res.data.data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [search, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLead) await leads.update(editingLead.id, formData);
      else await leads.create(formData);
      setShowModal(false);
      setEditingLead(null);
      setFormData({ name: '', email: '', phone: '', source: '', notes: '' });
      fetchLeads();
    } catch (error) { console.error('Error saving lead:', error); }
  };

  const handleConvert = async (id: string) => {
    if (confirm('להמיר ליד זה ללקוח?')) {
      await leads.convert(id);
      fetchLeads();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('למחוק ליד זה?')) {
      await leads.delete(id);
      fetchLeads();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="חיפוש..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pr-10 pl-4 py-2 border rounded-lg" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="">כל הסטטוסים</option>
            {Object.entries(statusLabels).map(([k, { label }]) => <option key={k} value={k}>{label}</option>)}
          </select>
        </div>
        <button onClick={() => { setEditingLead(null); setFormData({ name: '', email: '', phone: '', source: '', notes: '' }); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" /><span>ליד חדש</span>
        </button>
      </div>

      {isLoading ? <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div> : leadsList.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center"><p className="text-gray-500">אין לידים</p></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="text-right px-4 py-3 text-sm">שם</th>
              <th className="text-right px-4 py-3 text-sm">קשר</th>
              <th className="text-right px-4 py-3 text-sm">סטטוס</th>
              <th className="px-4 py-3"></th>
            </tr></thead>
            <tbody className="divide-y">
              {leadsList.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{lead.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{lead.phone || lead.email || '-'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${statusLabels[lead.status]?.color}`}>{statusLabels[lead.status]?.label}</span></td>
                  <td className="px-4 py-3 flex gap-1">
                    <button onClick={() => { setEditingLead(lead); setFormData({ name: lead.name, email: lead.email || '', phone: lead.phone || '', source: lead.source || '', notes: lead.notes || '' }); setShowModal(true); }} className="p-2 hover:bg-gray-100 rounded"><Edit className="w-4 h-4" /></button>
                    {lead.status !== 'CONVERTED' && <button onClick={() => handleConvert(lead.id)} className="p-2 hover:bg-green-100 rounded"><UserCheck className="w-4 h-4 text-green-600" /></button>}
                    <button onClick={() => handleDelete(lead.id)} className="p-2 hover:bg-red-100 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-4">
            <h3 className="text-lg font-semibold mb-4">{editingLead ? 'עריכת ליד' : 'ליד חדש'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="שם *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="tel" placeholder="טלפון" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              <input type="email" placeholder="אימייל" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">שמור</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 py-2 rounded-lg">ביטול</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
