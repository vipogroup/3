'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatCurrencyILS } from '@/app/utils/date';

const statusColors = {
  success: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  error: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
  },
};

export default function WithdrawalModal({
  open,
  onClose,
  summary,
  onSuccess,
}) {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const availableBalance = useMemo(() => summary?.availableBalance ?? 0, [summary]);
  const pendingAmount = useMemo(() => summary?.pendingCommissions ?? 0, [summary]);
  const onHold = useMemo(() => summary?.onHold ?? 0, [summary]);

  useEffect(() => {
    if (!open) {
      setAmount('');
      setNotes('');
      setError('');
      setSuccessMessage('');
      setLoading(false);
    }
  }, [open]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    if (loading) return;

    const numericAmount = Number(amount);
    if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError('סכום משיכה לא תקין');
      return;
    }
    if (numericAmount > availableBalance) {
      setError('ניתן למשוך עד הסכום הזמין בלבד');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numericAmount, notes }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload?.error || 'בקשה נכשלה');
      }

      setSuccessMessage('הבקשה נשלחה למנהל ותעבור לטיפול בקרוב.');
      setAmount('');
      setNotes('');
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      setError(err?.message || 'שליחת הבקשה נכשלה, נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-xl" style={{ border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgba(30, 58, 138, 0.35), rgba(8, 145, 178, 0.35))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#1e3a8a' }}>בקשת משיכה</h2>
            <p className="text-sm text-gray-500">שלח בקשה למנהל עבור העמלות הזמינות שלך</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="סגור"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border bg-gray-50 p-3" style={{ borderColor: 'rgba(8, 145, 178, 0.3)' }}>
            <p className="text-xs text-gray-500">זמין למשיכה</p>
            <p className="text-base font-bold" style={{ color: '#1e3a8a' }}>{formatCurrencyILS(availableBalance)}</p>
          </div>
          <div className="rounded-xl border bg-gray-50 p-3" style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}>
            <p className="text-xs text-gray-500">ממתין לשחרור</p>
            <p className="text-base font-bold text-amber-600">{formatCurrencyILS(pendingAmount)}</p>
          </div>
          <div className="rounded-xl border bg-gray-50 p-3" style={{ borderColor: 'rgba(8, 145, 178, 0.2)' }}>
            <p className="text-xs text-gray-500">נעול בבקשות</p>
            <p className="text-base font-bold text-slate-700">{formatCurrencyILS(onHold)}</p>
          </div>
        </div>

        <form onSubmit={submitRequest} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="withdrawal-amount">
              סכום למשיכה (₪)
            </label>
            <input
              id="withdrawal-amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-1 text-xs text-gray-500">מינימום: ₪1, מקסימום: {formatCurrencyILS(availableBalance)}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="withdrawal-notes">
              הערות למנהל (אופציונלי)
            </label>
            <textarea
              id="withdrawal-notes"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="למשל: העברה לחשבון בנק מסוים"
            />
          </div>

          {error && (
            <div className={`rounded-lg border px-3 py-2 text-sm ${statusColors.error.bg} ${statusColors.error.text} ${statusColors.error.border}`}>
              {error}
            </div>
          )}

          {successMessage && (
            <div className={`rounded-lg border px-3 py-2 text-sm ${statusColors.success.bg} ${statusColors.success.text} ${statusColors.success.border}`}>
              {successMessage}
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:w-auto"
              disabled={loading}
            >
              ביטול
            </button>
            <button
              type="submit"
              className="w-full rounded-lg px-4 py-2 text-sm font-semibold text-white sm:w-auto"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              disabled={loading || availableBalance <= 0}
            >
              {loading ? 'שולח בקשה…' : 'שלח בקשת משיכה'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
