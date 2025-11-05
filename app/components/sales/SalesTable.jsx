"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import SaleStatusBadge from "./SaleStatusBadge";
import AdminActions from "./AdminActions";

/**
 * Table component for displaying sales with filtering, sorting, and pagination
 */
export default function SalesTable({ sales = [], isAdmin = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [deletedSaleIds, setDeletedSaleIds] = useState(new Set());
  
  const itemsPerPage = 20;

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("he-IL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Handle sort toggle
  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "desc" };
    });
  };

  // Handle sale deletion (client-side)
  const handleSaleDeleted = (saleId) => {
    setDeletedSaleIds((prev) => new Set([...prev, saleId]));
  };

  // Apply filters, sorting, and pagination
  const filteredSales = useMemo(() => {
    // Filter out deleted sales
    let result = sales.filter(sale => !deletedSaleIds.has(sale._id));
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        sale => 
          sale.customerName?.toLowerCase().includes(term) || 
          sale.customerPhone?.includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(sale => sale.status === statusFilter);
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle date comparison
      if (sortConfig.key === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // Handle numeric comparison
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      // Handle string comparison
      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return result;
  }, [sales, searchTerm, statusFilter, sortConfig, deletedSaleIds]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSales.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSales, currentPage]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="חיפוש לפי שם לקוח או טלפון..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">כל הסטטוסים</option>
            <option value="pending">ממתין</option>
            <option value="in-progress">בתהליך</option>
            <option value="completed">הושלם</option>
            <option value="cancelled">בוטל</option>
          </select>
          <button
            onClick={handleResetFilters}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            איפוס
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                <button
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center"
                >
                  תאריך
                  {sortConfig.key === "createdAt" && (
                    <span className="mr-1">
                      {sortConfig.direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                מוצר
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                לקוח
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                טלפון
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                <button
                  onClick={() => handleSort("salePrice")}
                  className="flex items-center"
                >
                  מחיר
                  {sortConfig.key === "salePrice" && (
                    <span className="mr-1">
                      {sortConfig.direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                עמלה
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                סטטוס
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                פעולות
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedSales.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                  {sales.length === 0
                    ? "אין מכירות להצגה"
                    : "לא נמצאו תוצאות מתאימות לחיפוש"}
                </td>
              </tr>
            ) : (
              paginatedSales.map((sale) => (
                <tr key={sale._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700 border-b">
                    {formatDate(sale.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-b">
                    {sale.productId?.name || "מוצר לא ידוע"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-b">
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
                  <td className="px-4 py-3 text-sm border-b">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/sales/${sale._id}`}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        צפה
                      </Link>
                      {isAdmin && (
                        <AdminActions
                          saleId={sale._id}
                          isAdmin={isAdmin}
                          onDelete={handleSaleDeleted}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              ראשון
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              הקודם
            </button>
            <span className="px-3 py-1">
              {currentPage} מתוך {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              הבא
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              אחרון
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
