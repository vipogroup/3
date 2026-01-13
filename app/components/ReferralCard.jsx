'use client';

import { useEffect, useState } from 'react';

export default function ReferralCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/referrals/summary', { credentials: 'include' })
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
        <p className="text-gray-500">טוען...</p>
      </div>
    );
  }

  if (!data?.ok) return null;

  const link = data.myRefLink;
  const wa = `https://wa.me/?text=${encodeURIComponent('הצטרפו אליי למערכת VIPO: ' + link)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl text-blue-600">R</span>
        <h3 className="text-xl font-bold text-gray-900">חבר-מביא-חבר</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">שתף את הלינק האישי שלך והרוויח על כל חבר שמצטרף!</p>

      {/* Referral Link */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">הלינק האישי שלך:</label>
        <input
          type="text"
          value={link}
          readOnly
          onFocus={(e) => e.target.select()}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-mono"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleCopy}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {copied ? 'הועתק!' : 'העתק לינק'}
        </button>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium text-center"
          style={{ background: '#25D366' }}
        >
          שתף ב-WhatsApp
        </a>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">סה״כ הפניות:</span>
          <span className="text-2xl font-bold text-blue-600">{data.referrals.total}</span>
        </div>
        {data.credits && data.credits.total > 0 && (
          <div className="flex justify-between items-center mt-2 pt-2 border-t">
            <span className="text-sm text-gray-600">קרדיט שנצבר:</span>
            <span className="text-lg font-bold text-green-600">₪{data.credits.total}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <p className="text-xs text-gray-500 mt-4">
        כל חבר שנרשם דרך הלינק שלך יזוכה לך בנקודות ובונוסים
      </p>
    </div>
  );
}
