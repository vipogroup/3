"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/app/components/layout/MainLayout";
import SalesChart from "./components/SalesChart";
import SaleStatusBadge from "@/app/components/sales/SaleStatusBadge";
import { exportToCSV, exportToExcel } from "@/app/utils/export";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState("");
  
  // Filter state
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    status: "",
    agentId: ""
  });
  
  // Agents list for filter dropdown
  const [agents, setAgents] = useState([]);
  
  // Check if user is admin and redirect if not
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          router.push("/sales");
          return;
        }
        
        const data = await res.json();
        if (!data.user || data.user.role !== "admin") {
          router.push("/sales");
          return;
        }
        
        setUser(data.user);
        
        // Try to fetch agents list if user is admin
        try {
          const agentsRes = await fetch("/api/users?role=agent", { cache: "no-store" });
          if (agentsRes.ok) {
            const agentsData = await agentsRes.json();
            if (Array.isArray(agentsData)) {
              setAgents(agentsData);
            }
          }
        } catch (error) {
          console.error("Failed to fetch agents:", error);
          // Non-critical error, continue without agents filter
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/sales");
      }
    }
    
    checkAuth();
  }, [router]);
  
  // Fetch report data based on filters
  useEffect(() => {
    if (!user) return;
    
    async function fetchReportData() {
      setLoading(true);
      setError("");
      
      try {
        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (filters.from) queryParams.append("from", filters.from);
        if (filters.to) queryParams.append("to", filters.to);
        if (filters.status) queryParams.append("status", filters.status);
        if (filters.agentId) queryParams.append("agentId", filters.agentId);
        
        const res = await fetch(`/api/sales/report?${queryParams.toString()}`, { 
          cache: "no-store" 
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            setError("אנא התחבר כדי לצפות בדוחות");
            return;
          }
          if (res.status === 403) {
            setError("אין לך הרשאה לצפות בדוחות");
            router.push("/sales");
            return;
          }
          throw new Error("Failed to load report data");
        }
        
        const data = await res.json();
        if (!data.ok) {
          throw new Error(data.message || "Failed to load report data");
        }
        
        setReportData(data);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("טעינת הדוח נכשלה, נסה שוב");
      } finally {
        setLoading(false);
      }
    }
    
    fetchReportData();
  }, [user, filters, router]);
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    
    // Validate date range
    if (filters.from && filters.to && new Date(filters.from) > new Date(filters.to)) {
      setError("תאריך התחלה חייב להיות לפני תאריך סיום");
      return;
    }
    
    // Trigger effect to reload data
    setFilters({ ...filters });
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      from: "",
      to: "",
      status: "",
      agentId: ""
    });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("he-IL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">דוחות מכירות</h1>
      </div>
      
      {/* Filters panel */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="from" className="block mb-1 text-sm font-medium">מתאריך</label>
            <input
              type="date"
              id="from"
              name="from"
              value={filters.from}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label htmlFor="to" className="block mb-1 text-sm font-medium">עד תאריך</label>
            <input
              type="date"
              id="to"
              name="to"
              value={filters.to}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block mb-1 text-sm font-medium">סטטוס</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">כל הסטטוסים</option>
              <option value="pending">ממתין</option>
              <option value="in-progress">בתהליך</option>
              <option value="completed">הושלם</option>
              <option value="cancelled">בוטל</option>
            </select>
          </div>
          
          {agents.length > 0 && (
            <div>
              <label htmlFor="agentId" className="block mb-1 text-sm font-medium">סוכן</label>
              <select
                id="agentId"
                name="agentId"
                value={filters.agentId}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">כל הסוכנים</option>
                {agents.map(agent => (
                  <option key={agent._id} value={agent._id}>
                    {agent.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="flex gap-2 items-end md:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              סינון
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              disabled={loading}
            >
              איפוס
            </button>
          </div>
        </form>
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
      ) : reportData ? (
        <>
          {/* KPIs summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">סך מכירות</h3>
              <p className="text-2xl font-bold">
                ₪{reportData.totals.totalSales.toLocaleString('he-IL')}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">סך עמלות</h3>
              <p className="text-2xl font-bold">
                ₪{reportData.totals.totalCommission.toLocaleString('he-IL')}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">מס' עסקאות</h3>
              <p className="text-2xl font-bold">
                {reportData.totals.count}
              </p>
            </div>
          </div>
          
          {/* Chart area */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">גרף מכירות</h2>
            <SalesChart 
              data={reportData.list} 
              from={filters.from} 
              to={filters.to} 
            />
          </div>
          
          {/* Table area */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">טבלת מכירות</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => exportToCSV(reportData.list, "sales_report.csv")}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  ייצוא ל-CSV
                </button>
                <button
                  onClick={() => exportToExcel(reportData.list, "sales_report.xlsx")}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  ייצוא ל-Excel
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">תאריך</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">מוצר</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">לקוח</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">טלפון</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">מחיר</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">עמלה</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">סטטוס</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.list.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                          אין נתונים בטווח שנבחר
                        </td>
                      </tr>
                    ) : (
                      reportData.list.map((sale) => (
                        <tr key={sale._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            {formatDate(sale.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b truncate max-w-[150px]">
                            {sale.productId?.name || "מוצר לא ידוע"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b truncate max-w-[150px]">
                            {sale.customerName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            {sale.customerPhone}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            ₪{sale.salePrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b">
                            ₪{sale.commission.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm border-b">
                            <SaleStatusBadge status={sale.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </MainLayout>
  );
}
