import UserHeader from "@/app/components/UserHeader";

export const metadata = {
  title: "VIPO Sales Hub",
  description: "Agents + Products + Group Buy",
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
      <body>
        <UserHeader />
        <div className="container py-4">
          {children}
          <footer className="mt-12 py-8 text-center text-sm text-gray-500">© VIPO</footer>
        </div>
      </body>
    </html>
  );
}
