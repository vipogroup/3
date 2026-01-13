'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ShareProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId;

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Fetch product and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user
        const userRes = await fetch('/api/auth/me');
        if (!userRes.ok) {
          router.push('/login');
          return;
        }
        const userData = await userRes.json();
        if (userData.user?.role !== 'agent' && userData.user?.role !== 'admin') {
          router.push('/');
          return;
        }
        setUser(userData.user);

        // Fetch product
        const productRes = await fetch(`/api/products/${productId}`);
        if (productRes.ok) {
          const productData = await productRes.json();
          setProduct(productData.product || productData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, router]);

  const couponCode = user?.couponCode || '';

  const getProductShareUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/products/${product?._id}${couponCode ? `?ref=${couponCode}` : ''}`;
  };

  const buildShareText = () => {
    const lines = [
      `*${product?.name}*`,
      '',
      product?.description || '',
      '',
      `מחיר: ₪${product?.price}`,
    ];

    if (couponCode) {
      lines.push(`קוד קופון: ${couponCode}`);
    }

    const productUrl = getProductShareUrl();
    if (productUrl) {
      lines.push('', `לרכישה: ${productUrl}`);
    }

    lines.push('', 'השתמשו בקוד הקופון בקופה לקבלת ההטבה!');

    return lines.filter(Boolean).join('\n');
  };

  const shareToWhatsApp = () => {
    const text = buildShareText();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToFacebook = () => {
    const shareUrl = getProductShareUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const text = `${product?.name} - ₪${product?.price}`;
    const shareUrl = getProductShareUrl();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareToTelegram = () => {
    const text = buildShareText();
    const shareUrl = getProductShareUrl();
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
  };

  const shareViaEmail = () => {
    const text = buildShareText();
    const subject = `בדוק את ${product?.name}`;
    const body = `שלום,\n\n${text}\n\nבברכה`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyLink = async () => {
    try {
      const url = getProductShareUrl();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        prompt('העתק את הקישור:', url);
      }
    } catch (err) {
      prompt('העתק את הקישור:', getProductShareUrl());
    }
  };

  const copyShareText = async () => {
    try {
      const text = buildShareText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000);
      } else {
        prompt('העתק את הטקסט:', text);
      }
    } catch (err) {
      prompt('העתק את הטקסט:', buildShareText());
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8f9fa' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#0891b2' }}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: '#f8f9fa' }}>
        <h1 className="text-xl font-bold text-gray-800 mb-4">המוצר לא נמצא</h1>
        <Link 
          href="/agent"
          className="px-6 py-3 rounded-xl text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
        >
          חזור לדשבורד
        </Link>
      </div>
    );
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen pb-8" style={{ background: '#f8f9fa' }}>
      {/* Header */}
      <div 
        className="px-4 py-6"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">שיתוף מוצר</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4">
        {/* Product Card */}
        <div 
          className="bg-white rounded-2xl overflow-hidden mb-6"
          style={{ 
            boxShadow: '0 4px 20px rgba(8, 145, 178, 0.15)',
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          <div className="flex flex-col sm:flex-row">
            {/* Product Image */}
            <div className="relative w-full sm:w-48 h-48 flex-shrink-0">
              <Image
                src={product.image || product.imageUrl || 'https://placehold.co/300x300?text=VIPO'}
                alt={product.name || 'מוצר'}
                fill
                className="object-cover"
                unoptimized
              />
              {discountPercent > 0 && (
                <div 
                  className="absolute top-2 right-2 text-white px-2 py-1 rounded-lg text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                >
                  -{discountPercent}%
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 flex-1">
              <h2 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center gap-3 mb-3">
                <span 
                  className="text-2xl font-black"
                  style={{ 
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ₪{product.price?.toLocaleString('he-IL')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm line-through text-gray-400">
                    ₪{product.originalPrice?.toLocaleString('he-IL')}
                  </span>
                )}
              </div>

              {product.commission && (
                <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  עמלה: ₪{product.commission}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coupon Code Section */}
        {couponCode && (
          <div 
            className="bg-white rounded-2xl p-4 mb-6"
            style={{ 
              boxShadow: '0 4px 20px rgba(8, 145, 178, 0.1)',
              border: '2px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">קוד הקופון שלך:</p>
                <p className="text-xl font-bold" style={{ color: '#1e3a8a' }}>{couponCode}</p>
              </div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)' }}
              >
                <svg className="w-6 h-6" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Share Options */}
        <div 
          className="bg-white rounded-2xl p-5 mb-6"
          style={{ boxShadow: '0 4px 20px rgba(8, 145, 178, 0.1)' }}
        >
          <h3 className="font-bold text-gray-900 mb-4 text-center">שתף לרשתות חברתיות</h3>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {/* WhatsApp */}
            <button
              onClick={shareToWhatsApp}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
            >
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              onClick={shareToFacebook}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
            >
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Facebook</span>
            </button>

            {/* Telegram */}
            <button
              onClick={shareToTelegram}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
            >
              <div className="w-14 h-14 rounded-full bg-sky-500 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Telegram</span>
            </button>

            {/* Twitter/X */}
            <button
              onClick={shareToTwitter}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
            >
              <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">X</span>
            </button>

            {/* Email */}
            <button
              onClick={shareViaEmail}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">אימייל</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={copyLink}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${copied ? 'bg-green-500' : 'bg-gray-300'}`}>
                {copied ? (
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-medium text-gray-700">{copied ? 'הועתק!' : 'העתק לינק'}</span>
            </button>
          </div>
        </div>

        {/* Copy Full Text */}
        <div 
          className="bg-white rounded-2xl p-5 mb-6"
          style={{ boxShadow: '0 4px 20px rgba(8, 145, 178, 0.1)' }}
        >
          <h3 className="font-bold text-gray-900 mb-3">טקסט מוכן לשיתוף</h3>
          <div 
            className="p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap mb-4"
            style={{ background: '#f8f9fa', fontFamily: 'monospace' }}
          >
            {buildShareText()}
          </div>
          <button
            onClick={copyShareText}
            className="w-full py-3 rounded-xl text-white font-medium transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            {copiedText ? '✓ הטקסט הועתק!' : 'העתק טקסט מלא'}
          </button>
        </div>

        {/* Share Link Preview */}
        <div 
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 4px 20px rgba(8, 145, 178, 0.1)' }}
        >
          <h3 className="font-bold text-gray-900 mb-3">קישור לשיתוף</h3>
          <div 
            className="p-3 rounded-xl text-sm break-all"
            style={{ background: '#f8f9fa', color: '#0891b2' }}
          >
            {getProductShareUrl()}
          </div>
        </div>
      </div>
    </div>
  );
}
