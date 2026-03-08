import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Vavuniya Boxing Association", template: "%s | VBA" },
  description: "Official website of the Vavuniya Boxing Association — Northern Province, Sri Lanka. District boxing news, events, rankings and athlete information.",
  keywords: ["boxing", "vavuniya", "sri lanka", "VBA", "BASL", "northern province", "boxing association"],
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "VBA" },
  openGraph: {
    type: "website",
    locale: "en_LK",
    siteName: "Vavuniya Boxing Association",
    title: "Vavuniya Boxing Association",
    description: "Official website of the Vavuniya Boxing Association — Northern Province, Sri Lanka.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0B2545",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
