"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Menu, X, ChevronRight } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-xl shadow-sm overflow-x-hidden">
      <nav className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-4 px-4 py-3 md:py-4 lg:px-8">
        
        {/* LOGO & BRAND */}
        <Link href="/" className="flex items-center gap-3 group min-w-0">
          <div className="relative h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="StylishBlazer Logo"
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
              priority
            />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-charcoal-900 font-serif">
              Stylish<span className="text-brand-600">Blazer</span>
            </span>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">
              The Artisan Clothier
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-8 lg:flex">
          {[
            { name: "Home", href: "/" },
            { name: "Collection", href: "/products" },
            { name: "Women", href: "/category/women-coats" },
            { name: "Men", href: "/category/mens-blazers" },
            { name: "About", href: "/about" },
            { name: "Contact", href: "/contact" },
            { name: "Admin", href: "/admin" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[13px] font-semibold uppercase tracking-wider text-zinc-600 transition-all hover:text-brand-600 relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* CTA - Desktop */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="tel:+917906200663"
            className="flex items-center gap-2 rounded-xl bg-charcoal-900 px-6 py-3 text-[13px] font-bold text-white shadow-lg hover:shadow-glow-green hover:bg-brand-800 transition-all duration-300 hover:scale-105"
          >
            <Phone className="h-4 w-4 text-emerald-400" />
            +91 7906200663
          </a>
        </div>

        {/* MOBILE CONTACT & MENU */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href="tel:+917906200663"
            className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-600 transition-colors hover:bg-emerald-100 border border-emerald-100/50 shadow-sm"
            aria-label="Call Now"
          >
            <Phone className="h-4 w-4" />
            
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center rounded-xl border border-zinc-100 p-2.5 text-zinc-700 transition-colors hover:bg-zinc-100 shadow-sm"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out bg-white border-t border-zinc-100 ${
          mobileMenuOpen ? "max-h-screen opacity-100 border-b shadow-xl" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-8 space-y-4">
          {[
            { name: "Home", href: "/" },
            { name: "All Products", href: "/products" },
            { name: "Women Collection", href: "/category/women-coats" },
            { name: "Mens Blazers", href: "/category/mens-blazers" },
            { name: "Our Story", href: "/about" },
            { name: "Contact Us", href: "/contact" },
            { name: "Admin Login", href: "/admin" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between group py-2"
            >
              <span className="text-lg font-serif font-semibold text-zinc-800 group-hover:text-brand-600 transition-colors">
                {item.name}
              </span>
              <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-brand-600 transition-all group-hover:translate-x-1" />
            </Link>
          ))}

          <div className="pt-6 border-t border-zinc-50">
            <a
              href="tel:+917906200663"
              className="flex items-center justify-center gap-3 rounded-xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white shadow-md active:scale-95 transition-all"
            >
              <Phone className="h-4 w-4" />
              Call +91 7906200663
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
