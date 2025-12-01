"use client";

import TransactionsReport from "@/components/admin/TransactionsReport";

export default function TransactionsClient() {
  return (
    <main className="min-h-screen bg-white p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
      <header className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2" style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>עסקאות</h1>
        <p className="text-sm sm:text-base text-gray-600">סקירת עסקאות עם פילטרים בזמן אמת</p>
      </header>
      <TransactionsReport />
      </div>
    </main>
  );
}
