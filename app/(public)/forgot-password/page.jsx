"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || "שגיאה בשליחת הבקשה");
      }

      setStatus({
        type: "success",
        message: "אם הכתובת קיימת במערכת, נשלח אליך מייל עם קישור לאיפוס הסיסמה.",
      });
      setEmail("");
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "שגיאה בשליחת הבקשה. נסה שוב.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">שכחת סיסמה?</h1>
            <p className="text-gray-600 text-sm">
              הזן את כתובת האימייל שלך ונשלח קישור לאיפוס הסיסמה
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                כתובת אימייל
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            {status.message && (
              <div
                className={`px-4 py-3 rounded-lg border text-sm ${
                  status.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
                role="alert"
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? "שולח..." : "שלח קישור לאיפוס"}
            </button>
          </form>

          <button
            type="button"
            className="mt-6 text-sm text-blue-600 hover:text-blue-700"
            onClick={() => router.push("/login")}
          >
            חזרה למסך התחברות
          </button>
        </div>
      </div>
    </main>
  );
}
