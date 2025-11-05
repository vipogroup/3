"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { getAllPresets, applyPreset } from "@/app/lib/themePresets";

export default function SettingsForm() {
  const { settings: themeSettings, updateSettings } = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("presets");

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
    
    // Contact
    email: "info@vipo.com",
    phone: "050-1234567",
    address: "תל אביב, ישראל",
    whatsapp: "972501234567",
    
    // Social Media
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    
    // Features
    enableRegistration: true,
    enableGroupBuy: true,
    enableGamification: true,
    enableNotifications: true,
    enableDarkMode: false,
    
    // SEO
    metaTitle: "VIPO - מערכת ניהול סוכנים",
    metaDescription: "מערכת מתקדמת לניהול סוכנים, מוצרים ורכישות קבוצתיות",
    metaKeywords: "סוכנים, מוצרים, רכישה קבוצתית, VIPO",
    
    // Email
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    emailFrom: "noreply@vipo.com",
  });

  // Load settings from ThemeContext
  useEffect(() => {
    if (themeSettings) {
      setSettings(prev => ({ ...prev, ...themeSettings }));
    }
  }, [themeSettings]);

  const handleChange = (field, value) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    
    // Apply changes immediately (live preview)
    updateSettings(newSettings);
  };

  const handlePresetSelect = (presetName) => {
    const presetSettings = applyPreset(presetName);
    if (presetSettings) {
      const newSettings = { ...settings, ...presetSettings };
      setSettings(newSettings);
      updateSettings(newSettings);
      setSuccess(`סגנון ${presetName} הוחל בהצלחה!`);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      // Update theme context
      await updateSettings(settings);
      
      setSuccess("ההגדרות נשמרו בהצלחה! השינויים יוחלו על כל האתר.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "שגיאה בשמירת ההגדרות");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "presets", label: "תצוגה מקדימה", icon: "🎨" },
    { id: "general", label: "כללי", icon: "🏠" },
    { id: "colors", label: "צבעים", icon: "🖌️" },
    { id: "contact", label: "יצירת קשר", icon: "📞" },
    { id: "social", label: "רשתות חברתיות", icon: "🌐" },
    { id: "features", label: "תכונות", icon: "⚙️" },
    { id: "seo", label: "SEO", icon: "🔍" },
    { id: "email", label: "אימייל", icon: "📧" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">הגדרות מערכת</h1>
          <p className="text-purple-100">נהל את כל הגדרות האתר, לוגו, צבעים ופונקציות</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-2xl shadow-xl overflow-x-auto">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="bg-white rounded-b-2xl shadow-xl p-8">
          {/* Presets Tab */}
          {activeTab === "presets" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">תצוגה מקדימה - בחר סגנון</h2>
              <p className="text-gray-600 mb-8">
                בחר סגנון מוכן של אתר מכירות מפורסם. כל הצבעים והעיצוב של המערכת ישתנו מיידית!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getAllPresets().map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset.id)}
                    className="relative bg-white border-4 border-gray-200 hover:border-purple-500 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 text-left"
                  >
                    {/* Preview Icon */}
                    <div className="text-6xl mb-4 text-center">{preset.preview}</div>
                    
                    {/* Name */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                      {preset.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 text-center">
                      {preset.description}
                    </p>
                    
                    {/* Color Swatches */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div
                        className="h-12 rounded-lg shadow-md"
                        style={{ backgroundColor: preset.colors.primaryColor }}
                        title="Primary"
                      ></div>
                      <div
                        className="h-12 rounded-lg shadow-md"
                        style={{ backgroundColor: preset.colors.secondaryColor }}
                        title="Secondary"
                      ></div>
                      <div
                        className="h-12 rounded-lg shadow-md"
                        style={{ backgroundColor: preset.colors.accentColor }}
                        title="Accent"
                      ></div>
                      <div
                        className="h-12 rounded-lg shadow-md"
                        style={{ backgroundColor: preset.colors.successColor }}
                        title="Success"
                      ></div>
                    </div>
                    
                    {/* Apply Button */}
                    <div className="text-center">
                      <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-6 py-2 rounded-xl">
                        החל סגנון
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Info Card */}
              <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">💡 איך זה עובד?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">1️⃣</span>
                    <span>בחר סגנון מהאפשרויות למעלה</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">2️⃣</span>
                    <span>הצבעים ישתנו מיידית בכל המערכת</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">3️⃣</span>
                    <span>אפשר לערוך ידנית בטאב "צבעים"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">4️⃣</span>
                    <span>לחץ "שמור הגדרות" לשמירה קבועה</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">הגדרות כלליות</h2>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">שם האתר</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="VIPO"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">תיאור האתר</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleChange("siteDescription", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="תיאור קצר של האתר"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">לוגו (URL)</label>
                <input
                  type="url"
                  value={settings.logoUrl}
                  onChange={(e) => handleChange("logoUrl", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="https://..."
                />
                {settings.logoUrl && (
                  <div className="mt-4">
                    <img src={settings.logoUrl} alt="Logo" className="h-16" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Favicon (URL)</label>
                <input
                  type="url"
                  value={settings.faviconUrl}
                  onChange={(e) => handleChange("faviconUrl", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="https://..."
                />
              </div>
            </div>
          )}

          {/* Colors Tab */}
          {activeTab === "colors" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ערכת צבעים</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: "primaryColor", label: "צבע ראשי", desc: "כפתורים וקישורים" },
                  { key: "secondaryColor", label: "צבע משני", desc: "אלמנטים משניים" },
                  { key: "accentColor", label: "צבע הדגשה", desc: "הדגשות ואייקונים" },
                  { key: "successColor", label: "צבע הצלחה", desc: "הודעות הצלחה" },
                  { key: "warningColor", label: "צבע אזהרה", desc: "הודעות אזהרה" },
                  { key: "dangerColor", label: "צבע שגיאה", desc: "הודעות שגיאה" },
                  { key: "backgroundColor", label: "צבע רקע", desc: "רקע האתר" },
                  { key: "textColor", label: "צבע טקסט", desc: "טקסט ראשי" },
                ].map((color) => (
                  <div key={color.key} className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl">
                    <input
                      type="color"
                      value={settings[color.key]}
                      onChange={(e) => handleChange(color.key, e.target.value)}
                      className="w-16 h-16 border-2 rounded-lg cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{color.label}</div>
                      <div className="text-sm text-gray-600">{color.desc}</div>
                      <div className="text-xs font-mono text-gray-500 mt-1">{settings[color.key]}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview */}
              <div className="mt-8 p-6 border-2 border-dashed border-gray-300 rounded-xl">
                <h3 className="text-lg font-bold mb-4">תצוגה מקדימה</h3>
                <div className="flex flex-wrap gap-3">
                  <button style={{ backgroundColor: settings.primaryColor }} className="px-6 py-2 text-white rounded-lg">Primary</button>
                  <button style={{ backgroundColor: settings.secondaryColor }} className="px-6 py-2 text-white rounded-lg">Secondary</button>
                  <button style={{ backgroundColor: settings.accentColor }} className="px-6 py-2 text-white rounded-lg">Accent</button>
                  <button style={{ backgroundColor: settings.successColor }} className="px-6 py-2 text-white rounded-lg">Success</button>
                  <button style={{ backgroundColor: settings.warningColor }} className="px-6 py-2 text-white rounded-lg">Warning</button>
                  <button style={{ backgroundColor: settings.dangerColor }} className="px-6 py-2 text-white rounded-lg">Danger</button>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">פרטי יצירת קשר</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">אימייל</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="info@vipo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">טלפון</label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="050-1234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    value={settings.whatsapp}
                    onChange={(e) => handleChange("whatsapp", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="972501234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">כתובת</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="תל אביב, ישראל"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">רשתות חברתיות</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: "facebook", label: "Facebook", icon: "📘", placeholder: "https://facebook.com/..." },
                  { key: "instagram", label: "Instagram", icon: "📷", placeholder: "https://instagram.com/..." },
                  { key: "twitter", label: "Twitter", icon: "🐦", placeholder: "https://twitter.com/..." },
                  { key: "linkedin", label: "LinkedIn", icon: "💼", placeholder: "https://linkedin.com/..." },
                ].map((social) => (
                  <div key={social.key}>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      {social.icon} {social.label}
                    </label>
                    <input
                      type="url"
                      value={settings[social.key]}
                      onChange={(e) => handleChange(social.key, e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                      placeholder={social.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === "features" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">תכונות מערכת</h2>
              
              <div className="space-y-4">
                {[
                  { key: "enableRegistration", label: "אפשר הרשמה", desc: "אפשר למשתמשים חדשים להירשם" },
                  { key: "enableGroupBuy", label: "רכישה קבוצתית", desc: "אפשר רכישות קבוצתיות" },
                  { key: "enableGamification", label: "Gamification", desc: "מערכת רמות, XP ותגים" },
                  { key: "enableNotifications", label: "התראות", desc: "שלח התראות למשתמשים" },
                  { key: "enableDarkMode", label: "מצב כהה", desc: "אפשר מצב כהה באתר" },
                ].map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
                    <div>
                      <div className="font-bold text-gray-900">{feature.label}</div>
                      <div className="text-sm text-gray-600">{feature.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[feature.key]}
                        onChange={(e) => handleChange(feature.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:right-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">הגדרות SEO</h2>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">כותרת Meta</label>
                <input
                  type="text"
                  value={settings.metaTitle}
                  onChange={(e) => handleChange("metaTitle", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="VIPO - מערכת ניהול סוכנים"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">תיאור Meta</label>
                <textarea
                  value={settings.metaDescription}
                  onChange={(e) => handleChange("metaDescription", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="תיאור האתר למנועי חיפוש"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">מילות מפתח</label>
                <input
                  type="text"
                  value={settings.metaKeywords}
                  onChange={(e) => handleChange("metaKeywords", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                  placeholder="סוכנים, מוצרים, רכישה קבוצתית"
                />
                <p className="text-sm text-gray-600 mt-1">הפרד מילות מפתח בפסיקים</p>
              </div>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === "email" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">הגדרות אימייל (SMTP)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => handleChange("smtpHost", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">SMTP Port</label>
                  <input
                    type="text"
                    value={settings.smtpPort}
                    onChange={(e) => handleChange("smtpPort", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="587"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">SMTP User</label>
                  <input
                    type="text"
                    value={settings.smtpUser}
                    onChange={(e) => handleChange("smtpUser", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="user@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">SMTP Password</label>
                  <input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleChange("smtpPassword", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="••••••••"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Email From</label>
                  <input
                    type="email"
                    value={settings.emailFrom}
                    onChange={(e) => handleChange("emailFrom", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
                    placeholder="noreply@vipo.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="mt-6 bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-xl font-semibold">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold rounded-xl transition-all"
            >
              איפוס
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg ${
                saving ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "שומר..." : "💾 שמור הגדרות"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
