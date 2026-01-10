'use client';

import dynamic from 'next/dynamic';

// Dynamically import GlobalFooter with no SSR to completely avoid hydration issues
const GlobalFooter = dynamic(() => import('./GlobalFooter'), {
  ssr: false,
  loading: () => null
});

export default function GlobalFooterWrapper() {
  return <GlobalFooter />;
}
