'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/app/components/layout/MainLayout';
import SaleStatusBadge from '@/app/components/sales/SaleStatusBadge';
import AdminActions from '@/app/components/sales/AdminActions';

export const dynamic = 'force-dynamic';

export default function SaleDetailsPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for editable fields (admin only)
  const [editableFields, setEditableFields] = useState({
    customerName: '',
    customerPhone: '',
    salePrice: '',
    status: '',
  });

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }

    fetchUser();
  }, []);

  // Fetch sale details
  useEffect(() => {
    async function fetchSaleDetails() {
      try {
        const res = await fetch(`/api/sales/${id}`, { cache: 'no-store' });

        if (!res.ok) {
          if (res.status === 401) {
            setError('אנא התחבר כדי לצפות בפרטי המכירה');
            return;
          }
          if (res.status === 403) {
            setError('אין לך הרשאה לצפות בפריט זה');
            return;
          }
          if (res.status === 404) {
            setError('המכירה לא נמצאה');
            return;
          }
          throw new Error('Failed to load sale details');
        }

        const data = await res.json();
        setSale(data);

        // Initialize editable fields with current values
        setEditableFields({
          customerName: data.customerName || '',
          customerPhone: data.customerPhone || '',
          salePrice: data.salePrice || '',
          status: data.status || 'pending',
        });
      } catch (error) {
        console.error('Error fetching sale details:', error);
        setError('אירעה שגיאה בטעינת פרטי המכירה');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchSaleDetails();
    }
  }, [id]);

  const isAdmin = user?.role === 'admin';

  // Handle field changes (admin only)
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditableFields((prev) => ({
      ...prev,
      [name]: name === 'salePrice' ? Number(value) : value,
    }));
  };

  // Format phone number on blur
  const handlePhoneBlur = (e) => {
    const { value } = e.target;
    if (!value) return;

    // Remove non-digits
    const digits = value.replace(/\D/g, '');

    // Format as Israeli phone number
    if (digits.length >= 10) {
      const formatted = digits.slice(0, 3) + '-' + digits.slice(3, 10);
      setEditableFields((prev) => ({ ...prev, customerPhone: formatted }));
    }
  };

  // Calculate commission based on current price (for preview)
  const calculatedCommission = editableFields.salePrice * 0.05;

  // Handle form submission for admin edits
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/sales/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: editableFields.customerName,
          customerPhone: editableFields.customerPhone.replace(/\D/g, ''), // Send only digits
          salePrice: Number(editableFields.salePrice),
          status: editableFields.status,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update sale');
      }

      // Update local state with response data
      const updatedSale = await res.json();
      setSale(updatedSale);

      // Show success message
      alert('המכירה עודכנה בהצלחה'); // Replace with toast in production
    } catch (error) {
      console.error('Submit error:', error);
      alert('פעולה נכשלה, נסה שוב'); // Replace with toast in production
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">פרטי מכירה</h1>
        <Link href="/sales" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
          חזרה למכירות
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : sale ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          {isAdmin ? (
            // Admin view - editable form
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">פרטי מכירה</h3>

                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">מזהה מכירה</label>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">{sale._id}</div>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">תאריך יצירה</label>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      {formatDate(sale.createdAt)}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">סוכן</label>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      {sale.agentId || 'לא ידוע'}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">מוצר</label>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      {sale.productId?.name || 'מוצר לא ידוע'}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">פרטים לעריכה</h3>

                  <div className="mb-4">
                    <label htmlFor="customerName" className="block mb-1 text-sm font-medium">
                      שם לקוח
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={editableFields.customerName}
                      onChange={handleFieldChange}
                      className="w-full p-2 border rounded"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="customerPhone" className="block mb-1 text-sm font-medium">
                      טלפון לקוח
                    </label>
                    <input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      value={editableFields.customerPhone}
                      onChange={handleFieldChange}
                      onBlur={handlePhoneBlur}
                      className="w-full p-2 border rounded"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="salePrice" className="block mb-1 text-sm font-medium">
                      מחיר מכירה
                    </label>
                    <input
                      type="number"
                      id="salePrice"
                      name="salePrice"
                      value={editableFields.salePrice}
                      onChange={handleFieldChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border rounded"
                      disabled={isSubmitting}
                    />
                    <p className="text-sm text-blue-600 mt-1">
                      עמלה מחושבת: ₪{calculatedCommission.toFixed(2)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="status" className="block mb-1 text-sm font-medium">
                      סטטוס
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={editableFields.status}
                      onChange={handleFieldChange}
                      className="w-full p-2 border rounded"
                      disabled={isSubmitting}
                    >
                      <option value="pending">ממתין</option>
                      <option value="in-progress">בתהליך</option>
                      <option value="completed">הושלם</option>
                      <option value="cancelled">בוטל</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <AdminActions saleId={sale._id} isAdmin={isAdmin} />

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'שומר...' : 'שמור שינויים'}
                </button>
              </div>
            </form>
          ) : (
            // Non-admin view - read only
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">פרטי מכירה</h3>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">מזהה מכירה</p>
                  <p>{sale._id}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">תאריך יצירה</p>
                  <p>{formatDate(sale.createdAt)}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">סוכן</p>
                  <p>{sale.agentId || 'לא ידוע'}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">מוצר</p>
                  <p>{sale.productId?.name || 'מוצר לא ידוע'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">פרטי לקוח ותשלום</h3>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">שם לקוח</p>
                  <p>{sale.customerName}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">טלפון לקוח</p>
                  <p>{sale.customerPhone}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">מחיר מכירה</p>
                  <p>₪{sale.salePrice.toFixed(2)}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">עמלה</p>
                  <p>₪{sale.commission.toFixed(2)}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">סטטוס</p>
                  <div className="mt-1">
                    <SaleStatusBadge status={sale.status} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </MainLayout>
  );
}
