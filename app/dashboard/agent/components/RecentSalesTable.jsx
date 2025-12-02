'use client';

import { formatCurrencyILS } from '@/app/utils/date';

/**
 * Component to display sale status with appropriate color
 * pending=amber, in-progress=blue, completed=green, cancelled=red
 */
function SaleStatusBadge({ status }) {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'ממתין';
      case 'in-progress':
        return 'בתהליך';
      case 'completed':
        return 'הושלם';
      case 'cancelled':
        return 'בוטל';
      default:
        return status;
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor()}`}>
      {getStatusText()}
    </span>
  );
}

/**
 * Recent sales table component for agent dashboard
 * @param {Object} props - Component props
 * @param {Array} props.rows - Array of sale objects
 */
export default function RecentSalesTable({ rows = [], className = '' }) {
  // Sort by createdAt in descending order and limit to 10
  const recentSales = [...rows]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Format phone number with hyphen (UI only)
  const formatPhone = (phone) => {
    if (!phone) return '';

    // Remove non-digits
    const digits = phone.replace(/\D/g, '');

    // Format as Israeli phone number
    if (digits.length >= 10) {
      return digits.slice(0, 3) + '-' + digits.slice(3);
    }

    return phone;
  };

  const cardClassName =
    className || 'bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden';

  if (recentSales.length === 0) {
    return (
      <div className={`${cardClassName} p-10 text-center flex items-center justify-center`}>
        <div>
          <p className="text-lg font-semibold text-gray-700">אין מכירות אחרונות להצגה</p>
          <p className="text-sm text-gray-500 mt-2">כשתתבצע מכירה חדשה, היא תופיע כאן.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClassName}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-purple-50 to-blue-50">
            <tr>
              <th className="px-5 py-3 text-right text-xs font-bold tracking-wide text-gray-600 uppercase">
                תאריך
              </th>
              <th className="px-5 py-3 text-right text-xs font-bold tracking-wide text-gray-600 uppercase">
                מוצר
              </th>
              <th className="px-5 py-3 text-right text-xs font-bold tracking-wide text-gray-600 uppercase">
                לקוח
              </th>
              <th className="px-5 py-3 text-right text-xs font-bold tracking-wide text-gray-600 uppercase">
                טלפון
              </th>
              <th className="px-5 py-3 text-right text-xs font-bold tracking-wide text-gray-600 uppercase">
                מחיר
              </th>
              <th className="px-5 py-3 text-right text-xs font-bold tracking-wide text-gray-600 uppercase">
                עמלה
              </th>
              <th className="px-5 py-3 text-right text-xs font-bold tracking-wide text-gray-600 uppercase">
                סטטוס
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {recentSales.map((sale) => (
              <tr key={sale._id} className="hover:bg-indigo-50/40 transition-colors">
                <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">{formatDate(sale.createdAt)}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(sale.createdAt).toLocaleTimeString('he-IL', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 max-w-[200px]">
                  <div className="font-medium text-gray-900 truncate">
                    {sale.productId?.name || 'מוצר לא ידוע'}
                  </div>
                  {sale.productId?.price ? (
                    <div className="text-xs text-gray-400 mt-0.5">
                      מחיר קטלוגי: {formatCurrencyILS(sale.productId.price)}
                    </div>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 max-w-[200px]">
                  <div className="font-medium text-gray-900 truncate">
                    {sale.customerName || '---'}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 truncate">
                    {sale.customerEmail || 'ללא אימייל'}
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {formatPhone(sale.customerPhone)}
                </td>
                <td className="px-5 py-4 text-sm text-gray-900 text-left whitespace-nowrap">
                  <span className="font-semibold">{formatCurrencyILS(sale.salePrice)}</span>
                </td>
                <td className="px-5 py-4 text-sm text-indigo-600 text-left whitespace-nowrap">
                  <span className="font-semibold">{formatCurrencyILS(sale.commission)}</span>
                </td>
                <td className="px-5 py-4 text-sm text-right">
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
