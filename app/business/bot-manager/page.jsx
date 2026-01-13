'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BotIcons } from '@/components/admin/BotIcons';

export default function BusinessBotManagerPage() {
  const [businessId, setBusinessId] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Stats calculations
  const stats = useMemo(() => {
    if (!config) return { categories: 0, questions: 0, active: 0 };
    const categories = config.categories?.length || 0;
    const questions = config.categories?.reduce((sum, cat) => sum + (cat.questions?.length || 0), 0) || 0;
    const active = config.categories?.filter(c => c.isActive).length || 0;
    return { categories, questions, active };
  }, [config]);

  // Filtered categories for search
  const filteredCategories = useMemo(() => {
    if (!config?.categories || !searchQuery) return config?.categories || [];
    return config.categories.filter(cat => 
      cat.name.includes(searchQuery) ||
      cat.questions?.some(q => q.question.includes(searchQuery) || q.answer.includes(searchQuery))
    );
  }, [config?.categories, searchQuery]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Check auth and get businessId
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.user?.role !== 'business_admin' && data.user?.role !== 'admin' && data.user?.role !== 'super_admin') {
          router.push('/');
          return;
        }
        if (!data.user?.tenantId && data.user?.role === 'business_admin') {
          router.push('/login');
          return;
        }
        setAuthorized(true);
        setBusinessId(data.user.tenantId || data.user.id);
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/login');
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (businessId) {
      fetchConfig();
    }
  }, [businessId]);

  const fetchConfig = async () => {
    try {
      const res = await fetch(`/api/bot-config?ownerType=business&businessId=${businessId}`);
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/bot-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerType: 'business',
          businessId,
          texts: config.texts,
          buttons: config.buttons,
          placeholders: config.placeholders,
          categories: config.categories,
          settings: config.settings
        })
      });
      const data = await res.json();
      if (data.success) {
        showMessage('success', 'ההגדרות נשמרו בהצלחה!');
      }
    } catch (error) {
      showMessage('error', 'שגיאה בשמירה');
    } finally {
      setSaving(false);
    }
  };

  // Export config to JSON file
  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bot-config-business-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMessage('success', 'הקובץ יוצא בהצלחה!');
  };

  // Import config from JSON file
  const importConfig = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.categories) {
          setConfig(prev => ({ ...prev, ...imported }));
          showMessage('success', 'הקונפיגורציה יובאה בהצלחה! לחץ שמור להחלת השינויים.');
        }
      } catch (err) {
        showMessage('error', 'שגיאה בקריאת הקובץ');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const updateText = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateCategory = (categoryId, field, value) => {
    setConfig(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId ? { ...cat, [field]: value } : cat
      )
    }));
  };

  const updateQuestion = (categoryId, questionId, field, value) => {
    setConfig(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              questions: cat.questions.map(q =>
                q.id === questionId ? { ...q, [field]: value } : q
              )
            }
          : cat
      )
    }));
  };

  const addCategory = async () => {
    try {
      const res = await fetch('/api/bot-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerType: 'business',
          businessId,
          action: 'addCategory',
          data: { name: 'קטגוריה חדשה' }
        })
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        showMessage('success', 'קטגוריה נוספה!');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const addQuestion = async (categoryId) => {
    try {
      const res = await fetch('/api/bot-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerType: 'business',
          businessId,
          action: 'addQuestion',
          categoryId,
          data: { question: 'שאלה חדשה', answer: 'תשובה חדשה' }
        })
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        showMessage('success', 'שאלה נוספה!');
      }
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!confirm('האם למחוק את הקטגוריה?')) return;
    try {
      const res = await fetch(`/api/bot-config?ownerType=business&businessId=${businessId}&action=deleteCategory&categoryId=${categoryId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        showMessage('success', 'הקטגוריה נמחקה!');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const deleteQuestion = async (categoryId, questionId) => {
    if (!confirm('האם למחוק את השאלה?')) return;
    try {
      const res = await fetch(`/api/bot-config?ownerType=business&businessId=${businessId}&action=deleteQuestion&categoryId=${categoryId}&questionId=${questionId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        showMessage('success', 'השאלה נמחקה!');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  if (loading || !businessId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">לא נמצאה תצורת בוט</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'סקירה', icon: BotIcons.chart },
    { id: 'texts', label: 'טקסטים', icon: BotIcons.text },
    { id: 'categories', label: 'קטגוריות', icon: BotIcons.list },
    { id: 'buttons', label: 'כפתורים', icon: BotIcons.button },
    { id: 'settings', label: 'הגדרות', icon: BotIcons.settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/business" className="text-gray-500 hover:text-gray-700 transition-colors">
                {BotIcons.arrowRight}
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                  {BotIcons.robot}
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-800">ניהול בוט צ&apos;אט</h1>
                  <p className="text-sm text-gray-500">דשבורד עסק</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Export Button */}
              <button
                onClick={exportConfig}
                className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors hidden sm:flex"
                title="ייצוא קונפיגורציה"
              >
                {BotIcons.download}
              </button>
              {/* Import Button */}
              <label className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer hidden sm:flex" title="ייבוא קונפיגורציה">
                {BotIcons.upload}
                <input type="file" accept=".json" onChange={importConfig} className="hidden" />
              </label>
              {/* Save Button */}
              <button
                onClick={saveConfig}
                disabled={saving}
                className="px-4 sm:px-6 py-2.5 rounded-xl text-white font-medium transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                {saving ? BotIcons.spinner : BotIcons.save}
                <span className="hidden sm:inline">{saving ? 'שומר...' : 'שמור'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {message.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-2 mb-6 flex gap-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] px-3 sm:px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' } : {}}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800">סקירה כללית</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      {BotIcons.folder}
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.categories}</p>
                      <p className="text-sm opacity-80">קטגוריות</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      {BotIcons.question}
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.questions}</p>
                      <p className="text-sm opacity-80">שאלות</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      {BotIcons.check}
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.active}</p>
                      <p className="text-sm opacity-80">פעילות</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t pt-6">
                <h3 className="text-md font-bold text-gray-700 mb-4">פעולות מהירות</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveTab('categories')}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
                  >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                      {BotIcons.plus}
                    </div>
                    <span className="text-sm text-gray-700">הוסף קטגוריה</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('texts')}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
                  >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                      {BotIcons.text}
                    </div>
                    <span className="text-sm text-gray-700">ערוך טקסטים</span>
                  </button>
                  <button
                    onClick={exportConfig}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
                  >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                      {BotIcons.download}
                    </div>
                    <span className="text-sm text-gray-700">ייצא הגדרות</span>
                  </button>
                  <label className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center cursor-pointer">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                      {BotIcons.upload}
                    </div>
                    <span className="text-sm text-gray-700">ייבא הגדרות</span>
                    <input type="file" accept=".json" onChange={importConfig} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Bot Status */}
              <div className="border-t pt-6">
                <h3 className="text-md font-bold text-gray-700 mb-4">מצב הבוט</h3>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-3 h-3 rounded-full ${config.settings?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-gray-700">{config.settings?.isActive ? 'הבוט פעיל ומוצג באתר' : 'הבוט כבוי'}</span>
                  <button
                    onClick={() => updateText('settings', 'isActive', !config.settings?.isActive)}
                    className="mr-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ 
                      background: config.settings?.isActive ? '#fee2e2' : 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                      color: config.settings?.isActive ? '#dc2626' : 'white'
                    }}
                  >
                    {config.settings?.isActive ? 'כבה בוט' : 'הפעל בוט'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Texts Tab */}
          {activeTab === 'texts' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">טקסטים כלליים</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">כותרת הבוט</label>
                  <input
                    type="text"
                    value={config.texts.title}
                    onChange={(e) => updateText('texts', 'title', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">תת-כותרת</label>
                  <input
                    type="text"
                    value={config.texts.subtitle}
                    onChange={(e) => updateText('texts', 'subtitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">הודעת פתיחה 1</label>
                  <input
                    type="text"
                    value={config.texts.welcome1}
                    onChange={(e) => updateText('texts', 'welcome1', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">הודעת פתיחה 2</label>
                  <input
                    type="text"
                    value={config.texts.welcome2}
                    onChange={(e) => updateText('texts', 'welcome2', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">הודעת סיום</label>
                  <input
                    type="text"
                    value={config.texts.goodbye}
                    onChange={(e) => updateText('texts', 'goodbye', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">לא נמצאה תשובה</label>
                  <input
                    type="text"
                    value={config.texts.noAnswer}
                    onChange={(e) => updateText('texts', 'noAnswer', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">הודעה נשלחה בהצלחה</label>
                  <input
                    type="text"
                    value={config.texts.sentSuccess}
                    onChange={(e) => updateText('texts', 'sentSuccess', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שגיאה בשליחה</label>
                  <input
                    type="text"
                    value={config.texts.sendError}
                    onChange={(e) => updateText('texts', 'sendError', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Header with search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold text-gray-800">קטגוריות ושאלות</h2>
                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative flex-1 sm:flex-none">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {BotIcons.search}
                    </div>
                    <input
                      type="text"
                      placeholder="חיפוש..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-48 pr-10 pl-4 py-2 rounded-xl border border-gray-200 focus:border-cyan-500 outline-none text-sm"
                    />
                  </div>
                  <button
                    onClick={addCategory}
                    className="px-4 py-2 rounded-xl text-white font-medium transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                  >
                    {BotIcons.plus}
                    <span className="hidden sm:inline">הוסף קטגוריה</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Category Header */}
                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-gray-400">{expandedCategory === category.id ? BotIcons.chevronUp : BotIcons.chevronDown}</span>
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateCategory(category.id, 'name', e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-cyan-500 outline-none"
                        />
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <input
                            type="checkbox"
                            checked={category.isActive}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateCategory(category.id, 'isActive', e.target.checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded"
                          />
                          פעיל
                        </label>
                        <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          {category.questions.length} שאלות
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCategory(category.id);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        {BotIcons.trash}
                      </button>
                    </div>

                    {/* Questions */}
                    {expandedCategory === category.id && !category.isContact && (
                      <div className="p-4 space-y-4 bg-white">
                        {category.questions.map((question) => (
                          <div key={question.id} className="p-4 bg-gray-50 rounded-xl space-y-3">
                            <div className="flex items-start gap-3">
                              <span className="text-sm text-gray-400 mt-3">ש:</span>
                              <input
                                type="text"
                                value={question.question}
                                onChange={(e) => updateQuestion(category.id, question.id, 'question', e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-cyan-500 outline-none"
                                placeholder="שאלה"
                              />
                              <button
                                onClick={() => deleteQuestion(category.id, question.id)}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                {BotIcons.close}
                              </button>
                            </div>
                            <div className="flex items-start gap-3">
                              <span className="text-sm text-gray-400 mt-3">ת:</span>
                              <textarea
                                value={question.answer}
                                onChange={(e) => updateQuestion(category.id, question.id, 'answer', e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-cyan-500 outline-none resize-none"
                                rows={2}
                                placeholder="תשובה"
                              />
                            </div>
                          </div>
                        ))}
                        
                        <button
                          onClick={() => addQuestion(category.id)}
                          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-cyan-500 hover:text-cyan-600 transition-colors flex items-center justify-center gap-2"
                        >
                          {BotIcons.plus}
                          הוסף שאלה
                        </button>
                      </div>
                    )}

                    {expandedCategory === category.id && category.isContact && (
                      <div className="p-4 bg-yellow-50 text-yellow-700 text-sm">
                        <span className="ml-2">{BotIcons.info}</span>
                        קטגוריית שיחה עם נציג - לחיצה על קטגוריה זו תפתח טופס יצירת קשר
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons Tab */}
          {activeTab === 'buttons' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">טקסטים של כפתורים</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">נושא אחר</label>
                  <input
                    type="text"
                    value={config.buttons.otherTopic}
                    onChange={(e) => updateText('buttons', 'otherTopic', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שיחה עם נציג</label>
                  <input
                    type="text"
                    value={config.buttons.talkAgent}
                    onChange={(e) => updateText('buttons', 'talkAgent', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">זה הכל תודה</label>
                  <input
                    type="text"
                    value={config.buttons.thanks}
                    onChange={(e) => updateText('buttons', 'thanks', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">חזרה לנושאים</label>
                  <input
                    type="text"
                    value={config.buttons.backTopics}
                    onChange={(e) => updateText('buttons', 'backTopics', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שלח</label>
                  <input
                    type="text"
                    value={config.buttons.send}
                    onChange={(e) => updateText('buttons', 'send', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ביטול</label>
                  <input
                    type="text"
                    value={config.buttons.cancel}
                    onChange={(e) => updateText('buttons', 'cancel', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
              </div>

              <h2 className="text-lg font-bold text-gray-800 mt-8 mb-4">Placeholders</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">כתוב הודעה</label>
                  <input
                    type="text"
                    value={config.placeholders.message}
                    onChange={(e) => updateText('placeholders', 'message', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">כתוב שאלה</label>
                  <input
                    type="text"
                    value={config.placeholders.question}
                    onChange={(e) => updateText('placeholders', 'question', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">הגדרות בוט</h2>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={config.settings.isActive}
                    onChange={(e) => updateText('settings', 'isActive', e.target.checked)}
                    className="w-5 h-5 rounded text-cyan-600"
                  />
                  <div>
                    <span className="font-medium text-gray-800">בוט פעיל</span>
                    <p className="text-sm text-gray-500">הצג את הבוט באתר</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={config.settings.showOnAllPages}
                    onChange={(e) => updateText('settings', 'showOnAllPages', e.target.checked)}
                    className="w-5 h-5 rounded text-cyan-600"
                  />
                  <div>
                    <span className="font-medium text-gray-800">הצג בכל הדפים</span>
                    <p className="text-sm text-gray-500">הבוט יופיע בכל דפי האתר</p>
                  </div>
                </label>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 mb-2">מיקום הבוט</label>
                  <select
                    value={config.settings.position}
                    onChange={(e) => updateText('settings', 'position', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 outline-none"
                  >
                    <option value="left">שמאל</option>
                    <option value="right">ימין</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
