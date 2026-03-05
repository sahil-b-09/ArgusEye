import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArgusEye 24/7 - Best TradingView Indicators for Absolute Clarity",
  description: "ArgusEye and ArgusEye 24/7 are institutional-grade TradingView indicators. Eliminate market noise, map liquidity, and identify high-probability setups with the ArgusEye toolkit.",
  keywords: ["ArgusEye", "ArgusEye 24/7", "TradingView indicators", "HTF PO3", "trading automation", "ArgusEye indicator", "Argus Eye"],
  openGraph: {
    title: "ArgusEye 24/7 - Best TradingView Indicators",
    description: "ArgusEye and ArgusEye 24/7 are institutional-grade TradingView indicators designed to eliminate market noise and map liquidity.",
    url: "https://arguseye247.com",
    siteName: "ArgusEye",
    locale: "en_US",
    type: "website",
  },
  verification: {
    google: "-jjR3SoLaF3VfBi8BmsNl6LEbTqm-2P4KEW_aUAbyOs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-PH2F8567" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <GoogleAnalytics gaId="G-4G4Y2NDTYL" />
      </body>
    </html>
  );
}
