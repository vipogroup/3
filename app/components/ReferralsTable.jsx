'use client';

import { useEffect, useState } from 'react';

export default function ReferralsTable() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/referrals/list', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">המופנים שלי</h3>
        <p className="text-gray-500">טוען...</p>
      </div>
    );
  }

  if (!data?.ok || !data.referrals) {
    return null;
  }

  const referrals = data.referrals;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">המופנים שלי</h3>
        <span className="text-sm text-gray-600">סה״כ: {data.count}</span>
      </div>

      {referrals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2 text-gray-400">-</p>
          <p>אין עדיין הפניות</p>
          <p className="text-sm mt-2">שתף את הלינק האישי שלך כדי להתחיל להרוויח!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  שם
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  אימייל/טלפון
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  תפקיד
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  תאריך הצטרפות
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {referrals.map((ref) => (
                <tr key={ref._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{ref.fullName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {ref.email || ref.phone || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        ref.role === 'agent'
                          ? 'bg-green-100 text-green-800'
                          : ref.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ref.role === 'agent' ? 'סוכן' : ref.role === 'admin' ? 'מנהל' : 'לקוח'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(ref.createdAt).toLocaleDateString('he-IL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
