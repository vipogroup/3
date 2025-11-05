"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/app/components/layout/MainLayout";
import KpiCard from "./components/KpiCard";
import MonthChart from "./components/MonthChart";
import LeaderboardTable from "./components/LeaderboardTable";
import { getCurrentMonthRange, formatCurrencyILS } from "@/app/utils/date";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [error, setError] = useState("");

  // Check user role and redirect to appropriate dashboard
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          router.push("/login");
          return;
        }
        
        const data = await res.json();
        if (!data.user) {
          router.push("/login");
          return;
        }
        
        // Redirect based on role
        if (data.user.role === "customer") {
          router.push("/customer");
          return;
        } else if (data.user.role === "agent") {
          router.push("/agent");
          return;
        } else if (data.user.role !== "admin") {
          router.push("/login");
          return;
        }
        
        setUser(data.user);
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/login");
      }
    }
    
    checkAuth();
  }, [router]);

  // Fetch report data for current month
  useEffect(() => {
    if (!user) return;

    async function fetchReportData() {
      setLoading(true);
      try {
        // Get current month range
        const { fromISO, toISO } = getCurrentMonthRange();
        
        // Fetch report data
        const res = await fetch(`/api/sales/report?from=${fromISO}&to=${toISO}`, {
          cache: "no-store"
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch report data");
        }
        
        const data = await res.json();
        if (!data.ok) {
          throw new Error(data.message || "Failed to fetch report data");
        }
        
        setReportData(data);
        
        // Process data for leaderboard
        const agentMap = new Map();
        
        // Group sales by agent
        data.list.forEach(sale => {
          const agentId = sale.agentId;
          if (!agentId) return;
          
          const agentIdStr = agentId.toString();
          
          if (!agentMap.has(agentIdStr)) {
            agentMap.set(agentIdStr, {
              agentId: agentIdStr,
              agentName: sale.agentName || null,
              totalSales: 0,
              totalCommission: 0,
              count: 0
            });
          }
          
          const agent = agentMap.get(agentIdStr);
          agent.totalSales += sale.salePrice;
          agent.totalCommission += sale.commission;
          agent.count += 1;
        });
        
        // Convert map to array
        setLeaderboardData(Array.from(agentMap.values()));
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("טעינת הדוח נכשלה, נסה שוב");
      } finally {
        setLoading(false);
      }
    }

    fetchReportData();
  }, [user]);

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">דשבורד מנהל</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : reportData ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <KpiCard 
              title="סך מכירות החודש" 
              value={formatCurrencyILS(reportData.totals.totalSales)} 
            />
            <KpiCard 
              title="סך עמלות החודש" 
              value={formatCurrencyILS(reportData.totals.totalCommission)} 
            />
            <KpiCard 
              title="מספר עסקאות החודש" 
              value={reportData.totals.count} 
            />
          </div>
          
          {/* Monthly Trend Chart */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">מגמה חודשית</h2>
            <MonthChart data={reportData.list} />
          </div>
          
          {/* Leaderboard */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">טבלת מובילים</h2>
            <LeaderboardTable rows={leaderboardData} />
          </div>
        </>
      ) : null}
    </MainLayout>
  );
}
