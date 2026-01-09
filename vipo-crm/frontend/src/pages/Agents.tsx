import { useEffect, useState } from 'react';
import { agents } from '../lib/api';
import { Plus, Copy, RefreshCw, UserPlus, Link, Ticket, Loader2 } from 'lucide-react';

export default function Agents() {
  const [agentsList, setAgentsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', commissionRate: 10 });

  const fetchAgents = async () => {
    try {
      const res = await agents.list();
      setAgentsList(res.data.data || []);
    } catch (error) { console.error('Error:', error); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchAgents(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await agents.create(formData);
    setShowModal(false);
    setFormData({ name: '', email: '', phone: '', commissionRate: 10 });
    fetchAgents();
  };

  const handleRegenerateCodes = async (id: string) => {
    if (confirm('ליצור קודים חדשים?')) {
      await agents.regenerateCodes(id);
      fetchAgents();
    }
  };

  const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); alert('הועתק!'); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">ניהול סוכנים</h2>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" /><span>סוכן חדש</span>
        </button>
      </div>

      {isLoading ? <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div> : agentsList.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center"><UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" /><p className="text-gray-500">אין סוכנים</p></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agentsList.map((agent) => (
            <div key={agent.id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">{agent.name?.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-sm text-gray-500">{agent.email || agent.phone || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold">{agent._count?.leads || 0}</p>
                  <p className="text-xs text-gray-500">לידים</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold">{agent.commissionRate}%</p>
                  <p className="text-xs text-gray-500">עמלה</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <Link className="w-4 h-4 text-blue-600" />
                  <code className="flex-1 text-sm">{agent.linkCode}</code>
                  <button onClick={() => copyToClipboard(agent.linkCode)} className="p-1 hover:bg-blue-100 rounded"><Copy className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                  <Ticket className="w-4 h-4 text-purple-600" />
                  <code className="flex-1 text-sm">{agent.couponCode}</code>
                  <button onClick={() => copyToClipboard(agent.couponCode)} className="p-1 hover:bg-purple-100 rounded"><Copy className="w-4 h-4" /></button>
                </div>
              </div>
              <button onClick={() => handleRegenerateCodes(agent.id)} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                <RefreshCw className="w-4 h-4" /><span>יצירת קודים חדשים</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-4">
            <h3 className="text-lg font-semibold mb-4">סוכן חדש</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="שם *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
              <input type="email" placeholder="אימייל" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              <input type="tel" placeholder="טלפון" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              <input type="number" placeholder="אחוז עמלה" min="0" max="100" value={formData.commissionRate} onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">צור סוכן</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 py-2 rounded-lg">ביטול</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
