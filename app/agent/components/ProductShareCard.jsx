'use client';

import { useState } from 'react';
import Image from 'next/image';
import ShareModal from './ShareModal';

export default function ProductShareCard({ product, couponCode, referralLink }) {
  const [showShareModal, setShowShareModal] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <div
        className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
        style={{
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image || product.imageUrl || 'https://placehold.co/300x300?text=VIPO'}
            alt={product.name || 'מוצר'}
            fill
            className="object-cover"
            unoptimized
          />

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div
              className="absolute top-2 right-2 text-white px-2 py-1 rounded-lg text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              -{discountPercent}%
            </div>
          )}

          {/* Commission Badge */}
          {product.commission && (
            <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
              ₪{product.commission} עמלה
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 h-10">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span 
              className="text-lg font-bold"
              style={{ color: '#1e3a8a' }}
            >
              ₪{product.price?.toLocaleString('he-IL')}
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through text-gray-400">
                ₪{product.originalPrice?.toLocaleString('he-IL')}
              </span>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            שתף מוצר
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={product}
        couponCode={couponCode}
        referralLink={referralLink}
      />
    </>
  );
}
