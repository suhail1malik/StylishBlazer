"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { 
  Search, 
  Star, 
  LayoutGrid,
  Edit2,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

export default function ProductStudioClient({ 
  initialProducts, 
  categories 
}: { 
  initialProducts: any[];
  categories: any[];
}) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategoryFilter(cat);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.category?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || product.categoryId === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchQuery, categoryFilter]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
           <h2 className="text-xl font-serif font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Active Inventory</h2>
           <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full">{filteredProducts.length} Units</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search collection..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-full"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Category Filter */}
            <div className="relative flex-1 md:flex-none" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full md:w-auto flex items-center gap-3 pl-5 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:border-emerald-500 transition-all shadow-sm min-w-[160px] justify-between group"
              >
                <span className="truncate max-w-[100px]">
                  {categoryFilter === "all" ? "All Categories" : categories.find(c => c.id === categoryFilter)?.name || "Category"}
                </span>
                <LayoutGrid className={`w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors ${isCategoryOpen ? 'text-emerald-500' : ''}`} />
              </button>

              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-2 z-[50] max-h-[300px] overflow-y-auto no-scrollbar"
                  >
                    <button
                      onClick={() => {
                        setCategoryFilter("all");
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                        categoryFilter === "all" 
                          ? "bg-emerald-50 text-emerald-600" 
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCategoryFilter(cat.id);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                          categoryFilter === cat.id 
                            ? "bg-emerald-50 text-emerald-600" 
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <ProductRow 
            key={product.id} 
            product={product} 
            forceExpand={!!searchQuery} 
          />
        ))}
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-serif italic">No matching articles found in your inventory.</p>
          </div>
        )}
      </div>
    </>
  );
}

function ProductRow({ product, forceExpand }: { product: any; forceExpand: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (forceExpand) setIsExpanded(true);
  }, [forceExpand]);

  return (
    <div 
      className={`group bg-white rounded-[24px] md:rounded-[32px] overflow-hidden border transition-all duration-500 ${
        (isExpanded || forceExpand)
          ? "border-emerald-200 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-100" 
          : "border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300"
      }`}
    >
      {/* Header Row (Always Visible) */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <LayoutGrid className="w-6 h-6 m-auto absolute inset-0 text-slate-300" />
            )}
          </div>
          <div>
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-0.5">
              {product.category?.name || "Bespoke Collection"}
            </p>
            <h3 className="text-sm md:text-base font-serif font-bold text-slate-900 line-clamp-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              {product.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
           <div className="hidden sm:block text-right">
              <p className="text-xs md:text-sm font-bold text-slate-900">₹{product.price?.toLocaleString("en-IN")}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</p>
           </div>
           
           <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
              <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform duration-500 ${isExpanded ? "rotate-90 text-emerald-500" : "group-hover:translate-x-1"}`} />
           </div>
        </div>
      </button>

      {/* Expanded Content (Details & Actions) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="px-4 pb-6 md:px-8 md:pb-8 pt-2 border-t border-slate-50">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Visual Detail */}
                  <div className="lg:col-span-4 relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 shadow-inner group/img">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                        <LayoutGrid className="w-16 h-16" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isActive ? (
                        <span className="bg-emerald-500 text-white text-[8px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">Active</span>
                      ) : (
                        <span className="bg-slate-500 text-white text-[8px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Draft</span>
                      )}
                    </div>
                  </div>

                  {/* Info Details */}
                  <div className="lg:col-span-8 flex flex-col h-full">
                    <div className="mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl md:text-2xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                          Collection Specification
                        </h4>
                        <div className="lg:hidden text-lg font-bold text-slate-900">
                          ₹{product.price?.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-2xl">
                        {product.description || "No description provided for this collection piece."}
                      </p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                       {[
                         { label: 'Category', value: product.category?.name || 'Unset' },
                         { label: 'Fabric', value: product.fabric || 'Premium' },
                         { label: 'Status', value: product.isActive ? 'Visible' : 'Hidden' },
                         { label: 'Featured', value: product.isFeatured ? 'Yes' : 'No' }
                       ].map((item, i) => (
                         <div key={i} className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-xs font-bold text-slate-700 truncate">{item.value}</p>
                         </div>
                       ))}
                    </div>

                    {/* Action Bar */}
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-6 border-t border-slate-50">
                       <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="flex items-center gap-2 px-6 py-3 bg-emerald-950 text-emerald-50 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900 transition-all active:scale-95 shadow-lg shadow-emerald-950/10"
                       >
                          <Edit2 className="w-3.5 h-3.5" />
                          Modify Specification
                       </Link>
                       <DeleteProductButton id={product.id} name={product.name} />
                       
                       <div className="ml-auto hidden sm:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${product.isActive ? "text-emerald-500" : "text-slate-300"}`} />
                          {product.isActive ? "Live in Atelier" : "On Hold"}
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
