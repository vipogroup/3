"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/app/components/StatusBadge.jsx";

const OPTIONS = ["new", "qualified", "paid", "shipped", "delivered", "canceled"];

export default function StatusSelect({ id, value }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  async function onChange(e) {
    const status = e.target.value;
    const res = await fetch(`/api/orders/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      alert("שינוי סטטוס נכשל");
      return;
    }
    router.refresh();
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <StatusBadge status={value} />
      <select disabled={pending} defaultValue={value} onChange={(e) => start(() => onChange(e))}>
        {OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </span>
  );
}
