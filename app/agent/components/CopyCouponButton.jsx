'use client';

export default function CopyCouponButton({ code }) {
  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      alert('קוד הועתק!');
    }
  };

  return (
    <button onClick={handleCopy} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
      העתק
    </button>
  );
}
