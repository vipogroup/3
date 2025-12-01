"use client";

import { useState, useEffect } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [agents, setAgents] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchUsers();
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setCurrentUserId(data.sub);
      }
    } catch (err) {
      console.error("Failed to get current user:", err);
    }
  }

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      // API returns 'items' not 'users'
      const usersList = data.items || data.users || [];
      setUsers(usersList);
      
      // Fetch agent names for users with referredBy
      const agentIds = [...new Set(usersList.filter(u => u.referredBy).map(u => u.referredBy))];
      if (agentIds.length > 0) {
        fetchAgents(agentIds);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAgents(agentIds) {
    try {
      const agentPromises = agentIds.map(id => 
        fetch(`/api/users/${id}`).then(r => r.ok ? r.json() : null)
      );
      const agentResults = await Promise.all(agentPromises);
      const agentsMap = {};
      agentResults.forEach((result, index) => {
        if (result && result.user) {
          agentsMap[agentIds[index]] = result.user.fullName || result.user.email;
        }
      });
      setAgents(agentsMap);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  }

  async function handleDeleteUser(user) {
    if (!user?._id) return;

    if (user._id === currentUserId) {
      setError("לא ניתן למחוק את עצמך");
      return;
    }

    if (!confirm(`האם למחוק את המשתמש ${user.fullName || user.email || user.phone}?`)) {
      return;
    }

    try {
      setError("");
      setDeletingId(user._id);
      const res = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (err) {
      setError(err.message || "מחיקה נכשלה");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleActive(user) {
    if (!user?._id) return;

    if (user._id === currentUserId) {
      setError("לא ניתן לשנות את הסטטוס של עצמך");
      return;
    }

    try {
      setError("");
      setTogglingId(user._id);
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update status");
      }

      const { user: updated } = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isActive: updated?.isActive } : u))
      );
    } catch (err) {
      setError(err.message || "עדכון סטטוס נכשל");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleRoleChange(userId, newRole) {
    // Check if trying to remove last admin
    const adminCount = users.filter(u => u.role === "admin").length;
    const user = users.find(u => u._id === userId);
    
    if (user.role === "admin" && newRole !== "admin" && adminCount === 1) {
      setError("לא ניתן להוריד את המנהל האחרון במערכת");
      return;
    }

    // Check if trying to change own role
    if (userId === currentUserId) {
      setError("לא ניתן לשנות את התפקיד של עצמך");
      return;
    }

    try {
      setError("");
      const res = await fetch("/api/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update role");
      }

      // Update local state
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: newRole } : u
      ));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <div className="text-center py-8">טוען...</div>;
  }

  const roleOptions = [
    { value: "customer", label: "לקוח", color: "bg-blue-100 text-blue-800" },
    { value: "agent", label: "סוכן", color: "bg-green-100 text-green-800" },
    { value: "admin", label: "מנהל", color: "bg-red-100 text-red-800" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">רשימת משתמשים</h2>
        <p className="text-gray-600">סה״כ {users.length} משתמשים</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תפקיד</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">הופנה על ידי</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תאריך הצטרפות</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => {
              const roleOption = roleOptions.find(r => r.value === user.role);
              const isCurrentUser = user._id === currentUserId;
              
              return (
                <tr key={user._id} className={`hover:bg-gray-50 ${isCurrentUser ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.fullName || user.email}
                    {isCurrentUser && <span className="text-xs text-blue-600 mr-2">(אתה)</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 justify-end">
                      <span>{user.phone || "-"}</span>
                      {user.phone && (
                        <a
                          href={buildWhatsAppUrl(user.phone, `היי ${user.fullName || ""}, כאן VIPO`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold bg-green-500 text-white hover:bg-green-600 transition"
                        >
                          ווצאפ
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${roleOption?.color}`}>
                      {roleOption?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.referredBy ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">🤝</span>
                        <span className="text-sm font-medium text-green-700">
                          {agents[user.referredBy] || "טוען..."}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 justify-end">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {user.isActive ? "פעיל" : "לא פעיל"}
                      </span>
                      {!isCurrentUser && (
                        <button
                          type="button"
                          onClick={() => handleToggleActive(user)}
                          disabled={togglingId === user._id}
                          className={`px-3 py-1 rounded border text-xs font-semibold transition ${
                            togglingId === user._id
                              ? "bg-gray-200 text-gray-500 cursor-wait"
                              : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                          }`}
                        >
                          {togglingId === user._id
                            ? "מעבד..."
                            : user.isActive
                            ? "כבה"
                            : "הפעל"}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("he-IL")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={isCurrentUser}
                        className={`border rounded px-2 py-1 text-sm ${
                          isCurrentUser ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        {roleOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {!isCurrentUser && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          disabled={deletingId === user._id}
                          className={`px-3 py-1 rounded border text-xs font-semibold transition ${
                            deletingId === user._id
                              ? 'bg-gray-200 text-gray-500 cursor-wait'
                              : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {deletingId === user._id ? "מוחק..." : "מחק"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            אין משתמשים במערכת
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 הערות חשובות</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• לא ניתן לשנות את התפקיד של עצמך</li>
          <li>• לא ניתן להוריד את המנהל האחרון במערכת</li>
          <li>• שינוי תפקיד מתבצע מיידית</li>
        </ul>
      </div>
    </div>
  );
}
