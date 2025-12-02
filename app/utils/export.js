'use client';

/**
 * Utility functions for exporting data to CSV and Excel formats
 */

/**
 * Format a date for display in exports
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Get status text in Hebrew
 * @param {string} status - Status code
 * @returns {string} Hebrew status text
 */
function getStatusText(status) {
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
}

/**
 * Export data to CSV format and trigger download
 * @param {Array} rows - Array of sale objects
 * @param {string} filename - Output filename
 */
export function exportToCSV(rows, filename = 'sales_report.csv') {
  if (!rows || !rows.length) {
    alert('אין נתונים לייצוא');
    return;
  }

  // Define headers in Hebrew
  const headers = ['תאריך', 'מוצר', 'לקוח', 'טלפון', 'מחיר', 'עמלה', 'סטטוס'];

  // Convert data to CSV rows
  const csvRows = rows.map((row) => [
    formatDate(row.createdAt),
    row.productId?.name || 'לא ידוע',
    row.customerName,
    row.customerPhone,
    row.salePrice.toFixed(2),
    row.commission.toFixed(2),
    getStatusText(row.status),
  ]);

  // Add headers as first row
  csvRows.unshift(headers);

  // Convert to CSV string
  const csvContent = csvRows.map((row) => row.join(',')).join('\n');

  // Add UTF-8 BOM for Excel compatibility with Hebrew
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;

  // Create blob and download link
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // Create download link and trigger click
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data to Excel format (fallback to CSV with .xlsx extension)
 * @param {Array} rows - Array of sale objects
 * @param {string} filename - Output filename
 */
export function exportToExcel(rows, filename = 'sales_report.xlsx') {
  // For now, we'll use the CSV function with an .xlsx extension
  // This is an acceptable fallback as mentioned in the requirements
  exportToCSV(rows, filename);
}
