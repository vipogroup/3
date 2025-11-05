"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState({
    // General
    siteName: "VIPO",
    siteDescription: "מערכת מתקדמת לניהול סוכנים ומוצרים",
    logoUrl: "",
    faviconUrl: "",
    
    // Colors
    primaryColor: "#9333ea",
    secondaryColor: "#2563eb",
    accentColor: "#00bcd4",
    successColor: "#16a34a",
    warningColor: "#eab308",
    dangerColor: "#dc2626",
    backgroundColor: "#f7fbff",
    textColor: "#0d1b2a",
  });

  const [loading, setLoading] = useState(true);

  // Load settings from API or localStorage
  useEffect(() => {
    loadSettings();
  }, []);

  // Apply CSS variables when settings change
  useEffect(() => {
    applyTheme();
  }, [settings]);

  const loadSettings = async () => {
    try {
      // Try to load from localStorage first
      const saved = localStorage.getItem("siteSettings");
      if (saved) {
        setSettings(JSON.parse(saved));
      }

      // TODO: Load from API
      // const res = await fetch("/api/settings");
      // if (res.ok) {
      //   const data = await res.json();
      //   setSettings(data.settings);
      //   localStorage.setItem("siteSettings", JSON.stringify(data.settings));
      // }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = () => {
    // Apply CSS variables to :root
    const root = document.documentElement;
    
    root.style.setProperty("--primary", settings.primaryColor);
    root.style.setProperty("--secondary", settings.secondaryColor);
    root.style.setProperty("--accent", settings.accentColor);
    root.style.setProperty("--success", settings.successColor);
    root.style.setProperty("--warning", settings.warningColor);
    root.style.setProperty("--danger", settings.dangerColor);
    root.style.setProperty("--bg", settings.backgroundColor);
    root.style.setProperty("--text", settings.textColor);

    // Update document title
    document.title = settings.siteName;

    // Update favicon if exists
    if (settings.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = settings.faviconUrl;
    }

    // Update meta description
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = settings.siteDescription;
  };

  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem("siteSettings", JSON.stringify(newSettings));

    // TODO: Save to API
    // try {
    //   await fetch("/api/settings", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(newSettings)
    //   });
    // } catch (error) {
    //   console.error("Failed to save settings:", error);
    // }
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
