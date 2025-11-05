"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/http";

export default function AdminLogin() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier: identifier.trim(), password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "שגיאה בהתחברות");
      return;
    }

    if (!data?.role || data.role !== "admin") {
      setError("אין לך הרשאות מנהל");
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0c] text-white px-4">
      <div className="w-full max-w-md bg-gradient-to-b from-[#111112] to-[#0a0a0a] border border-[#2d2d2d] rounded-xl p-8 shadow-[0_0_25px_rgba(212,175,55,0.25)]">
        <h1 className="text-3xl font-bold text-center mb-8">
          VIPO Admin <span className="text-[#D4AF37]">Login</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <div>
            <label className="text-sm text-gray-300">אימייל</label>
            <input
              type="email"
              className="w-full mt-2 px-4 py-3 bg-[#141414] border border-[#2d2d2d] rounded-lg focus:border-[#D4AF37] outline-none transition"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="הכנס אימייל"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">סיסמה</label>
            <input
              type="password"
              className="w-full mt-2 px-4 py-3 bg-[#141414] border border-[#2d2d2d] rounded-lg focus:border-[#D4AF37] outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="הכנס סיסמה"
            />
          </div>

          {error && <p className="text-red-400 text-center text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-[#D4AF37] hover:bg-[#b48c2d] text-black font-bold rounded-lg transition shadow-lg"
          >
            כניסת מנהל
          </button>
        </form>
      </div>
    </div>
  );
}
