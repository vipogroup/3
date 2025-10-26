'use client';

import { useCallback } from 'react';
import { buildQuoteMessageB } from '@/lib/whatsapp/messageTemplates.js';
import { normalizeIL } from '@/lib/normalize/phone.js';

export default function WhatsAppButton({ order }) {
  const onClick = useCallback(() => {
    const phoneRaw = order?.customer?.phone;
    if (!phoneRaw) {
      alert('אין מספר וואטסאפ ללקוח בהזמנה');
      return;
    }
    const msg = buildQuoteMessageB(order);
    // Normalize to international for wa.me
    const norm = normalizeIL(phoneRaw) || '';
    const phone = norm.startsWith('0') ? ('972' + norm.slice(1)) : norm;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [order]);

  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 14px',
        borderRadius: 10,
        border: 'none',
        cursor: 'pointer',
        fontWeight: 600,
        background: '#25D366',
        color: '#fff'
      }}
      title="שליחת הצעה בווטסאפ"
    >
      שליחת הצעה ב-WhatsApp
    </button>
  );
}
