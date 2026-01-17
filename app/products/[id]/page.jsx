'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductById, fetchProductById } from '@/app/lib/products';
import { useCartContext } from '@/app/context/CartContext';
import { useTheme } from '@/app/context/ThemeContext';
import {
  isGroupPurchase,
  getGroupTimeRemaining,
  formatGroupCountdown,
} from '@/app/lib/groupPurchase';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState(false);
  const [groupTimeLeft, setGroupTimeLeft] = useState(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showSuitableFor, setShowSuitableFor] = useState(false);
  const [showWhyChooseUs, setShowWhyChooseUs] = useState(false);
  const [showWarranty, setShowWarranty] = useState(false);
  const [customFieldsOpen, setCustomFieldsOpen] = useState({});
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [liveNotification, setLiveNotification] = useState(null);
  const [viewersCount, setViewersCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const relatedScrollRef = useRef(null);
  const { addItem } = useCartContext();
  const { settings: themeSettings } = useTheme();

  const {
    primaryColor,
    secondaryColor,
    accentColor,
    textColor,
    backgroundGradient,
    cardBackground,
    buttonGradient,
    borderSoftColor,
  } = useMemo(() => {
    const primary = themeSettings?.primaryColor || '#4f46e5';
    const secondary = themeSettings?.secondaryColor || '#4338ca';
    const accent = themeSettings?.accentColor || '#ec4899';
    const text = themeSettings?.textColor || '#1f2937';
    const background =
      themeSettings?.backgroundGradient ||
      `linear-gradient(135deg, ${primary} 0%, ${secondary} 50%, ${accent} 100%)`;
    const cardBg =
      themeSettings?.cardGradient ||
      'linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(240,246,255,0.98) 100%)';
    const buttonBg =
      themeSettings?.buttonGradient ||
      `linear-gradient(135deg, ${primary} 0%, ${secondary} 48%, ${accent} 100%)`;
    const borderColor = themeSettings?.primaryColor
      ? `${themeSettings.primaryColor}33`
      : 'rgba(79,70,229,0.28)';

    return {
      primaryColor: primary,
      secondaryColor: secondary,
      accentColor: accent,
      textColor: text,
      backgroundGradient: background,
      cardBackground: cardBg,
      buttonGradient: buttonBg,
      borderSoftColor: borderColor,
    };
  }, [themeSettings]);

  const outlineHoverColor = useMemo(
    () =>
      themeSettings?.backgroundColor
        ? `${themeSettings.backgroundColor}dd`
        : 'rgba(255,255,255,0.85)',
    [themeSettings],
  );

  const loadProduct = useCallback(async () => {
    const id = params.id;
    if (!id) {
      setProduct(null);
      setProductError(true);
      setLoadingProduct(false);
      return;
    }

    setLoadingProduct(true);
    setProductError(false);

    const cached = getProductById(id);
    if (cached) {
      setProduct(cached);
    }

    try {
      const remote = await fetchProductById(id);
      if (remote) {
        setProduct(remote);
        setProductError(false);
      } else if (!cached) {
        setProduct(null);
        setProductError(true);
      }
    } catch (error) {
      console.error('Failed to load product', error);
      if (!cached) {
        setProduct(null);
        setProductError(true);
      }
    }
    setLoadingProduct(false);
  }, [params.id]);

  useEffect(() => {
    loadProduct();
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else setUser(null);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, [params.id, loadProduct]);

  useEffect(() => {
    const update = () => {
      loadProduct();
    };
    window.addEventListener('productsUpdated', update);
    return () => window.removeEventListener('productsUpdated', update);
  }, [params.id, loadProduct]);

  useEffect(() => setSelectedMediaIndex(0), [product?._id]);

  // Load related products
  useEffect(() => {
    if (!product) return;
    
    const loadRelatedProducts = async () => {
      setLoadingRelated(true);
      try {
        const res = await fetch('/api/products?marketplace=true', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const allProducts = Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : [];
          
          // Filter: same type (group/available), exclude current product
          const sameType = allProducts.filter(p => 
            p._id !== product._id && 
            p.purchaseType === product.purchaseType
          );
          
          // Also get some random products from other types
          const otherType = allProducts.filter(p => 
            p._id !== product._id && 
            p.purchaseType !== product.purchaseType
          );
          
          // Mix: 4 same type + 4 random
          const shuffled = [...sameType].sort(() => Math.random() - 0.5).slice(0, 4);
          const randomOthers = [...otherType].sort(() => Math.random() - 0.5).slice(0, 4);
          
          setRelatedProducts([...shuffled, ...randomOthers]);
        }
      } catch (error) {
        console.error('Failed to load related products:', error);
      }
      setLoadingRelated(false);
    };
    
    loadRelatedProducts();
  }, [product]);

  // Auto-scroll related products carousel
  useEffect(() => {
    if (!relatedProducts.length || !relatedScrollRef.current) return;
    
    const container = relatedScrollRef.current;
    const scrollSpeed = 1; // pixels per frame
    let scrollDirection = 1; // 1 = right, -1 = left
    let animationId;
    let isPaused = false;
    
    const autoScroll = () => {
      if (!isPaused && container) {
        container.scrollLeft += scrollSpeed * scrollDirection;
        
        // Reverse direction at edges
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 5) {
          scrollDirection = -1;
        } else if (container.scrollLeft <= 5) {
          scrollDirection = 1;
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };
    
    // Start auto-scroll after 2 seconds
    const startTimeout = setTimeout(() => {
      animationId = requestAnimationFrame(autoScroll);
    }, 2000);
    
    // Pause on hover/touch
    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };
    const handleTouchStart = () => { isPaused = true; };
    const handleTouchEnd = () => { setTimeout(() => { isPaused = false; }, 3000); };
    
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      clearTimeout(startTimeout);
      if (animationId) cancelAnimationFrame(animationId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [relatedProducts]);

  // Check if product is in favorites
  useEffect(() => {
    if (!product?._id) return;
    try {
      const saved = localStorage.getItem('vipo_favorites');
      if (saved) {
        const favorites = JSON.parse(saved);
        setIsFavorite(favorites.some((item) => item._id === product._id));
      }
    } catch (e) {
      console.error('Error loading favorites:', e);
    }
  }, [product?._id]);

  // Toggle favorite status
  const toggleFavorite = useCallback(() => {
    if (!product) return;
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
  }, [product, isFavorite]);

  useEffect(() => {
    if (!product || !isGroupPurchase(product)) {
      setGroupTimeLeft(null);
      return;
    }

    const tick = () => setGroupTimeLeft(getGroupTimeRemaining(product));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [product]);

  // Sticky Bar - show when scrolling past action buttons
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowStickyBar(scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Social Proof - Simulated viewers count
  useEffect(() => {
    if (!product || product.purchaseType !== 'group') return;
    
    // Initial viewers (random between 5-15)
    setViewersCount(Math.floor(Math.random() * 11) + 5);
    
    // Update viewers every 30-60 seconds
    const interval = setInterval(() => {
      setViewersCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(3, Math.min(20, prev + change));
      });
    }, 30000 + Math.random() * 30000);
    
    return () => clearInterval(interval);
  }, [product]);

  // Social Proof - Live notifications
  useEffect(() => {
    if (!product || product.purchaseType !== 'group') return;
    
    const names = ['דוד', 'שרה', 'משה', 'רחל', 'יוסי', 'מיכל', 'אבי', 'נועה', 'עומר', 'תמר'];
    const cities = ['תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'רמת גן', 'פתח תקווה', 'ראשון לציון', 'נתניה'];
    
    const showNotification = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const minutes = Math.floor(Math.random() * 10) + 1;
      
      setLiveNotification({ name, city, minutes });
      
      // Hide after 4 seconds
      setTimeout(() => setLiveNotification(null), 4000);
    };
    
    // First notification after 5-10 seconds
    const firstTimeout = setTimeout(showNotification, 5000 + Math.random() * 5000);
    
    // Then every 20-40 seconds
    const interval = setInterval(showNotification, 20000 + Math.random() * 20000);
    
    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, [product]);

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-10 py-12 text-center max-w-md">
          <div className="flex items-center justify-center mb-6">
            <div
              className="h-12 w-12 rounded-full border-4 border-gray-200 animate-spin"
              style={{ borderTopColor: '#1e3a8a', borderBottomColor: '#0891b2' }}
            ></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">טוען מוצר...</h2>
          <p className="text-gray-600">אנא המתן</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">מוצר לא נמצא</h1>
          <p className="text-gray-600 mb-6">המוצר שחיפשת אינו קיים במערכת</p>
          <Link
            href="/products"
            className="inline-block text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              boxShadow: '0 2px 8px rgba(8, 145, 178, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(8, 145, 178, 0.2)';
            }}
          >
            חזרה לחנות
          </Link>
        </div>
      </div>
    );
  }

  const imageCandidates = [
    product.image,
    ...(Array.isArray(product.images) ? product.images : []),
  ].filter(Boolean);

  const uniqueImages = [...new Set(imageCandidates)];

  const mediaItems = [
    ...uniqueImages.map((src) => ({ type: 'image', src })),
    ...(product.videoUrl ? [{ type: 'video', src: product.videoUrl }] : []),
  ];

  if (mediaItems.length === 0) {
    mediaItems.push({
      type: 'image',
      src: 'https://via.placeholder.com/800x600?text=No+Image',
    });
  }

  const selectedMedia = mediaItems[selectedMediaIndex];

  const hasDiscount =
    typeof product.originalPrice === 'number' && product.originalPrice > product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/checkout');
  };

  // Get first 4 features for preview
  const visibleFeatures = product.features?.filter(f => f)?.slice(0, showAllFeatures ? undefined : 4) || [];
  const hasMoreFeatures = (product.features?.filter(f => f)?.length || 0) > 4;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      
      {/* Urgency Banner for Group Purchase - TOP OF PAGE */}
      {product.purchaseType === 'group' && product.groupPurchaseDetails && groupTimeLeft && !groupTimeLeft.expired && (
        <div className="sticky top-0 z-40" style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #0891b2 100%)' }}>
          <div className="max-w-lg mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-bold">המבצע נגמר בעוד:</span>
              </div>
              <div className="flex items-center gap-1 font-mono font-bold text-lg">
                <span className="bg-white/20 px-2 py-0.5 rounded">{String(groupTimeLeft.days || 0).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-white/20 px-2 py-0.5 rounded">{String(groupTimeLeft.hours || 0).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-white/20 px-2 py-0.5 rounded">{String(groupTimeLeft.minutes || 0).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-white/20 px-2 py-0.5 rounded">{String(groupTimeLeft.seconds || 0).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto">
        
        {/* Back Button */}
        <div className="px-4 py-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            חזרה לחנות
          </Link>
        </div>

        {/* Image Section - Compact with Swipe */}
        <div className="relative bg-white">
          <div className={`relative ${selectedMedia.type === 'video' ? 'aspect-video' : 'aspect-[4/3]'}`}>
            {selectedMedia.type === 'video' ? (
              selectedMedia.src.includes('youtube') || selectedMedia.src.includes('youtu.be') ? (
                <iframe src={selectedMedia.src} className="w-full h-full" allowFullScreen />
              ) : (
                /* eslint-disable-next-line jsx-a11y/media-has-caption */
                <video 
                  src={selectedMedia.src} 
                  controls 
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                  onError={(e) => console.error('Video error:', e.target.error, selectedMedia.src)}
                >
                  <source src={selectedMedia.src} type="video/mp4" />
                  הדפדפן שלך לא תומך בתגית וידאו
                </video>
              )
            ) : (
              <Image
                src={selectedMedia.src || 'https://placehold.co/400x300/f3f4f6/9ca3af?text=%F0%9F%93%A6'}
                alt={product?.name || 'תמונה של מוצר'}
                fill
                sizes="100vw"
                className="object-contain"
                unoptimized
                priority
              />
            )}
            
            {/* Icons Container - Top Right */}
            <div className="absolute top-3 right-3 flex gap-2 z-10">
              {/* Favorite Button */}
              <button
                onClick={toggleFavorite}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: isFavorite ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                }}
                aria-label={isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
              >
                <svg
                  className="w-5 h-5"
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
                  onClick={() => router.push(`/agent/share/${product._id}`)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                  aria-label="שתף מוצר"
                >
                  <svg
                    className="w-5 h-5"
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
            {hasDiscount && (
              <div className="absolute top-3 left-3 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)' }}>
                {discountPercent}% הנחה
              </div>
            )}

            {/* Image Counter */}
            {mediaItems.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
                {selectedMediaIndex + 1} / {mediaItems.length}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {mediaItems.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {mediaItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMediaIndex(i)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${i === selectedMediaIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'}`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-gray-800 text-white flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                    </div>
                  ) : (
                    <Image src={item.src} alt="" fill sizes="56px" className="object-cover" unoptimized />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Card */}
        <div className="px-4 py-4">
          
          {/* Category */}
          {product.category && (
            <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mb-2">{product.category}</span>
          )}
          
          {/* Product Name */}
          <h1 className="text-xl font-bold leading-snug mb-2" style={{ color: 'var(--primary)' }}>
            {product.name}
          </h1>
          

          {/* Price Section */}
          <div className="flex items-end gap-3 mb-4">
            <span 
              className="text-3xl font-bold"
              style={{ 
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ₪{product.price.toLocaleString('he-IL')}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  ₪{product.originalPrice.toLocaleString('he-IL')}
                </span>
                <span 
                  className="text-sm font-bold px-2 py-1 rounded"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)',
                    color: '#0891b2',
                  }}
                >
                  חיסכון של ₪{(product.originalPrice - product.price).toLocaleString('he-IL')}
                </span>
              </>
            )}
          </div>

          {/* Group Purchase Card */}
          {product.purchaseType === 'group' && product.groupPurchaseDetails && (
            <div 
              className="rounded-xl p-4 mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className="w-10 h-10 rounded-full text-white flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                </div>
                <div>
                  <span className="font-bold text-lg" style={{ color: '#d97706' }}>רכישה קבוצתית</span>
                  <p className="text-xs text-gray-500">הצטרפו לקבוצה וחסכו!</p>
                </div>
              </div>

              {/* Stats Grid - 3 columns */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {/* נרשמו - משתנה לכחול כשעוברים 50% */}
                <div 
                  className="bg-white rounded-xl p-3 text-center shadow-sm" 
                  style={{ 
                    border: `1px solid ${((product.groupPurchaseDetails.currentQuantity || 0) / product.groupPurchaseDetails.minQuantity) >= 0.5 
                      ? 'rgba(8, 145, 178, 0.3)' 
                      : 'rgba(245, 158, 11, 0.2)'}` 
                  }}
                >
                  <div 
                    className="w-8 h-8 mx-auto mb-1.5 rounded-full flex items-center justify-center" 
                    style={{ 
                      background: ((product.groupPurchaseDetails.currentQuantity || 0) / product.groupPurchaseDetails.minQuantity) >= 0.5 
                        ? 'rgba(8, 145, 178, 0.15)' 
                        : 'rgba(245, 158, 11, 0.15)' 
                    }}
                  >
                    <svg 
                      className="w-4 h-4" 
                      style={{ color: ((product.groupPurchaseDetails.currentQuantity || 0) / product.groupPurchaseDetails.minQuantity) >= 0.5 ? '#0891b2' : '#f59e0b' }} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div 
                    className="text-2xl font-bold" 
                    style={{ color: ((product.groupPurchaseDetails.currentQuantity || 0) / product.groupPurchaseDetails.minQuantity) >= 0.5 ? '#1e3a8a' : '#d97706' }}
                  >
                    {product.groupPurchaseDetails.currentQuantity || 0}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">נרשמו</div>
                </div>

                {/* נותרו */}
                <div className="bg-white rounded-xl p-3 text-center shadow-sm" style={{ border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div className="w-8 h-8 mx-auto mb-1.5 rounded-full flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
                    <svg className="w-4 h-4" style={{ color: '#f59e0b' }} fill="currentColor" viewBox="0 0 20 24">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 11.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: '#d97706' }}>
                    {Math.max(0, product.groupPurchaseDetails.minQuantity - (product.groupPurchaseDetails.currentQuantity || 0))}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">נותרו</div>
                </div>

                {/* זמן נותר */}
                <div className="bg-white rounded-xl p-3 text-center shadow-sm" style={{ border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div className="w-8 h-8 mx-auto mb-1.5 rounded-full flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
                    <svg className="w-4 h-4" style={{ color: '#f59e0b' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: '#d97706' }}>
                    {groupTimeLeft && !groupTimeLeft.expired ? (groupTimeLeft.days || 0) : 0}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">ימים נותרו</div>
                </div>
              </div>
              
              {/* Progress Bar - גרדיאנט כתום-ירוק */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">התקדמות הקבוצה</span>
                  <span 
                    className="font-bold" 
                    style={{ 
                      color: ((product.groupPurchaseDetails.currentQuantity || 0) / product.groupPurchaseDetails.minQuantity) >= 0.5 
                        ? '#1e3a8a' 
                        : '#d97706' 
                    }}
                  >
                    {Math.round(((product.groupPurchaseDetails.currentQuantity || 0) / product.groupPurchaseDetails.minQuantity) * 100)}%
                  </span>
                </div>
                <div className="h-2.5 bg-white rounded-full overflow-hidden relative" dir="rtl">
                  {/* חלק כתום - עד 50% */}
                  <div
                    className="absolute top-0 right-0 h-full rounded-r-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(50, ((product.groupPurchaseDetails.currentQuantity || 0) / product.groupPurchaseDetails.minQuantity) * 100)}%`,
                      background: 'linear-gradient(270deg, #f59e0b 0%, #fbbf24 100%)'
                    }}
                  />
                  {/* חלק ירוק - מ-50% ומעלה */}
                  {((product.groupPurchaseDetails.currentQuantity || 0) / product.groupPurchaseDetails.minQuantity) > 0.5 && (
                    <div
                      className="absolute top-0 h-full rounded-l-full transition-all duration-500"
                      style={{ 
                        right: '50%',
                        width: `${Math.min(50, (((product.groupPurchaseDetails.currentQuantity || 0) / product.groupPurchaseDetails.minQuantity) - 0.5) * 100)}%`,
                        background: 'linear-gradient(270deg, #1e3a8a 0%, #0891b2 100%)'
                      }}
                    />
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{product.groupPurchaseDetails.currentQuantity || 0} נרשמו</span>
                  <span>יעד: {product.groupPurchaseDetails.minQuantity} משתתפים</span>
                </div>
              </div>

              
              {/* Info Grid - Delivery */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white rounded-lg p-2.5 text-center" style={{ border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div className="text-gray-500 text-xs mb-0.5">זמן אספקה משוער</div>
                  <div className="font-bold text-gray-800">
                    ~{product.groupPurchaseDetails.totalDays || (product.groupPurchaseDetails.closingDays || 0) + (product.groupPurchaseDetails.shippingDays || 0)} ימים
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2.5 text-center" style={{ border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div className="text-gray-500 text-xs mb-0.5">משלוח</div>
                  <div className="font-bold flex items-center justify-center gap-1" style={{ color: 'var(--secondary)' }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                    </svg>
                    חינם!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stock Status */}
          {product.stockCount > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#0891b2' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--secondary)' }}>במלאי</span>
            </div>
          )}

          {/* Action Buttons - Fixed Bottom Style */}
          <div className="bg-white border-t border-gray-200 pt-4 pb-2">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 font-medium">כמות</span>
              <div className="flex items-center bg-gray-100 rounded-full">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="w-11 h-11 flex items-center justify-center text-xl text-gray-700 hover:bg-gray-200 rounded-full transition"
                >
                  −
                </button>
                <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="w-11 h-11 flex items-center justify-center text-xl text-gray-700 hover:bg-gray-200 rounded-full transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex gap-3">
              {/* Add to Cart */}
              <button
                onClick={() => addItem(product, quantity)}
                className="flex-1 h-14 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                style={{
                  border: '2px solid transparent',
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, var(--primary), var(--secondary))',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                  color: '#1e3a8a',
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                הוסף לסל
              </button>
              
              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="flex-[2] h-14 rounded-xl font-bold text-white transition-all flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}
              >
                {product.purchaseType === 'group' ? 'הצטרף עכשיו' : 'קנה עכשיו'}
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-gray-50 mt-2">
          
          {/* Features Section */}
          {product.features && product.features.some(f => f) && (
            <div className="bg-white mb-2">
              <button
                onClick={() => setShowAllFeatures(!showAllFeatures)}
                className="w-full px-4 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">תכונות עיקריות</div>
                    <div className="text-xs text-gray-500">{product.features.filter(f => f).length} תכונות</div>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${showAllFeatures ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showAllFeatures && (
                <div className="px-4 pb-4">
                  <div 
                    className="rounded-xl overflow-hidden"
                    style={{
                      border: '1px solid transparent',
                      backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(8, 145, 178, 0.2))',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box',
                    }}
                  >
                    {product.features.filter(f => f).map((feature, i) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-3 px-4 py-3"
                        style={{ 
                          background: i % 2 === 0 ? 'rgba(30, 58, 138, 0.03)' : 'white',
                          borderBottom: i < product.features.filter(f => f).length - 1 ? '1px solid rgba(30, 58, 138, 0.08)' : 'none',
                        }}
                      >
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}
                        >
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#374151' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Specs Section */}
          {product.specs && (typeof product.specs === 'string' ? product.specs.trim() : Object.values(product.specs).some(v => v && v.trim())) && (
            <div className="bg-white mb-2">
              <button
                onClick={() => setShowSpecs(!showSpecs)}
                className="w-full px-4 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">מפרט טכני</div>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${showSpecs ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showSpecs && (
                <div className="px-4 pb-4">
                  <div 
                    className="rounded-xl p-4"
                    style={{
                      border: '1px solid transparent',
                      backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(8, 145, 178, 0.2))',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box',
                    }}
                  >
                    {typeof product.specs === 'string' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#374151' }}>
                        {product.specs}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(product.specs).filter(([_, value]) => value && value.trim()).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm" style={{ color: '#374151' }}>
                            <span className="font-medium">{key.replace('spec', 'מפרט ')}</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Suitable For Section */}
          {product.suitableFor && (
            <div className="bg-white mb-2">
              <button
                onClick={() => setShowSuitableFor(!showSuitableFor)}
                className="w-full px-4 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">למי זה מתאים?</div>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${showSuitableFor ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showSuitableFor && (
                <div className="px-4 pb-4">
                  <div 
                    className="rounded-xl p-4"
                    style={{
                      border: '1px solid transparent',
                      backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(8, 145, 178, 0.2))',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box',
                    }}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#374151' }}>
                      {product.suitableFor}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Why Choose Us Section */}
          {product.whyChooseUs && (
            <div className="bg-white mb-2">
              <button
                onClick={() => setShowWhyChooseUs(!showWhyChooseUs)}
                className="w-full px-4 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">למה לבחור בנו?</div>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${showWhyChooseUs ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showWhyChooseUs && (
                <div className="px-4 pb-4">
                  <div 
                    className="rounded-xl p-4"
                    style={{
                      border: '1px solid transparent',
                      backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(8, 145, 178, 0.2))',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box',
                    }}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#374151' }}>
                      {product.whyChooseUs}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Warranty Section */}
          {product.warranty && (
            <div className="bg-white mb-2">
              <button
                onClick={() => setShowWarranty(!showWarranty)}
                className="w-full px-4 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">אחריות</div>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${showWarranty ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showWarranty && (
                <div className="px-4 pb-4">
                  <div 
                    className="rounded-xl p-4"
                    style={{
                      border: '1px solid transparent',
                      backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(8, 145, 178, 0.2))',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box',
                    }}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#374151' }}>
                      {product.warranty}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Custom Fields Sections */}
          {product.customFields && product.customFields.length > 0 && product.customFields.map((field, index) => (
            field.title && field.content && (
              <div key={index} className="bg-white mb-2">
                <button
                  onClick={() => {
                    const newState = { ...customFieldsOpen };
                    newState[index] = !newState[index];
                    setCustomFieldsOpen(newState);
                  }}
                  className="w-full px-4 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)' }}
                    >
                      <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{field.title}</div>
                    </div>
                  </div>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${customFieldsOpen[index] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {customFieldsOpen[index] && (
                  <div className="px-4 pb-4">
                    <div 
                      className="rounded-xl p-4"
                      style={{
                        border: '1px solid transparent',
                        backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(8, 145, 178, 0.2))',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                      }}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#374151' }}>
                        {field.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          ))}

          {/* Description Section */}
          {product.fullDescription && (
            <div className="bg-white mb-2">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="w-full px-4 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">תיאור המוצר</div>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${showDescription ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showDescription && (
                <div className="px-4 pb-4">
                  <div 
                    className="rounded-xl p-4"
                    style={{
                      border: '1px solid transparent',
                      backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(8, 145, 178, 0.2))',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box',
                    }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                      {product.fullDescription}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Live Notification - Social Proof */}
      {product.purchaseType === 'group' && liveNotification && (
        <div 
          className="fixed bottom-24 right-4 z-50 animate-slide-in-right"
          style={{
            animation: 'slideInRight 0.5s ease-out',
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl p-3 flex items-center gap-3 max-w-[280px]"
            style={{ border: '1px solid rgba(245, 158, 11, 0.3)' }}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}
            >
              {liveNotification.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {liveNotification.name} מ{liveNotification.city}
              </p>
              <p className="text-xs text-gray-500">
                הצטרף/ה לפני {liveNotification.minutes} דקות
              </p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Viewers Count - Social Proof */}
      {product.purchaseType === 'group' && viewersCount > 0 && (
        <div className="fixed bottom-24 left-4 z-50">
          <div 
            className="bg-white/95 backdrop-blur rounded-full shadow-lg px-3 py-2 flex items-center gap-2"
            style={{ border: '1px solid rgba(245, 158, 11, 0.2)' }}
          >
            <div className="flex -space-x-1.5">
              {[...Array(Math.min(3, viewersCount))].map((_, i) => (
                <div 
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ 
                    background: `linear-gradient(135deg, ${['#f59e0b', '#f59e0b', '#fbbf24'][i]} 0%, ${['#fbbf24', '#fbbf24', '#fcd34d'][i]} 100%)`,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-gray-700">{viewersCount} צופים עכשיו</span>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      {product.purchaseType === 'group' && showStickyBar && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl"
          style={{ 
            borderColor: 'rgba(245, 158, 11, 0.3)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
          }}
        >
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Price & Timer */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold" style={{ color: '#d97706' }}>
                    ₪{(product.salePrice || product.price || 0).toLocaleString()}
                  </span>
                  {product.salePrice && product.price > product.salePrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₪{product.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {groupTimeLeft && !groupTimeLeft.expired && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: '#dc2626' }}>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>נותרו {groupTimeLeft.days}:{String(groupTimeLeft.hours).padStart(2,'0')}:{String(groupTimeLeft.minutes).padStart(2,'0')}</span>
                  </div>
                )}
              </div>
              
              {/* CTA Button */}
              <button
                onClick={handleBuyNow}
                className="px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center gap-2"
                style={{ 
                  background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                הצטרף עכשיו
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-lg mx-auto px-4 py-3 border-t border-gray-100">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--primary)' }}>
            מוצרים נוספים שיעניינו אותך
          </h2>
          
          {/* Horizontal Scroll Container */}
          <div ref={relatedScrollRef} className="overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth">
            <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct._id}
                  href={`/products/${relProduct._id}`}
                  className="flex-shrink-0 w-36 bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={relProduct.image || relProduct.imageUrl || 'https://placehold.co/200x200/f3f4f6/9ca3af?text=%F0%9F%93%A6'}
                      alt={relProduct.name}
                      fill
                      sizes="144px"
                      className="object-contain p-2"
                      unoptimized
                    />
                    {/* Type Badge */}
                    {relProduct.purchaseType === 'group' && (
                      <div 
                        className="absolute top-1 right-1 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full"
                        style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}
                      >
                        קבוצתי
                      </div>
                    )}
                    {/* Discount Badge */}
                    {relProduct.originalPrice && relProduct.originalPrice > relProduct.price && (
                      <div 
                        className="absolute top-1 left-1 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full"
                        style={{ background: '#dc2626' }}
                      >
                        {Math.round(((relProduct.originalPrice - relProduct.price) / relProduct.originalPrice) * 100)}%-
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-2">
                    <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight mb-1" style={{ minHeight: '2.5em' }}>
                      {relProduct.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span 
                        className="text-sm font-bold"
                        style={{ color: relProduct.purchaseType === 'group' ? '#d97706' : 'var(--primary)' }}
                      >
                        ₪{(relProduct.price || 0).toLocaleString()}
                      </span>
                      {relProduct.originalPrice && relProduct.originalPrice > relProduct.price && (
                        <span className="text-[10px] text-gray-400 line-through">
                          ₪{relProduct.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* View All Button */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 mt-4 py-3 rounded-xl font-medium text-sm transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)',
              color: 'var(--primary)',
              border: '1px solid rgba(30, 58, 138, 0.1)',
            }}
          >
            צפה בכל המוצרים
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
      )}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

    </div>
  );
}
