"use client";

import { useEffect, useState } from "react";

export default function CommissionStats() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current user data
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">טוען...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const commissionBalance = user.commissionBalance || 0;
  const referralCount = user.referralCount || user.referralsCount || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Commission Balance Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">יתרת קרדיט</p>
            <p className="text-3xl font-bold text-green-600">₪{commissionBalance.toLocaleString()}</p>
          </div>
          <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl">
            💰
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          קרדיט שנצבר מהפניות מוצלחות
        </p>
      </div>

      {/* Referral Count Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">כמות הפניות</p>
            <p className="text-3xl font-bold text-blue-600">{referralCount}</p>
          </div>
          <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl">
            👥
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          משתמשים שהצטרפו דרך הלינק שלך
        </p>
      </div>
    </div>
  );
}
