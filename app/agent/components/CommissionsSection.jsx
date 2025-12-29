'use client';

import { useMemo } from 'react';
import { formatCurrencyILS } from '@/app/utils/date';

const commissionStatusConfig = {
  pending: {
    label: 'ממתין לשחרור',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  available: {
    label: 'זמין למשיכה',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  claimed: {
    label: 'נמשך',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  cancelled: {
    label: 'בוטל',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
};

const withdrawalStatusConfig = {
  pending: { label: 'ממתין לאישור', className: 'text-amber-600 bg-amber-100 border-amber-200' },
  approved: { label: 'אושר', className: 'text-blue-600 bg-blue-100 border-blue-200' },
  rejected: { label: 'נדחה', className: 'text-red-600 bg-red-100 border-red-200' },
  completed: { label: 'הושלם', className: 'text-green-600 bg-green-100 border-green-200' },
};

function formatDate(date) {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (error) {
    return '—';
  }
}

function CommissionRow({ commission }) {
  const status = commissionStatusConfig[commission.status] || commissionStatusConfig.pending;
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
        {commission.customerName || 'לקוח'}
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">
        {commission.orderType === 'group' ? 'רכישה קבוצתית' : 'רכישה רגילה'}
      </td>
      <td className="py-3 px-4 text-sm font-semibold" style={{ color: '#1e3a8a' }}>
        {formatCurrencyILS(commission.amount)}
      </td>
      <td className="py-3 px-4 text-sm">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">
        {commission.orderType === 'group' && commission.groupPurchase ? commission.groupPurchase.name || '—' : '—'}
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">{formatDate(commission.availableAt)}</td>
    </tr>
  );
}

function CommissionCard({ commission }) {
  const status = commissionStatusConfig[commission.status] || commissionStatusConfig.pending;
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-900">{commission.customerName || 'לקוח'}</span>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-gray-600">
          <span>סוג הזמנה</span>
          <span>{commission.orderType === 'group' ? 'רכישה קבוצתית' : 'רכישה רגילה'}</span>
        </div>
        <div className="flex items-center justify-between font-semibold" style={{ color: '#1e3a8a' }}>
          <span>סכום עמלה</span>
          <span>{formatCurrencyILS(commission.amount)}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>זמין בתאריך</span>
          <span>{formatDate(commission.availableAt)}</span>
        </div>
        {commission.orderType === 'group' && commission.groupPurchase ? (
          <div className="flex items-center justify-between text-gray-600">
            <span>רכישה קבוצתית</span>
            <span>{commission.groupPurchase.name || '—'}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function WithdrawalRow({ request }) {
  const status = withdrawalStatusConfig[request.status] || withdrawalStatusConfig.pending;
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 px-4 text-sm">{formatDate(request.createdAt)}</td>
      <td className="py-3 px-4 text-sm font-semibold" style={{ color: '#1e3a8a' }}>
        {formatCurrencyILS(request.amount)}
      </td>
      <td className="py-3 px-4 text-sm">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">{request.adminNotes || '—'}</td>
    </tr>
  );
}

export default function CommissionsSection({ summary, commissions, withdrawals, onRequestWithdraw, onRefresh }) {
  const hasCommissions = Array.isArray(commissions) && commissions.length > 0;
  const hasWithdrawals = Array.isArray(withdrawals) && withdrawals.length > 0;

  const availableBalance = useMemo(() => summary?.availableBalance ?? 0, [summary]);
  const pendingAmount = useMemo(() => summary?.pendingCommissions ?? 0, [summary]);
  const onHold = useMemo(() => summary?.onHold ?? 0, [summary]);
  const totalEarned = useMemo(() => summary?.totalEarned ?? 0, [summary]);

  return (
    <section className="mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2
            className="text-xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ניהול עמלות
          </h2>
          <p className="text-sm text-gray-500">מבט כולל על העמלות הזמינות והביצועים שלך</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            רענן נתונים
          </button>
          <button
            type="button"
            onClick={onRequestWithdraw}
            disabled={availableBalance <= 0}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            ממש עמלות
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4 mb-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm" style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}>
          <p className="text-xs text-gray-500">זמין למשיכה</p>
          <p className="text-lg font-bold" style={{ color: '#1e3a8a' }}>{formatCurrencyILS(availableBalance)}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm" style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}>
          <p className="text-xs text-gray-500">ממתין לשחרור</p>
          <p className="text-lg font-bold text-amber-600">{formatCurrencyILS(pendingAmount)}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm" style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}>
          <p className="text-xs text-gray-500">נעול בבקשות</p>
          <p className="text-lg font-bold text-slate-700">{formatCurrencyILS(onHold)}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm" style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}>
          <p className="text-xs text-gray-500">סה״כ עמלות שהרווחת</p>
          <p className="text-lg font-bold" style={{ color: '#0891b2' }}>{formatCurrencyILS(totalEarned)}</p>
        </div>
      </div>

      <div
        className="mb-5 rounded-2xl border bg-white p-4 shadow-sm"
        style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">פירוט עמלות לפי הזמנה</h3>
          <span className="text-sm text-gray-500">סה״כ {commissions?.length ?? 0} עמלות</span>
        </div>

        {hasCommissions ? (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-600">
                    <th className="py-2 px-4 font-medium">לקוח</th>
                    <th className="py-2 px-4 font-medium">סוג רכישה</th>
                    <th className="py-2 px-4 font-medium">עמלה (₪)</th>
                    <th className="py-2 px-4 font-medium">סטטוס עמלה</th>
                    <th className="py-2 px-4 font-medium">רכישה קבוצתית</th>
                    <th className="py-2 px-4 font-medium">תאריך זמינות</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((commission) => (
                    <CommissionRow key={commission.orderId || commission.createdAt} commission={commission} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 md:hidden">
              {commissions.map((commission) => (
                <CommissionCard key={commission.orderId || commission.createdAt} commission={commission} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center text-sm text-gray-500">
            אין עמלות להצגה כרגע
          </div>
        )}
      </div>

      <div
        className="rounded-2xl border bg-white p-4 shadow-sm"
        style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">היסטוריית בקשות משיכה</h3>
          <span className="text-sm text-gray-500">סה״כ {withdrawals?.length ?? 0} בקשות</span>
        </div>

        {hasWithdrawals ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="py-2 px-4 font-medium">תאריך</th>
                  <th className="py-2 px-4 font-medium">סכום</th>
                  <th className="py-2 px-4 font-medium">סטטוס</th>
                  <th className="py-2 px-4 font-medium">הערות מנהל</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((request) => (
                  <WithdrawalRow key={request._id} request={request} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center text-sm text-gray-500">
            עדיין לא ביקשת משיכה. לחץ על ״ממש עמלות״ כדי להתחיל.
          </div>
        )}
      </div>
    </section>
  );
}
