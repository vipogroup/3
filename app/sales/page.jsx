"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/app/components/layout/MainLayout";
import SalesTable from "@/app/components/sales/SalesTable";

export const dynamic = "force-dynamic";

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }

    fetchUser();
  }, []);

  // Fetch sales data
  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch("/api/sales", { cache: "no-store" });
        
        if (!res.ok) {
          if (res.status === 401) {
            setError("אנא התחבר כדי לצפות במכירות");
            return;
          }
          if (res.status === 403) {
            setError("אין לך הרשאה לצפות במכירות");
            return;
          }
          throw new Error("Failed to load sales");
        }
        
        const data = await res.json();
        setSales(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching sales:", error);
        setError("אירעה שגיאה בטעינת המכירות. נסה שוב מאוחר יותר.");
      } finally {
        setLoading(false);
      }
    }

    fetchSales();
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">מכירות</h1>
        {user && (
          <Link
            href="/sales/new"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            הוספת מכירה
          </Link>
        )}
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
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <SalesTable sales={sales} isAdmin={isAdmin} />
        </div>
      )}
    </MainLayout>
  );
}
