"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STATUS_FILTERS = [
  { value: 'all', label: 'הכל' },
  { value: 'pending', label: 'ממתין לאישור' },
  { value: 'approved', label: 'אושר' },
  { value: 'completed', label: 'הושלם' },
  { value: 'rejected', label: 'נדחה' },
];

const STATUS_BADGE_STYLES = {
  pending: 'text-amber-600 bg-amber-100 border border-amber-200',
  approved: 'text-blue-600 bg-blue-100 border border-blue-200',
  completed: 'text-green-600 bg-green-100 border border-green-200',
  rejected: 'text-red-600 bg-red-100 border border-red-200',
};

const DEFAULT_STATS = {
  pendingCount: 0,
  pendingAmount: 0,
  completedThisMonth: 0,
  completedCountThisMonth: 0,
};

const PAGE_SIZE = 20;

function formatCurrencyILS(value) {
  return `₪${Number(value || 0).toLocaleString('he-IL')}`;
}

function formatDateTime(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('he-IL', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch (error) {
    return '—';
  }
}

function StatsCard({ title, value, subtitle, accent = 'blue' }) {
  const palette = {
    blue: {
      text: '#1e3a8a',
      border: 'rgba(8, 145, 178, 0.25)',
    },
    green: {
      text: '#047857',
      border: 'rgba(34, 197, 94, 0.25)',
    },
    red: {
      text: '#b91c1c',
      border: 'rgba(248, 113, 113, 0.25)',
    },
  }[accent];

  return (
    <div
      className="rounded-2xl bg-white p-4 shadow-sm"
      style={{ border: `1px solid ${palette.border}` }}
    >
      <p className="text-xs text-gray-500">{title}</p>
      <p className="mt-2 text-lg font-bold" style={{ color: palette.text }}>
        {value}
      </p>
      {subtitle ? <p className="mt-1 text-xs text-gray-400">{subtitle}</p> : null}
    </div>
  );
}

function WithdrawalRow({ withdrawal, onOpen }) {
  const statusClass = STATUS_BADGE_STYLES[withdrawal.status] || STATUS_BADGE_STYLES.pending;

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
        {withdrawal.user?.fullName || 'סוכן'}
        <div className="text-xs text-gray-500">
          {withdrawal.user?.email || withdrawal.user?.phone || '—'}
        </div>
      </td>
      <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#1e3a8a' }}>
        {formatCurrencyILS(withdrawal.amount)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatCurrencyILS(withdrawal.snapshotBalance)}</td>
      <td className="px-4 py-3 text-sm">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
        >
          {STATUS_FILTERS.find((status) => status.value === withdrawal.status)?.label || 'ממתין'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(withdrawal.createdAt)}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{withdrawal.adminNotes || '—'}</td>
      <td className="px-4 py-3 text-left">
        <button
          type="button"
          onClick={() => onOpen(withdrawal.id)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
        >
          נהל בקשה
        </button>
      </td>
    </tr>
  );
}

export default function WithdrawalsAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchWithdrawals = useCallback(
    async (targetPage, statusValue, searchValue) => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        params.set('page', String(targetPage));
        params.set('limit', String(PAGE_SIZE));

        if (statusValue && statusValue !== 'all') {
          params.set('status', statusValue);
        }

        if (searchValue) {
          params.set('search', searchValue);
        }

        const response = await fetch(`/api/admin/withdrawals?${params.toString()}`, {
          cache: 'no-store',
        });

        if (response.status === 401 || response.status === 403) {
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('טעינת הנתונים נכשלה');
        }

        const payload = await response.json();
        if (!payload?.ok) {
          throw new Error(payload?.error || 'שגיאה בטעינת הנתונים');
        }

        setWithdrawals(Array.isArray(payload.withdrawals) ? payload.withdrawals : []);
        setStats({ ...DEFAULT_STATS, ...(payload.stats || {}) });
        setPagination({
          page: payload.pagination?.page ?? targetPage,
          pages: payload.pagination?.pages ?? 1,
          total: payload.pagination?.total ?? 0,
        });
      } catch (err) {
        console.error('ADMIN_WITHDRAWALS_FETCH_ERROR', err);
        setError(err?.message || 'שגיאה בטעינת הנתונים');
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch((prev) => {
        const trimmed = searchInput.trim();
        return prev === trimmed ? prev : trimmed;
      });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    fetchWithdrawals(page, statusFilter, debouncedSearch);
  }, [page, statusFilter, debouncedSearch, fetchWithdrawals]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.pages || nextPage === page) return;
    setPage(nextPage);
  };

  const refresh = useCallback(() => {
    fetchWithdrawals(page, statusFilter, debouncedSearch);
  }, [fetchWithdrawals, page, statusFilter, debouncedSearch]);

  const openModal = (withdrawalId) => {
    setSelectedWithdrawalId(withdrawalId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedWithdrawalId(null);
  };

  const summaryCards = useMemo(
    () => [
      {
        title: 'בקשות ממתינות',
        value: stats.pendingCount,
        subtitle: stats.pendingAmount ? `${formatCurrencyILS(stats.pendingAmount)} ממתינים לתשלום` : '—',
        accent: 'red',
      },
      {
        title: 'תשלום החודש',
        value: formatCurrencyILS(stats.completedThisMonth),
        subtitle: stats.completedCountThisMonth ? `${stats.completedCountThisMonth} בקשות הושלמו` : '—',
        accent: 'green',
      },
      {
        title: 'סה״כ בקשות',
        value: pagination.total,
        subtitle: `עמוד ${page} מתוך ${pagination.pages}`,
        accent: 'blue',
      },
    ],
    [stats, pagination, page],
  );

  return (
    <main className="min-h-screen bg-white px-3 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              בקשות משיכה
            </h1>
            <p className="text-sm text-gray-500">ניהול מלא של בקשות המשיכה מסוכנים</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refresh}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              רענן
            </button>
            <Link
              href="/admin/transactions"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              מעבר לעסקאות
            </Link>
            <Link
              href="/admin"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              חזרה
            </Link>
          </div>
        </header>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          {summaryCards.map((card) => (
            <StatsCard key={card.title} {...card} />
          ))}
        </section>

        <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm" style={{ border: '1px solid rgba(8, 145, 178, 0.1)' }}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="text-sm font-medium text-gray-600">סינון לפי סטטוס:</span>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => handleStatusChange(status.value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      statusFilter === status.value
                        ? 'border border-transparent text-white'
                        : 'border border-gray-200 bg-white text-gray-600'
                    }`}
                    style={
                      statusFilter === status.value
                        ? { background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }
                        : undefined
                    }
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative w-full md:w-72">
              <input
                type="search"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="חיפוש לפי שם סוכן או טלפון"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-9 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.65 6.15z" />
              </svg>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm" style={{ border: '1px solid rgba(8, 145, 178, 0.1)' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-medium">סוכן</th>
                  <th className="px-4 py-3 font-medium">סכום משיכה</th>
                  <th className="px-4 py-3 font-medium">יתרה נוכחית</th>
                  <th className="px-4 py-3 font-medium">סטטוס</th>
                  <th className="px-4 py-3 font-medium">תאריך פתיחה</th>
                  <th className="px-4 py-3 font-medium">הערות מנהל</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center">
                      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div>
                    </td>
                  </tr>
                ) : withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                      אין בקשות תואמות לסינון הנוכחי.
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((withdrawal) => (
                    <WithdrawalRow key={withdrawal.id} withdrawal={withdrawal} onOpen={openModal} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-600 md:flex-row">
            <div>
              מציג {withdrawals.length} מתוך {pagination.total} בקשות
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                הקודם
              </button>
              <span className="text-xs">
                עמוד {page} מתוך {pagination.pages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pagination.pages}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                הבא
              </button>
            </div>
          </div>
        </section>

        {isModalOpen && selectedWithdrawalId ? (
          <WithdrawalActionModal
            open={isModalOpen}
            withdrawalId={selectedWithdrawalId}
            onClose={closeModal}
            onActionComplete={refresh}
          />
        ) : null}
      </div>
    </main>
  );
}

function WithdrawalActionModal({ open, withdrawalId, onClose, onActionComplete }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [withdrawal, setWithdrawal] = useState(null);
  const [action, setAction] = useState('approve');
  const [adminNotes, setAdminNotes] = useState('');

  const loadDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/withdrawals/${withdrawalId}`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('טעינת פרטי הבקשה נכשלה');
      }
      const payload = await response.json();
      if (!payload?.ok || !payload.withdrawal) {
        throw new Error('שגיאה בטעינת הבקשה');
      }
      setWithdrawal(payload.withdrawal);
      setAdminNotes(payload.withdrawal.adminNotes || '');
      setAction(payload.withdrawal.status === 'approved' ? 'complete' : 'approve');
    } catch (err) {
      console.error('ADMIN_WITHDRAWAL_DETAILS_ERROR', err);
      setError(err?.message || 'שגיאת טעינה');
    } finally {
      setLoading(false);
    }
  }, [withdrawalId]);

  useEffect(() => {
    if (open) {
      loadDetails();
    }
  }, [open, loadDetails]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (action === 'reject' && !adminNotes.trim()) {
      setError('יש להזין הערה בעת דחיית בקשה');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/withdrawals/${withdrawalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, adminNotes }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || 'הפעולה נכשלה');
      }

      setSuccess(payload.deleted ? 'בקשת המשיכה נמחקה בהצלחה' : 'הבקשה עודכנה בהצלחה');
      onActionComplete();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('ADMIN_WITHDRAWAL_UPDATE_ERROR', err);
      setError(err?.message || 'הפעולה נכשלה');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
      <div
        className="h-full w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:h-auto"
        style={{
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgba(30, 58, 138, 0.35), rgba(8, 145, 178, 0.35))',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#1e3a8a' }}>
              ניהול בקשת משיכה
            </h2>
            <p className="text-sm text-gray-500">עדכון סטטוס והעברת הערות לסוכן</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-12 w-12 animate-spin rounded-full border-3 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : withdrawal ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900">פרטי הסוכן</p>
              <div className="mt-2 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                <div>
                  <span className="text-gray-500">שם מלא:</span>{' '}
                  {withdrawal.user?.fullName || '—'}
                </div>
                <div>
                  <span className="text-gray-500">אימייל:</span>{' '}
                  {withdrawal.user?.email || '—'}
                </div>
                <div>
                  <span className="text-gray-500">טלפון:</span>{' '}
                  {withdrawal.user?.phone || '—'}
                </div>
                <div>
                  <span className="text-gray-500">סטטוס נוכחי:</span>{' '}
                  {STATUS_FILTERS.find((status) => status.value === withdrawal.status)?.label || '—'}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">סכום הבקשה</p>
                <p className="mt-2 text-lg font-bold" style={{ color: '#1e3a8a' }}>
                  {formatCurrencyILS(withdrawal.amount)}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">יתרה זמינה בעת הבקשה</p>
                <p className="mt-2 text-lg font-bold text-slate-700">
                  {formatCurrencyILS(withdrawal.snapshotBalance)}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">סכום נעול</p>
                <p className="mt-2 text-lg font-bold text-slate-700">
                  {formatCurrencyILS(withdrawal.snapshotOnHold)}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">תאריך פתיחה</p>
                <p className="mt-2 text-sm text-gray-700">{formatDateTime(withdrawal.createdAt)}</p>
              </div>
            </div>

            {/* Payment Details Section */}
            {withdrawal.paymentDetails && (
              <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08), rgba(8, 145, 178, 0.08))', border: '1px solid rgba(30, 58, 138, 0.2)' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: '#1e3a8a' }}>
                  💰 פרטי העברת התשלום
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">אמצעי תשלום:</span>
                    <span className="font-semibold" style={{ color: '#1e3a8a' }}>
                      {withdrawal.paymentDetails.method === 'bit' && '💳 ביט'}
                      {withdrawal.paymentDetails.method === 'paybox' && '📱 פייבוקס'}
                      {withdrawal.paymentDetails.method === 'paypal' && '🅿️ פייפל'}
                      {withdrawal.paymentDetails.method === 'bank' && '🏦 העברה בנקאית'}
                    </span>
                  </div>
                  
                  {(withdrawal.paymentDetails.method === 'bit' || withdrawal.paymentDetails.method === 'paybox') && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">מספר טלפון:</span>
                      <span className="font-mono font-semibold text-gray-900">{withdrawal.paymentDetails.phone}</span>
                    </div>
                  )}
                  
                  {withdrawal.paymentDetails.method === 'paypal' && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">אימייל PayPal:</span>
                      <span className="font-mono font-semibold text-gray-900">{withdrawal.paymentDetails.email}</span>
                    </div>
                  )}
                  
                  {withdrawal.paymentDetails.method === 'bank' && (
                    <div className="grid gap-2 sm:grid-cols-2 mt-2 p-3 bg-white rounded-lg">
                      <div>
                        <span className="text-gray-500 text-xs">שם בעל החשבון:</span>
                        <p className="font-semibold text-gray-900">{withdrawal.paymentDetails.accountName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">מספר בנק:</span>
                        <p className="font-mono font-semibold text-gray-900">{withdrawal.paymentDetails.bankNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">מספר סניף:</span>
                        <p className="font-mono font-semibold text-gray-900">{withdrawal.paymentDetails.branchNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">מספר חשבון:</span>
                        <p className="font-mono font-semibold text-gray-900">{withdrawal.paymentDetails.accountNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-sm font-semibold text-gray-900">בחר פעולה</p>
              <div className="grid gap-2 sm:grid-cols-4">
                {[
                  { value: 'approve', label: 'אישור בקשה', color: 'blue' },
                  { value: 'complete', label: 'סימון הושלם', color: 'blue' },
                  { value: 'reject', label: 'דחיית בקשה', color: 'blue' },
                  { value: 'delete', label: 'מחיקת בקשה', color: 'red' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAction(option.value)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      action === option.value
                        ? 'border-transparent text-white'
                        : option.color === 'red' 
                          ? 'border-red-200 text-red-600 hover:bg-red-50'
                          : 'border-gray-200 text-gray-700'
                    }`}
                    style={
                      action === option.value
                        ? option.color === 'red'
                          ? { background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' }
                          : { background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }
                        : undefined
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {action === 'delete' && (
                <p className="mt-2 text-xs text-red-600">
                  שים לב: מחיקת בקשה היא פעולה בלתי הפיכה. לא ניתן למחוק בקשות שהושלמו.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="admin-notes" className="mb-1 block text-sm font-medium text-gray-700">
                הערות למעקב
              </label>
              <textarea
                id="admin-notes"
                rows={4}
                value={adminNotes}
                onChange={(event) => setAdminNotes(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="למשל: הועבר בהעברה בנקאית, יאושר לאחר קבלת אסמכתא"
              />
              {action === 'reject' ? (
                <p className="mt-1 text-xs text-red-600">בעת דחייה חובה לציין סיבה מפורטת.</p>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {success}
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:w-auto"
                disabled={loading}
              >
                ביטול
              </button>
              <button
                type="submit"
                className="w-full rounded-lg px-4 py-2 text-sm font-semibold text-white sm:w-auto"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                disabled={loading}
              >
                {loading ? 'מעבד…' : 'שמירת הפעולה'}
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center text-sm text-gray-500">
            הבקשה לא נמצאה.
          </div>
        )}
      </div>
    </div>
  );
}
