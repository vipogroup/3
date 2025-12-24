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
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
        enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600',
      )}
    >
      <span
        className={classNames(
          'inline-block h-2 w-2 rounded-full',
          enabled ? 'bg-emerald-500' : 'bg-gray-400',
        )}
      />
      {template.type}
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-col gap-4 pb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🔔</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">ניהול התראות מערכת</h1>
              <p className="text-sm text-slate-400">
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
                  ? 'bg-white text-slate-900 shadow-lg shadow-blue-500/30'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20',
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
                  ? 'bg-white text-slate-900 shadow-lg shadow-emerald-400/30'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20',
              )}
            >
              שליחות מתוזמנות
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/60 bg-rose-500/10 p-4 text-sm text-rose-100">
            שגיאה: {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center shadow-lg">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white" />
            <p className="text-sm text-white/80">טוען נתוני תבניות ותזמונים...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {tab === 'templates' && selectedTemplateData && (
              <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl">
                <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
                  <aside className="space-y-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h2 className="text-sm font-semibold text-white/70">תבניות קיימות</h2>
                    <div className="max-h-[420px] space-y-2 overflow-y-auto pr-2">
                      {availableTemplates.map((tpl) => (
                        <button
                          key={tpl.type}
                          type="button"
                          onClick={() => handleTemplateSelect(tpl.type)}
                          className={classNames(
                            'w-full rounded-xl px-3 py-3 text-left transition-all border border-transparent',
                            tpl.type === selectedTemplate
                              ? 'bg-white text-slate-900 shadow-lg'
                              : 'bg-white/5 text-slate-200 hover:bg-white/10',
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold capitalize">{tpl.type}</span>
                            <TemplateBadge template={tpl} />
                          </div>
                          {tpl.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{tpl.description}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </aside>

                  <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-inner">
                      <div className="flex flex-wrap items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-white/60">כותרת</label>
                            <input
                              type="text"
                              value={selectedTemplateData.title || ''}
                              onChange={(e) => handleTemplateFieldChange('title', e.target.value)}
                              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-white/60">תוכן ההודעה</label>
                            <textarea
                              value={selectedTemplateData.body || ''}
                              onChange={(e) => handleTemplateFieldChange('body', e.target.value)}
                              rows={4}
                              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="w-full max-w-[220px] space-y-4 rounded-2xl bg-white/10 p-4 text-xs text-white/80">
                          <p className="font-semibold text-white/90">פרטי תבנית</p>
                          <div>
                            <p className="text-white/60">מצב תבנית</p>
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
                            <p className="text-white/60">קהל יעד</p>
                            <AudienceChips audience={selectedTemplateData.audience} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-white/60">Placeholders</p>
                            <VariablesList variables={selectedTemplateData.variables} />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2 text-xs text-white/70">
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
                                    className="w-4 h-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                                  />
                                  <span className="text-white/80">{option.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/70">
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
                                  className="inline-flex items-center gap-1 cursor-pointer bg-white/5 rounded px-2 py-1 hover:bg-white/10"
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
                                    className="w-3 h-3 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                                  />
                                  <span className="text-white/70 text-[10px]">{option.label}</span>
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

                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">⏰</span>
                          <span className="text-sm font-semibold text-white">תזמון שליחה:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-white/70">תאריך:</label>
                          <input
                            type="date"
                            value={quickScheduleDate}
                            onChange={(e) => setQuickScheduleDate(e.target.value)}
                            className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-white/70">שעה:</label>
                          <input
                            type="time"
                            value={quickScheduleTime}
                            onChange={(e) => setQuickScheduleTime(e.target.value)}
                            className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleQuickSchedule}
                          disabled={schedulingQuick || !quickScheduleDate || !quickScheduleTime}
                          className={classNames(
                            'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                            schedulingQuick || !quickScheduleDate || !quickScheduleTime
                              ? 'bg-white/20 text-white/40 cursor-not-allowed'
                              : 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/30 hover:scale-[1.02]',
                          )}
                        >
                          {schedulingQuick ? 'מתזמן...' : '📅 תזמן שליחה'}
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
                            ? 'bg-white/20 text-white/60 cursor-wait'
                            : 'bg-white text-slate-900 shadow-lg shadow-blue-500/30 hover:scale-[1.01]',
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
