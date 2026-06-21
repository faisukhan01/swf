import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shop With Faisu!! — React Native Ecommerce App",
  description: "A complete, real Android ecommerce app built with React Native + Expo + TypeScript. Live interactive preview plus full source code.",
  keywords: ["Shop With Faisu", "React Native", "Expo", "ecommerce", "mobile app", "Android", "TypeScript"],
  authors: [{ name: "Faisu" }],
  icons: {
    icon: "/brand/logo.png",
  },
  openGraph: {
    title: "Shop With Faisu!! — React Native Ecommerce App",
    description: "Built with React Native + Expo + TypeScript. Live preview + full source.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop With Faisu!!",
    description: "React Native + Expo ecommerce app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
