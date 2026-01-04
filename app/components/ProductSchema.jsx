'use client';

import Script from 'next/script';

export default function ProductSchema({ product }) {
  if (!product) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name || '',
    description: product.description || product.name || '',
    image: product.image || product.images?.[0] || '',
    sku: product.sku || product._id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'VIPO',
    },
    offers: {
      '@type': 'Offer',
      url: typeof window !== 'undefined' ? window.location.href : '',
      priceCurrency: 'ILS',
      price: product.price || 0,
      availability: product.stock > 0 || product.inStock !== false
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'VIPO',
      },
    },
  };

  // Add original price if on sale
  if (product.originalPrice && product.originalPrice > product.price) {
    schema.offers.priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }

  // Add rating if available
  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Organization schema for homepage
export function OrganizationSchema({ settings = {} }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.siteName || 'VIPO',
    description: settings.siteDescription || settings.metaDescription || '',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://vipo.co.il',
    logo: settings.logoUrl || '',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.phone || '',
      email: settings.email || '',
      contactType: 'customer service',
      availableLanguage: ['Hebrew', 'English'],
    },
    sameAs: [
      settings.facebook,
      settings.instagram,
      settings.twitter,
      settings.linkedin,
    ].filter(Boolean),
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb schema
export function BreadcrumbSchema({ items = [] }) {
  if (!items.length) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
