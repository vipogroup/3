import "./globals.css";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { CartProvider } from "@/app/context/CartContext";
import UserHeader from "@/app/components/UserHeader";
import ReferralTracker from "@/app/components/ReferralTracker";
import CartToast from "@/app/components/CartToast";

export const metadata = {
  title: "VIPO - חנות מוצרי גיימינג ואלקטרוניקה",
  description: "מוצרי גיימינג איכותיים במחירים משתלמים - משלוח מהיר לכל הארץ",
  manifest: "/manifest.webmanifest",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  themeColor: "#8b5cf6",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          dangerouslySetInnerHTML={{
            __html: "if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js'); }",
          }}
        />
      </head>
      <body>
        <CartProvider>
          <ThemeProvider>
            <ReferralTracker />
            <UserHeader />
            <div className="container py-4">
              {children}
              <footer className="mt-12 py-8 text-center text-sm text-gray-500">© VIPO</footer>
            </div>
            <CartToast />
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
