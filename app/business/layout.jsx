'use client';

import { Suspense } from 'react';
import { BusinessProvider, BusinessLoading } from './BusinessContext';

/**
 * Business Dashboard Layout
 * 
 * CRITICAL: This layout wraps ALL /business pages with BusinessProvider
 * This ensures that:
 * 1. All pages have access to tenant context
 * 2. All pages use consistent error handling
 * 3. NO redirects to /admin or other dashboards happen
 */
export default function BusinessLayout({ children }) {
  return (
    <Suspense fallback={<BusinessLoading />}>
      <BusinessProvider>
        {children}
      </BusinessProvider>
    </Suspense>
  );
}
