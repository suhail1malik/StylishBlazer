import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
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
                  <Link href="/category/women-long-coats" className="transition-colors hover:text-white">
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
                  <a href="tel:+917500737345" className="hover:text-white transition-colors cursor-pointer">+91 7500737345</a>
                  <a href="mailto:Jaatsarik091@gmail.com" className="hover:text-white transition-colors cursor-pointer">Jaatsarik091@gmail.com</a>
                </div>
              </div>

              {/* Social */}
              <div className="col-span-2 md:col-span-1 border-t border-white/5 pt-6 md:border-0 md:pt-0">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Connect
                </h3>
                <div className="flex gap-4">
                  <a 
                    href="https://www.instagram.com/stylishblazer.in?igsh=MWY4MGw4N3ZwcThhcQ==&utm_source=ig_contact_invite" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://m.facebook.com/story.php?story_fbid=122099153475164744&substory_index=4234412313495080&id=61584942339883" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
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
