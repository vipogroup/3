"use client";

import TransactionsReport from "@/components/admin/TransactionsReport";

export default function TransactionsClient() {
  return (
    <main className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">דוח עסקאות</h1>
        <p className="text-gray-600">סקירת עסקאות עם פילטרים בזמן אמת</p>
      </header>
      <TransactionsReport />
    </main>
  );
}
