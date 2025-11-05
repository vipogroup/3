"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/app/components/layout/MainLayout";
import SaleForm from "@/app/components/sales/SaleForm";

export default function NewSalePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user is authenticated and has permission
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          setError("אנא התחבר כדי ליצור מכירה חדשה");
          return;
        }
        
        const data = await res.json();
        if (!data.user) {
          setError("אנא התחבר כדי ליצור מכירה חדשה");
          return;
        }
        
        // Check if user is agent or admin
        if (!["סוכן", "agent", "מנהל", "admin"].includes(data.user.role)) {
          setError("אין לך הרשאה ליצור מכירות");
          return;
        }
        
        setUser(data.user);
      } catch (error) {
        console.error("Auth check error:", error);
        setError("אירעה שגיאה בבדיקת הרשאות");
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, []);

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">יצירת מכירה חדשה</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          חזרה
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : user ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <SaleForm />
        </div>
      ) : null}
    </MainLayout>
  );
}
