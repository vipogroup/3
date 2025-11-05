"use client";

import { formatCurrencyILS } from "@/app/utils/date";

/**
 * Component to display sale status with appropriate color
 * pending=amber, in-progress=blue, completed=green, cancelled=red
 */
function SaleStatusBadge({ status }) {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "ממתין";
      case "in-progress":
        return "בתהליך";
      case "completed":
        return "הושלם";
      case "cancelled":
        return "בוטל";
      default:
        return status;
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor()}`}
    >
      {getStatusText()}
    </span>
  );
}

/**
 * Recent sales table component for agent dashboard
 * @param {Object} props - Component props
 * @param {Array} props.rows - Array of sale objects
 */
export default function RecentSalesTable({ rows = [] }) {
  // Sort by createdAt in descending order and limit to 10
  const recentSales = [...rows]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };
  
  // Format phone number with hyphen (UI only)
  const formatPhone = (phone) => {
    if (!phone) return "";
    
    // Remove non-digits
    const digits = phone.replace(/\D/g, "");
    
    // Format as Israeli phone number
    if (digits.length >= 10) {
      return digits.slice(0, 3) + "-" + digits.slice(3);
    }
    
    return phone;
  };

  if (recentSales.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">אין מכירות אחרונות להצגה</p>
      </div>
    );
  }

  return (
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
            {recentSales.map((sale) => (
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
                  {formatPhone(sale.customerPhone)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 border-b text-right">
                  {formatCurrencyILS(sale.salePrice)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 border-b text-right">
                  {formatCurrencyILS(sale.commission)}
                </td>
                <td className="px-4 py-3 text-sm border-b">
                  <SaleStatusBadge status={sale.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
