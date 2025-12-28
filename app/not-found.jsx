import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Icon */}
        <div className="mb-8">
          <div 
            className="w-32 h-32 mx-auto rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)' }}
          >
            <span className="text-6xl">🔍</span>
          </div>
        </div>

        {/* Title */}
        <h1 
          className="text-6xl font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          הדף לא נמצא
        </h2>

        <p className="text-gray-600 mb-8">
          מצטערים, הדף שחיפשת לא קיים או הועבר למקום אחר.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-2xl text-white font-semibold shadow-lg transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            חזרה לדף הבית
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 rounded-2xl font-semibold border-2 transition-transform hover:scale-105"
            style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
          >
            צפייה במוצרים
          </Link>
        </div>

        {/* Help Link */}
        <p className="mt-8 text-sm text-gray-500">
          צריך עזרה?{' '}
          <Link href="/contact" className="underline" style={{ color: '#0891b2' }}>
            צור קשר
          </Link>
        </p>
      </div>
    </div>
  );
}
