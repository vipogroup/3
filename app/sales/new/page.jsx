'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/app/components/layout/MainLayout';
import SaleForm from '@/app/components/sales/SaleForm';

export default function NewSalePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is authenticated and has permission
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!res.ok) {
          setError('אנא התחבר כדי ליצור מכירה חדשה');
          return;
        }

        const data = await res.json();
        if (!data.user) {
          setError('אנא התחבר כדי ליצור מכירה חדשה');
          return;
        }

        // Check if user is agent or admin
        if (!['סוכן', 'agent', 'מנהל', 'admin'].includes(data.user.role)) {
          setError('אין לך הרשאה ליצור מכירות');
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error('Auth check error:', error);
        setError('אירעה שגיאה בבדיקת הרשאות');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1
                className="text-3xl font-bold mb-1"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                יצירת מכירה חדשה
              </h1>
              <div
                className="h-1 w-24 rounded-full"
                style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)' }}
              />
            </div>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-300"
              style={{
                background: 'white',
                border: '2px solid #1e3a8a',
                color: '#1e3a8a',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#1e3a8a';
              }}
            >
              חזרה
            </button>
          </div>

          {error && (
            <div
              className="px-4 py-3 rounded-lg mb-6"
              style={{
                background:
                  'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                color: '#dc2626',
              }}
            >
              <p className="font-medium">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div
                className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"
                style={{
                  borderTopColor: '#1e3a8a',
                  borderBottomColor: '#0891b2',
                }}
              ></div>
            </div>
          ) : user ? (
            <div
              className="rounded-xl p-6"
              style={{
                border: '2px solid transparent',
                backgroundImage:
                  'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                boxShadow: '0 4px 15px rgba(8, 145, 178, 0.12)',
              }}
            >
              <SaleForm />
            </div>
          ) : null}
        </div>
      </div>
    </MainLayout>
  );
}
