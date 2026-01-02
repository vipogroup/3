'use client';

import Link from 'next/link';
import TransactionsReport from '@/components/admin/TransactionsReport';

export default function TransactionsClient() {
  return (
    <main className="min-h-screen bg-white p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-4 sm:mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin" className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="חזרה לדשבורד">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <h1
              className="text-xl sm:text-2xl md:text-3xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              עסקאות
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">סקירת עסקאות עם פילטרים בזמן אמת</p>
        </header>
        <TransactionsReport />
      </div>
    </main>
  );
}
