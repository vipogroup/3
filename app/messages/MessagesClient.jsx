'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAdminMessageTargets } from './hooks/useAdminMessageTargets';

const ROLE_LABELS = {
  admin: 'מנהל',
  agent: 'סוכן',
  customer: 'לקוח',
  all: 'כולם',
};

const ADMIN_TARGET_OPTIONS = [
  { value: 'all', label: 'הודעה לכל המשתמשים' },
  { value: 'admin', label: 'מנהלים בלבד' },
  { value: 'agent', label: 'סוכנים בלבד' },
  { value: 'customer', label: 'לקוחות בלבד' },
  { value: 'direct', label: 'הודעה ישירה למשתמש ספציפי' },
];

function formatDate(ts) {
  if (!ts) return '';
  const date = new Date(ts);
  return `${date.toLocaleDateString('he-IL')} ${date.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export default function MessagesClient({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [messageText, setMessageText] = useState('');
  const [targetRole, setTargetRole] = useState('all');
  const [targetUserId, setTargetUserId] = useState('');
  const [limit, setLimit] = useState(50);
  const [replyContext, setReplyContext] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const isAdmin = currentUser?.role === 'admin';
  const { targets: knownTargets, activeTarget } = useAdminMessageTargets(
    messages,
    targetRole,
    targetUserId.trim() || null,
  );

  const fetchMessages = useCallback(async (opts = {}) => {
    const { showLoader = true } = opts;
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError('');
    if (!showLoader) {
      setReplyContext((prev) => prev);
    }
    try {
      const params = new URLSearchParams();
      params.set('limit', String(limit));
      if (isAdmin && targetRole === 'direct' && targetUserId.trim()) {
        params.set('userId', targetUserId.trim());
      }

      const res = await fetch(`/api/messages?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'שגיאה בטעינת ההודעות');
      }
      const data = await res.json();
      setMessages(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      setError(err.message || 'שגיאה בטעינה');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAdmin, limit, targetRole, targetUserId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Mark all messages as read when entering the messages page
  useEffect(() => {
    const markAllAsRead = async () => {
      try {
        await fetch('/api/messages/read-all', { method: 'POST' });
      } catch (_) {
        // ignore errors
      }
    };
    markAllAsRead();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    const text = messageText.trim();
    if (!text) {
      setError('נא להזין תוכן להודעה');
      return;
    }
    if (text.length > 2000) {
      setError('ההודעה חורגת מהמגבלה (2000 תווים)');
      return;
    }

    try {
      const payload = { message: text };
      if (isAdmin) {
        if (targetRole === 'direct') {
          const trimmed = targetUserId.trim();
          if (!trimmed) {
            setError('נא לציין מזהה משתמש עבור הודעה ישירה');
            return;
          }
          payload.targetRole = 'direct';
          payload.targetUserId = trimmed;
        } else {
          payload.targetRole = targetRole;
        }
      }

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'שליחת ההודעה נכשלה');
      }

      const data = await res.json();
      setMessages((prev) => (data.item ? [data.item, ...prev] : prev));
      setMessageText('');
      if (isAdmin && targetRole === 'direct' && !replyContext) setTargetUserId('');
    } catch (err) {
      setError(err.message || 'שליחת ההודעה נכשלה');
    }
  }, [isAdmin, messageText, targetRole, targetUserId, replyContext]);

  const resolvedTargetRole = useMemo(() => {
    if (!isAdmin) return 'admin';
    if (targetRole === 'direct') {
      if (replyContext?.userId) {
        return `מענה אל ${ROLE_LABELS[replyContext.role] || replyContext.role} (${replyContext.userId})`;
      }
      return targetUserId.trim() ? `משתמש ${targetUserId.trim()}` : 'הודעה ישירה';
    }
    return ROLE_LABELS[targetRole] || targetRole;
  }, [isAdmin, targetRole, targetUserId, replyContext]);

  const canSend = messageText.trim().length > 0 && (!isAdmin || targetRole !== 'direct' || targetUserId.trim());

  const handleReply = useCallback(
    (item) => {
      if (!isAdmin) return;
      const directTargetId = item.senderRole === 'admin' ? item.targetUserId : item.senderId;
      const directTargetRole = item.senderRole === 'admin' ? item.targetRole : item.senderRole;
      if (!directTargetId) {
        setTargetRole('admin');
        setTargetUserId('');
        setReplyContext(null);
        return;
      }
      setTargetRole('direct');
      setTargetUserId(String(directTargetId));
      setReplyContext({
        userId: String(directTargetId),
        role: directTargetRole,
      });
    },
    [isAdmin],
  );

  const clearReplyContext = useCallback(() => {
    setReplyContext(null);
    setTargetUserId('');
    setTargetRole('all');
  }, []);

  const handleDelete = useCallback(
    async (messageId) => {
      if (!messageId) return;
      const confirmDelete = window.confirm('האם למחוק את ההודעה הזו? הפעולה אינה ניתנת לשחזור.');
      if (!confirmDelete) return;

      setDeletingId(messageId);
      setError('');
      try {
        const res = await fetch(`/api/messages/${messageId}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'מחיקת ההודעה נכשלה');
        }
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      } catch (err) {
        setError(err.message || 'מחיקת ההודעה נכשלה');
      } finally {
        setDeletingId(null);
      }
    },
    [],
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>
              מרכז הודעות
            </h1>
            <p className="text-sm text-gray-500">ניהול תקשורת בין מנהלים לסוכנים ולקוחות</p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold px-3 py-2 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.12) 0%, rgba(8, 145, 178, 0.12) 100%)',
              color: '#1e3a8a',
            }}
          >
            חזרה למוצרים
          </Link>
        </header>

        <section
          className="bg-white rounded-xl shadow p-6 space-y-4"
          style={{
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          <div className="space-y-1">
            <h2 className="text-lg font-semibold" style={{ color: '#0f172a' }}>
              שליחת הודעה חדשה
            </h2>
            <p className="text-xs text-gray-500">
              {isAdmin
                ? `הודעה תישלח אל: ${resolvedTargetRole}`
                : 'ההודעה תישלח ישירות למנהלים (לא ניתן לפנות ללקוחות או לסוכנים אחרים).'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isAdmin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    בחר יעד
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTargetRole(value);
                      if (value !== 'direct') {
                        setReplyContext(null);
                        setTargetUserId('');
                      }
                    }}
                    className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {ADMIN_TARGET_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {targetRole === 'direct' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      מזהה משתמש יעד
                    </label>
                    <input
                      value={targetUserId}
                      onChange={(e) => setTargetUserId(e.target.value)}
                      placeholder="לדוגמה: 6565..."
                      className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    {knownTargets.length > 0 && (
                      <div className="mt-2 rounded-lg border border-sky-100 bg-sky-50 p-2 text-xs text-sky-800 space-y-1">
                        <p className="font-semibold">נמענים אחרונים:</p>
                        <div className="flex flex-wrap gap-2">
                          {knownTargets.map((option) => (
                            <button
                              key={option.userId}
                              type="button"
                              onClick={() => {
                                setTargetUserId(option.userId);
                                setReplyContext({ userId: option.userId, role: option.role });
                              }}
                              className={`px-2 py-1 rounded-full border text-[11px] transition ${{
                                true: 'bg-white border-sky-400 text-sky-700 shadow-sm',
                                false: 'bg-sky-100 border-transparent text-sky-800 hover:bg-sky-200',
                              }[option.userId === activeTarget?.userId ? 'true' : 'false']}`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                תוכן ההודעה
              </label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                maxLength={2000}
                className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="כתוב כאן את ההודעה..."
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{messageText.length}/2000</span>
                {!canSend && <span>יש למלא את כל השדות הדרושים</span>}
              </div>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            {isAdmin && replyContext && (
              <div className="flex items-center justify-between text-xs text-sky-800 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2">
                <span>
                  מענה ל{ROLE_LABELS[replyContext.role] || replyContext.role} ({replyContext.userId})
                </span>
                <button
                  type="button"
                  onClick={clearReplyContext}
                  className="font-semibold text-sky-700 hover:text-sky-900"
                >
                  בטל מענה ישיר
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={!canSend}
                className="text-sm font-semibold px-4 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                }}
              >
                שלח הודעה
              </button>
              <button
                type="button"
                onClick={() => fetchMessages({ showLoader: false })}
                className="text-xs font-semibold px-3 py-2 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.08) 0%, rgba(8, 145, 178, 0.12) 100%)',
                  color: '#0f172a',
                }}
              >
                רענן הודעות
                {refreshing && <span className="ml-2 animate-pulse">...</span>}
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold" style={{ color: '#0f172a' }}>
              היסטוריית הודעות
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <label htmlFor="limit-select">כמות להצגה:</label>
              <select
                id="limit-select"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value) || 50)}
                className="border rounded px-2 py-1"
              >
                {[20, 50, 100].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="max-h-[520px] overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="py-16 text-center text-sm text-gray-500">טוען הודעות...</div>
            ) : messages.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-400">אין הודעות להצגה.</div>
            ) : (
              messages.map((item) => {
                const isSender = currentUser?.id && item.senderId
                  ? String(item.senderId) === String(currentUser.id)
                  : false;
                const canDelete = isAdmin || isSender;
                const isDeleting = deletingId === item.id;

                return (
                  <article key={item.id} className="px-6 py-4 space-y-2">
                    <header className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px]"
                          style={{
                            background: 'rgba(8, 145, 178, 0.08)',
                            color: '#1e3a8a',
                          }}
                        >
                          <strong>{ROLE_LABELS[item.senderRole] || item.senderRole}</strong>
                          <span>→ {ROLE_LABELS[item.targetRole] || item.targetRole}</span>
                        </span>
                        {item.targetUserId && (
                          <span className="text-gray-400">(משתמש: {item.targetUserId})</span>
                        )}
                      </span>
                      <span className="flex items-center gap-3">
                        <time>{formatDate(item.createdAt)}</time>
                        {isAdmin && (item.senderRole !== 'admin' || item.targetUserId) && (
                          <button
                            type="button"
                            onClick={() => handleReply(item)}
                            className="text-[11px] font-semibold px-2 py-1 rounded-full bg-sky-100 text-sky-800 hover:bg-sky-200"
                          >
                            השב
                          </button>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={isDeleting}
                            className="text-[11px] font-semibold px-2 py-1 rounded-full text-red-600 hover:bg-red-50 disabled:opacity-60"
                          >
                            {isDeleting ? 'מוחק…' : 'מחק'}
                          </button>
                        )}
                      </span>
                    </header>
                    <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{item.message}</p>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
