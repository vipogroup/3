'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import SaleStatusBadge from './SaleStatusBadge';
import AdminActions from './AdminActions';

/**
 * Table component for displaying sales with filtering, sorting, and pagination
 */
export default function SalesTable({ sales = [], isAdmin = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [deletedSaleIds, setDeletedSaleIds] = useState(new Set());

  const itemsPerPage = 20;

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Handle sort toggle
  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'desc' };
    });
  };

  // Handle sale deletion (client-side)
  const handleSaleDeleted = (saleId) => {
    setDeletedSaleIds((prev) => new Set([...prev, saleId]));
  };

  // Apply filters, sorting, and pagination
  const filteredSales = useMemo(() => {
    // Filter out deleted sales
    let result = sales.filter((sale) => !deletedSaleIds.has(sale._id));

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (sale) =>
          sale.customerName?.toLowerCase().includes(term) || sale.customerPhone?.includes(term),
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((sale) => sale.status === statusFilter);
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle date comparison
      if (sortConfig.key === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle numeric comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string comparison
      if (sortConfig.direction === 'asc') {
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
    setSearchTerm('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row gap-3">
        <div className="flex-1 w-full">
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
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded"
          >
            <option value="">כל הסטטוסים</option>
            <option value="pending">ממתין</option>
            <option value="in-progress">בתהליך</option>
            <option value="completed">הושלם</option>
            <option value="cancelled">בוטל</option>
          </select>
          <button
            onClick={handleResetFilters}
            className="w-full sm:w-auto px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            איפוס
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                <button onClick={() => handleSort('createdAt')} className="flex items-center">
                  תאריך
                  {sortConfig.key === 'createdAt' && (
                    <span className="mr-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
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
                <button onClick={() => handleSort('salePrice')} className="flex items-center">
                  מחיר
                  {sortConfig.key === 'salePrice' && (
                    <span className="mr-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
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
                  {sales.length === 0 ? 'אין מכירות להצגה' : 'לא נמצאו תוצאות מתאימות לחיפוש'}
                </td>
              </tr>
            ) : (
              paginatedSales.map((sale) => (
                <tr key={sale._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700 border-b">
                    {formatDate(sale.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-b">
                    {sale.productId?.name || 'מוצר לא ידוע'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-b">{sale.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-b">{sale.customerPhone}</td>
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

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {paginatedSales.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-center text-gray-600 shadow-sm">
            {sales.length === 0 ? 'אין מכירות להצגה' : 'לא נמצאו תוצאות מתאימות לחיפוש'}
          </div>
        ) : (
          paginatedSales.map((sale) => (
            <div
              key={sale._id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm text-right"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500">תאריך</p>
                  <p className="text-base font-semibold text-gray-900">
                    {formatDate(sale.createdAt)}
                  </p>
                </div>
                <SaleStatusBadge status={sale.status} />
              </div>

              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <div>
                  <p className="text-xs text-gray-500">מוצר</p>
                  <p className="font-medium">{sale.productId?.name || 'מוצר לא ידוע'}</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">לקוח</p>
                    <p className="font-medium">{sale.customerName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">טלפון</p>
                    <p className="font-medium break-all">{sale.customerPhone || '—'}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500">מחיר</p>
                      <p className="font-medium">₪{Number(sale.salePrice ?? 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">עמלה</p>
                      <p className="font-medium">₪{Number(sale.commission ?? 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href={`/sales/${sale._id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-all"
                >
                  צפה
                </Link>
                {isAdmin && (
                  <div className="flex justify-center">
                    <AdminActions
                      saleId={sale._id}
                      isAdmin={isAdmin}
                      onDelete={handleSaleDeleted}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="w-full sm:w-auto px-3 py-1 border rounded disabled:opacity-50"
            >
              ראשון
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-full sm:w-auto px-3 py-1 border rounded disabled:opacity-50"
            >
              הקודם
            </button>
            <span className="px-3 py-1 text-center">
              {currentPage} מתוך {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto px-3 py-1 border rounded disabled:opacity-50"
            >
              הבא
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto px-3 py-1 border rounded disabled:opacity-50"
            >
              אחרון
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
