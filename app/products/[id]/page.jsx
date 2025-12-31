'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
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
                'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)';
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
        <div className="sticky top-0 z-40" style={{ background: 'linear-gradient(90deg, #dc2626 0%, #ea580c 50%, #f97316 100%)' }}>
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
                src={selectedMedia.src || 'https://placehold.co/400x300?text=VIPO'}
                alt={product?.name || 'תמונה של מוצר'}
                fill
                sizes="100vw"
                className="object-contain"
                unoptimized
                priority
              />
            )}
            
            {/* Discount Badge */}
            {hasDiscount && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
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
          <h1 className="text-xl font-bold text-gray-900 leading-snug mb-2">
            {product.name}
          </h1>
          

          {/* Price Section */}
          <div className="flex items-end gap-3 mb-4">
            <span 
              className="text-3xl font-bold"
              style={{ 
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
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
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                  </div>
                  <span className="font-bold text-gray-800">רכישה קבוצתית</span>
                </div>
                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-bold">
                  {Math.max(0, product.groupPurchaseDetails.minQuantity - (product.groupPurchaseDetails.currentQuantity || 0))} מקומות נותרו
                </span>
              </div>
              
              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">התקדמות הקבוצה</span>
                  <span className="font-bold text-orange-600">
                    {product.groupPurchaseDetails.currentQuantity || 0} / {product.groupPurchaseDetails.minQuantity}
                  </span>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, ((product.groupPurchaseDetails.currentQuantity || 0) / product.groupPurchaseDetails.minQuantity) * 100)}%`,
                      background: 'linear-gradient(90deg, #f97316, #ea580c)'
                    }}
                  />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-lg p-2.5 text-center">
                  <div className="text-gray-500 text-xs mb-0.5">זמן אספקה</div>
                  <div className="font-bold text-gray-800">
                    ~{product.groupPurchaseDetails.totalDays || (product.groupPurchaseDetails.closingDays || 0) + (product.groupPurchaseDetails.shippingDays || 0)} ימים
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2.5 text-center">
                  <div className="text-gray-500 text-xs mb-0.5">משלוח</div>
                  <div className="font-bold text-green-600">חינם</div>
                </div>
              </div>
            </div>
          )}

          {/* Stock Status */}
          {product.stockCount > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-600">במלאי</span>
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
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
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
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                קנה עכשיו
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
                    <svg className="w-5 h-5" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
                          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
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
                    <svg className="w-5 h-5" style={{ color: '#1e3a8a' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
                    <svg className="w-5 h-5" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
                    <svg className="w-5 h-5" style={{ color: '#1e3a8a' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
                    <svg className="w-5 h-5" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
                    <svg className="w-5 h-5" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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

          {/* Back Link */}
          <div className="bg-white px-4 py-4">
            <Link href="/products" className="inline-flex items-center gap-2 font-medium text-sm" style={{ color: '#0891b2' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              חזרה לכל המוצרים
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
