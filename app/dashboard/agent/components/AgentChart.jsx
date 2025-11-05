"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { groupSalesByDay, getCurrentMonthRange } from "@/app/utils/date";

/**
 * Agent sales chart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of agent's sale objects
 */
export default function AgentChart({ data }) {
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
    const { fromISO, toISO } = getCurrentMonthRange();
    
    // Filter sales for current month
    const currentMonthSales = data.filter(sale => {
      const saleDate = new Date(sale.createdAt).toISOString().split('T')[0];
      return saleDate >= fromISO && saleDate <= toISO;
    });
    
    // Group sales by day
    const { labels, values } = groupSalesByDay(currentMonthSales, fromISO, toISO);
    setChartData({ labels, values });
  }, [data]);

  // Create or update chart
  useEffect(() => {
    if (!chartData) return;
    
    // Format labels for display (Hebrew date format)
    const formattedLabels = chartData.labels.map(dateStr => {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("he-IL", {
        day: "2-digit",
        month: "2-digit",
      }).format(date);
    });

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: formattedLabels,
        datasets: [
          {
            label: "מכירות יומיות",
            data: chartData.values,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
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
            position: "top",
            align: "end",
            rtl: true,
            labels: {
              font: {
                family: "system-ui, sans-serif",
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat("he-IL", {
                    style: "currency",
                    currency: "ILS",
                  }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "יום",
              font: {
                family: "system-ui, sans-serif",
              },
            },
            ticks: {
              font: {
                family: "system-ui, sans-serif",
              },
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "מכירות",
              font: {
                family: "system-ui, sans-serif",
              },
            },
            ticks: {
              callback: function(value) {
                return "₪" + value.toLocaleString("he-IL");
              },
              font: {
                family: "system-ui, sans-serif",
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
