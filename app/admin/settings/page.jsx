"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Theme configurations based on popular e-commerce sites
const THEMES = {
  amazon: {
    name: "Amazon",
    icon: "📦",
    primary: "orange-500",
    secondary: "slate-800",
    gradient: "from-orange-50 via-orange-100 to-yellow-50",
    buttonGradient: "from-orange-400 to-orange-500",
    accentColor: "#ff9900",
    description: "כתום וצהוב בהשראת Amazon"
  },
  aliexpress: {
    name: "AliExpress",
    icon: "🛍️",
    primary: "red-600",
    secondary: "orange-500",
    gradient: "from-red-50 via-orange-50 to-yellow-50",
    buttonGradient: "from-red-500 to-orange-500",
    accentColor: "#e4393c",
    description: "אדום וכתום בהשראת AliExpress"
  },
  alibaba: {
    name: "Alibaba",
    icon: "🏭",
    primary: "orange-600",
    secondary: "amber-500",
    gradient: "from-orange-50 via-amber-50 to-orange-100",
    buttonGradient: "from-orange-500 to-amber-500",
    accentColor: "#ff6a00",
    description: "כתום חם בהשראת Alibaba"
  },
  ebay: {
    name: "eBay",
    icon: "🎯",
    primary: "blue-600",
    secondary: "yellow-400",
    gradient: "from-blue-50 via-sky-50 to-yellow-50",
    buttonGradient: "from-blue-500 to-sky-500",
    accentColor: "#0064d2",
    description: "כחול וצהוב בהשראת eBay"
  },
  etsy: {
    name: "Etsy",
    icon: "🎨",
    primary: "orange-500",
    secondary: "slate-700",
    gradient: "from-orange-50 via-amber-50 to-orange-100",
    buttonGradient: "from-orange-500 to-amber-600",
    accentColor: "#f56400",
    description: "כתום יצירתי בהשראת Etsy"
  },
  walmart: {
    name: "Walmart",
    icon: "⭐",
    primary: "blue-600",
    secondary: "yellow-400",
    gradient: "from-blue-50 via-sky-50 to-blue-100",
    buttonGradient: "from-blue-600 to-blue-700",
    accentColor: "#0071ce",
    description: "כחול וצהוב בהשראת Walmart"
  },
  shopify: {
    name: "Shopify",
    icon: "🛒",
    primary: "green-600",
    secondary: "emerald-500",
    gradient: "from-green-50 via-emerald-50 to-teal-50",
    buttonGradient: "from-green-600 to-emerald-600",
    accentColor: "#5e8e3e",
    description: "ירוק מודרני בהשראת Shopify"
  },
  wish: {
    name: "Wish",
    icon: "💙",
    primary: "sky-500",
    secondary: "blue-400",
    gradient: "from-sky-50 via-blue-50 to-cyan-50",
    buttonGradient: "from-sky-500 to-blue-500",
    accentColor: "#2fb7ec",
    description: "תכלת עליז בהשראת Wish"
  }
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState("amazon");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load current theme
    const savedTheme = localStorage.getItem("vipo_theme") || "amazon";
    setCurrentTheme(savedTheme);
  }, []);

  const handleThemeChange = (themeKey) => {
    setSaving(true);
    setCurrentTheme(themeKey);
    
    // Save to localStorage
    localStorage.setItem("vipo_theme", themeKey);
    
    // Dispatch event to update all pages
    window.dispatchEvent(new Event("themeChanged"));
    
    // Show success message
    setTimeout(() => {
      setSaving(false);
      alert(`✅ הסגנון "${THEMES[themeKey].name}" הוחל בהצלחה!\n\nהדפים יתעדכנו אוטומטית.`);
    }, 500);
  };

  const theme = THEMES[currentTheme] || THEMES.amazon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                ⚙️ הגדרות מערכת
              </h1>
              <p className="text-gray-600">
                התאם אישית את מראה המערכת לפי טעמך
              </p>
            </div>
            <button
              onClick={() => router.push("/admin")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-xl transition-all"
            >
              ← חזור לדשבורד
            </button>
          </div>
        </div>

        {/* Current Theme Display */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎨 סגנון נוכחי
          </h2>
          <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${theme.gradient} shadow-xl flex items-center justify-center`}>
              <span className="text-5xl">{theme.icon}</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                {theme.name}
                <span className="text-sm font-normal text-gray-500">({theme.icon})</span>
              </h3>
              <p className="text-gray-600 mb-2">{theme.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">צבע ראשי:</span>
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: theme.accentColor }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🎭 בחר סגנון עיצוב
          </h2>
          <p className="text-gray-600 mb-8">
            לחץ על אחת הערכות לשינוי מיידי של העיצוב בכל המערכת
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(THEMES).map(([key, themeData]) => {
              const isActive = key === currentTheme;
              
              return (
                <div
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                    isActive 
                      ? "ring-4 ring-offset-2 ring-offset-white shadow-2xl scale-105" 
                      : "hover:scale-105 hover:shadow-xl"
                  }`}
                  style={{ 
                    ringColor: isActive ? themeData.accentColor : 'transparent'
                  }}
                >
                  {/* Theme Preview */}
                  <div className={`h-48 bg-gradient-to-br ${themeData.gradient} relative`}>
                    {/* Sample UI Elements */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      {/* Top Bar */}
                      <div className="flex justify-between items-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm font-semibold">
                          דשבורד
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full w-10 h-10"></div>
                      </div>
                      
                      {/* Sample Cards */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/30 backdrop-blur-sm rounded-lg h-12"></div>
                        <div className="bg-white/30 backdrop-blur-sm rounded-lg h-12"></div>
                      </div>
                      
                      {/* Sample Button */}
                      <div className={`bg-gradient-to-r ${themeData.buttonGradient} text-white text-center py-2 rounded-lg font-semibold text-sm shadow-lg`}>
                        כפתור לדוגמה
                      </div>
                    </div>

                    {/* Active Badge */}
                    {isActive && (
                      <div className="absolute top-4 right-4 bg-white text-green-600 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <span>✓</span>
                        <span>פעיל</span>
                      </div>
                    )}
                  </div>

                  {/* Theme Info */}
                  <div className="bg-white p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{themeData.icon}</span>
                        <span>{themeData.name}</span>
                      </div>
                      {isActive && (
                        <span className="text-green-600 text-2xl">✓</span>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {themeData.description}
                    </p>
                    
                    {/* Color Swatches */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">צבעים:</span>
                      <div className="flex gap-1">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-gray-200"
                          style={{ backgroundColor: themeData.accentColor }}
                        ></div>
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${themeData.gradient}`}></div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleThemeChange(key);
                      }}
                      disabled={isActive || saving}
                      className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all ${
                        isActive
                          ? "bg-green-100 text-green-700 cursor-default"
                          : `bg-gradient-to-r ${themeData.buttonGradient} text-white hover:shadow-lg`
                      }`}
                    >
                      {isActive ? "✓ מופעל" : saving ? "שומר..." : "החל סגנון"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mt-8">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            <span>טיפ</span>
          </h3>
          <p className="text-blue-800 text-sm">
            השינוי יוחל מיידית על כל העמודים במערכת: דשבורד מנהל, דשבורד סוכן, עמוד לקוחות ועוד.
            העיצוב נשמר באופן אוטומטי ויישאר גם לאחר סגירת הדפדפן.
          </p>
        </div>
      </div>
    </div>
  );
}
