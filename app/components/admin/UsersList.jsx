'use client';

import { useState, useEffect, useCallback } from 'react';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { isSuperAdmin } from '@/lib/superAdmins';
import AdminPermissionsModal from './AdminPermissionsModal';
import AdminsTab from './AdminsTab';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [agents, setAgents] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [resettingId, setResettingId] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);
  const [permissionsModalUser, setPermissionsModalUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  
  // Tenant users state
  const [activeTab, setActiveTab] = useState('system'); // 'system' | 'tenants' | 'admins'
  const [tenantGroups, setTenantGroups] = useState([]);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [expandedTenants, setExpandedTenants] = useState({});
  const [superAdmins, setSuperAdmins] = useState([]);
  const [resettingAll, setResettingAll] = useState(false);

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

  const fetchUsers = useCallback(async (search = '', role = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (role && role !== 'all') params.append('role', role);
      const url = `/api/users${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      // API returns 'items' not 'users'
      let usersList = data.items || data.users || [];
      
      // Filter out business_admin users from system users tab
      // They should only appear in the tenants tab
      usersList = usersList.filter(u => u.role !== 'business_admin');
      
      // Separate super admins for dedicated tab
      const admins = usersList.filter(u => u.role === 'admin' || u.isSuperAdmin);
      setSuperAdmins(admins);
      
      // Remove admins from regular users list
      usersList = usersList.filter(u => u.role !== 'admin' && !u.isSuperAdmin);
      
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

  const fetchTenantUsers = useCallback(async () => {
    try {
      setLoadingTenants(true);
      const res = await fetch('/api/admin/users-by-tenant');
      if (!res.ok) {
        if (res.status === 403) {
          // Not super admin, hide tenants tab
          return;
        }
        throw new Error('Failed to fetch tenant users');
      }
      const data = await res.json();
      setTenantGroups(data.tenantGroups || []);
    } catch (err) {
      console.error('Failed to fetch tenant users:', err);
    } finally {
      setLoadingTenants(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(searchQuery, roleFilter);
    getCurrentUser();
  }, [fetchUsers, getCurrentUser, searchQuery, roleFilter]);

  useEffect(() => {
    if (isSuperAdminUser && activeTab === 'tenants') {
      fetchTenantUsers();
    }
  }, [isSuperAdminUser, activeTab, fetchTenantUsers]);

  const toggleTenantExpand = (tenantId) => {
    setExpandedTenants(prev => ({
      ...prev,
      [tenantId]: !prev[tenantId]
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

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

  async function handleResetUser(user) {
    if (!user?._id) return;

    const defaultPassword = '123456789';
    const resetMessage = user.role === 'admin' 
      ? `האם לאפס את הסיסמה של המנהל ${user.fullName || user.email}?\n\nהסיסמה החדשה תהיה: ${defaultPassword}`
      : `האם לאפס את סיסמת המשתמש ${user.fullName || user.email}?\n\nהסיסמה החדשה תהיה: ${defaultPassword}`;

    if (!confirm(resetMessage)) {
      return;
    }

    try {
      setError('');
      setResettingId(user._id);
      
      // איפוס סיסמה בלבד - לא מחיקת נתונים!
      const res = await fetch(`/api/users/${user._id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: defaultPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to reset password');
      }

      alert(`✅ הסיסמה אופסה בהצלחה!\n\nהסיסמה החדשה: ${defaultPassword}\n\nיש להעביר למשתמש את הסיסמה החדשה.`);
      
    } catch (err) {
      setError(err.message || 'איפוס סיסמה נכשל');
    } finally {
      setResettingId(null);
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

  async function handleTogglePushButtons(user) {
    if (!user?._id) return;

    try {
      setError('');
      const newValue = user.showPushButtons === true ? false : true;
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showPushButtons: newValue }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update');
      }

      const { user: updated } = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, showPushButtons: updated?.showPushButtons } : u)),
      );
    } catch (err) {
      setError(err.message || 'עדכון נכשל');
    }
  }

  // Reset all users (for testing)
  async function handleResetAllUsers() {
    const confirmText = 'מחק משתמשים';
    const userInput = prompt(`⚠️ אזהרה! פעולה זו תמחק את כל המשתמשים וכל הנתונים שלהם!\n(חוץ מ-Super Admin)\n\nהקלד "${confirmText}" לאישור:`);
    
    if (userInput !== confirmText) {
      if (userInput !== null) alert('הטקסט שהוזן לא תואם. הפעולה בוטלה.');
      return;
    }
    
    setResettingAll(true);
    try {
      const res = await fetch('/api/admin/reset-users', {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'שגיאה באיפוס המשתמשים');
      }
      
      alert(`✅ ${data.message}`);
      fetchUsers(searchQuery, roleFilter);
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setResettingAll(false);
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
    
    // Only super admins can change any role
    if (!isSuperAdminUser) {
      setError('רק מנהלים ראשיים יכולים לשנות תפקידים');
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

  const filteredUsers = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);

  const filterOptions = [
    { value: 'all', label: 'הכל', count: users.length },
    { value: 'customer', label: 'לקוחות', count: users.filter(u => u.role === 'customer').length },
    { value: 'agent', label: 'סוכנים', count: users.filter(u => u.role === 'agent').length },
    { value: 'admin', label: 'מנהלים', count: users.filter(u => u.role === 'admin').length },
  ];

  return (
    <div>
      {/* Main Tabs - System vs Tenants */}
      {isSuperAdminUser && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-2 mb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('admins')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'admins'
                  ? 'text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              style={activeTab === 'admins' ? {
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
              } : {}}
            >
              מנהלי מערכת
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('system')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'system'
                  ? 'text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              style={activeTab === 'system' ? {
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)'
              } : {}}
            >
              משתמשי מערכת
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tenants')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'tenants'
                  ? 'text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              style={activeTab === 'tenants' ? {
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)'
              } : {}}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              משתמשי עסקים ({tenantGroups.reduce((sum, g) => sum + g.users.length, 0)})
            </button>
          </div>
        </div>
      )}

      {/* Header - Only show for system users tab */}
      {activeTab === 'system' && (
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 mb-4">
        <div className="flex flex-col gap-4">
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
              <p className="text-sm text-gray-600 mt-1">סה״כ {filteredUsers.length} משתמשים</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRoleFilter(option.value)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    roleFilter === option.value
                      ? 'text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={roleFilter === option.value ? { background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' } : {}}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>
          </div>
          
          {/* שדה חיפוש */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="חפש לפי שם, טלפון או מייל..."
                className="w-full px-4 py-2.5 pr-10 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none transition-colors text-sm"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-white font-medium transition-all"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              חפש
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all"
              >
                נקה
              </button>
            )}
            {isSuperAdminUser && (
              <button
                type="button"
                onClick={handleResetAllUsers}
                disabled={resettingAll}
                className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all disabled:opacity-50"
                title="מחיקת כל המשתמשים (לבדיקות)"
              >
                {resettingAll ? 'מוחק...' : '⚠️ איפוס'}
              </button>
            )}
          </form>
          {searchQuery && (
            <p className="text-sm text-cyan-600">תוצאות חיפוש: &quot;{searchQuery}&quot;</p>
          )}
        </div>
      </div>
      )}

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 font-medium">
          {error}
        </div>
      )}

      {/* Desktop Table & Mobile Cards - System Users */}
      {activeTab === 'system' && (
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
              {filteredUsers.map((user) => {
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
                            style={{ color: '#0891b2' }}
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
                          <span className="text-sm font-medium" style={{ color: '#0891b2' }}>
                            {agents[user.referredBy] || 'טוען...'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('he-IL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenDropdownId(openDropdownId === user._id ? null : user._id)}
                          className="p-2 rounded-lg transition-all"
                          style={{ 
                            background: openDropdownId === user._id ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)' : 'transparent',
                            color: '#1e3a8a'
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        
                        {openDropdownId === user._id && (
                          <div 
                            className="absolute left-0 mt-1 w-48 bg-white rounded-xl py-2 z-50"
                            style={{
                              border: '2px solid transparent',
                              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                              backgroundOrigin: 'border-box',
                              backgroundClip: 'padding-box, border-box',
                              boxShadow: '0 8px 25px rgba(8, 145, 178, 0.25)',
                            }}
                          >
                            {/* Role Change */}
                            {isSuperAdminUser && !isCurrentUser && (
                              <div className="px-3 py-2 border-b border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">שנה תפקיד:</p>
                                <select
                                  value={user.role}
                                  onChange={(e) => { handleRoleChange(user._id, e.target.value); setOpenDropdownId(null); }}
                                  className="w-full border rounded px-2 py-1 text-sm cursor-pointer"
                                >
                                  {roleOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                            
                            {/* Permissions */}
                            {user.role === 'admin' && isSuperAdminUser && !isSuperAdmin(user.email) && (
                              <button
                                type="button"
                                onClick={() => { handleOpenPermissionsModal(user); setOpenDropdownId(null); }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-right transition-colors"
                                style={{ color: '#1e3a8a' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                הרשאות
                              </button>
                            )}
                            
                            {/* Toggle Active */}
                            {!isCurrentUser && (
                              <button
                                type="button"
                                onClick={() => { handleToggleActive(user); setOpenDropdownId(null); }}
                                disabled={togglingId === user._id}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-right transition-colors"
                                style={{ color: '#1e3a8a' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={user.isActive ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                                </svg>
                                {togglingId === user._id ? 'מעבד...' : user.isActive ? 'כבה משתמש' : 'הפעל משתמש'}
                              </button>
                            )}
                            
                            {/* Toggle Push Buttons */}
                            {!isCurrentUser && user.role !== 'admin' && (
                              <button
                                type="button"
                                onClick={() => { handleTogglePushButtons(user); setOpenDropdownId(null); }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-right transition-colors"
                                style={{ color: '#1e3a8a' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {user.showPushButtons === true ? 'כבה כפתורי התראות' : 'הדלק כפתורי התראות'}
                              </button>
                            )}
                            
                            {/* Reset */}
                            {!isCurrentUser && user.role !== 'admin' && isSuperAdminUser && (
                              <button
                                type="button"
                                onClick={() => { handleResetUser(user); setOpenDropdownId(null); }}
                                disabled={resettingId === user._id}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-right transition-colors"
                                style={{ color: '#1e3a8a' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {resettingId === user._id ? 'מאפס...' : 'איפוס משתמש'}
                              </button>
                            )}
                            
                            {/* Delete */}
                            {!isCurrentUser && (
                              <button
                                type="button"
                                onClick={() => { handleDeleteUser(user); setOpenDropdownId(null); }}
                                disabled={deletingId === user._id}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-right hover:bg-red-50 border-t border-gray-100"
                                style={{ color: '#dc2626' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {deletingId === user._id ? 'מוחק...' : 'מחק משתמש'}
                              </button>
                            )}
                          </div>
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
          {filteredUsers.map((user) => {
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
                    <span className="mr-1 font-medium" style={{ color: '#0891b2' }}>
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
                      {user.role !== 'admin' && isSuperAdminUser && (
                        <button
                          type="button"
                          onClick={() => handleResetUser(user)}
                          disabled={resettingId === user._id}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium"
                          style={{
                            background: resettingId === user._id ? '#e5e7eb' : 'white',
                            border: '2px solid #0891b2',
                            color: '#1e3a8a',
                          }}
                        >
                          {resettingId === user._id ? 'מאפס...' : 'איפוס'}
                        </button>
                      )}
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            {roleFilter === 'all' ? 'אין משתמשים במערכת' : `אין ${filterOptions.find(o => o.value === roleFilter)?.label || ''} במערכת`}
          </div>
        )}
      </div>
      )}

      {/* Tenant Users Section */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          {loadingTenants ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <div
                className="animate-spin rounded-full h-10 w-10 mx-auto mb-4"
                style={{
                  border: '4px solid rgba(8, 145, 178, 0.2)',
                  borderTopColor: '#0891b2',
                }}
              ></div>
              <p className="text-gray-600">טוען משתמשי עסקים...</p>
            </div>
          ) : tenantGroups.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-gray-500">אין עסקים במערכת</p>
            </div>
          ) : (
            tenantGroups.map((group) => (
              <div
                key={group.tenant._id}
                className="bg-white rounded-xl overflow-hidden"
                style={{
                  border: '2px solid transparent',
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                  boxShadow: '0 4px 15px rgba(8, 145, 178, 0.1)',
                }}
              >
                {/* Tenant Header */}
                <button
                  type="button"
                  onClick={() => toggleTenantExpand(group.tenant._id)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                    >
                      {group.tenant.name?.charAt(0) || 'W'}
                    </div>
                    <div className="text-right">
                      <h3 className="font-semibold text-gray-900">{group.tenant.name}</h3>
                      <p className="text-sm text-gray-500">
                        {group.users.length} משתמשים • 
                        <span className={`mr-1 px-2 py-0.5 rounded-full text-xs ${
                          group.tenant.status === 'active' ? 'bg-green-100 text-green-700' :
                          group.tenant.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {group.tenant.status === 'active' ? 'פעיל' : 
                           group.tenant.status === 'pending' ? 'ממתין' : 'מושהה'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedTenants[group.tenant._id] ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Tenant Users List */}
                {expandedTenants[group.tenant._id] && (
                  <div className="border-t border-gray-100">
                    {group.users.length === 0 ? (
                      <p className="px-4 py-6 text-center text-gray-500 text-sm">אין משתמשים בעסק זה</p>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {group.users.map((user) => {
                          const roleOption = roleOptions.find((r) => r.value === user.role);
                          return (
                            <div key={user._id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                                  {user.fullName?.charAt(0) || user.email?.charAt(0) || '?'}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{user.fullName || user.email}</p>
                                  <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${roleOption?.color || 'bg-gray-100 text-gray-700'}`}>
                                  {roleOption?.label || user.role}
                                </span>
                                {user.phone && (
                                  <a
                                    href={buildWhatsAppUrl(user.phone, `היי ${user.fullName || ''}`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg text-white"
                                    style={{ background: '#25D366' }}
                                    title="WhatsApp"
                                  >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Admins Tab Section */}
      {activeTab === 'admins' && (
        <AdminsTab 
          superAdmins={superAdmins}
          currentUserId={currentUserId}
          onDeleteUser={handleDeleteUser}
          deletingId={deletingId}
        />
      )}

      {/* Info Box */}
      {activeTab === 'system' && (
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
            <span>רק מנהלים ראשיים יכולים לשנות תפקידים (לקוח/סוכן/מנהל)</span>
          </li>
          {isSuperAdminUser && (
            <li className="flex items-start gap-2">
              <span style={{ color: '#0891b2' }}>•</span>
              <span>שינוי תפקיד מתבצע מיידית</span>
            </li>
          )}
        </ul>
      </div>
      )}

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
