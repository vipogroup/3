'use client';

import { useState, useEffect, useCallback } from 'react';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { isSuperAdmin } from '@/lib/superAdmins';
import AdminPermissionsModal from './AdminPermissionsModal';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [agents, setAgents] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);
  const [permissionsModalUser, setPermissionsModalUser] = useState(null);

  const getCurrentUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const userId = data.user?._id || data.user?.id || data.sub;
        const email = data.user?.email || '';
        setCurrentUserId(userId);
        setCurrentUserEmail(email);
        setIsSuperAdminUser(isSuperAdmin(email));
      }
    } catch (err) {
      console.error('Failed to get current user:', err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      // API returns 'items' not 'users'
      const usersList = data.items || data.users || [];
      setUsers(usersList);

      // Fetch agent names for users with referredBy
      const agentIds = [...new Set(usersList.filter((u) => u.referredBy).map((u) => u.referredBy))];
      if (agentIds.length > 0) {
        fetchAgents(agentIds);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    getCurrentUser();
  }, [fetchUsers, getCurrentUser]);

  async function fetchAgents(agentIds) {
    try {
      const agentPromises = agentIds.map((id) =>
        fetch(`/api/users/${id}`).then((r) => (r.ok ? r.json() : null)),
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
      console.error('Failed to fetch agents:', err);
    }
  }

  async function handleDeleteUser(user) {
    if (!user?._id) return;

    if (user._id === currentUserId) {
      setError('לא ניתן למחוק את עצמך');
      return;
    }

    if (!confirm(`האם למחוק את המשתמש ${user.fullName || user.email || user.phone}?`)) {
      return;
    }

    try {
      setError('');
      setDeletingId(user._id);
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete user');
      }

      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (err) {
      setError(err.message || 'מחיקה נכשלה');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleActive(user) {
    if (!user?._id) return;

    if (user._id === currentUserId) {
      setError('לא ניתן לשנות את הסטטוס של עצמך');
      return;
    }

    try {
      setError('');
      setTogglingId(user._id);
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update status');
      }

      const { user: updated } = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isActive: updated?.isActive } : u)),
      );
    } catch (err) {
      setError(err.message || 'עדכון סטטוס נכשל');
    } finally {
      setTogglingId(null);
    }
  }

  async function handleRoleChange(userId, newRole) {
    // Check if trying to remove last admin
    const adminCount = users.filter((u) => u.role === 'admin').length;
    const user = users.find((u) => u._id === userId);

    if (user.role === 'admin' && newRole !== 'admin' && adminCount === 1) {
      setError('לא ניתן להוריד את המנהל האחרון במערכת');
      return;
    }

    // Check if trying to change own role
    if (userId === currentUserId) {
      setError('לא ניתן לשנות את התפקיד של עצמך');
      return;
    }
    
    // Check if promoting to admin and user is not super admin
    if (newRole === 'admin' && !isSuperAdminUser) {
      setError('רק מנהלים ראשיים יכולים להעניק הרשאות מנהל');
      return;
    }

    try {
      setError('');
      const res = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update role');
      }

      const result = await res.json();
      // Update local state with full user data from response
      setUsers(users.map((u) => (u._id === userId ? { ...u, ...result.user } : u)));
    } catch (err) {
      setError(err.message);
    }
  }
  
  function handleOpenPermissionsModal(user) {
    setPermissionsModalUser(user);
  }
  
  function handleClosePermissionsModal() {
    setPermissionsModalUser(null);
  }
  
  function handleSavePermissions(updatedUser) {
    setUsers(users.map((u) => (u._id === updatedUser._id ? { ...u, ...updatedUser } : u)));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          className="bg-white rounded-xl p-8"
          style={{
            border: '2px solid transparent',
            backgroundImage:
              'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 4px 20px rgba(8, 145, 178, 0.15)',
          }}
        >
          <div
            className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
            style={{
              border: '4px solid rgba(8, 145, 178, 0.2)',
              borderTopColor: '#0891b2',
            }}
          ></div>
          <p className="text-gray-600 text-center font-medium">טוען משתמשים...</p>
        </div>
      </div>
    );
  }

  const roleOptions = [
    { value: 'customer', label: 'לקוח', color: 'bg-blue-100 text-blue-800' },
    { value: 'agent', label: 'סוכן', color: 'bg-green-100 text-green-800' },
    { value: 'admin', label: 'מנהל', color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-base sm:text-lg font-bold"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              רשימת משתמשים
            </h2>
            <p className="text-sm text-gray-600 mt-1">סה״כ {users.length} משתמשים</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 font-medium">
          {error}
        </div>
      )}

      {/* Desktop Table & Mobile Cards */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '2px solid #0891b2' }}>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase"
                  style={{ color: '#1e3a8a' }}
                >
                  שם
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase"
                  style={{ color: '#1e3a8a' }}
                >
                  אימייל
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase"
                  style={{ color: '#1e3a8a' }}
                >
                  טלפון
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase"
                  style={{ color: '#1e3a8a' }}
                >
                  תפקיד
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase"
                  style={{ color: '#1e3a8a' }}
                >
                  הופנה על ידי
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase"
                  style={{ color: '#1e3a8a' }}
                >
                  סטטוס
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase"
                  style={{ color: '#1e3a8a' }}
                >
                  תאריך הצטרפות
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase"
                  style={{ color: '#1e3a8a' }}
                >
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => {
                const roleOption = roleOptions.find((r) => r.value === user.role);
                const isCurrentUser = user._id === currentUserId;

                return (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 transition-all"
                    style={{
                      background: isCurrentUser
                        ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)'
                        : 'white',
                    }}
                    onMouseEnter={(e) =>
                      !isCurrentUser &&
                      (e.currentTarget.style.background =
                        'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)')
                    }
                    onMouseLeave={(e) =>
                      !isCurrentUser && (e.currentTarget.style.background = 'white')
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.fullName || user.email}
                      {isCurrentUser && <span className="text-xs text-blue-600 mr-2">(אתה)</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 justify-end">
                        <span>{user.phone || '-'}</span>
                        {user.phone && (
                          <a
                            href={buildWhatsAppUrl(
                              user.phone,
                              `היי ${user.fullName || ''}, כאן VIPO`,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-white"
                            style={{ background: '#0891b2' }}
                          >
                            WhatsApp
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
                          <svg
                            className="w-4 h-4"
                            style={{ color: '#16a34a' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span className="text-sm font-medium" style={{ color: '#16a34a' }}>
                            {agents[user.referredBy] || 'טוען...'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 justify-end">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? 'פעיל' : 'לא פעיל'}
                        </span>
                        {!isCurrentUser && (
                          <button
                            type="button"
                            onClick={() => handleToggleActive(user)}
                            disabled={togglingId === user._id}
                            className="px-3 py-1 rounded-lg text-xs font-semibold transition"
                            style={{
                              background: togglingId === user._id ? '#e5e7eb' : 'white',
                              border:
                                togglingId === user._id ? '2px solid #9ca3af' : '2px solid #0891b2',
                              color: togglingId === user._id ? '#6b7280' : '#0891b2',
                              cursor: togglingId === user._id ? 'wait' : 'pointer',
                            }}
                            onMouseEnter={(e) =>
                              !togglingId &&
                              (e.currentTarget.style.background =
                                'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)')
                            }
                            onMouseLeave={(e) =>
                              !togglingId && (e.currentTarget.style.background = 'white')
                            }
                          >
                            {togglingId === user._id ? 'מעבד...' : user.isActive ? 'כבה' : 'הפעל'}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('he-IL')}
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
                          {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {user.role === 'admin' && isSuperAdminUser && !isSuperAdmin(user.email) && (
                          <button
                            type="button"
                            onClick={() => handleOpenPermissionsModal(user)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold transition"
                            style={{
                              background: 'white',
                              border: '2px solid #0891b2',
                              color: '#0891b2',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background =
                                'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = 'white')
                            }
                          >
                            הרשאות
                          </button>
                        )}
                        {!isCurrentUser && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            disabled={deletingId === user._id}
                            className="px-3 py-1 rounded-lg text-xs font-semibold transition"
                            style={{
                              background: deletingId === user._id ? '#e5e7eb' : 'white',
                              border:
                                deletingId === user._id ? '2px solid #9ca3af' : '2px solid #dc2626',
                              color: deletingId === user._id ? '#6b7280' : '#dc2626',
                              cursor: deletingId === user._id ? 'wait' : 'pointer',
                            }}
                            onMouseEnter={(e) =>
                              !deletingId &&
                              (e.currentTarget.style.background = 'rgba(220, 38, 38, 0.05)')
                            }
                            onMouseLeave={(e) =>
                              !deletingId && (e.currentTarget.style.background = 'white')
                            }
                          >
                            {deletingId === user._id ? 'מוחק...' : 'מחק'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-3">
          {users.map((user) => {
            const roleOption = roleOptions.find((r) => r.value === user.role);
            const isCurrentUser = user._id === currentUserId;

            return (
              <div key={user._id} className="p-4 rounded-lg border-2 border-gray-200 bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {user.fullName || user.email}
                      {isCurrentUser && (
                        <span className="text-xs mr-2" style={{ color: '#0891b2' }}>
                          {' '}
                          (אתה)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 break-all">{user.email}</p>
                    {user.phone && <p className="text-xs text-gray-500 mt-1">{user.phone}</p>}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${roleOption?.color}`}
                  >
                    {roleOption?.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-gray-500">סטטוס:</span>
                    <span
                      className={`mr-1 px-2 py-1 rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.isActive ? 'פעיל' : 'לא פעיל'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">תאריך:</span>
                    <span className="mr-1 text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString('he-IL')}
                    </span>
                  </div>
                </div>

                {user.referredBy && (
                  <div className="mb-3 text-xs">
                    <span className="text-gray-500">הופנה ע״י:</span>
                    <span className="mr-1 font-medium" style={{ color: '#16a34a' }}>
                      {agents[user.referredBy] || 'טוען...'}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  {user.phone && (
                    <a
                      href={buildWhatsAppUrl(user.phone, `היי ${user.fullName || ''}, כאן VIPO`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-medium px-3 py-1.5 rounded-lg text-xs"
                      style={{ background: '#0891b2' }}
                    >
                      WhatsApp
                    </a>
                  )}
                  {!isCurrentUser && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(user)}
                        disabled={togglingId === user._id}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium"
                        style={{
                          background: togglingId === user._id ? '#e5e7eb' : 'white',
                          border: '2px solid #0891b2',
                          color: '#0891b2',
                        }}
                      >
                        {togglingId === user._id ? 'מעבד...' : user.isActive ? 'כבה' : 'הפעל'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user)}
                        disabled={deletingId === user._id}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium"
                        style={{
                          background: deletingId === user._id ? '#e5e7eb' : 'white',
                          border: '2px solid #dc2626',
                          color: '#dc2626',
                        }}
                      >
                        {deletingId === user._id ? 'מוחק...' : 'מחק'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">אין משתמשים במערכת</div>
        )}
      </div>

      {/* Info Box */}
      <div
        className="mt-6 rounded-xl p-6"
        style={{
          border: '2px solid transparent',
          backgroundImage:
            'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 4px 20px rgba(8, 145, 178, 0.15)',
        }}
      >
        <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#1e3a8a' }}>
          <svg
            className="w-5 h-5"
            style={{ color: '#0891b2' }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          הערות חשובות
        </h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-start gap-2">
            <span style={{ color: '#0891b2' }}>•</span>
            <span>לא ניתן לשנות את התפקיד של עצמך</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#0891b2' }}>•</span>
            <span>לא ניתן להוריד את המנהל האחרון במערכת</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#0891b2' }}>•</span>
            <span>שינוי תפקיד מתבצע מיידית</span>
          </li>
          {isSuperAdminUser && (
            <li className="flex items-start gap-2">
              <span style={{ color: '#0891b2' }}>•</span>
              <span>רק מנהלים ראשיים יכולים להעניק הרשאות מנהל ולנהל הרשאות של מנהלים אחרים</span>
            </li>
          )}
        </ul>
      </div>

      {/* Permissions Modal */}
      <AdminPermissionsModal
        user={permissionsModalUser}
        isOpen={!!permissionsModalUser}
        onClose={handleClosePermissionsModal}
        onSave={handleSavePermissions}
      />
    </div>
  );
}
