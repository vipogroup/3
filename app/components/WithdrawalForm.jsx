'use client';

import { useState, useEffect } from 'react';

export default function WithdrawalForm() {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user balance
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        setBalance(data.commissionBalance || 0);
      })
      .catch(() => {
        setBalance(0);
      });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const amountNum = parseFloat(amount);

    if (!amountNum || amountNum < 1) {
      setError('סכום לא תקין');
      setLoading(false);
      return;
    }

    if (amountNum > balance) {
      setError(`הסכום גבוה מהיתרה הזמינה (₪${balance})`);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: amountNum, notes }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create request');
      }

      setMessage('✅ בקשת המשיכה נשלחה בהצלחה! תטופל בקרוב.');
      setAmount('');
      setNotes('');

      // Refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">בקשת משיכת קרדיט</h3>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>יתרה זמינה:</strong> ₪{balance.toLocaleString()}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">סכום למשיכה (₪)</label>
          <input
            type="number"
            min="1"
            max={balance}
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="הזן סכום"
            required
            disabled={loading || balance === 0}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">הערות (אופציונלי)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
            placeholder="פרטי העברה, הערות נוספות..."
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || balance === 0}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'שולח...' : 'שלח בקשה'}
        </button>

        {balance === 0 && (
          <p className="text-sm text-gray-500 text-center">אין יתרה זמינה למשיכה</p>
        )}
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <strong>שים לב:</strong> הבקשה תטופל על ידי המנהל. לאחר אישור, הסכום יועבר לחשבון הבנק
          שלך.
        </p>
      </div>
    </div>
  );
}
