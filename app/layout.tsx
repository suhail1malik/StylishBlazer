import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://stylishblazer.in"),
  title: {
    template: "%s | StylishBlazer",
    default: "StylishBlazer | Premium Women Coats & Mens Blazers",
  },
  description: "Premium Quality Outerwear Manufacturer, specializing in bespoke woven designs spanning formal wear to casual chic.",
  openGraph: {
    title: "StylishBlazer | Premium Women Coats & Mens Blazers",
    description: "Premium Quality Outerwear Manufacturer",
    url: "https://stylishblazer.in",
    siteName: "StylishBlazer",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StylishBlazer",
    description: "Premium Quality Outerwear Manufacturer",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${inter.className} overflow-x-hidden bg-slate-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
