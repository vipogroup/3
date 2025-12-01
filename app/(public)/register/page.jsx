"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/http";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);

    // Get referrerId from localStorage (fallback if cookie didn't work)
    let referrerId = null;
    try {
      referrerId = localStorage.getItem("referrerId");
    } catch (err) {
      console.log("localStorage not available");
    }

    // Register
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phone, email, password, role, referrerId }),
    });

    const j = await res.json().catch(() => ({}));
    if (!res.ok || !j?.ok) {
      // Better error messages
      let errorMsg = j?.error || "הרשמה נכשלה";
      if (errorMsg === "user exists") {
        errorMsg = "משתמש עם האימייל או הטלפון הזה כבר קיים. נסה להתחבר במקום.";
      } else if (errorMsg === "missing fields") {
        errorMsg = "חסרים שדות חובה. אנא מלא את כל השדות המסומנים בכוכבית.";
      } else if (errorMsg === "phone or email required") {
        errorMsg = "נדרש אימייל או טלפון לפחות.";
      } else if (errorMsg === "invalid role") {
        errorMsg = "סוג משתמש לא תקין.";
      }
      setErr(errorMsg);
      setLoading(false);
      return;
    }

    // Auto-login for customers
    if (role === "customer") {
      setMsg("נרשמת בהצלחה! מתחבר...");
      
      const identifier = email || phone;
      const loginRes = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      });

      if (loginRes.ok) {
        setTimeout(() => router.push("/customer"), 500);
      } else {
        setMsg("נרשמת בהצלחה, אבל ההתחברות נכשלה. מעביר לעמוד כניסה...");
        setTimeout(() => router.push("/login"), 1500);
      }
    } else {
      // Admin/Agent - manual login required
      setMsg("נרשמת בהצלחה! המתן לאישור מנהל ולאחר מכן התחבר.");
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              הצטרף אלינו
            </h1>
            <p className="text-gray-600">
              צור חשבון חדש והתחל למכור
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label 
                htmlFor="fullName" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                שם מלא <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="ישראל ישראלי"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-describedby="fullName-help"
              />
              <p id="fullName-help" className="text-xs text-gray-500 mt-1">
                השם המלא שלך כפי שיופיע במערכת
              </p>
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                כתובת אימייל <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-describedby="email-help"
              />
              <p id="email-help" className="text-xs text-gray-500 mt-1">
                נשתמש באימייל לשליחת עדכונים ואימות חשבון
              </p>
            </div>

            {/* Phone */}
            <div>
              <label 
                htmlFor="phone" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                מספר טלפון
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="050-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-describedby="phone-help"
              />
              <p id="phone-help" className="text-xs text-gray-500 mt-1">
                אופציונלי - לצורך יצירת קשר
              </p>
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                סיסמה <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-describedby="password-help"
              />
              <p id="password-help" className="text-xs text-gray-500 mt-1">
                לפחות 6 תווים - השתמש בסיסמה חזקה
              </p>
            </div>

            {/* Role */}
            <div>
              <label 
                htmlFor="role" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                סוג משתמש
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-describedby="role-help"
              >
                <option value="customer">לקוח</option>
                <option value="agent">סוכן</option>
              </select>
              <p id="role-help" className="text-xs text-gray-500 mt-1">
                {role === "customer" && "לקוח - גישה לרכישת מוצרים"}
                {role === "agent" && "סוכן - גישה לדשבורד סוכנים ועמלות"}
              </p>
            </div>

            {/* Success Message */}
            {msg && (
              <div 
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3" 
                role="status"
                aria-live="polite"
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <strong className="font-semibold">הצלחה!</strong>
                  <p className="text-sm mt-1">{msg}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {err && (
              <div 
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" 
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <strong className="font-semibold">שגיאה בהרשמה</strong>
                    <p className="text-sm mt-1">{err}</p>
                  </div>
                </div>
                {err.includes("כבר קיים") && (
                  <div className="mt-3">
                    <a 
                      href="/login"
                      className="inline-block w-full text-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      עבור להתחברות
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  נרשם...
                </span>
              ) : (
                "הירשם עכשיו"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">או</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            כבר יש לך חשבון?{" "}
            <a 
              href="/login" 
              className="font-semibold text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
            >
              התחבר כאן
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          בהרשמה אתה מסכים ל
          <a href="/terms" className="underline hover:text-gray-700"> תנאי השימוש </a>
          ו
          <a href="/privacy" className="underline hover:text-gray-700">מדיניות הפרטיות</a>
        </p>
      </div>
    </main>
  );
}
