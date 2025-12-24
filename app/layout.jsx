import './globals.css';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { CartProvider } from '@/app/context/CartContext';
import UserHeader from '@/app/components/UserHeader';
import ReferralTracker from '@/app/components/ReferralTracker';
import CartToast from '@/app/components/CartToast';
import PwaInstaller from '@/app/components/PwaInstaller';
import InstallPrompt from '@/app/components/InstallPrompt';
import UpdateNotifier from '@/app/components/UpdateNotifier';
import PushNotificationModal from '@/app/components/PushNotificationModal';

export const metadata = {
  title: 'VIPO - רוכשים ביחד',
  description: 'מוצרים איכותיים במחירים משתלמים - משלוח מהיר לכל הארץ',
  manifest: '/manifest.webmanifest',
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
        <link rel="apple-touch-icon" href="/icons/192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VIPO" />
      </head>
      <body className="bg-gray-50">
        <CartProvider>
          <ThemeProvider>
            <PwaInstaller enabled={enableServiceWorker} />
            <ReferralTracker />
            <UserHeader />
            {children}
            <CartToast />
            <InstallPrompt />
            <UpdateNotifier />
            <PushNotificationModal />
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
