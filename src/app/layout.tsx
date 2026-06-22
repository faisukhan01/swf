import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PWAScript } from "@/components/PWAScript";
import { InstallPWA } from "@/components/InstallPWA";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#10b981",
};

export const metadata: Metadata = {
  title: "Shop With Faisu!! — Mobile Shopping App",
  description: "A complete, real mobile shopping app built with React Native + Expo + TypeScript. Live interactive preview plus full source code.",
  keywords: ["Shop With Faisu", "React Native", "Expo", "ecommerce", "mobile app", "Android", "TypeScript", "PWA"],
  authors: [{ name: "Faisu" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  openGraph: {
    title: "Shop With Faisu!! — Mobile Shopping App",
    description: "Built with React Native + Expo + TypeScript. Live preview + full source.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop With Faisu!!",
    description: "React Native + Expo ecommerce app",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Shop With Faisu",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Shop Faisu" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <PWAScript />
        {children}
        <InstallPWA />
        <Toaster />
      </body>
    </html>
  );
}
