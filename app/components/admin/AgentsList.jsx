"use client";

import { useState, useEffect } from "react";

export default function AgentsList() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  async function fetchAgents() {
    try {
      setLoading(true);
      const res = await fetch("/api/agents");
      if (!res.ok) throw new Error("Failed to fetch agents");
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const url = editingAgent ? `/api/agents/${editingAgent._id}` : "/api/agents";
      const method = editingAgent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save agent");
      }

      // Reset form and refresh list
      setFormData({ fullName: "", email: "", phone: "", password: "" });
      setEditingAgent(null);
      setShowForm(false);
      fetchAgents();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(agent) {
    setEditingAgent(agent);
    setFormData({
      fullName: agent.fullName,
      email: agent.email,
      phone: agent.phone,
      password: "", // Don't populate password
    });
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingAgent(null);
    setFormData({ fullName: "", email: "", phone: "", password: "" });
    setError("");
  }

  if (loading) {
    return <div className="text-center py-8">טוען...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">רשימת סוכנים</h2>
          <p className="text-gray-600">סה״כ {agents.length} סוכנים</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ הוסף סוכן
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingAgent ? "עריכת סוכן" : "הוספת סוכן חדש"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">שם מלא</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">אימייל</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">טלפון</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  סיסמה {editingAgent && "(השאר ריק לשמירת הסיסמה הנוכחית)"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required={!editingAgent}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingAgent ? "עדכן" : "הוסף"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">שם</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">אימייל</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">טלפון</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תאריך יצירה</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {agents.map((agent) => (
              <tr key={agent._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{agent.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{agent.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{agent.phone || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    agent.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {agent.isActive ? "פעיל" : "לא פעיל"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(agent.createdAt).toLocaleDateString("he-IL")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleEdit(agent)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    ✏️ ערוך
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {agents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            אין סוכנים במערכת
          </div>
        )}
      </div>
    </div>
  );
}
