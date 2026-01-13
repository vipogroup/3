'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Check, User, LogIn, Plus, Phone, Mail, MapPin, Users, Package, ChevronLeft, X, Share2, ShoppingCart } from 'lucide-react';
import { useCartContext } from '@/app/context/CartContext';

// Helper function to check if product is group purchase
function isGroupPurchase(product) {
  return product?.purchaseType === 'group' || product?.groupPurchaseDetails?.endDate;
}

// GroupBadge Component
function GroupBadge() {
  return (
    <span
      className="absolute right-2 bottom-2 text-xs font-semibold px-2 py-1 rounded-md shadow"
      style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        color: 'white',
      }}
    >
      קבוצתית
    </span>
  );
}

// GroupTimer Component
function GroupTimer({ product, primaryColor, secondaryColor }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = product.groupPurchaseDetails?.endDate;
      if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const diff = end - now;
      
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [product]);

  return (
    <div className="flex items-center justify-center gap-1">
      <div className="flex items-center gap-0.5">
        <div className="flex flex-col items-center">
          <span 
            className="text-sm font-bold text-white px-1.5 py-0.5 rounded"
            style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
          >
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-gray-500">שניות</span>
        </div>
        <span className="text-gray-400 font-bold">:</span>
        <div className="flex flex-col items-center">
          <span 
            className="text-sm font-bold text-white px-1.5 py-0.5 rounded"
            style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
          >
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-gray-500">דקות</span>
        </div>
        <span className="text-gray-400 font-bold">:</span>
        <div className="flex flex-col items-center">
          <span 
            className="text-sm font-bold text-white px-1.5 py-0.5 rounded"
            style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
          >
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-gray-500">שעות</span>
        </div>
        <span className="text-gray-400 font-bold">:</span>
        <div className="flex flex-col items-center">
          <span 
            className="text-sm font-bold text-white px-1.5 py-0.5 rounded"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}
          >
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-gray-500">ימים</span>
        </div>
      </div>
    </div>
  );
}

export default function TenantStorePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params?.slug;
  const typeFilter = searchParams?.get('type'); // 'available' or 'group'
  
  const [tenant, setTenant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [addedToCart, setAddedToCart] = useState({});
  const [user, setUser] = useState(null);
  const [showMarquee, setShowMarquee] = useState(true);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [videoProduct, setVideoProduct] = useState(null);
  
  // Use global cart context
  const { addItem: addToGlobalCart } = useCartContext();

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        }
      } catch (e) {
        // Not logged in
      }
    };
    checkUser();
  }, []);

  const loadData = useCallback(async () => {
    if (!slug) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Load tenant info
      const tenantRes = await fetch(`/api/tenants/by-slug/${slug}`, { credentials: 'include' });
      if (!tenantRes.ok) {
        throw new Error('העסק לא נמצא');
      }
      const tenantData = await tenantRes.json();
      setTenant(tenantData.tenant);
      
      // Load products for this tenant
      const productsRes = await fetch(`/api/products?tenant=${slug}`, { credentials: 'include' });
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    // Filter by purchase type from URL parameter
    let matchesType = true;
    if (typeFilter === 'available') {
      matchesType = product.purchaseType !== 'group';
    } else if (typeFilter === 'group') {
      matchesType = product.purchaseType === 'group';
    }
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Add to global cart
  const addToCart = (product) => {
    addToGlobalCart(product, 1);
    setAddedToCart(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAddedToCart(prev => ({ ...prev, [product._id]: false })), 1500);
  };

  // Upgrade to agent
  async function handleUpgradeToAgent() {
    try {
      setUpgrading(true);
      const res = await fetch('/api/users/upgrade-to-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        alert('ברכות! הפכת לסוכן בהצלחה!');
        window.location.href = '/agent';
      } else {
        const data = await res.json();
        alert('שגיאה: ' + (data.error || 'לא ניתן לשדרג לסוכן'));
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('שגיאה בשדרוג לסוכן');
    } finally {
      setUpgrading(false);
      setShowAgentModal(false);
    }
  }

  // Page title based on filter
  const pageTitle = typeFilter === 'available' ? 'מוצרים זמינים עכשיו' : typeFilter === 'group' ? 'רכישה קבוצתית' : 'כל המוצרים';

  // Get branding colors
  const primaryColor = tenant?.branding?.primaryColor || '#1e3a8a';
  const secondaryColor = tenant?.branding?.secondaryColor || '#0891b2';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full" style={{ borderColor: primaryColor, borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">שגיאה</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="px-6 py-3 text-white rounded-lg" style={{ background: primaryColor }}>
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  const gradientPrimary = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
  const gradientReverse = `linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor} 100%)`;

  return (
    <div 
      className="min-h-screen" 
      dir="rtl"
      style={{
        background: typeFilter === 'group'
          ? 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)'
          : 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
      }}
    >
      {/* Marquee Banner - For customers and guests */}
      {showMarquee && (!user || user?.role === 'customer') && (
        <div
          className="relative overflow-hidden py-3 cursor-pointer"
          style={{ background: gradientPrimary }}
          onClick={() => setShowAgentModal(true)}
        >
          <div className="marquee-container">
            <div className="marquee-content">
              <div className="flex items-center gap-4 whitespace-nowrap">
                <span className="text-white font-bold text-lg">רוצים להרוויח כסף?</span>
                <span className="text-white font-semibold text-lg">הפכו לסוכן וקבלו 10% עמלה על כל מכירה!</span>
                <span className="bg-white px-4 py-1 rounded-full font-bold text-sm" style={{ color: primaryColor }}>לחצו כאן להצטרפות</span>
              </div>
            </div>
            <div className="marquee-content" aria-hidden="true">
              <div className="flex items-center gap-4 whitespace-nowrap">
                <span className="text-white font-bold text-lg">רוצים להרוויח כסף?</span>
                <span className="text-white font-semibold text-lg">הפכו לסוכן וקבלו 10% עמלה על כל מכירה!</span>
                <span className="bg-white px-4 py-1 rounded-full font-bold text-sm" style={{ color: primaryColor }}>לחצו כאן להצטרפות</span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setShowMarquee(false); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            aria-label="סגור"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <style jsx>{`
        .marquee-container {
          display: flex;
          animation: marquee 10s linear infinite;
        }
        .marquee-content {
          display: flex;
          flex-shrink: 0;
          min-width: 100%;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .marquee-container:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tenant?.branding?.logo ? (
                <Image src={tenant.branding.logo} alt="לוגו" width={48} height={48} className="rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}>
                  <span className="text-xl font-bold text-white">{tenant?.name?.charAt(0)}</span>
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-gray-900">{tenant?.name}</h1>
                {tenant?.contact?.phone && (
                  <a href={`tel:${tenant.contact.phone}`} className="text-sm text-gray-500 hover:text-gray-700">
                    {tenant.contact.phone}
                  </a>
                )}
              </div>
            </div>
            
            {/* Login/Register & Cart Buttons */}
            <div className="flex items-center gap-2">
              {!user && (
                <>
                  <Link
                    href={`/register?tenant=${slug}`}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">הרשמה</span>
                  </Link>
                  <Link
                    href={`/login?tenant=${slug}`}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 transition-all"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">התחברות</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div 
        className="py-8 px-4 text-white text-center"
        style={{ background: gradientPrimary }}
      >
        <h2 className="text-2xl font-bold mb-2">ברוכים הבאים ל{tenant?.name}</h2>
        <p className="text-white/80">גלו את המוצרים שלנו</p>
      </div>

      {/* Type Filter Header */}
      {typeFilter && (
        <div 
          className="border-b"
          style={{ 
            background: typeFilter === 'group' 
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%)'
              : `linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link 
                href={`/t/${slug}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:opacity-80 no-underline"
                style={{
                  textDecoration: 'none',
                  border: `1.5px solid ${typeFilter === 'group' ? '#d97706' : primaryColor}`,
                  color: typeFilter === 'group' ? '#92400e' : primaryColor,
                  background: typeFilter === 'group' ? '#fef3c7' : '#dbeafe',
                }}
              >
                <ChevronLeft className="w-4 h-4" style={{ transform: 'rotate(180deg)' }} />
                <span className="text-sm font-medium">חזרה לחנות</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex flex-col">
                <h1 
                  className="text-xl font-bold flex items-center gap-2"
                  style={{ color: typeFilter === 'group' ? '#f59e0b' : primaryColor }}
                >
                  {typeFilter === 'group' && <Users className="w-5 h-5" />}
                  {typeFilter === 'available' && <Package className="w-5 h-5" />}
                  {pageTitle}
                </h1>
                {typeFilter === 'group' && (
                  <button
                    onClick={() => setShowGroupInfoModal(true)}
                    className="text-xs underline hover:no-underline transition-all text-right"
                    style={{ color: '#92400e' }}
                  >
                    מה זה רכישה קבוצתית?
                  </button>
                )}
              </div>
              
              {/* Switch Button */}
              <div className="mr-auto">
                <Link
                  href={typeFilter === 'group' ? `/t/${slug}?type=available` : `/t/${slug}?type=group`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:opacity-80 no-underline"
                  style={{
                    textDecoration: 'none',
                    border: `1.5px solid ${typeFilter === 'group' ? primaryColor : '#d97706'}`,
                    color: typeFilter === 'group' ? primaryColor : '#92400e',
                    background: typeFilter === 'group' ? '#dbeafe' : '#fef3c7',
                  }}
                >
                  <span className="text-sm font-medium">{typeFilter === 'group' ? 'זמינים עכשיו' : 'רכישה קבוצתית'}</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="חפש מוצרים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': secondaryColor }}
            />
          </div>
          
          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2"
            >
              <option value="">כל הקטגוריות</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategory ? 'לא נמצאו מוצרים' : 'אין מוצרים עדיין'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory ? 'נסה לחפש משהו אחר' : 'העסק עדיין לא הוסיף מוצרים'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const discountPercent = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;
              const isGroup = isGroupPurchase(product);
              
              return (
                <div 
                  key={product._id} 
                  className="bg-white rounded-xl overflow-hidden group h-full flex flex-col transition-all duration-300"
                  style={{
                    border: '2px solid transparent',
                    backgroundImage: `linear-gradient(white, white), linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    boxShadow: '0 4px 15px rgba(8, 145, 178, 0.15)',
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
                  <Link href={`/products/${product._id}`} className="block relative">
                    <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-t-xl">
                      {product.image || product.imageUrl ? (
                        <Image 
                          src={product.image || product.imageUrl} 
                          alt={product.name}
                          fill
                          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {/* Discount Badge */}
                      {discountPercent > 0 && (
                        <div
                          className="absolute top-2 right-2 text-white px-2 py-1 rounded-md text-xs font-bold"
                          style={{ background: gradientPrimary }}
                        >
                          -{discountPercent}%
                        </div>
                      )}
                      {/* Group Badge */}
                      {isGroup && <GroupBadge />}
                    </div>
                  </Link>
                  <div className="p-3 flex-1 flex flex-col">
                    <Link href={`/products/${product._id}`}>
                      <h3 className="text-base font-medium mb-2 line-clamp-2 hover:text-cyan-600 leading-snug" style={{ color: '#374151' }}>
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Price */}
                    <div className="mb-3">
                      {product.originalPrice ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span 
                            className="text-2xl font-black"
                            style={{ 
                              background: gradientPrimary,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            ₪{product.price?.toLocaleString('he-IL')}
                          </span>
                          <span className="text-sm line-through text-gray-400">
                            ₪{product.originalPrice?.toLocaleString('he-IL')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold" style={{ color: '#374151' }}>
                          ₪{product.price?.toLocaleString('he-IL')}
                        </span>
                      )}
                    </div>

                    {/* Group Purchase Card */}
                    {isGroup && (
                      <div 
                        className="mb-3 p-3 rounded-xl"
                        style={{
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                        }}
                      >
                        {/* Timer Title */}
                        <div className="flex items-center gap-1 mb-2">
                          <svg className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          <span className="text-xs font-bold" style={{ color: '#d97706' }}>מבצע נסגר בעוד:</span>
                        </div>
                        
                        {/* Timer */}
                        <GroupTimer product={product} primaryColor={primaryColor} secondaryColor={secondaryColor} />
                        
                        {/* Divider */}
                        <div className="h-px my-2" style={{ background: 'rgba(245, 158, 11, 0.3)' }} />
                        
                        {/* Progress */}
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
                          <span className="text-xs font-bold" style={{ color: '#d97706' }}>
                            {product.groupPurchaseDetails?.currentQuantity || 0}/{product.groupPurchaseDetails?.minQuantity || 10} נרשמו
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2.5 bg-white rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(100, ((product.groupPurchaseDetails?.currentQuantity || 0) / (product.groupPurchaseDetails?.minQuantity || 10)) * 100)}%`,
                                background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold" style={{ color: '#d97706' }}>
                            {Math.round(((product.groupPurchaseDetails?.currentQuantity || 0) / (product.groupPurchaseDetails?.minQuantity || 10)) * 100)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="mt-auto flex gap-2">
                      {/* Share Button - Only for agents */}
                      {(user?.role === 'agent' || user?.role === 'admin') && (
                        <button
                          type="button"
                          onClick={() => router.push(`/agent/share/${product._id}`)}
                          className="flex items-center justify-center p-2.5 rounded-lg transition-all duration-200 hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${secondaryColor} 0%, #06b6d4 100%)`,
                            boxShadow: '0 2px 8px rgba(8, 145, 178, 0.3)',
                          }}
                          aria-label="שתף מוצר"
                        >
                          <Share2 className="w-4 h-4 text-white" style={{ transform: 'rotate(-45deg)' }} />
                        </button>
                      )}
                      
                      {/* Add to Cart / Go to Cart */}
                      <div className="flex-1">
                        {!addedToCart?.[product._id] ? (
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold transition-all duration-300 text-white"
                            style={{
                              background: gradientPrimary,
                              boxShadow: '0 4px 15px rgba(8, 145, 178, 0.3)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = gradientReverse;
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = gradientPrimary;
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            הוסף לסל
                          </button>
                        ) : (
                          <Link
                            href="/cart"
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 text-white"
                            style={{ background: gradientPrimary }}
                          >
                            <Check className="w-4 h-4" />
                            מעבר לסל
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Contact Section */}
      {(tenant?.contact?.phone || tenant?.contact?.email || tenant?.contact?.address) && (
        <section className="py-8 px-4" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}>
          <div className="max-w-7xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4 text-center">צרו קשר</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {tenant.contact.phone && (
                <a href={`tel:${tenant.contact.phone}`} className="flex items-center gap-2 text-white/90 hover:text-white">
                  <Phone className="w-5 h-5" />
                  {tenant.contact.phone}
                </a>
              )}
              {tenant.contact.email && (
                <a href={`mailto:${tenant.contact.email}`} className="flex items-center gap-2 text-white/90 hover:text-white">
                  <Mail className="w-5 h-5" />
                  {tenant.contact.email}
                </a>
              )}
              {tenant.contact.address && (
                <span className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-5 h-5" />
                  {tenant.contact.address}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          {tenant?.name} © {new Date().getFullYear()} | מופעל על ידי VIPO
        </div>
      </footer>

      {/* Upgrade to Agent Modal */}
      {showAgentModal && (!user || user?.role === 'customer') && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="text-center mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: gradientPrimary }}
              >
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">הפוך לסוכן!</h3>
              <p className="text-gray-600">צור הכנסה פאסיבית על ידי שיתוף מוצרים</p>
            </div>

            <div
              className="rounded-xl p-6 mb-6"
              style={{
                background: `linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)`,
                border: '2px solid rgba(8, 145, 178, 0.3)',
              }}
            >
              <h4 className="font-bold mb-3 text-lg" style={{ color: primaryColor }}>מה תקבל כסוכן?</h4>
              <ul className="space-y-2" style={{ color: primaryColor }}>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <span><strong>עמלות של 10%</strong> על כל מכירה שתבצע</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <span><strong>קוד קופון ייחודי</strong> לשיתוף עם חברים</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <span><strong>דשבורד סוכן מתקדם</strong> עם סטטיסטיקות</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <span><strong>מעקב אחר הרווחים</strong> בזמן אמת</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold" style={{ color: secondaryColor }}>✓</span>
                  <span><strong>בונוסים ותגמולים</strong> למוכרים מצטיינים</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>שים לב:</strong>{' '}
                {!user ? 'תצטרך להירשם כדי להפוך לסוכן. ' : 'השדרוג הוא חד-פעמי ולא ניתן לבטל אותו. '}
                לאחר {!user ? 'ההרשמה' : 'השדרוג'} תקבל גישה לדשבורד הסוכנים ותוכל להתחיל להרוויח!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (!user) {
                    window.location.href = `/register?role=agent&tenant=${slug}`;
                  } else {
                    handleUpgradeToAgent();
                  }
                }}
                disabled={upgrading}
                className="flex-1 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: gradientPrimary }}
              >
                {upgrading ? 'משדרג...' : !user ? 'הירשם כסוכן עכשיו!' : 'כן, אני רוצה להפוך לסוכן!'}
              </button>
              <button
                onClick={() => setShowAgentModal(false)}
                disabled={upgrading}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-all disabled:opacity-50"
              >
                אולי מאוחר יותר
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Purchase Info Modal */}
      {showGroupInfoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold" style={{ color: '#d97706' }}>מה זה רכישה קבוצתית?</h3>
              <button
                onClick={() => setShowGroupInfoModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Intro */}
            <div className="mb-4 p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)', border: '1px solid rgba(217, 119, 6, 0.2)' }}>
              <p className="text-gray-700 leading-relaxed text-center">
                <strong style={{ color: '#92400e' }}>רכישה קבוצתית</strong> היא הדרך החכמה לקנות מוצרים איכותיים במחירים נמוכים משמעותית!
                <br />
                כשהרבה אנשים קונים יחד, אנחנו מזמינים כמויות גדולות ישירות מהמפעל - וכולם נהנים מהחיסכון.
              </p>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2" style={{ color: '#16a34a' }}>
                  <Check className="w-5 h-5" />
                  <span>עד 50% חיסכון</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#16a34a' }}>
                  <Check className="w-5 h-5" />
                  <span>ישירות מהמפעל</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#16a34a' }}>
                  <Check className="w-5 h-5" />
                  <span>ללא סיכון</span>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}>
                <Users className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xl font-bold" style={{ color: '#92400e' }}>איך זה עובד?</h4>
            </div>

            <div className="space-y-3">
              {[
                { title: 'בחירת מוצר', desc: 'בוחרים מוצרים במחיר מפעל מהמערכת שלנו - עד 50% יותר זול ממחיר השוק' },
                { title: 'הצטרפות לקבוצה', desc: 'מצטרפים לקבוצת הרכישה. בתום ה-30 יום ההזמנה עוברת למפעל לייצור' },
                { title: 'שיתוף', desc: 'משתפים את החברים ומשפחה כדי להגדיל את הקבוצה. הפכו לסוכן כדי לקבל 10% עמלה!' },
                { title: 'המחיר יורד', desc: 'ככל שיותר חברים מצטרפים, המחיר יורד לכולם' },
                { title: 'סגירת קבוצה', desc: 'בסיום ההרשמה מקבלים הודעה שמתחילים בייצור ועדכון על זמני הגעה' },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 rounded-xl" style={{ background: 'rgba(251, 191, 36, 0.08)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold" style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg" style={{ color: '#92400e' }}>{step.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowGroupInfoModal(false)}
              className="w-full mt-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}
            >
              הבנתי, בואו נתחיל!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
