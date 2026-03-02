// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stylishblazer.in"),
  title: {
    default: "StylishBlazer | Premium Women Coats & Mens Blazers Manufacturer",
    template: "%s | StylishBlazer",
  },
  description:
    "StylishBlazer is a premium manufacturer of women coats, woolen jackets, and mens blazers. Bulk orders welcome. Custom sizing available.",
  keywords: [
    "women coats manufacturer",
    "mens blazers wholesale",
    "woolen jackets bulk",
    "premium outerwear India",
    "StylishBlazer",
    "blazer manufacturer India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://stylishblazer.in",
    siteName: "StylishBlazer",
    title: "StylishBlazer | Premium Outerwear Manufacturer",
    description:
      "Premium manufacturer of women coats and mens blazers. Bulk orders, custom sizing, and wholesale pricing available.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "StylishBlazer Premium Outerwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StylishBlazer | Premium Outerwear Manufacturer",
    description:
      "Premium manufacturer of women coats and mens blazers. Bulk orders welcome.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-linear-to-br from-zinc-50 via-white to-zinc-50 text-zinc-900 antialiased">
        {/* PREMIUM NAVBAR */}
        <Navbar />
        <main className="flex-1">{children}</main>

        {/* Footer continues same as before... */}
        <footer className="border-t border-zinc-200 bg-linear-to-b from-white to-zinc-50">
          <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
            <div className="grid gap-8 text-sm md:grid-cols-4">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-linear-to-br from-brand-600 to-brand-700" />
                  <span className="text-base font-bold text-zinc-900">
                    StylishBlazer
                  </span>
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  Premium manufacturer of women long coats, mens blazers and
                  woolen outerwear for retailers and brands.
                </p>
              </div>

              {/* Products */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Products
                </h3>
                <div className="flex flex-col gap-2 text-zinc-600">
                  <Link
                    href="/category/women-long-coats"
                    className="transition-colors hover:text-brand-600"
                  >
                    Women Long Coats
                  </Link>
                  <Link
                    href="/category/mens-blazers"
                    className="transition-colors hover:text-brand-600"
                  >
                    Mens Blazers
                  </Link>
                  <Link
                    href="/category/woolen-jackets"
                    className="transition-colors hover:text-brand-600"
                  >
                    Woolen Jackets
                  </Link>
                </div>
              </div>

              {/* Company */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Company
                </h3>
                <div className="flex flex-col gap-2 text-zinc-600">
                  <Link
                    href="/about"
                    className="transition-colors hover:text-brand-600"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    className="transition-colors hover:text-brand-600"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/contact"
                    className="transition-colors hover:text-brand-600"
                  >
                    Enquiry
                  </Link>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Contact
                </h3>
                <div className="flex flex-col gap-2 text-zinc-600">
                  <p>Chandigarh, India</p>
                  <p>+91-12345-67890</p>
                  <p>sales@StylishBlazer.com</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 text-xs text-zinc-500 md:flex-row">
              <p>
                © {new Date().getFullYear()} StylishBlazer. All rights reserved.
              </p>
              <p className="flex items-center gap-1">
                Built with 💚 using Next.js & Tailwind CSS
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
