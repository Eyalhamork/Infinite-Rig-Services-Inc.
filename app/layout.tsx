import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FloatingChatWidget from "@/components/floating-chat-widget";
import PWAInstallPrompt from '@/components/pwa-install-prompt';
import CookieConsent from "@/components/layout/CookieConsent";
import { Toaster } from "sonner";


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Infinite Rig Services - Offshore Support & Manning Solutions",
  description:
    "Liberia's premier offshore support, supply, and manning services company for the oil and gas industry.",
  keywords:
    "offshore services, oil and gas, manning, Liberia, supply chain, drilling support",
  authors: [{ name: "Infinite Rig Services, Inc." }],
  openGraph: {
    title: "Infinite Rig Services",
    description: "Offshore Support & Manning Solutions",
    url: "https://infiniterigservices.com",
    siteName: "Infinite Rig Services",
    locale: "en_US",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IRS",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: "/icon-192x192.png" },
      { url: "/icon-512x512.png", sizes: "512x512" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#FF6B35",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="application-name" content="IRS" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="IRS" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#FF6B35" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512x512.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}
        <CookieConsent />
        <FloatingChatWidget />
        <PWAInstallPrompt />
        <Toaster position="top-center" richColors />

      </body>
    </html>
  );
}
