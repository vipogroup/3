/**
 * Date utility functions for dashboard components
 */

/**
 * Get the date range for the current month (start and end dates)
 * @returns {Object} Object containing fromISO and toISO date strings
 */
export function getCurrentMonthRange() {
  const now = new Date();

  // First day of current month
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  // Last day of current month
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  lastDay.setHours(23, 59, 59, 999); // Set to end of day

  // Format as ISO strings (YYYY-MM-DD)
  const fromISO = firstDay.toISOString().split('T')[0];
  const toISO = lastDay.toISOString().split('T')[0];

  return { fromISO, toISO };
}

/**
 * Group sales by day and calculate sum for each day
 * @param {Array} sales - Array of sale objects
 * @param {string} [from] - Optional start date (YYYY-MM-DD)
 * @param {string} [to] - Optional end date (YYYY-MM-DD)
 * @returns {Object} Object with labels and values arrays
 */
export function groupSalesByDay(sales, from, to) {
  if (!sales || !Array.isArray(sales) || sales.length === 0) {
    return { labels: [], values: [] };
  }

  // Group sales by day
  const salesByDay = sales.reduce((acc, sale) => {
    const date = new Date(sale.createdAt);
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format

    if (!acc[dateString]) {
      acc[dateString] = 0;
    }

    acc[dateString] += sale.salePrice;
    return acc;
  }, {});

  // If from and to are provided, fill in missing dates
  if (from && to) {
    const startDate = new Date(from);
    const endDate = new Date(to);

    // Ensure end date is set to end of day
    endDate.setHours(23, 59, 59, 999);

    const dateArray = [];
    const currentDate = new Date(startDate);

    // Create array of all dates in range
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      dateArray.push(dateString);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Use all dates in range
    const labels = dateArray;
    const values = labels.map((date) => salesByDay[date] || 0);

    return { labels, values };
  } else {
    // Use only dates with sales
    const labels = Object.keys(salesByDay).sort();
    const values = labels.map((date) => salesByDay[date]);

    return { labels, values };
  }
}

/**
 * Format a number as Israeli currency (ILS)
 * @param {number} n - Number to format
 * @returns {string} Formatted currency string
 */
export function formatCurrencyILS(n) {
  if (n === undefined || n === null) return '₪0';

  // Show decimals only if there are any (e.g., 53.89 -> ₪53.89, 54 -> ₪54)
  const hasDecimals = n % 1 !== 0;
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(n);
}
