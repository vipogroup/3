'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SecurityPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [securityData, setSecurityData] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.user.role !== 'admin') {
        router.push('/');
        return;
      }
      setUser(data.user);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const runSecurityScan = useCallback(async () => {
    setScanning(true);
    try {
      const res = await fetch('/api/admin/security-scan');
      if (res.ok) {
        const data = await res.json();
        setSecurityData(data);
      }
    } catch (error) {
      console.error('Failed to run security scan:', error);
    } finally {
      setScanning(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      runSecurityScan();
    }
  }, [user, runSecurityScan]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4" style={{ border: '4px solid rgba(8, 145, 178, 0.2)', borderTopColor: '#0891b2' }}></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status) => {
    if (status === 'ok') return (
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
    if (status === 'warning') return (
      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
    return (
      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              אבטחת מערכת
            </h1>
            <p className="text-gray-500 text-sm mt-1">סריקה מקיפה של רמת האבטחה במערכת</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={runSecurityScan}
              disabled={scanning}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)' }}
            >
              <svg className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {scanning ? 'סורק...' : 'סרוק שוב'}
            </button>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              חזרה
            </Link>
          </div>
        </div>

        {securityData && (
          <>
            {/* Overall Score Card */}
            <div className={`bg-white rounded-xl p-6 border-2 shadow-lg mb-6 ${securityData.overallScore >= 85 ? 'border-green-300' : securityData.overallScore >= 70 ? 'border-amber-300' : 'border-red-300'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">ציון אבטחה כללי</h2>
                  <p className="text-sm text-gray-500">
                    {securityData.overallScore >= 85 ? 'המערכת מאובטחת היטב' : 
                     securityData.overallScore >= 70 ? 'יש מקום לשיפור' : 
                     'נדרשת תשומת לב מיידית'}
                  </p>
                </div>
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(securityData.overallScore)}`}>
                    {securityData.overallScore}%
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-3 mt-2">
                    <div className={`h-3 rounded-full ${getScoreBg(securityData.overallScore)}`} style={{ width: `${securityData.overallScore}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {securityData.categories && Object.entries(securityData.categories).map(([key, category]) => (
                <div key={key} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <button 
                    onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.score >= 80 ? 'bg-green-100' : category.score >= 60 ? 'bg-amber-100' : 'bg-red-100'}`}>
                        <span className={`text-xl font-bold ${getScoreColor(category.score)}`}>{category.score}</span>
                      </div>
                      <div className="text-right">
                        <h3 className="font-bold text-gray-900">{category.name}</h3>
                        <p className="text-xs text-gray-500">{category.checks?.length || 0} בדיקות</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedCategory === key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedCategory === key && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="space-y-3">
                        {category.checks?.map((check, i) => (
                          <div key={i} className={`p-3 rounded-lg ${check.status === 'ok' ? 'bg-green-50 border border-green-200' : check.status === 'warning' ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
                            <div className="flex items-start gap-3">
                              {getStatusIcon(check.status)}
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{check.name}</p>
                                <p className="text-sm text-gray-600">{check.message}</p>
                                {check.recommendation && (
                                  <p className="text-xs text-blue-600 mt-1">המלצה: {check.recommendation}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Recommendations */}
            {securityData.recommendations && securityData.recommendations.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">המלצות לשיפור האבטחה</h2>
                </div>
                <div className="p-4 space-y-4">
                  {securityData.recommendations.map((rec, i) => (
                    <div key={i} className={`p-4 rounded-lg ${rec.priority === 'critical' ? 'bg-red-50 border-2 border-red-300' : rec.priority === 'high' ? 'bg-amber-50 border border-amber-200' : rec.priority === 'medium' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
                      <div className="flex items-start gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${rec.priority === 'critical' ? 'bg-red-500 text-white' : rec.priority === 'high' ? 'bg-amber-500 text-white' : rec.priority === 'medium' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}>
                          {rec.priority === 'critical' ? 'קריטי' : rec.priority === 'high' ? 'גבוה' : rec.priority === 'medium' ? 'בינוני' : 'נמוך'}
                        </span>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{rec.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                          {rec.code && (
                            <pre className="mt-2 p-3 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto" dir="ltr">
                              {rec.code}
                            </pre>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Best Practices */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">מה קיים במערכת</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-900">הצפנת סיסמאות עם bcrypt</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-900">אימות JWT מאובטח</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-900">Rate Limiting לנקודות קצה</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-900">הגנה על Routes לפי תפקיד</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-900">Cookies מאובטחים (httpOnly, secure)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-900">חיבור מוצפן לדאטהבייס (SSL)</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {!securityData && !scanning && (
          <div className="bg-white rounded-xl p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-gray-500">לחץ על סרוק שוב להפעלת סריקת אבטחה</p>
          </div>
        )}
      </div>
    </main>
  );
}
