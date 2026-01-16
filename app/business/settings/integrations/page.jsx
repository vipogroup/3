'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BusinessIntegrationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('payment');
  
  const [settings, setSettings] = useState({
    // Payment Mode
    paymentMode: 'platform', // 'platform' | 'independent'
    // Domain
    domain: '',
    subdomain: '',
    // PayPlus
    payplus: {
      enabled: false,
      apiKey: '',
      secretKey: '',
      terminalId: '',
      webhookSecret: '',
      testMode: true,
    },
    // Priority
    priority: {
      enabled: false,
      apiUrl: '',
      username: '',
      password: '',
      companyId: '',
      priceListCode: '',
      warehouseCode: '',
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/business/integrations', { credentials: 'include' });
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to load settings');
      }
      const data = await res.json();
      if (data.ok) {
        setSettings({
          paymentMode: data.tenant?.paymentMode || 'platform',
          domain: data.tenant?.domain || '',
          subdomain: data.tenant?.subdomain || '',
          payplus: {
            enabled: data.tenant?.payplus?.enabled || false,
            apiKey: data.tenant?.payplus?.apiKey || '',
            secretKey: data.tenant?.payplus?.secretKey || '',
            terminalId: data.tenant?.payplus?.terminalId || '',
            webhookSecret: data.tenant?.payplus?.webhookSecret || '',
            testMode: data.tenant?.payplus?.testMode !== false,
          },
          priority: {
            enabled: data.tenant?.priority?.enabled || false,
            apiUrl: data.tenant?.priority?.apiUrl || '',
            username: data.tenant?.priority?.username || '',
            password: data.tenant?.priority?.password || '',
            companyId: data.tenant?.priority?.companyId || '',
            priceListCode: data.tenant?.priority?.priceListCode || '',
            warehouseCode: data.tenant?.priority?.warehouseCode || '',
          },
        });
      }
    } catch (err) {
      setError('שגיאה בטעינת ההגדרות');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/business/integrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.ok) {
        setSuccess('ההגדרות נשמרו בהצלחה!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'שגיאה בשמירת ההגדרות');
      }
    } catch (err) {
      setError('שגיאה בשמירת ההגדרות');
    } finally {
      setSaving(false);
    }
  };

  const updatePayplus = (field, value) => {
    setSettings(prev => ({
      ...prev,
      payplus: { ...prev.payplus, [field]: value }
    }));
  };

  const updatePriority = (field, value) => {
    setSettings(prev => ({
      ...prev,
      priority: { ...prev.priority, [field]: value }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען הגדרות...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'payment', label: 'מודל תשלום', icon: '💰' },
    { id: 'domain', label: 'דומיין', icon: '🌐' },
    { id: 'payplus', label: 'PayPlus סליקה', icon: '💳' },
    { id: 'priority', label: 'Priority ERP', icon: '📦' },
  ];

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              אינטגרציות
            </h1>
            <p className="text-gray-500 text-sm mt-1">דומיין, סליקה ו-ERP</p>
          </div>
          <Link
            href="/business/settings"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            חזרה
          </Link>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={activeTab === tab.id ? {
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)'
              } : {}}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          className="bg-white rounded-xl p-6"
          style={{
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 4px 15px rgba(8, 145, 178, 0.12)',
          }}
        >
          {/* Payment Mode Tab */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">מודל תשלומים</h2>
                <p className="text-gray-500 text-sm mb-6">
                  בחר כיצד תרצה לקבל תשלומים מלקוחות
                </p>
              </div>

              <div className="space-y-4">
                {/* Platform Mode */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                    settings.paymentMode === 'platform'
                      ? 'ring-2 ring-cyan-500 bg-cyan-50'
                      : 'border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    value="platform"
                    checked={settings.paymentMode === 'platform'}
                    onChange={(e) => setSettings(prev => ({ ...prev, paymentMode: e.target.value }))}
                    className="mt-1 w-5 h-5"
                    style={{ accentColor: '#0891b2' }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">סליקה דרך המערכת</span>
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">מומלץ למתחילים</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      התשלומים עוברים דרך מנהל המערכת. אתה רק מעלה מוצרים ומתחיל למכור!
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        ✓ אין צורך בחשבון PayPlus
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        ✓ אין צורך בהנהלת חשבונות
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        ✓ התחלה מיידית
                      </span>
                    </div>
                  </div>
                </label>

                {/* Independent Mode */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                    settings.paymentMode === 'independent'
                      ? 'ring-2 ring-cyan-500 bg-cyan-50'
                      : 'border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    value="independent"
                    checked={settings.paymentMode === 'independent'}
                    onChange={(e) => setSettings(prev => ({ ...prev, paymentMode: e.target.value }))}
                    className="mt-1 w-5 h-5"
                    style={{ accentColor: '#0891b2' }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">סליקה עצמאית</span>
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">לעסקים מתקדמים</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      התשלומים עוברים ישירות אליך. דורש חיבור PayPlus והנהלת חשבונות משלך.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        💳 דורש חשבון PayPlus
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        📋 דורש הנהלת חשבונות
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        🔓 עצמאות מלאה
                      </span>
                    </div>
                  </div>
                </label>
              </div>

              {settings.paymentMode === 'independent' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-amber-500 text-xl">⚠️</span>
                    <div>
                      <h4 className="font-bold text-amber-800 mb-1">נדרש חיבור PayPlus</h4>
                      <p className="text-sm text-amber-700">
                        כדי לקבל תשלומים ישירות, עליך להגדיר את פרטי PayPlus שלך בלשונית &quot;PayPlus סליקה&quot;.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Domain Tab */}
          {activeTab === 'domain' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">הגדרות דומיין</h2>
                <p className="text-gray-500 text-sm mb-6">
                  הגדר דומיין מותאם אישית לחנות שלך. לאחר הגדרת הדומיין, תצטרך להפנות את ה-DNS אלינו.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">דומיין מותאם אישית</label>
                <input
                  type="text"
                  value={settings.domain}
                  onChange={(e) => setSettings(prev => ({ ...prev, domain: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="shop.yourdomain.com"
                />
                <p className="text-xs text-gray-500 mt-1">הזן את הדומיין המלא (ללא https://)</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">תת-דומיין (Subdomain)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settings.subdomain}
                    onChange={(e) => setSettings(prev => ({ ...prev, subdomain: e.target.value }))}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                    placeholder="myshop"
                  />
                  <span className="text-gray-500">.vipo-group.com</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-800 mb-2">הגדרות DNS נדרשות:</h3>
                <p className="text-sm text-blue-700">
                  הוסף רשומת CNAME שמצביעה ל: <code className="bg-blue-100 px-2 py-1 rounded">cname.vipo-group.com</code>
                </p>
              </div>
            </div>
          )}

          {/* PayPlus Tab */}
          {activeTab === 'payplus' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">PayPlus - סליקת אשראי</h2>
                  <p className="text-gray-500 text-sm">חבר את חשבון PayPlus שלך לקבלת תשלומים ישירות</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.payplus.enabled}
                    onChange={(e) => updatePayplus('enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[-24px] peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              {settings.payplus.enabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">API Key</label>
                      <input
                        type="text"
                        value={settings.payplus.apiKey}
                        onChange={(e) => updatePayplus('apiKey', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                        placeholder="הזן API Key"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Secret Key</label>
                      <input
                        type="password"
                        value={settings.payplus.secretKey}
                        onChange={(e) => updatePayplus('secretKey', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                        placeholder="הזן Secret Key"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Terminal ID</label>
                      <input
                        type="text"
                        value={settings.payplus.terminalId}
                        onChange={(e) => updatePayplus('terminalId', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                        placeholder="מזהה מסוף (אופציונלי)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Webhook Secret</label>
                      <input
                        type="password"
                        value={settings.payplus.webhookSecret}
                        onChange={(e) => updatePayplus('webhookSecret', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                        placeholder="סוד לאימות Webhooks"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="testMode"
                      checked={settings.payplus.testMode}
                      onChange={(e) => updatePayplus('testMode', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <label htmlFor="testMode" className="text-sm">
                      <span className="font-bold text-yellow-800">מצב בדיקה (Test Mode)</span>
                      <span className="text-yellow-700"> - ללא חיובים אמיתיים</span>
                    </label>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-800 mb-2">כתובת Webhook:</h3>
                    <code className="text-sm bg-gray-100 px-3 py-2 rounded block overflow-x-auto">
                      https://vipo-group.com/api/payplus/webhook?tenant={settings.subdomain || 'YOUR_SUBDOMAIN'}
                    </code>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Priority Tab */}
          {activeTab === 'priority' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Priority ERP</h2>
                  <p className="text-gray-500 text-sm">חבר את מערכת Priority לסנכרון הזמנות ומלאי</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.priority.enabled}
                    onChange={(e) => updatePriority('enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[-24px] peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              {settings.priority.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-900 mb-2">API URL</label>
                    <input
                      type="url"
                      value={settings.priority.apiUrl}
                      onChange={(e) => updatePriority('apiUrl', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                      placeholder="https://your-priority-server.com/odata/Priority/tabula.ini"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">שם משתמש</label>
                    <input
                      type="text"
                      value={settings.priority.username}
                      onChange={(e) => updatePriority('username', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                      placeholder="apiuser"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">סיסמה</label>
                    <input
                      type="password"
                      value={settings.priority.password}
                      onChange={(e) => updatePriority('password', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">קוד חברה</label>
                    <input
                      type="text"
                      value={settings.priority.companyId}
                      onChange={(e) => updatePriority('companyId', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                      placeholder="demo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">קוד מחירון</label>
                    <input
                      type="text"
                      value={settings.priority.priceListCode}
                      onChange={(e) => updatePriority('priceListCode', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                      placeholder="001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">קוד מחסן</label>
                    <input
                      type="text"
                      value={settings.priority.warehouseCode}
                      onChange={(e) => updatePriority('warehouseCode', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                      placeholder="001"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 rounded-xl text-white font-bold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            {saving ? 'שומר...' : 'שמור הגדרות'}
          </button>
        </div>
      </div>
    </div>
  );
}
