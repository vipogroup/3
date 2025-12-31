'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const productsList = data.products || data;
        if (Array.isArray(productsList)) {
          setProducts(productsList.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || products.length === 0) return;

    const scrollSpeed = 1;
    const interval = setInterval(() => {
      if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
        carousel.scrollLeft = 0;
      } else {
        carousel.scrollLeft += scrollSpeed;
      }
    }, 20);

    return () => clearInterval(interval);
  }, [products]);

  return (
    <div className="min-h-screen" style={{ background: '#f8f9fa' }}>
      {/* Hero Section */}
      <div 
        className="relative pt-8 pb-16 px-4"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
      >
        {/* VIPO Title */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <h1 
              className="text-5xl font-black text-white"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 0 30px rgba(125, 211, 252, 0.6), 0 4px 8px rgba(0,0,0,0.2)',
              }}
            >
              VIPO
            </h1>
            {/* Styled Underline */}
            <div 
              className="h-1 w-24 mx-auto mt-1.5 rounded-full"
              style={{ 
                background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)',
                boxShadow: '0 6px 18px rgba(8, 145, 178, 0.25)',
              }}
            />
          </div>
          <p className="text-white/90 text-base mt-4 font-medium">נלחמים ביוקר המחיה - מוצרים במחירים משתלמים</p>
        </div>

        {/* Selection Cards */}
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-4">
            {/* Available Now Card */}
            <Link href="/products?type=available" className="block group">
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
            <Link href="/products?type=group" className="block group">
              <div 
                className="relative bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl p-4 text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                style={{ boxShadow: '0 8px 32px rgba(251, 191, 36, 0.35)' }}
              >
                {/* HOT Badge */}
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg animate-pulse">
                  עד 50% הנחה
                </div>
                
                {/* Icon - People */}
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                
                <h3 className="font-bold text-base mb-1" style={{ color: '#78350f' }}>רכישה קבוצתית</h3>
                <p className="text-xs mb-3" style={{ color: '#92400e' }}>הצטרפו למילוי מכולה<br/>ותהנו מהנחות מטורפות!</p>
                
                {/* Button */}
                <div className="bg-white px-4 py-2 rounded-full font-bold text-sm" style={{ color: '#d97706' }}>
                  לחץ כאן
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z" fill="#f8f9fa"/>
          </svg>
        </div>
      </div>

      {/* Products Section */}
      <div className="py-8 px-4">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#1e3a8a' }}>
            הצצה למוצרים
          </h2>
          <div 
            className="h-1 w-16 mx-auto mt-2 rounded-full"
            style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)' }}
          />
        </div>

        {/* Carousel */}
        {products.length > 0 ? (
          <div 
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollBehavior: 'auto' }}
          >
            {[...products, ...products].map((product, index) => (
              <Link 
                key={`${product._id}-${index}`}
                href={`/products/${product._id}`}
                className="flex-shrink-0 w-36"
              >
                <div 
                  className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{
                    border: '2px solid transparent',
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    boxShadow: '0 4px 15px rgba(8, 145, 178, 0.15)',
                  }}
                >
                  <div className="aspect-square relative bg-gray-50">
                    <Image
                      src={product.image || 'https://placehold.co/300x300?text=VIPO'}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-xs font-medium text-gray-800 line-clamp-1">{product.name}</h3>
                    <p 
                      className="text-sm font-bold mt-1"
                      style={{ 
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      ₪{product.price?.toLocaleString('he-IL')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="animate-pulse flex justify-center gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-36 h-48 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
