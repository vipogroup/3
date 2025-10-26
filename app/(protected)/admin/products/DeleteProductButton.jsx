"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  async function remove() {
    if (!confirm("למחוק מוצר?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("שגיאה במחיקה");
      return;
    }
    router.refresh();
  }

  return (
    <button disabled={pending} onClick={() => start(remove)}>
      {pending ? "מוחק..." : "מחק"}
    </button>
  );
}
