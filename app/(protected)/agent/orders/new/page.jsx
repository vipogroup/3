'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function NewOrderPage() {
  const [products, setProducts] = useState([]);
  const [selectedSku, setSelectedSku] = useState('');
  const [qty, setQty] = useState(1);
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState(0);
  const [err, setErr] = useState('');
  const [pending, start] = useTransition();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/products?active=true', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d.items) ? d.items : []))
      .catch(() => {});
  }, []);

  const subtotal = useMemo(() => items.reduce((s, it) => s + (Number(it.qty||0) * Number(it.price||0)), 0), [items]);
  const total = useMemo(() => Math.max(0, subtotal - Number(discount||0)), [subtotal, discount]);

  function addItem() {
    const p = products.find((x) => x.sku === selectedSku);
    if (!p) return;
    const existing = items.findIndex((x) => x.sku === p.sku);
    if (existing >= 0) {
      const next = [...items];
      next[existing] = { ...next[existing], qty: Number(next[existing].qty || 0) + Number(qty || 1) };
      setItems(next);
    } else {
      setItems([...items, { productId: String(p._id), title: p.title, sku: p.sku, price: p.price, qty: Number(qty || 1) }]);
    }
    setSelectedSku('');
    setQty(1);
  }

  function updateQty(sku, val) {
    const next = items.map((it) => (it.sku === sku ? { ...it, qty: Number(val || 0) } : it));
    setItems(next);
  }

  function removeItem(sku) {
    setItems(items.filter((it) => it.sku !== sku));
  }

  async function create() {
    setErr('');
    const body = {
      customer: { fullName: customerName, phone: customerPhone, notes },
      items,
      discount: Number(discount || 0),
    };
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error || 'שגיאה ביצירת הזמנה');
      return;
    }
    const j = await res.json();
    router.push(`/agent/orders/${j.order?._id}`);
  }

  return (
    <main className="container" style={{ direction: 'rtl', padding: 24 }}>
      <h1>הזמנה חדשה</h1>

      <section style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', margin: '8px 0' }}>
        <select value={selectedSku} onChange={(e) => setSelectedSku(e.target.value)}>
          <option value="">בחר מוצר</option>
          {products.map((p) => (
            <option key={p._id} value={p.sku}>
              {p.title} — {p.sku} — {p.price}
            </option>
          ))}
        </select>
        <input type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} style={{ width: 80 }} />
        <button onClick={addItem}>הוסף</button>
      </section>

      <section>
        <h3>שורות הזמנה</h3>
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
            {items.map((it) => (
              <tr key={it.sku}>
                <td>{it.sku}</td>
                <td>{it.title}</td>
                <td>{it.price}</td>
                <td>
                  <input type="number" min={0} value={it.qty} onChange={(e) => updateQty(it.sku, e.target.value)} style={{ width: 80 }} />
                </td>
                <td>
                  <button onClick={() => removeItem(it.sku)}>הסר</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 12 }}>
        <label>
          הנחה
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} style={{ width: 120, marginInlineStart: 8 }} />
        </label>
        <div style={{ marginTop: 8 }}>ביניים: {subtotal} | סה"כ: {total}</div>
      </section>

      <section style={{ marginTop: 12, display: 'grid', gap: 8, maxWidth: 380 }}>
        <h3>לקוח</h3>
        <input placeholder="שם מלא" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        <input placeholder="טלפון" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
        <textarea placeholder="הערות" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </section>

      <div style={{ marginTop: 16 }}>
        <button disabled={pending} onClick={() => start(create)}>
          {pending ? 'יוצר...' : 'צור הזמנה'}
        </button>
      </div>
      {err && <div style={{ color: 'crimson', marginTop: 8 }}>{err}</div>}
    </main>
  );
}
