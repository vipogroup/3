'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import WhatsAppButton from './WhatsAppButton.jsx';
import { buildQuoteLinkMessage } from '@/lib/whatsapp/messageTemplates.js';
import { normalizeIL } from '@/lib/normalize/phone.js';

export default function AgentOrderDetail({ params }) {
  const { id } = params || {};
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedSku, setSelectedSku] = useState('');
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [pending, start] = useTransition();

  useEffect(() => {
    fetch(`/api/orders/${id}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setOrder(d))
      .catch(() => setErr('שגיאה בטעינת הזמנה'));

    fetch('/api/products?active=true', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d.items) ? d.items : []))
      .catch(() => {});
  }, [id]);

  const subtotal = useMemo(
    () => (Array.isArray(order?.items) ? order.items.reduce((s, it) => s + (Number(it.qty || 0) * Number(it.price || 0)), 0) : 0),
    [order]
  );
  const total = useMemo(() => Math.max(0, subtotal - Number(order?.discount || 0)), [subtotal, order?.discount]);

  function updateQty(sku, val) {
    if (!order) return;
    const nextItems = order.items.map((it) => (it.sku === sku ? { ...it, qty: Number(val || 0) } : it));
    setOrder({ ...order, items: nextItems });
  }

  function removeItem(sku) {
    if (!order) return;
    const nextItems = order.items.filter((it) => it.sku !== sku);
    setOrder({ ...order, items: nextItems });
  }

  function addItem() {
    if (!order) return;
    const p = products.find((x) => x.sku === selectedSku);
    if (!p) return;
    const existing = order.items.findIndex((x) => x.sku === p.sku);
    const next = [...order.items];
    if (existing >= 0) next[existing] = { ...next[existing], qty: Number(next[existing].qty || 0) + Number(qty || 1) };
    else next.push({ productId: String(p._id), title: p.title, sku: p.sku, price: p.price, qty: Number(qty || 1) });
    setOrder({ ...order, items: next });
    setSelectedSku('');
    setQty(1);
  }

  async function saveItems() {
    setMsg(''); setErr('');
    const res = await fetch(`/api/orders/${id}/items`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: order.items, discount: order.discount || 0 }),
    });
    if (!res.ok) { setErr('שגיאה בעדכון פריטים'); return; }
    setMsg('הפריטים נשמרו');
  }

  async function saveNotes(e) {
    e.preventDefault();
    setMsg(''); setErr('');
    const form = e.currentTarget;
    const notes = form.notes.value;
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer: { ...(order.customer||{}), notes } }),
    });
    if (!res.ok) { setErr('שגיאה בעדכון הערות'); return; }
    setMsg('הערות נשמרו');
  }

  if (!order) return <main className="container" style={{ direction: 'rtl', padding: 24 }}>טוען…</main>;

  return (
    <main className="container" style={{ direction: 'rtl', padding: 24 }}>
      <h1>הזמנה</h1>
      <div style={{ margin: '8px 0' }}><Link href="/agent/orders">← חזרה לרשימה</Link></div>

      <section style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', margin: '8px 0' }}>
        <button
          onClick={async () => {
            try {
              const res = await fetch(`/api/orders/${id}/quote`, { method: 'GET' });
              if (!res.ok) { alert('שגיאה ביצירת PDF'); return; }
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = `quote-${id}.pdf`;
              document.body.appendChild(a); a.click(); a.remove();
              window.URL.revokeObjectURL(url);
            } catch {
              alert('שגיאה בהורדת PDF');
            }
          }}
        >📄 הורדת PDF</button>
        <button
          onClick={async () => {
            try {
              const res = await fetch(`/api/orders/${id}/quote/upload`, { method: 'POST' });
              if (!res.ok) { alert('שגיאה בהעלאת PDF'); return; }
              const { url } = await res.json();
              if (!url) { alert('לא התקבל קישור PDF'); return; }
              const msg = buildQuoteLinkMessage(order, url);
              const raw = order?.customer?.phone || '';
              let phone = normalizeIL(raw) || '';
              if (phone.startsWith('0')) phone = '972' + phone.slice(1);
              window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
            } catch {
              alert('שגיאה בשליחת PDF');
            }
          }}
        >📱 שליחת PDF ב-WhatsApp</button>
      </section>

      <section style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', margin: '8px 0' }}>
        <WhatsAppButton order={order} />
      </section>

      <section style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', margin: '8px 0' }}>
        <select value={selectedSku} onChange={(e) => setSelectedSku(e.target.value)}>
          <option value="">בחר מוצר</option>
          {products.map((p) => (
            <option key={p._id} value={p.sku}>{p.title} — {p.sku} — {p.price}</option>
          ))}
        </select>
        <input type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} style={{ width: 80 }} />
        <button onClick={addItem}>הוסף</button>
      </section>

      <section>
        <h3>שורות</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'right' }}>SKU</th>
              <th style={{ textAlign: 'right' }}>מוצר</th>
              <th style={{ textAlign: 'right' }}>מחיר</th>
              <th style={{ textAlign: 'right' }}>כמות</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(order.items||[]).map((it) => (
              <tr key={it.sku}>
                <td>{it.sku}</td>
                <td>{it.title}</td>
                <td>{it.price}</td>
                <td>
                  <input type="number" min={0} value={it.qty} onChange={(e) => updateQty(it.sku, e.target.value)} style={{ width: 80 }} />
                </td>
                <td><button onClick={() => removeItem(it.sku)}>הסר</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 8 }}>ביניים: {subtotal} | הנחה: {order.discount||0} | סה"כ: {total}</div>
        <button disabled={pending} onClick={() => start(saveItems)}>שמור פריטים</button>
      </section>

      <section style={{ marginTop: 16 }}>
        <h3>הערות לקוח</h3>
        <form onSubmit={saveNotes}>
          <textarea name="notes" defaultValue={order.customer?.notes||''} style={{ minWidth: 320, minHeight: 80 }} />
          <div><button type="submit">שמור הערות</button></div>
        </form>
      </section>

      {msg && <div style={{ color: 'green', marginTop: 8 }}>{msg}</div>}
      {err && <div style={{ color: 'crimson', marginTop: 8 }}>{err}</div>}
    </main>
  );
}
