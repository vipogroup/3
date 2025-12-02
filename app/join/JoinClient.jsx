'use client';

import { useEffect, useMemo } from 'react';

export default function JoinClient({ refId, productId }) {
  const safeRef = useMemo(() => (typeof refId === 'string' ? refId.trim() : null), [refId]);
  const safeProduct = useMemo(
    () => (typeof productId === 'string' ? productId.trim() : null),
    [productId],
  );

  useEffect(() => {
    if (!safeRef) return;

    try {
      localStorage.setItem('referrerId', safeRef);
    } catch (err) {
      console.warn('Failed to persist referrerId', err);
    }
  }, [safeRef]);

  return (
    <section className="space-y-4">
      <div className="text-sm">
        <div>
          Referral ID: <strong>{safeRef || '—'}</strong>
        </div>
        <div>
          Product ID: <strong>{safeProduct || '—'}</strong>
        </div>
      </div>

      <p className="text-sm opacity-80">
        עמוד זה מרונדר דינמית כדי לאסוף פרמטרים מה-URL בזמן ריצה ולמנוע שגיאות build.
      </p>
    </section>
  );
}
