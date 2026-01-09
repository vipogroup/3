'use client';

import { useState, useEffect, useCallback } from 'react';
import { Building2, Plus, Search, Edit, Trash2, Eye, Check, X, RefreshCw, UserPlus, ExternalLink, LayoutDashboard, Copy, Link2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TenantsClient() {
  const router = useRouter();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(null); // tenant for which to create admin
  const [registrationUrl, setRegistrationUrl] = useState('/register-business');
  const [copied, setCopied] = useState(false);

  // Set registration URL on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRegistrationUrl(`${window.location.origin}/register-business`);
    }
  }, []);

  const loadTenants = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      
      const res = await fetch(`/api/tenants?${params}`, { credentials: 'include' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'שגיאה בטעינת העסקים');
      
      setTenants(data.tenants || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  const filteredTenants = tenants.filter(tenant => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      tenant.name?.toLowerCase().includes(term) ||
      tenant.slug?.toLowerCase().includes(term) ||
      tenant.domain?.toLowerCase().includes(term)
    );
  });

  const handleStatusChange = async (tenantId, newStatus) => {
    try {
      const res = await fetch(`/api/tenants/${tenantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'שגיאה בעדכון הסטטוס');
      }
      
      loadTenants();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (tenantId, tenantName) => {
    if (!confirm(`האם למחוק את העסק ${tenantName}? פעולה זו בלתי הפיכה.`)) return;
    
    try {
      const res = await fetch(`/api/tenants/${tenantId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'שגיאה במחיקת העסק');
      }
      
      loadTenants();
    } catch (err) {
      alert(err.message);
    }
  };

  // Enter tenant dashboard as super admin
  const handleEnterDashboard = async (tenantId) => {
    try {
      // Set impersonation cookie/session
      const res = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tenantId }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'שגיאה בכניסה לדשבורד');
      }
      
      // Navigate to business dashboard
      router.push('/business');
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
    };
    const labels = {
      active: 'פעיל',
      pending: 'ממתין',
      inactive: 'לא פעיל',
      suspended: 'מושהה',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.inactive}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">ניהול עסקים</h1>
            <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">Multi-Tenant Management</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Registration Link */}
          <div className="flex items-center gap-1 sm:gap-2 bg-green-50 border border-green-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
            <Link2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
            <span className="text-xs sm:text-sm text-green-700 font-medium hidden sm:inline">קישור הרשמה:</span>
            <code className="text-xs bg-white px-1 sm:px-2 py-0.5 sm:py-1 rounded border text-gray-600 max-w-[120px] sm:max-w-none truncate">
              {registrationUrl}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(registrationUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className={`p-1 sm:p-1.5 rounded transition-colors ${copied ? 'text-green-700 bg-green-100' : 'text-green-600 hover:bg-green-100'}`}
              title="העתק קישור"
            >
              {copied ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            עסק חדש
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="חיפוש..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-9 sm:pr-10 pl-3 sm:pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none px-2 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="">כל הסטטוסים</option>
              <option value="active">פעיל</option>
              <option value="pending">ממתין</option>
              <option value="inactive">לא פעיל</option>
              <option value="suspended">מושהה</option>
            </select>
            <button
              onClick={loadTenants}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">רענון</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        /* Tenants Table */
        <div className="bg-white rounded-lg shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">עסק</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">דומיין</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">סטטוס</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">עמלה</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">סטטיסטיקות</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    {searchTerm || statusFilter ? 'לא נמצאו עסקים התואמים לחיפוש' : 'אין עסקים במערכת'}
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => (
                  <tr key={tenant._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {tenant.branding?.logo ? (
                          <img src={tenant.branding.logo} alt="לוגו" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{tenant.name}</div>
                          <div className="text-sm text-gray-500">{tenant.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        {tenant.domain || tenant.subdomain ? (
                          <a 
                            href={`https://${tenant.domain || tenant.subdomain + '.vipo.co.il'}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {tenant.domain || `${tenant.subdomain}.vipo.co.il`}
                          </a>
                        ) : (
                          <span className="text-gray-400">לא הוגדר</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(tenant.status)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">{tenant.platformCommissionRate || 5}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>מוצרים: {tenant.stats?.totalProducts || 0}</div>
                        <div>הזמנות: {tenant.stats?.totalOrders || 0}</div>
                        <div>משתמשים: {tenant.stats?.totalUsers || 0}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEnterDashboard(tenant._id)}
                          className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"
                          title="כניסה לדשבורד עסק"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                        </button>
                        <a
                          href={`/t/${tenant.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="פתח אתר עסק"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => setShowAdminModal(tenant)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                          title="הוסף מנהל עסק"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingTenant(tenant)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="עריכה"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {tenant.status !== 'active' ? (
                          <button
                            onClick={() => handleStatusChange(tenant._id, 'active')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="הפעלה"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(tenant._id, 'suspended')}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                            title="השהייה"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(tenant._id, tenant.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="מחיקה"
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
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{tenants.length}</div>
          <div className="text-sm text-gray-500">סהכ עסקים</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {tenants.filter(t => t.status === 'active').length}
          </div>
          <div className="text-sm text-gray-500">פעילים</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">
            {tenants.filter(t => t.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-500">ממתינים</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600">
            {tenants.reduce((sum, t) => sum + (t.stats?.totalOrders || 0), 0)}
          </div>
          <div className="text-sm text-gray-500">סהכ הזמנות</div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingTenant) && (
        <TenantModal
          tenant={editingTenant}
          onClose={() => {
            setShowCreateModal(false);
            setEditingTenant(null);
          }}
          onSave={() => {
            setShowCreateModal(false);
            setEditingTenant(null);
            loadTenants();
          }}
        />
      )}

      {/* Create Business Admin Modal */}
      {showAdminModal && (
        <CreateAdminModal
          tenant={showAdminModal}
          onClose={() => setShowAdminModal(null)}
          onSave={() => {
            setShowAdminModal(null);
            loadTenants();
          }}
        />
      )}
    </div>
  );
}

function TenantModal({ tenant, onClose, onSave }) {
  const isEdit = !!tenant;
  const [formData, setFormData] = useState({
    name: tenant?.name || '',
    slug: tenant?.slug || '',
    domain: tenant?.domain || '',
    subdomain: tenant?.subdomain || '',
    platformCommissionRate: tenant?.platformCommissionRate || 5,
    status: tenant?.status || 'pending',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEdit ? `/api/tenants/${tenant._id}` : '/api/tenants';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'שגיאה בשמירת העסק');

      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">{isEdit ? 'עריכת עסק' : 'יצירת עסק חדש'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם העסק *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (מזהה) *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/^-+|-+$/g, '') })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              required
              placeholder="my-business"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">דומיין</label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="shop.example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
              <input
                type="text"
                value={formData.subdomain}
                onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="shop"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">עמלת פלטפורמה (%)</label>
              <input
                type="number"
                value={formData.platformCommissionRate}
                onChange={(e) => setFormData({ ...formData, platformCommissionRate: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">ממתין</option>
                <option value="active">פעיל</option>
                <option value="inactive">לא פעיל</option>
                <option value="suspended">מושהה</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'שומר...' : (isEdit ? 'עדכון' : 'יצירה')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateAdminModal({ tenant, onClose, onSave }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          role: 'business_admin',
          tenantId: tenant._id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'שגיאה ביצירת המשתמש');

      setSuccess(true);
      setTimeout(() => {
        onSave();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="p-6 border-b bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-xl">
          <h2 className="text-xl font-bold text-white">יצירת מנהל עסק</h2>
          <p className="text-purple-200 text-sm mt-1">עבור: {tenant.name}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
              מנהל העסק נוצר בהצלחה!
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
              placeholder="ישראל ישראלי"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">אימייל *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
              placeholder="admin@business.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="050-1234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
              minLength={6}
              placeholder="לפחות 6 תווים"
            />
          </div>

          <div className="bg-purple-50 p-3 rounded-lg text-sm text-purple-800">
            <strong>שים לב:</strong> המשתמש יקבל הרשאות מלאות לניהול העסק {tenant.name} בלבד.
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving || success}
              className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'יוצר...' : 'צור מנהל עסק'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
