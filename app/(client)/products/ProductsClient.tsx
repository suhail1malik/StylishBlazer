"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  FadeIn, 
  StaggerGrid, 
  StaggerItem, 
  SectionHeading 
} from "@/components/AnimatedSections";
import { Sparkles, Package, ChevronRight, Filter, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  images: string[];
  sizes: string[];
  isFeatured: boolean;
  category: Category;
}

export default function ProductsPage({ 
  initialProducts, 
  initialCategories 
}: { 
  initialProducts: Product[], 
  initialCategories: Category[] 
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If we wanted to "refresh" data on mount, we could, but SSR handles initial state
    if (initialProducts.length === 0 && initialCategories.length === 0) {
      setLoading(true);
      Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
      ]).then(([productsData, categoriesData]) => {
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setLoading(false);
      });
    }
  }, [initialProducts, initialCategories]);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category?.slug === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Premium Dark Header */}
      <div 
        className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-20 text-center"
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
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-emerald-600/10 blur-[80px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            eyebrow={<><Sparkles className="w-3.5 h-3.5" /> Luxury Catalog</>}
            title="Our Full Collection"
            subtitle="Explore our meticulously crafted outerwear pieces."
            light={true}
          />

          {/* Breadcrumb - White on Dark */}
          <FadeIn className="flex items-center justify-center gap-2 text-[10px] md:text-sm text-slate-400 tracking-wider uppercase mt-8">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-medium">Collections</span>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        {/* Filters Row - Balanced Style */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[11px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                  activeCategory === "all"
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                    : "bg-white border-slate-200 text-slate-500 hover:border-emerald-500/50 hover:text-emerald-600"
                }`}
              >
                All Pieces ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[11px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                    activeCategory === cat.slug
                      ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                      : "bg-white border-slate-200 text-slate-500 hover:border-emerald-500/50 hover:text-emerald-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Premium Sort Controls */}
            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
          </div>
        </FadeIn>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && sorted.length === 0 && (
          <FadeIn className="text-center py-32 border border-slate-200 rounded-3xl bg-white shadow-sm">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-slate-800 mb-2">No items found</h3>
            <p className="text-slate-500 text-sm">We're currently updating this collection.</p>
          </FadeIn>
        )}

        {/* Grid - Premium Light Cards */}
        {!loading && sorted.length > 0 && (
          <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {sorted.map((product) => (
              <StaggerItem key={product.id}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group block relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 bg-white hover:border-emerald-200 hover:shadow-premium transition-all duration-500"
                >
                  {/* Image area */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package className="w-10 h-10" />
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {product.isFeatured && (
                      <span className="absolute top-3 left-3 z-10 bg-emerald-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold shadow-lg border border-emerald-400/30">
                        P
                      </span>
                    )}
                  </div>

                  {/* Content area */}
                  <div className="p-4 md:p-6">
                    <p className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600 mb-2">
                      {product.category?.name}
                    </p>
                    <h3 className="font-serif text-sm md:text-lg font-semibold text-slate-800 mb-2 line-clamp-1 group-hover:text-emerald-700 transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-4 md:mt-6 pt-4 border-t border-slate-100">
                      <p className="font-bold text-slate-900 text-sm md:text-base">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-1 group/btn transition-all">
                        Details
                        <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}

        {/* Bottom Status */}
        <FadeIn delay={0.4} className="mt-20 text-center border-t border-slate-200 pt-12">
          <p className="text-slate-400 text-[10px] tracking-[0.2em] uppercase">
            Showing {sorted.length} Premium Articles
          </p>
        </FadeIn>
      </div>
    </div>
  );
}

function SortDropdown({ sortBy, setSortBy }: { sortBy: string; setSortBy: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: "newest", label: "Newest Arrival" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Alphabetical" },
  ];

  const currentLabel = options.find((o) => o.value === sortBy)?.label;

  return (
    <div className="relative self-start lg:self-auto z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-2.5 shadow-sm hover:border-emerald-500/50 transition-all group"
      >
        <Filter className="w-4 h-4 text-emerald-600" />
        <span className="text-slate-600 text-[11px] md:text-xs font-bold uppercase tracking-widest">
          {currentLabel}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 lg:right-0 lg:left-auto mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-2 flex flex-col">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all ${
                      sortBy === option.value
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
                    }`}
                  >
                    {option.label}
                    {sortBy === option.value && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


