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
      <body className="bg-gray-50">
        <CartProvider>
          <ThemeProvider>
            <ReferralTracker />
            <UserHeader />
            {children}
            <CartToast />
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
