import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

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
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "StylishBlazer Premium Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StylishBlazer | Premium Outerwear Manufacturer",
    description:
      "Premium manufacturer of women coats and mens blazers. Bulk orders welcome.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <div className="min-h-screen flex flex-col bg-linear-to-br from-zinc-50 via-white to-zinc-50 text-zinc-900 antialiased font-sans">
        {/* PREMIUM NAVBAR */}
        <Navbar />
        <main className="flex-1">{children}</main>

        {/* WHATSAPP FLOAT */}
        <WhatsAppButton />

        {/* Premium Dark Footer */}
        <footer 
          className="relative overflow-hidden border-t border-white/5"
          style={{ background: "linear-gradient(135deg, #0f1117 0%, #1a2e1f 45%, #0f2218 100%)" }}
        >
          {/* Grid Lines Overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 lg:px-6">
            <div className="grid gap-8 text-sm grid-cols-2 md:grid-cols-4">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1 border-b border-white/5 pb-6 md:border-0 md:pb-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative h-10 w-10">
                    <Image
                      src="/logo.png"
                      alt="StylishBlazer Logo"
                      fill
                      className="object-contain"
                      sizes="40px"
                      unoptimized
                    />
                  </div>
                  <span className="text-base font-serif font-bold text-white tracking-wide">
                    StylishBlazer
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed text-xs md:text-sm">
                  Premium manufacturer of luxury women coats, mens blazers and
                  bespoke woolen outerwear for global retailers.
                </p>
              </div>

              {/* Products */}
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Collections
                </h3>
                <div className="flex flex-col gap-3 text-slate-400">
                  <Link href="/category/women-coats" className="transition-colors hover:text-white">
                    Women Coats
                  </Link>
                  <Link href="/category/mens-blazers" className="transition-colors hover:text-white">
                    Mens Blazers
                  </Link>
                  <Link href="/category/woolen-jackets" className="transition-colors hover:text-white">
                    Woolen Jackets
                  </Link>
                </div>
              </div>

              {/* Company */}
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Company
                </h3>
                <div className="flex flex-col gap-3 text-slate-400">
                  <Link href="/about" className="transition-colors hover:text-white">
                    About Us
                  </Link>
                  <Link href="/contact" className="transition-colors hover:text-white">
                    Contact Us
                  </Link>
                  <Link href="/privacy" className="transition-colors hover:text-white">
                    Privacy Policy
                  </Link>
                </div>
              </div>

              {/* Contact */}
              <div className="col-span-2 md:col-span-1 border-t border-white/5 pt-6 md:border-0 md:pt-0">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Inquiries
                </h3>
                <div className="flex flex-col gap-3 text-slate-400">
                  <p>Chandigarh, India</p>
                  <p className="hover:text-white transition-colors cursor-pointer">+91 7906200663</p>
                  <p className="hover:text-white transition-colors cursor-pointer">suhailmalik.dev@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-[10px] md:text-xs text-slate-400 tracking-widest uppercase md:flex-row">
              <p>
                © {new Date().getFullYear()} StylishBlazer. All rights reserved.
              </p>
              <p className="flex items-center gap-1 opacity-60">
                Premium Quality · Indian Craftsmanship
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
