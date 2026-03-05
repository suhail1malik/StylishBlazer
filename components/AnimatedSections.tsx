"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Scissors,
  ShieldCheck,
  Package,
  ArrowRight,
  Star,
  Truck,
  Users,
  Award,
  TrendingUp,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// ── Reusable fade-in wrapper ──────────────────────────────────────────────────
export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Staggered grid wrapper ────────────────────────────────────────────────────
export function StaggerGrid({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.12 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  eyebrow: React.ReactNode;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <FadeIn className="text-center mb-2 md:mb-12">
      <span
        className={`inline-flex items-center gap-2 text-[10px] md:text-xs font-semibold tracking-[0.18em] uppercase mb-2 md:mb-4 ${
          light ? "text-emerald-300" : "text-brand-600"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`font-serif text-xl md:text-4xl lg:text-5xl font-bold leading-tight ${
          light ? "text-white" : "text-charcoal-800"
        }`}
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${
            light ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}

// ── Stats section ─────────────────────────────────────────────────────────────
export function StatsSection() {
  const stats = [
    { icon: <TrendingUp className="w-5 h-5" />, value: "500+", label: "Designs" },
    { icon: <Users className="w-5 h-5" />,     value: "50+",  label: "Partners" },
    { icon: <Award className="w-5 h-5" />,     value: "15+",  label: "Years" },
    { icon: <Star className="w-5 h-5" />,      value: "4.9★", label: "Rating" },
  ];

  return (
    <section className="relative py-4 md:py-4 overflow-hidden" style={{ background: "#0f1117" }}>
      {/* Hero-style grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* thin gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent z-10" />
      <div className="container mx-auto px-4 relative z-10">
        <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <div className="glass flex flex-col items-center gap-0.5 py-2 md:py-5 rounded-xl md:rounded-2xl border border-white/5">
                <span className="text-emerald-400">{s.icon}</span>
                <span
                  className="text-2xl md:text-3xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.value}
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-wide">
                  {s.label}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent z-10" />
    </section>
  );
}

// ── Features section ──────────────────────────────────────────────────────────
export function FeaturesSection() {
  const features = [
    {
      Icon: Scissors,
      title: "Custom Manufacturing",
      desc: "Tailored designs to exactly match your brand identity and specifications.",
      color: "from-emerald-500/20 to-emerald-600/10",
      border: "border-emerald-500/20",
    },
    {
      Icon: ShieldCheck,
      title: "Premium Quality",
      desc: "High-grade wool blend fabrics with exceptional craftsmanship.",
      color: "from-amber-500/20 to-amber-600/10",
      border: "border-amber-500/20",
    },
    {
      Icon: Package,
      title: "Bulk Orders",
      desc: "Competitive wholesale pricing with MOQ starting from 50 pieces.",
      color: "from-blue-500/20 to-blue-600/10",
      border: "border-blue-500/20",
    },
    {
      Icon: Truck,
      title: "Pan-India Delivery",
      desc: "Reliable shipping to retailers and brands across all Indian states.",
      color: "from-purple-500/20 to-purple-600/10",
      border: "border-purple-500/20",
    },
  ];
  return (
    <section
      className="py-4 md:py-12 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f1117 0%, #1a2e1f 45%, #0f2218 100%)" }}
    >
      {/* Hero-style grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-emerald-600/10 blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          eyebrow={<><Sparkles className="w-3.5 h-3.5" /> Why Choose Us</>}
          title="Built for Premium Brands"
          subtitle="Advanced tailoring for modern brands."
          light={true}
        />

        <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {features.map(({ Icon, title, desc, color, border }) => (
            <StaggerItem key={title}>
              <div
                className={`card-shine group h-full rounded-xl md:rounded-2xl border border-white/10 bg-white/5 p-3 md:p-6 backdrop-blur-sm hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300`}
              >
                <div className="mb-1 md:mb-4 inline-flex rounded-lg md:rounded-xl bg-emerald-500/10 p-2 md:p-3">
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                </div>
                <h3
                  className="font-serif text-base md:text-lg font-semibold text-white mb-1 md:mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {title}
                </h3>
                <p className="text-[11px] md:text-sm leading-relaxed text-slate-400">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
      {/* thin gold line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent" />
    </section>
  );
}

// ── Category types ────────────────────────────────────────────────────────────
type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
};

// ── Categories section ────────────────────────────────────────────────────────
export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="py-8 md:py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-2 relative z-10">
        <SectionHeading
          eyebrow={<><Star className="w-3.5 h-3.5 fill-current" /> Our Collections</>}
          title="Browse by Category"
          subtitle="Carefully curated outerwear segments."
          light={false}
        />

        <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          {categories.map((category) => (
            <StaggerItem key={category.id}>
              <Link
                href={`/category/${category.slug}`}
                className="group block rounded-xl md:rounded-3xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-premium transition-all duration-500 bg-white"
              >
                {/* Image area */}
                <div className="relative h-52 md:h-82 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-6xl opacity-30">🧥</span>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="p-3 md:p-5">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-1 md:gap-3">
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-serif text-sm md:text-xl font-semibold text-slate-900 group-hover:text-brand-600 transition-colors duration-300"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {category.name}
                      </h3>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 md:px-3 py-0.5 md:py-1 text-[9px] md:text-xs font-semibold text-brand-700">
                      {category._count.products} styles
                    </span>
                  </div>

                  <div className="mt-2 md:mt-4 flex items-center gap-1 text-[10px] md:text-sm font-semibold text-brand-600 group-hover:gap-2 transition-all duration-300">
                    Explore Collection
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

// ── Product types ─────────────────────────────────────────────────────────────
type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  price: number;
  isFeatured: boolean;
  images: string[];
};

// ── Featured Products section ─────────────────────────────────────────────────
export function FeaturedSection({ products }: { products: Product[] }) {
  return (
    <section className="py-8 md:py-24" style={{ background: "#f8fafc" }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <FadeIn>
            <span className="block text-xs font-semibold tracking-[0.18em] uppercase text-brand-600 mb-2">
              Popular Styles
            </span>
            <h2
              className="font-serif text-3xl md:text-4xl font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Premium Products
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors group"
            >
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>

        <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <Link
                href={`/products/${product.slug}`}
                className="group block rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-soft hover:shadow-premium transition-all duration-500"
              >
                {/* Image */}
                <div className="relative bg-slate-100 aspect-[3/4] overflow-hidden">
                  {product.isFeatured && (
                    <span className="absolute top-3 left-3 z-10 inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-lg border border-emerald-400/30">
                      P
                    </span>
                  )}
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-5xl opacity-30">
                      👔
                    </div>
                  )}
                  {/* Subtle green overlay on hover */}
                  <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/10 transition-colors duration-500" />
                </div>

                {/* Details */}
                <div className="p-4">
                  <h3
                    className="font-serif font-semibold text-sm md:text-base text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-lg font-bold text-brand-600">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-2 transition-all">
                      Enquire <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

// ── CTA section ───────────────────────────────────────────────────────────────
export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative py-12 md:py-24 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f1117 0%, #1a2e1f 45%, #0f2218 100%)" }}
    >
      {/* Hero-style grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* decorative glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      {/* thin gold line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent z-10" />

      <div className="relative container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 text-amber-300 text-xs font-semibold tracking-[0.18em] uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Start Your Order
          </span>
          <h2
            className="font-serif text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Elevate{" "}
            <span className="text-gold-shimmer">Your Brand?</span>
          </h2>
          <p className="text-emerald-100/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Get premium quality outerwear manufactured exclusively for your brand.
            Contact us for custom orders and wholesale pricing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-brand-700 px-8 py-4 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 text-white px-8 py-4 text-sm font-bold hover:bg-white/10 transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent" />
    </section>
  );
}
