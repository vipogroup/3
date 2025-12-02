'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAllThemes } from '@/app/themes/themes';
import Link from 'next/link';

export default function ThemeSelectorPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [currentThemeId, setCurrentThemeId] = useState('vipo');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const themes = getAllThemes();

  const loadData = useCallback(async () => {
    try {
      // Check auth
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        router.push('/login');
        return;
      }
      const userData = await userRes.json();
      if (userData.user.role !== 'admin') {
        router.push('/');
        return;
      }
      setUser(userData.user);

      // Get current theme
      const themeRes = await fetch('/api/theme');
      if (themeRes.ok) {
        const themeData = await themeRes.json();
        setCurrentThemeId(themeData.themeId || 'vipo');
      }
    } catch (error) {
      console.error('Failed to load theme data:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleThemeChange(themeId) {
    try {
      setSaving(true);
      setMessage('');

      const res = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      });

      if (res.ok) {
        setCurrentThemeId(themeId);
        setMessage('✅ הסגנון עודכן בהצלחה! רענן את הדף לראות את השינויים.');
      } else {
        setMessage('❌ שגיאה בעדכון הסגנון');
      }
    } catch (error) {
      console.error('Theme change error:', error);
      setMessage('❌ שגיאה בעדכון הסגנון');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              🎨 בחירת סגנון עיצוב
            </h1>
            <p className="text-gray-600">בחר סגנון עיצוב למערכת - בהשראת אתרי e-commerce מובילים</p>
          </div>
          <Link
            href="/admin/dashboard-improved"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-3 rounded-lg transition shadow-md"
          >
            ← חזרה לדשבורד
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl ${
              message.includes('✅')
                ? 'bg-green-100 border border-green-300 text-green-800'
                : 'bg-red-100 border border-red-300 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        {/* Current Theme */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">סגנון נוכחי</h2>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{themes.find((t) => t.id === currentThemeId)?.icon}</span>
            <div>
              <p className="font-bold text-lg">
                {themes.find((t) => t.id === currentThemeId)?.nameHe}
              </p>
              <p className="text-sm text-gray-600">
                {themes.find((t) => t.id === currentThemeId)?.descriptionHe}
              </p>
            </div>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all cursor-pointer ${
                currentThemeId === theme.id
                  ? 'ring-4 ring-green-500 scale-105'
                  : 'hover:shadow-xl hover:scale-102'
              }`}
              onClick={() => handleThemeChange(theme.id)}
            >
              {/* Theme Preview */}
              <div
                className={`h-32 bg-gradient-to-r ${theme.bgGradient} flex items-center justify-center`}
              >
                <span className="text-6xl">{theme.icon}</span>
              </div>

              {/* Theme Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{theme.nameHe}</h3>
                  {currentThemeId === theme.id && (
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                      פעיל
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">{theme.descriptionHe}</p>

                {/* Color Swatches */}
                <div className="flex gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-full shadow-md"
                    style={{ backgroundColor: theme.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-8 h-8 rounded-full shadow-md"
                    style={{ backgroundColor: theme.secondary }}
                    title="Secondary"
                  />
                  <div
                    className="w-8 h-8 rounded-full shadow-md"
                    style={{ backgroundColor: theme.accent }}
                    title="Accent"
                  />
                </div>

                {/* Button Preview */}
                <div className="space-y-2">
                  <button
                    className={`w-full ${theme.primaryButton} py-2 px-4 ${theme.borderRadius}`}
                    disabled
                  >
                    כפתור ראשי
                  </button>
                  <button
                    className={`w-full ${theme.secondaryButton} py-2 px-4 ${theme.borderRadius}`}
                    disabled
                  >
                    כפתור משני
                  </button>
                </div>

                {/* Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleThemeChange(theme.id);
                  }}
                  disabled={saving || currentThemeId === theme.id}
                  className={`w-full mt-4 py-3 px-4 rounded-xl font-bold transition-all ${
                    currentThemeId === theme.id
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {saving ? 'שומר...' : currentThemeId === theme.id ? '✓ נבחר' : 'בחר סגנון זה'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">💡 הוראות שימוש</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ לחץ על כרטיס סגנון כדי לבחור אותו</li>
            <li>✓ השינויים נשמרים מיד במסד הנתונים</li>
            <li>✓ רענן את הדף כדי לראות את העיצוב החדש</li>
            <li>✓ הסגנון יחול על כל המערכת - דפי מוצרים, דשבורדים ועוד</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
