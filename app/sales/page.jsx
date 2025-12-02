'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/app/components/layout/MainLayout';
import SalesTable from '@/app/components/sales/SalesTable';

export const dynamic = 'force-dynamic';

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }

    fetchUser();
  }, []);

  // Fetch sales data
  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch('/api/sales', { cache: 'no-store' });

        if (!res.ok) {
          if (res.status === 401) {
            setError('אנא התחבר כדי לצפות במכירות');
            return;
          }
          if (res.status === 403) {
            setError('אין לך הרשאה לצפות במכירות');
            return;
          }
          throw new Error('Failed to load sales');
        }

        const data = await res.json();
        setSales(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching sales:', error);
        setError('אירעה שגיאה בטעינת המכירות. נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    }

    fetchSales();
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
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
                המכירות שלי
              </h1>
              <div
                className="h-1 w-24 rounded-full"
                style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)' }}
              />
            </div>
            {user && (
              <Link
                href="/sales/new"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                  boxShadow: '0 2px 8px rgba(8, 145, 178, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(8, 145, 178, 0.2)';
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                הוספת מכירה
              </Link>
            )}
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
          ) : (
            <div
              className="rounded-xl p-4 sm:p-6"
              style={{
                border: '2px solid transparent',
                backgroundImage:
                  'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                boxShadow: '0 4px 15px rgba(8, 145, 178, 0.12)',
              }}
            >
              <SalesTable sales={sales} isAdmin={isAdmin} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
