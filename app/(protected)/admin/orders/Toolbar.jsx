"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Toolbar({ initialQ = "", initialStatus = "" }) {
  const [q, setQ] = useState(initialQ);
  const [status, setStatus] = useState(initialStatus);
  const [pending, start] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  useEffect(() => {
    setQ(initialQ);
    setStatus(initialStatus);
  }, [initialQ, initialStatus]);

  function push(qv, sv) {
    const params = new URLSearchParams(sp.toString());
    if (qv) params.set("q", qv); else params.delete("q");
    if (sv) params.set("status", sv); else params.delete("status");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8, flexWrap: "wrap", direction: "rtl" }}>
      <select value={status} onChange={(e) => start(() => { const v = e.target.value; setStatus(v); push(q, v); })}>
        <option value="">כל הסטטוסים</option>
        <option value="new">new</option>
        <option value="qualified">qualified</option>
        <option value="paid">paid</option>
        <option value="shipped">shipped</option>
        <option value="delivered">delivered</option>
        <option value="canceled">canceled</option>
      </select>
      <input
        placeholder="חפש טלפון/sku"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') start(() => push(e.currentTarget.value, status)); }}
        onBlur={(e) => start(() => push(e.currentTarget.value, status))}
      />
      <button disabled={pending} onClick={() => start(() => push(q, status))}>סנן</button>
    </div>
  );
}
