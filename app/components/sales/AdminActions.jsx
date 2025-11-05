"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * Component for admin-only actions (edit/delete buttons)
 * Only renders if user role is admin
 */
export default function AdminActions({ saleId, isAdmin, onDelete }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Don't render anything if not admin
  if (!isAdmin) return null;

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/sales/${saleId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete sale");
      }

      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete(saleId);
      } else {
        // Otherwise redirect to sales page
        router.push("/sales");
        // Show toast notification
        alert("המכירה נמחקה בהצלחה"); // Replace with toast in production
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("פעולה נכשלה, נסה שוב"); // Replace with toast in production
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/sales/${saleId}`}
        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
      >
        עריכה
      </Link>
      <button
        onClick={handleDeleteClick}
        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        disabled={isDeleting}
      >
        {isDeleting ? "מוחק..." : "מחיקה"}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">אישור מחיקה</h3>
            <p className="mb-6">האם אתה בטוח שברצונך למחוק את המכירה הזו?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded"
                disabled={isDeleting}
              >
                ביטול
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
                disabled={isDeleting}
              >
                {isDeleting ? "מוחק..." : "מחק"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
