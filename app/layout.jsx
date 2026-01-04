import './globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { CartProvider } from '@/app/context/CartContext';
import UserHeader from '@/app/components/UserHeader';
import ReferralTracker from '@/app/components/ReferralTracker';
import CartToast from '@/app/components/CartToast';
import PwaInstaller from '@/app/components/PwaInstaller';
import InstallPrompt from '@/app/components/InstallPrompt';
import UpdateNotifier from '@/app/components/UpdateNotifier';
import PushNotificationModal from '@/app/components/PushNotificationModal';
import GlobalFooter from '@/app/components/GlobalFooter';
import CookieConsent from '@/components/CookieConsent';
import LoadingScreen from '@/app/components/LoadingScreen';
import GoogleAnalytics from '@/app/components/GoogleAnalytics';

export const metadata = {
  title: 'Vipo - ביחד ננצח',
  description: 'נלחמים ביוקר המחיה ורוכשים ביחד',
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Vipo - ביחד ננצח',
    description: 'נלחמים ביוקר המחיה ורוכשים ביחד',
    url: 'https://vipo-group.com',
    siteName: 'Vipo',
    locale: 'he_IL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vipo - ביחד ננצח',
    description: 'נלחמים ביוקר המחיה ורוכשים ביחד',
  },
};

export default function RootLayout({ children }) {
  // Enable service worker in all environments for push notifications
  const enableServiceWorker = true;

  return (
    <html lang="he" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* Apple/iOS specific icons and settings */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/192.png" />
        <link rel="icon" type="image/svg+xml" href="/icons/vipo-icon.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VIPO" />
        {/* Preload critical CSS to prevent layout shifts */}
        <link rel="preload" href="/home/css/style.css" as="style" />
        <link rel="stylesheet" href="/home/css/style.css" />
        <link rel="stylesheet" href="/home/css/responsive.css" />
        <link rel="stylesheet" href="/home/css/accessibility.css" />
        {/* Google Fonts - Rubik & Assistant */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&family=Rubik:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50">
        <GoogleAnalytics />
        <LoadingScreen />
        <CartProvider>
          <ThemeProvider>
            <PwaInstaller enabled={enableServiceWorker} />
            <ReferralTracker />
            <UserHeader />
            {children}
            <GlobalFooter />
            <CartToast />
            <InstallPrompt />
            <UpdateNotifier />
            <PushNotificationModal />
            <CookieConsent />
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
