'use client';

import Link from 'next/link';
import FeaturedCarousel from '@/app/components/FeaturedCarousel';

export default function ShopPage() {

  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      {/* Hero Section */}
      <div 
        className="relative pt-8 pb-16 px-4"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
      >
        {/* VIPO Title */}
        <div className="text-center mb-8">
          <p className="text-white/90 text-base font-medium">נלחמים ביוקר המחיה - מוצרים במחירים משתלמים</p>
        </div>

        {/* Selection Cards */}
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-4">
            {/* Available Now Card */}
            <Link href="/products?type=available" className="block group no-underline" style={{ textDecoration: 'none' }}>
              <div 
                className="relative bg-white rounded-2xl p-4 text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                style={{ boxShadow: '0 8px 32px rgba(8, 145, 178, 0.25)' }}
              >
                {/* Badge */}
                <div 
                  className="absolute top-0 right-0 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                >
                  משלוח מהיר
                </div>
                
                {/* Icon */}
                <div 
                  className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)' }}
                >
                  <svg className="w-7 h-7" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                
                <h3 className="font-bold text-base mb-1" style={{ color: '#1e3a8a' }}>במלאי עכשיו</h3>
                <p className="text-xs text-gray-500 mb-3">מוצרים מוכנים למשלוח<br/>ישירות אליך!</p>
                
                {/* Button */}
                <div 
                  className="text-white px-4 py-2 rounded-full font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                >
                  לחץ כאן
                </div>
              </div>
            </Link>

            {/* Group Purchase Card */}
            <Link href="/products?type=group" className="block group no-underline" style={{ textDecoration: 'none' }}>
              <div 
                className="relative rounded-2xl p-4 text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                style={{ background: '#fff7ed', boxShadow: '0 8px 32px rgba(251, 191, 36, 0.35)' }}
              >
                {/* HOT Badge */}
                <div className="absolute top-0 right-0 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg animate-pulse" style={{ background: '#d97706' }}>
                  עד 50% הנחה
                </div>
                
                {/* Icon - People */}
                <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: 'rgba(251, 191, 36, 0.2)' }}>
                  <svg className="w-7 h-7" style={{ color: '#d97706' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                
                <h3 className="font-bold text-base mb-1" style={{ color: '#d97706' }}>רכישה קבוצתית</h3>
                <p className="text-xs mb-3" style={{ color: '#d97706' }}>הצטרפו למילוי מכולה<br/>ותהנו מהנחות מטורפות!</p>
                
                {/* Button */}
                <div className="bg-white px-4 py-2 rounded-full font-bold text-sm" style={{ color: '#d97706', border: '2px solid #d97706' }}>
                  לחץ כאן
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z" fill="#ffffff"/>
          </svg>
        </div>
      </div>

      {/* Products Section - New Carousel */}
      <FeaturedCarousel darkBackground={false} />

    </div>
  );
}
