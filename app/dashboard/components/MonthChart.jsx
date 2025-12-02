'use client';

import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { groupSalesByDay } from '@/app/utils/date';

/**
 * Monthly sales chart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of sale objects for the current month
 */
export default function MonthChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartData, setChartData] = useState(null);

  // Process data to group by day
  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData(null);
      return;
    }

    // Get current month range
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const from = firstDay.toISOString().split('T')[0];
    const to = lastDay.toISOString().split('T')[0];

    // Group sales by day
    const { labels, values } = groupSalesByDay(data, from, to);
    setChartData({ labels, values });
  }, [data]);

  // Create or update chart
  useEffect(() => {
    if (!chartData) return;

    // Format labels for display (Hebrew date format)
    const formattedLabels = chartData.labels.map((dateStr) => {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('he-IL', {
        day: '2-digit',
        month: '2-digit',
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
            label: 'סך מכירות',
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
            title: {
              display: true,
              text: 'יום',
              font: {
                family: 'system-ui, sans-serif',
              },
            },
            ticks: {
              font: {
                family: 'system-ui, sans-serif',
              },
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'סך מכירות',
              font: {
                family: 'system-ui, sans-serif',
              },
            },
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
        <p className="text-gray-500">אין נתונים לחודש הנוכחי</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-64">
      <canvas ref={chartRef} />
    </div>
  );
}
