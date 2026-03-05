import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroSlider from "@/components/HeroSlider";
import type { Metadata } from "next";
import {
  StatsSection,
  FeaturesSection,
  CategoriesSection,
  FeaturedSection,
  CTASection,
} from "@/components/AnimatedSections";
import { ArrowRight } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Premium Women Coats & Mens Blazers Manufacturer | StylishBlazer",
  description:
    "StylishBlazer manufactures premium women coats, woolen jackets, and mens blazers. Wholesale & bulk orders from India.",
  alternates: { canonical: "https://stylishblazer.in" },
};

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    });
  } catch {
    return [];
  }
}

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    });
    return products
      .filter((p) => p.price !== null)
      .map((p) => ({ ...p, price: p.price ?? 0 }));
  } catch {
    return [];
  }
}

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  const heroProducts = featuredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    shortDescription: p.shortDescription ?? "",
    images: p.images,
    slug: p.slug,
  }));

  return (
    <main className="min-h-screen">
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f1117 0%, #1a2e1f 45%, #0f2218 100%)",
          minHeight: "min(45vh, 400px)",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-emerald-700/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-emerald-600/10 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-amber-500/5 blur-[80px]" />
        </div>

        {/* Fine grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container mx-auto px-4 py-2 md:py-12 relative z-10">
          <div className="grid grid-cols-2 gap-4 md:gap-12 lg:gap-16 items-center">
            {/* Left — Text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-semibold text-emerald-300 mb-4 md:mb-6 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="hidden xs:inline">Premium Manufacturer · Est. 2009</span>
                <span className="xs:hidden">Est. 2009</span>
              </div>

              <h1
                className="font-bold leading-tight text-white mb-4 md:mb-6"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(1rem, 3.5vw, 3.2rem)",
                }}
              >
                High-Quality{" "}
                <span className="text-gold-shimmer" style={{ display: "inline-block" }}>
                  Blazers & Coats
                </span>
                <br />
                <span className="text-emerald-400">Manufacturing for Retailers</span>
              </h1>

              <p className="text-slate-300 text-[10px] md:text-sm leading-relaxed mb-4 md:mb-6 max-w-lg line-clamp-2">
                High-quality outerwear manufacturing for fashion brands, retailers and bulk buyers.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-6 md:mb-10">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-lg md:rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 md:px-7 md:py-3.5 text-[10px] md:text-sm font-bold shadow-glow-green hover:shadow-xl transition-all duration-300"
                >
                  View All Collections
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg md:rounded-xl border-2 border-white/20 hover:border-white/40 hover:bg-white/10 text-white px-4 py-2.5 md:px-7 md:py-3.5 text-[10px] md:text-sm font-bold transition-all duration-300"
                >
                  Send Inquiry
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-5">
                {[
                  { text: "MOQ 50 pcs" },
                  { text: "Custom" },
                  { text: "15–20 day" },
                ].map((t) => (
                  <span key={t.text} className="flex items-center gap-1 text-[9px] md:text-xs text-slate-400">
                    <span className="text-emerald-400 font-bold">✓</span>
                    {t.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Slider */}
            <div className="flex justify-center">
              <div className="w-full max-w-[180px]  xs:max-w-sm lg:max-w-md">
                {heroProducts.length > 0 ? (
                  <HeroSlider products={heroProducts} />
                ) : (
                  <div className="glass rounded-3xl p-8 aspect-[4/5] flex flex-col items-center justify-center text-white/50 text-center">
                    <span className="text-7xl mb-4 opacity-40">🛍️</span>
                    <p className="font-medium">Premium Product Images</p>
                    <p className="text-sm mt-1 opacity-60">Add products to see them here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade to stats */}
        <div className="absolute bottom-0 left-0 right-0 h-4 md:h-24 bg-gradient-to-t from-[#0f1117] to-transparent" />
      </section>

      {/* ─── STATS ────────────────────────────────────────────────────── */}
      <div className="-mt-1 md:-mt-2 relative z-20">
        <StatsSection />
      </div>

        {/* ─── FEATURED PRODUCTS ────────────────────────────────────────── */}
      <div className="-mt-1 md:-mt-2 bg-white">
        {featuredProducts.length > 0 && (
          <FeaturedSection products={featuredProducts} />
        )}
      </div>

      {/* ─── FEATURES ─────────────────────────────────────────────────── */}
      <div className="-mt-1 md:-mt-2">
        <FeaturesSection />
      </div>

      {/* ─── CATEGORIES ───────────────────────────────────────────────── */}
      <CategoriesSection categories={categories} />

    

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <CTASection />
    </main>
  );
}
