"use client";

import { useState, useEffect } from "react";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      setError("");
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }

      // Optimistic UI update
      setOrders(orders.map(o => 
        o._id === orderId ? { ...o, status: newStatus } : o
      ));
    } catch (err) {
      setError(err.message);
      fetchOrders(); // Revert on error
    }
  }

  // Filter and search
  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch = !searchTerm || 
      order._id.includes(searchTerm) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone?.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const statusOptions = [
    { value: "pending", label: "ממתין", color: "bg-yellow-100 text-yellow-800" },
    { value: "paid", label: "שולם", color: "bg-green-100 text-green-800" },
    { value: "cancelled", label: "בוטל", color: "bg-red-100 text-red-800" },
  ];

  if (loading) {
    return <div className="text-center py-8">טוען...</div>;
  }

  return (
    <div>
      {/* Header with Filters */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">רשימת הזמנות</h2>
            <p className="text-gray-600">סה״כ {filteredOrders.length} הזמנות</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="חיפוש לפי מזהה, אימייל או טלפון..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">כל הסטטוסים</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">מזהה</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">לקוח</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">סכום</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תאריך</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => {
              const statusOption = statusOptions.find(s => s.value === order.status);
              
              return (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                    {order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div>{order.customerEmail || "-"}</div>
                      <div className="text-gray-500">{order.customerPhone || "-"}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold">
                    ₪{order.totalAmount?.toLocaleString() || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusOption?.color}`}>
                      {statusOption?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("he-IL")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm cursor-pointer"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || filter !== "all" ? "לא נמצאו הזמנות מתאימות" : "אין הזמנות במערכת"}
          </div>
        )}
      </div>
    </div>
  );
}
