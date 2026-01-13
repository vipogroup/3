'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_SETTINGS, withDefaultSettings } from '@/lib/settingsDefaults';

const ThemeContext = createContext();

const STORAGE_KEY = 'siteSettings';
const REMOTE_POLL_INTERVAL = 30_000; // 30 seconds
const isBrowser = typeof window !== 'undefined';

function withMetadata(settings, { source = 'local', updatedAt } = {}) {
  const timestamp = typeof updatedAt === 'number' ? updatedAt : Date.now();
  return {
    ...settings,
    __source: source,
    __updatedAt: timestamp,
  };
}

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const persistLocally = useCallback((value) => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (err) {
      console.warn('Failed to persist settings locally', err);
    }
  }, []);

  const applyRemoteSettings = useCallback(
    (remoteData = {}) => {
      const remoteSettings = withDefaultSettings(remoteData?.settings || {});
      const remoteUpdatedAt = remoteData?.updatedAt ? new Date(remoteData.updatedAt).getTime() : 0;
      const remoteWithMeta = withMetadata(remoteSettings, {
        source: 'remote',
        updatedAt: remoteUpdatedAt,
      });

      setSettings((current) => {
        const currentUpdatedAt = current?.__updatedAt ?? 0;

        if (currentUpdatedAt > remoteUpdatedAt) {
          persistLocally(current);
          return current;
        }

        persistLocally(remoteWithMeta);
        return remoteWithMeta;
      });
    },
    [persistLocally],
  );

  const fetchRemoteSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'settings_fetch_failed');
      }

      const data = await res.json();
      applyRemoteSettings(data);
      setError(null);
    } catch (err) {
      console.error('SETTINGS_LOAD_ERROR', err);
      setError('טעינת ההגדרות נכשלה. מוצגות הגדרות שמורות במכשיר.');
    }
  }, [applyRemoteSettings]);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (isBrowser) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const localSettings = withDefaultSettings(parsed);
          setSettings(
            withMetadata(localSettings, {
              source: parsed?.__source || 'local',
              updatedAt: parsed?.__updatedAt,
            }),
          );
        }
      } catch (err) {
        console.warn('Failed to parse local settings', err);
      }
    }

    await fetchRemoteSettings();
    setLoading(false);
  }, [fetchRemoteSettings]);

  // Load settings from API or localStorage
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const applyTheme = useCallback(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    root.style.setProperty('--primary', settings.primaryColor);
    root.style.setProperty('--secondary', settings.secondaryColor);
    root.style.setProperty('--accent', settings.accentColor);
    root.style.setProperty('--success', settings.successColor);
    root.style.setProperty('--warning', settings.warningColor);
    root.style.setProperty('--danger', settings.dangerColor);
    root.style.setProperty('--bg', settings.backgroundColor);
    root.style.setProperty('--text', settings.textColor);
    root.style.setProperty('--font-family', settings.fontFamily || "'Inter', 'Heebo', sans-serif");
    root.style.setProperty('--line-height', settings.lineHeight || 1.5);
    root.style.setProperty('--letter-spacing', settings.letterSpacing || '0.01em');
    root.style.setProperty('--direction', settings.direction || 'rtl');

    document.body.style.fontFamily = settings.fontFamily || "'Inter', 'Heebo', sans-serif";
    document.body.style.lineHeight = settings.lineHeight ? String(settings.lineHeight) : '1.5';
    document.body.style.letterSpacing = settings.letterSpacing || '0.01em';
    document.body.setAttribute('dir', settings.direction || 'rtl');

    document.title = settings.siteName;

    if (settings.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.faviconUrl;
    }

    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = settings.siteDescription;
  }, [settings]);

  // Apply CSS variables when settings change
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  const updateSettings = useCallback(
    (nextSettings, options = {}) => {
      const merged = withDefaultSettings(nextSettings);
      const withMeta = withMetadata(merged, options);
      setSettings(withMeta);
      persistLocally(withMeta);
      setError(null);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('themeChanged'));
      }
      return withMeta;
    },
    [persistLocally],
  );

  const saveSettings = useCallback(
    async (nextSettings, designPassword = null) => {
      const merged = updateSettings(nextSettings, { source: 'local' });

      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            settings: merged,
            designPassword: designPassword || undefined
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) {
          throw new Error(data?.error || 'settings_save_failed');
        }

        const saved = withDefaultSettings(data?.settings || merged);
        const savedWithMeta = withMetadata(saved, {
          source: 'remote',
          updatedAt: data?.updatedAt ? new Date(data.updatedAt).getTime() : Date.now(),
        });
        setSettings(savedWithMeta);
        persistLocally(savedWithMeta);
        setError(null);
        return { ok: true, settings: savedWithMeta, updatedAt: data?.updatedAt || null };
      } catch (err) {
        console.error('SETTINGS_SAVE_ERROR', err);
        setError('שמירת ההגדרות נכשלה. נסו שוב.');
        throw err;
      }
    },
    [persistLocally, updateSettings],
  );

  useEffect(() => {
    if (!isBrowser) return undefined;

    const handleStorage = (event) => {
      if (event.key && event.key !== STORAGE_KEY) return;

      if (!event.newValue) {
        fetchRemoteSettings();
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue);
        const localSettings = withDefaultSettings(parsed);
        const withMeta = withMetadata(localSettings, {
          source: parsed?.__source || 'local',
          updatedAt: parsed?.__updatedAt,
        });

        setSettings((current) => {
          const currentUpdatedAt = current?.__updatedAt ?? 0;
          const incomingUpdatedAt = withMeta.__updatedAt ?? 0;

          if (incomingUpdatedAt <= currentUpdatedAt) {
            return current;
          }

          return withMeta;
        });
      } catch (err) {
        console.warn('Failed to process storage event for settings', err);
        fetchRemoteSettings();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [fetchRemoteSettings]);

  useEffect(() => {
    if (!isBrowser) return undefined;

    const intervalId = window.setInterval(() => {
      fetchRemoteSettings();
    }, REMOTE_POLL_INTERVAL);

    return () => window.clearInterval(intervalId);
  }, [fetchRemoteSettings]);

  return (
    <ThemeContext.Provider
      value={{
        settings,
        updateSettings,
        saveSettings,
        loading,
        error,
        reloadSettings: loadSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
