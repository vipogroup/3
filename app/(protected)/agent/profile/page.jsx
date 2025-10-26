'use client';

import { useEffect, useState } from 'react';

export default function AgentProfile() {
  const [data, setData] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/users/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setData(d.user);
        setFullName(d.user?.fullName || '');
        setPhone(d.user?.phone || '');
      })
      .catch(() => {});
  }, []);

  async function save() {
    setMsg('');
    await fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, phone }),
    });
    setMsg('נשמר');
    location.reload();
  }

  async function changePassword(e) {
    e.preventDefault();
    setMsg('');
    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.newPassword.value;
    const r = await fetch('/api/users/me/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    if (r.ok) setMsg('הסיסמה עודכנה');
    else setMsg('שגיאה בעדכון הסיסמה');
  }

  if (!data) return <main className="container" style={{ direction: 'rtl', padding: 24 }}>טוען…</main>;

  return (
    <main className="container" style={{ direction: 'rtl', padding: 24 }}>
      <h1>פרופיל</h1>
      <label>
        שם מלא
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </label>
      <label>
        טלפון
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>
      <button onClick={save}>שמור</button>

      <h2>החלפת סיסמה</h2>
      <form onSubmit={changePassword}>
        <input name="oldPassword" type="password" placeholder="סיסמה נוכחית" required />
        <input name="newPassword" type="password" placeholder="סיסמה חדשה" required />
        <button type="submit">עדכן סיסמה</button>
      </form>
      {msg && <p>{msg}</p>}
    </main>
  );
}
