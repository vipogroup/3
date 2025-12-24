'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const STATUS_LABELS = {
  pending: 'ממתינה',
  paused: 'מושהית',
  completed: 'הושלם',
  cancelled: 'בוטל',
};

const RECURRENCE_LABELS = {
  none: 'ללא חזרה',
  daily: 'יומי',
  weekly: 'שבועי',
  interval: 'חוזר',
};

function formatDateTime(value) {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('he-IL', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

function TemplateBadge({ template }) {
  const enabled = template.enabled !== false;
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide',
        enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600',
      )}
    >
      {enabled ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )}
      <span>{template.type}</span>
    </span>
  );
}

function AudienceChips({ audience = [] }) {
  const normalized = Array.isArray(audience) ? audience : [];
  if (!normalized.length) return <span className="text-xs text-gray-400">ברירת מחדל</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {normalized.map((item) => (
        <span
          key={item}
          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function VariablesList({ variables = [] }) {
  if (!variables.length) {
    return <span className="text-xs text-gray-400">ללא משתנים דינמיים</span>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {variables.map((variable) => (
        <span
          key={variable}
          className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-2 py-1 text-[11px] text-slate-600"
        >
          {'{'}
          {variable}
          {'}'}
        </span>
      ))}
    </div>
  );
}

function StatusPill({ status }) {
  const baseClass = 'rounded-full px-3 py-1 text-xs font-semibold';
  switch (status) {
    case 'pending':
      return <span className={`${baseClass} bg-blue-100 text-blue-700`}>ממתינה</span>;
    case 'paused':
      return <span className={`${baseClass} bg-yellow-100 text-yellow-700`}>מושהית</span>;
    case 'completed':
      return <span className={`${baseClass} bg-emerald-100 text-emerald-700`}>הושלם</span>;
    case 'cancelled':
      return <span className={`${baseClass} bg-rose-100 text-rose-700`}>בוטל</span>;
    default:
      return <span className={`${baseClass} bg-gray-100 text-gray-600`}>{status || '-'}</span>;
  }
}

const initialScheduleForm = {
  templateType: '',
  scheduleAt: '',
  timezone: 'Asia/Jerusalem',
  recurrence: {
    type: 'none',
    every: 1,
    unit: 'day',
  },
  audience: [],
  payloadOverrides: {
    title: '',
    body: '',
    tags: [],
    userIds: [],
    url: '',
  },
  metadata: {},
};

export default function NotificationsManagerClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [scheduled, setScheduled] = useState([]);
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState(initialScheduleForm);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [tab, setTab] = useState('templates');
  const [quickScheduleDate, setQuickScheduleDate] = useState('');
  const [quickScheduleTime, setQuickScheduleTime] = useState('');
  const [schedulingQuick, setSchedulingQuick] = useState(false);

  const templateMap = useMemo(() => {
    const map = new Map();
    templates.forEach((tpl) => map.set(tpl.type, tpl));
    return map;
  }, [templates]);

  const selectedTemplateData = useMemo(() => {
    if (!selectedTemplate) return null;
    return templateMap.get(selectedTemplate) || null;
  }, [selectedTemplate, templateMap]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/admin/notifications', { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'failed_to_load');
      }
      const data = await res.json();
      setTemplates(data.templates || []);
      setScheduled(data.scheduled || []);
      if (!selectedTemplate && data.templates?.length) {
        setSelectedTemplate(data.templates[0].type);
      }
    } catch (err) {
      console.error('load_notifications_error', err);
      setError(err.message || 'load_failed');
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTemplateSelect = useCallback((type) => {
    setSelectedTemplate(type);
  }, []);

  const handleTemplateFieldChange = useCallback((field, value) => {
    setTemplates((prev) =>
      prev.map((tpl) => (tpl.type === selectedTemplate ? { ...tpl, [field]: value } : tpl)),
    );
  }, [selectedTemplate]);

  const handleTemplateAudienceChange = useCallback((value) => {
    setTemplates((prev) =>
      prev.map((tpl) => (tpl.type === selectedTemplate ? { ...tpl, audience: value } : tpl)),
    );
  }, [selectedTemplate]);

  const handleTemplateVariablesChange = useCallback((value) => {
    setTemplates((prev) =>
      prev.map((tpl) => (tpl.type === selectedTemplate ? { ...tpl, variables: value } : tpl)),
    );
  }, [selectedTemplate]);

  const handleTemplateEnabledToggle = useCallback((value) => {
    setTemplates((prev) =>
      prev.map((tpl) =>
        tpl.type === selectedTemplate
          ? {
              ...tpl,
              enabled: value,
            }
          : tpl,
      ),
    );
  }, [selectedTemplate]);

  const saveTemplate = useCallback(async () => {
    if (!selectedTemplateData) return;
    setSavingTemplate(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/notifications/${encodeURIComponent(selectedTemplateData.type)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedTemplateData.title,
          body: selectedTemplateData.body,
          description: selectedTemplateData.description,
          audience: selectedTemplateData.audience,
          variables: selectedTemplateData.variables,
          enabled: selectedTemplateData.enabled,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'failed_to_save_template');
      }
      await loadData();
    } catch (err) {
      console.error('save_template_error', err);
      setError(err.message || 'save_failed');
    } finally {
      setSavingTemplate(false);
    }
  }, [selectedTemplateData, loadData]);

  const resetScheduleForm = useCallback(() => {
    setScheduleForm(initialScheduleForm);
  }, []);

  const openScheduleForm = useCallback(() => {
    setScheduleForm((prev) => ({
      ...initialScheduleForm,
      templateType: selectedTemplate || prev.templateType,
    }));
    setScheduleFormOpen(true);
  }, [selectedTemplate]);

  const closeScheduleForm = useCallback(() => {
    setScheduleFormOpen(false);
  }, []);

  const handleScheduleFieldChange = useCallback((path, value) => {
    setScheduleForm((prev) => {
      const next = structuredClone(prev);
      const segments = Array.isArray(path) ? path : String(path).split('.');
      let ref = next;
      for (let i = 0; i < segments.length - 1; i += 1) {
        const key = segments[i];
        ref[key] = ref[key] || {};
        ref = ref[key];
      }
      ref[segments[segments.length - 1]] = value;
      return next;
    });
  }, []);

  const saveSchedule = useCallback(async () => {
    setSavingSchedule(true);
    setError('');
    try {
      const payload = {
        templateType: scheduleForm.templateType,
        scheduleAt: scheduleForm.scheduleAt,
        recurrence:
          scheduleForm.recurrence?.type && scheduleForm.recurrence.type !== 'none'
            ? scheduleForm.recurrence
            : null,
        audience: scheduleForm.audience,
        timezone: scheduleForm.timezone,
        payloadOverrides: scheduleForm.payloadOverrides,
        metadata: scheduleForm.metadata,
      };

      const res = await fetch('/api/admin/notifications/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
 
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'failed_to_schedule');
      }

      await loadData();
      resetScheduleForm();
      closeScheduleForm();
    } catch (err) {
      console.error('save_schedule_error', err);
      setError(err.message || 'schedule_failed');
    } finally {
      setSavingSchedule(false);
    }
  }, [scheduleForm, loadData, resetScheduleForm, closeScheduleForm]);

  const handleQuickSchedule = useCallback(async () => {
    if (!selectedTemplate || !quickScheduleDate || !quickScheduleTime) {
      setError('יש לבחור תאריך ושעה');
      return;
    }
    setSchedulingQuick(true);
    setError('');
    try {
      const scheduleAt = new Date(`${quickScheduleDate}T${quickScheduleTime}`);
      if (Number.isNaN(scheduleAt.getTime())) {
        throw new Error('תאריך או שעה לא תקינים');
      }
      const payload = {
        templateType: selectedTemplate,
        scheduleAt: scheduleAt.toISOString(),
        timezone: 'Asia/Jerusalem',
        audience: selectedTemplateData?.audience || [],
      };
      const res = await fetch('/api/admin/notifications/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'failed_to_schedule');
      }
      setQuickScheduleDate('');
      setQuickScheduleTime('');
      await loadData();
      setTab('scheduled');
    } catch (err) {
      console.error('quick_schedule_error', err);
      setError(err.message || 'schedule_failed');
    } finally {
      setSchedulingQuick(false);
    }
  }, [selectedTemplate, selectedTemplateData, quickScheduleDate, quickScheduleTime, loadData]);

  const availableTemplates = templates;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-col gap-4 pb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">ניהול התראות מערכת</h1>
              <p className="text-sm text-gray-600">
                עריכת תבניות הודעה, תזמון שליחות והתראות על מצב מערכת VIPO
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setTab('templates')}
              className={classNames(
                'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                tab === 'templates'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300',
              )}
            >
              תבניות התראה
            </button>
            <button
              type="button"
              onClick={() => setTab('scheduled')}
              className={classNames(
                'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                tab === 'scheduled'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300',
              )}
            >
              שליחות מתוזמנות
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
            שגיאה: {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-lg">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <p className="text-sm text-gray-600">טוען נתוני תבניות ותזמונים...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {tab === 'templates' && selectedTemplateData && (
              <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
                <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
                  <aside className="space-y-3 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <h2 className="text-sm font-semibold text-gray-700">תבניות קיימות</h2>
                    <div className="max-h-[420px] space-y-2 overflow-y-auto pr-2">
                      {availableTemplates.map((tpl) => (
                        <button
                          key={tpl.type}
                          type="button"
                          onClick={() => handleTemplateSelect(tpl.type)}
                          className={classNames(
                            'w-full rounded-xl px-3 py-3 text-left transition-all border border-transparent',
                            tpl.type === selectedTemplate
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200',
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm font-semibold capitalize">{tpl.type}</span>
                            </div>
                            <TemplateBadge template={tpl} />
                          </div>
                          {tpl.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{tpl.description}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </aside>

                  <div className="space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-inner">
                      <div className="flex flex-wrap items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-gray-600">כותרת</label>
                            <input
                              type="text"
                              value={selectedTemplateData.title || ''}
                              onChange={(e) => handleTemplateFieldChange('title', e.target.value)}
                              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-gray-600">תוכן ההודעה</label>
                            <textarea
                              value={selectedTemplateData.body || ''}
                              onChange={(e) => handleTemplateFieldChange('body', e.target.value)}
                              rows={4}
                              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="w-full max-w-[220px] space-y-4 rounded-2xl bg-blue-50 border border-blue-200 p-4 text-xs text-gray-700">
                          <p className="font-semibold text-gray-900">פרטי תבנית</p>
                          <div>
                            <p className="text-gray-600">מצב תבנית</p>
                            <label className="mt-1 flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={selectedTemplateData.enabled !== false}
                                onChange={(e) => handleTemplateEnabledToggle(e.target.checked)}
                              />
                              פעילה לשליחה
                            </label>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-600">קהל יעד</p>
                            <AudienceChips audience={selectedTemplateData.audience} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-600">Placeholders</p>
                            <VariablesList variables={selectedTemplateData.variables} />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-gray-200 pt-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>קהל יעד מותאם:</span>
                            <div className="flex items-center gap-3">
                              {[
                                { value: 'customer', label: 'לקוחות' },
                                { value: 'agent', label: 'סוכנים' },
                                { value: 'admin', label: 'מנהלים' },
                              ].map((option) => (
                                <label
                                  key={option.value}
                                  className="inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={(selectedTemplateData.audience || []).includes(option.value)}
                                    onChange={(e) => {
                                      const current = selectedTemplateData.audience || [];
                                      if (e.target.checked) {
                                        handleTemplateAudienceChange([...current, option.value]);
                                      } else {
                                        handleTemplateAudienceChange(current.filter((v) => v !== option.value));
                                      }
                                    }}
                                    className="w-4 h-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                                  />
                                  <span className="text-gray-700">{option.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>משתנים דינמיים:</span>
                            <div className="flex flex-wrap items-center gap-2">
                              {[
                                { value: 'order_id', label: 'מזהה הזמנה' },
                                { value: 'customer_name', label: 'שם לקוח' },
                                { value: 'total_amount', label: 'סכום' },
                                { value: 'product_name', label: 'שם מוצר' },
                                { value: 'product_url', label: 'קישור מוצר' },
                                { value: 'agent_name', label: 'שם סוכן' },
                                { value: 'commission_percent', label: 'אחוז עמלה' },
                                { value: 'datetime', label: 'תאריך ושעה' },
                                { value: 'user_type', label: 'סוג משתמש' },
                              ].map((option) => (
                                <label
                                  key={option.value}
                                  className="inline-flex items-center gap-1 cursor-pointer bg-gray-100 rounded px-2 py-1 hover:bg-gray-200 border border-gray-200"
                                >
                                  <input
                                    type="checkbox"
                                    checked={(selectedTemplateData.variables || []).includes(option.value)}
                                    onChange={(e) => {
                                      const current = selectedTemplateData.variables || [];
                                      if (e.target.checked) {
                                        handleTemplateVariablesChange([...current, option.value]);
                                      } else {
                                        handleTemplateVariablesChange(current.filter((v) => v !== option.value));
                                      }
                                    }}
                                    className="w-3 h-3 rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                                  />
                                  <span className="text-gray-600 text-[10px]">{option.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={loadData}
                            className="round июalformed"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-900">תזמון שליחה:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600">תאריך:</label>
                          <input
                            type="date"
                            value={quickScheduleDate}
                            onChange={(e) => setQuickScheduleDate(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600">שעה:</label>
                          <input
                            type="time"
                            value={quickScheduleTime}
                            onChange={(e) => setQuickScheduleTime(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleQuickSchedule}
                          disabled={schedulingQuick || !quickScheduleDate || !quickScheduleTime}
                          className={classNames(
                            'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                            schedulingQuick || !quickScheduleDate || !quickScheduleTime
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:scale-[1.02]',
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {schedulingQuick ? (
                              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                            {schedulingQuick ? 'מתזמן...' : 'תזמן שליחה'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={saveTemplate}
                        disabled={savingTemplate}
                        className={classNames(
                          'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                          savingTemplate
                            ? 'bg-gray-300 text-gray-500 cursor-wait'
                            : 'bg-blue-600 text-white shadow-lg hover:scale-[1.01]',
                        )}
                      >
                        {savingTemplate ? 'שומר...' : 'שמור תבנית'}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {tab === 'scheduled' && (
              <section className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">שליחות מתוזמנות</h2>
                    <p className="text-sm text-white/60">ניהול תורים וקריאות של התראות אוטומטיות</p>
                  </div>
                  <button
                    type="button"
                    onClick={openScheduleForm}
                    className="rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 hover:scale-[1.03]"
                  >
                    ✨ תזמן התראה חדשה
                  </button>
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-inner">
                  <table className="min-w-full text-sm">
                    <thead className="bg-white/10 text-xs uppercase tracking-wide text-white/60">
                      <tr>
                        <th className="px-4 py-3 text-left">תבנית</th>
                        <th className="px-4 py-3 text-left">מצב</th>
                        <th className="px-4 py-3 text-left">שליחה הבאה</th>
                        <th className="px-4 py-3 text-left">קהל יעד</th>
                        <th className="px-4 py-3 text-left">חזרה</th>
                        <th className="px-4 py-3 text-left">פעולות</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-white/80">
                      {scheduled.map((item) => (
                        <tr key={item._id || item.templateType}>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-semibold">{item.templateType}</span>
                              {item.payloadOverrides?.title && (
                                <span className="text-xs text-white/60">{item.payloadOverrides.title}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <StatusPill status={item.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span>{formatDateTime(item.nextRunAt)}</span>
                              <span className="text-xs text-white/50">{formatDateTime(item.lastRunAt)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <AudienceChips audience={item.audience} />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-white/70">
                              {item.recurrence?.unit === 'week' ? 'שבועי' : item.recurrence?.unit === 'day' ? 'יומי' : 'ללא'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="rounded-lg border border-white/20 px-3 py-1 text-xs text-white hover:bg-white/10"
                              >
                                ערוך
                              </button>
                              <button
                                type="button"
                                className="rounded-lg border border-rose-500/40 px-3 py-1 text-xs text-rose-300 hover:bg-rose-500/10"
                              >
                                ביטול
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {scheduled.length === 0 && (
                    <div className="p-12 text-center text-white/50">אין כרגע שליחות מתוזמנות</div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
