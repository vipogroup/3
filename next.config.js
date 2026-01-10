require('dotenv').config({ path: '.env.local' });

/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  
  // Disable Suspense boundary requirement for useSearchParams (fixes Vercel build)
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },

  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
    };
    return config;
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Compression
  compress: true,

  // Security Headers - Stage 15.9
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // XSS Protection (legacy browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Force HTTPS (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline/eval
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Tailwind requires unsafe-inline + Google Fonts
              "img-src 'self' data: https://res.cloudinary.com https://images.unsplash.com https://m.media-amazon.com https://placehold.co https://raw.githubusercontent.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://api.cloudinary.com https://res.cloudinary.com https://fonts.googleapis.com https://fonts.gstatic.com",
              "frame-src 'self' http://localhost:3002 https://vipogroup.github.io https://vipogroup.github.io/",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ].filter(Boolean),
      },
    ];
  },

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    compiler: {
      removeConsole: {
        exclude: ['error', 'warn'],
      },
    },
  }),
};

module.exports = nextConfig;
