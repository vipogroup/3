'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function FeaturedCarousel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user to check if agent
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?featured=true');
        const data = await res.json();
        const productsList = data.products || data;
        if (Array.isArray(productsList)) {
          const featured = productsList.filter(p => p.isFeatured);
          setProducts(featured.length > 0 ? featured : productsList.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (products.length === 0 || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % products.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [products.length, isPaused]);

  if (loading) {
    return (
      <div className="py-0 md:py-2 px-4 pb-0" style={{ position: 'relative', zIndex: 2, marginTop: '60px', marginBottom: '0', minHeight: '420px' }}>
        <div className="text-center mb-2 md:mb-4">
          <h2 className="text-xl font-bold drop-shadow-lg" style={{ color: '#ffffff', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}>
            מוצרים במחיר מפעל
          </h2>
          <div 
            className="h-1 w-16 mx-auto mt-2 rounded-full"
            style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, #ffffff 50%, rgba(255,255,255,0.3) 100%)' }}
          />
        </div>
        <div className="animate-pulse flex justify-center gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-32 h-56 bg-white/20 rounded-xl flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  // Calculate position for 3D carousel
  const getCardStyle = (index) => {
    const total = products.length;
    const anglePerItem = 360 / total;
    const rotation = (index - currentIndex) * anglePerItem;
    const radius = 220; // Distance from center
    
    // Convert to radians
    const radians = (rotation * Math.PI) / 180;
    
    // Calculate 3D position
    const translateX = Math.sin(radians) * radius;
    const translateZ = Math.cos(radians) * radius - radius;
    const scale = (translateZ + radius * 2) / (radius * 2);
    const opacity = scale < 0.5 ? 0 : Math.min(1, scale);
    const zIndex = Math.round(scale * 100);
    
    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${Math.max(0.6, scale)})`,
      opacity,
      zIndex,
      transition: 'all 0.5s ease-out',
    };
  };

  return (
    <div className="py-0 md:py-2 px-4 pb-0" style={{ position: 'relative', zIndex: 2, marginTop: '60px', marginBottom: '0', minHeight: '420px' }}>
      {/* Section Header */}
      <div className="text-center mb-2 md:mb-4">
        <h2 className="text-xl font-bold drop-shadow-lg" style={{ color: '#ffffff', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}>
          מוצרים במחיר מפעל
        </h2>
        <div 
          className="h-1 w-16 mx-auto mt-2 rounded-full"
          style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, #ffffff 50%, rgba(255,255,255,0.3) 100%)' }}
        />
      </div>

      {/* 3D Carousel */}
      <div 
        className="relative mx-auto"
        style={{ 
          perspective: '1000px',
          height: '320px',
          maxWidth: '100%',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div 
          className="absolute left-1/2 top-1/2"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {products.map((product, index) => (
            <div
              key={product._id}
              className="absolute"
              style={{
                ...getCardStyle(index),
                left: '-80px', // Half of card width (w-40 = 160px)
                top: '-140px', // Half of card height
              }}
            >
              <FeaturedProductCard 
                product={product}
                user={user}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function FeaturedProductCard({ product, user }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Check if product is in favorites on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vipo_favorites');
      if (saved) {
        const favorites = JSON.parse(saved);
        setIsFavorite(favorites.some((item) => item._id === product._id));
      }
    } catch (e) {
      console.error('Error loading favorites:', e);
    }
  }, [product._id]);

  // Toggle favorite status
  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const saved = localStorage.getItem('vipo_favorites');
      let favorites = saved ? JSON.parse(saved) : [];
      
      if (isFavorite) {
        favorites = favorites.filter((item) => item._id !== product._id);
      } else {
        favorites.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          imageUrl: product.imageUrl,
        });
      }
      
      localStorage.setItem('vipo_favorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error('Error saving favorites:', e);
    }
  };

  return (
    <div
      className="flex-shrink-0 w-40 rounded-xl overflow-hidden group flex flex-col transition-all duration-300"
      style={{
        border: '2px solid transparent',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), linear-gradient(135deg, #1e3a8a, #0891b2)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        boxShadow: '0 4px 15px rgba(8, 145, 178, 0.15)',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(8, 145, 178, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(8, 145, 178, 0.15)';
      }}
    >
      {/* Image Container */}
      <Link href={`/products/${product._id}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image || product.imageUrl || 'https://placehold.co/300x300?text=VIPO'}
            alt={product.name || 'מוצר'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />

          {/* Icons Container - Top Left */}
          <div className="absolute top-1 left-1 flex gap-1 z-10">
            {/* Heart/Favorites Button */}
            <button
              type="button"
              onClick={toggleFavorite}
              className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: isFavorite ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
              aria-label={isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
            >
              <svg
                className="w-3 h-3"
                fill={isFavorite ? 'white' : 'none'}
                stroke={isFavorite ? 'white' : '#6b7280'}
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Share Button - Only for agents */}
            {(user?.role === 'agent' || user?.role === 'admin') && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/agent/share/${product._id}`); }}
                className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
                aria-label="שתף מוצר"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            )}
          </div>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div
              className="absolute top-2 right-2 text-white px-1.5 py-0.5 rounded text-[10px] font-bold z-10"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              }}
            >
              -{discountPercent}%
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-2.5 flex-1 flex flex-col">
        {/* Product Title */}
        <Link href={`/products/${product._id}`}>
          <h3 className="text-xs font-medium mb-1.5 line-clamp-2 hover:text-cyan-600 leading-snug" style={{ color: '#374151' }}>
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-2">
          {product.originalPrice ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span 
                className="text-base font-black"
                style={{ 
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ₪{product.price?.toLocaleString('he-IL')}
              </span>
              <span className="text-[10px] line-through text-gray-400">
                ₪{product.originalPrice?.toLocaleString('he-IL')}
              </span>
            </div>
          ) : (
            <span 
              className="text-base font-bold"
              style={{ 
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ₪{product.price?.toLocaleString('he-IL')}
            </span>
          )}
        </div>

              </div>

    </div>
  );
}
