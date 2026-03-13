import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#10B981",
};

export const metadata: Metadata = {
  title: "ProfitPulse — Real-Time E-Commerce Profit Intelligence",
  description:
    "Stop guessing your margins. ProfitPulse calculates true net profit per SKU after ALL costs — platform fees, shipping, returns, ads, storage. Scan any barcode for instant profit analysis.",
  keywords: [
    "e-commerce profit tracker",
    "Amazon FBA profit calculator",
    "barcode scanner profit",
    "SKU profitability",
    "margin analysis",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
