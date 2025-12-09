'use client';

import { copyToClipboard } from '@/app/utils/copyToClipboard';

export default function CopyCouponButton({ code, label = 'העתק', successMessage = 'קוד הועתק!' }) {
  const handleCopy = async () => {
    if (!code) return;
    const normalizedCode = typeof code === 'string' ? code.toUpperCase() : code;

    const success = await copyToClipboard(normalizedCode);
    if (success) {
      alert(successMessage);
    } else {
      alert('אירעה שגיאה בעת העתקת הקוד');
    }
  };

  return (
    <button onClick={handleCopy} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
      {label}
    </button>
  );
}
