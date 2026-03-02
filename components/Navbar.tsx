"use client";

import { useState } from "react";
import Link from "next/link";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Custom Logo Icon */}
          <div className="relative h-11 w-11 flex-shrink-0">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full transition-transform duration-300 group-hover:scale-105"
            >
              <rect
                width="48"
                height="48"
                rx="12"
                fill="url(#logo-gradient)"
                className="drop-shadow-md"
              />
              <path
                d="M16 14L32 34"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow"
              />
              <path
                d="M20 18L28 30"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
              <circle cx="16" cy="14" r="2.5" fill="white" />
              <circle cx="32" cy="34" r="2.5" fill="white" />
              <text
                x="24"
                y="30"
                fill="white"
                fontSize="20"
                fontWeight="bold"
                textAnchor="middle"
                className="font-serif"
              >
                L
              </text>
              <defs>
                <linearGradient
                  id="logo-gradient"
                  x1="0"
                  y1="0"
                  x2="48"
                  y2="48"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#16a34a" />
                  <stop offset="50%" stopColor="#15803d" />
                  <stop offset="100%" stopColor="#14532d" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Brand Name */}
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-brand-600">
              Stylish<span className="text-brand-600">Blazer</span>
            </span>
            <span className="text-[9px] font-medium tracking-widest text-zinc-500 uppercase mt-0.5">
              Premium Outerwear
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-8 lg:flex">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-brand-600 relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-600 transition-all group-hover:w-full" />
          </Link>

          <Link
            href="/products"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-brand-600 relative group"
          >
            All Products
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-600 transition-all group-hover:w-full" />
          </Link>

          <Link
            href="/category/women-long-coats"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-brand-600 relative group"
          >
            Women Coats
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-600 transition-all group-hover:w-full" />
          </Link>
          <Link
            href="/category/mens-blazers"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-brand-600 relative group"
          >
            Mens Blazers
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-600 transition-all group-hover:w-full" />
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-brand-600 relative group"
          >
            About
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-600 transition-all group-hover:w-full" />
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-brand-600 relative group"
          >
            Contact
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-600 transition-all group-hover:w-full" />
          </Link>
        </div>

        {/* CTA BUTTON - Desktop */}
        <a
          href="tel:+911234567890"
          className="hidden sm:flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Call Sales
        </a>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex items-center justify-center rounded-lg p-2.5 text-zinc-700 transition-colors hover:bg-zinc-100 active:bg-zinc-200"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            // Close Icon
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger Icon
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* MOBILE MENU - Sliding Panel */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-zinc-200 bg-white/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
            >
              Home
            </Link>
            <Link
              href="/category/women-long-coats"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
            >
              Women Coats
            </Link>
            <Link
              href="/category/mens-blazers"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
            >
              Mens Blazers
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
            >
              Contact
            </Link>

            {/* Mobile CTA */}
            <a
              href="tel:+911234567890"
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-md mt-3"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call Sales
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
