'use client';

import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

/**
 * Sales chart component that displays sales data grouped by day
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of sale objects
 * @param {string} props.from - Start date (ISO format)
 * @param {string} props.to - End date (ISO format)
 */
export default function SalesChart({ data, from, to }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartData, setChartData] = useState(null);

  // Process data to group by day
  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData(null);
      return;
    }

    // Group sales by day
    const salesByDay = data.reduce((acc, sale) => {
      const date = new Date(sale.createdAt);
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format

      if (!acc[dateString]) {
        acc[dateString] = 0;
      }

      acc[dateString] += sale.salePrice;
      return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(salesByDay).sort();

    // Fill in missing dates if from and to are provided
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

      setChartData({ labels, values });
    } else {
      // Use only dates with sales
      const labels = sortedDates;
      const values = labels.map((date) => salesByDay[date]);

      setChartData({ labels, values });
    }
  }, [data, from, to]);

  // Create or update chart
  useEffect(() => {
    if (!chartData) return;

    // Format labels for display (Hebrew date format)
    const formattedLabels = chartData.labels.map((dateStr) => {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    });

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: formattedLabels,
        datasets: [
          {
            label: 'סך מכירות ליום',
            data: chartData.values,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            rtl: true,
            labels: {
              font: {
                family: 'system-ui, sans-serif',
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('he-IL', {
                    style: 'currency',
                    currency: 'ILS',
                  }).format(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              font: {
                family: 'system-ui, sans-serif',
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return '₪' + value.toLocaleString('he-IL');
              },
              font: {
                family: 'system-ui, sans-serif',
              },
            },
          },
        },
      },
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  // If no data, show empty state message
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center h-64 flex items-center justify-center">
        <p className="text-gray-500">אין נתונים בטווח שנבחר</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-64">
      <canvas ref={chartRef} />
    </div>
  );
}
