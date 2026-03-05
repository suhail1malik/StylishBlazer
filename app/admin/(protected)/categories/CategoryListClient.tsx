"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Search, 
  Layers, 
  Pencil, 
  Trash2, 
  ChevronRight, 
  ExternalLink,
  ArrowUpDown,
  ShoppingBag,
  Plus
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  isActive: boolean;
  order: number;
  _count: { products: number };
}

export default function CategoryListClient({ 
  categories, 
  onEdit, 
  onDelete 
}: { 
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (id: string, count: number) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.order - b.order);
  }, [categories, searchQuery]);

  return (
    <div className="space-y-6">
      {/* ── Filter & Search Bar ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
           <h2 className="text-xl font-serif font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Curated Collections</h2>
           <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full">{filteredCategories.length} Categories</span>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-full"
          />
        </div>
      </div>

      {/* ── Categories List ─────────────────────────────────────────── */}
      <div className="space-y-4">
        {filteredCategories.map((cat) => (
          <CategoryRow 
            key={cat.id} 
            category={cat} 
            onEdit={onEdit} 
            onDelete={onDelete}
            forceExpand={!!searchQuery}
          />
        ))}
        {filteredCategories.length === 0 && (
          <div className="py-20 text-center">
             <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <Layers className="w-8 h-8" />
             </div>
             <p className="text-slate-400 font-serif italic">No matching collections found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryRow({ 
  category, 
  onEdit, 
  onDelete,
  forceExpand
}: { 
  category: Category; 
  onEdit: (cat: Category) => void;
  onDelete: (id: string, count: number) => void;
  forceExpand: boolean;
}) {
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
            {category.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Layers className="w-6 h-6 m-auto absolute inset-0 text-slate-300" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                Order #{category.order}
              </span>
              <div className={`w-1 h-1 rounded-full ${category.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
            </div>
            <h3 className="text-sm md:text-base font-serif font-bold text-slate-900 line-clamp-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              {category.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
           <div className="hidden sm:block text-right">
              <p className="text-xs md:text-sm font-bold text-slate-900">{category._count.products}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Articles</p>
           </div>
           
           <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform duration-500 ${isExpanded ? "rotate-90 text-emerald-500" : "group-hover:translate-x-1"}`} />
        </div>
      </button>

      {/* Expanded Content */}
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
                  {/* Visual Preview */}
                  <div className="lg:col-span-4 relative aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 shadow-inner group/img">
                    {category.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                        <Layers className="w-16 h-16" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest backdrop-blur-md border ${
                        category.isActive 
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-emerald-400" 
                          : "bg-slate-500 text-white border-slate-400"
                      }`}>
                        {category.isActive ? "Live" : "Hidden"}
                      </span>
                    </div>
                  </div>

                  {/* Details & Actions */}
                  <div className="lg:col-span-8 flex flex-col h-full">
                    <div className="mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-lg md:text-xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                          Collection Narrative
                        </h4>
                        <div className="lg:hidden bg-slate-50 px-3 py-1 rounded-full text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                           {category._count.products} Articles
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-2xl italic">
                        "{category.description || "No narrative provided for this collection piece."}"
                      </p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                       {[
                         { label: 'Identifier', value: category.id.substring(0, 8), icon: <Layers className="w-3 h-3" /> },
                         { label: 'URL Slug', value: category.slug, icon: <ExternalLink className="w-3 h-3" /> },
                         { label: 'Inventory', value: `${category._count.products} Items`, icon: <ShoppingBag className="w-3 h-3" /> }
                       ].map((item, i) => (
                         <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-slate-400">{item.icon}</span>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                            </div>
                            <p className="text-xs font-bold text-slate-700 truncate">{item.value}</p>
                         </div>
                       ))}
                    </div>

                    {/* Action Bar */}
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-6 border-t border-slate-50">
                       <button
                          onClick={() => onEdit(category)}
                          className="flex items-center gap-2 px-6 py-3 bg-emerald-950 text-emerald-50 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900 transition-all active:scale-95 shadow-lg shadow-emerald-950/10"
                       >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit Collection
                       </button>
                       
                       <button
                          onClick={() => onDelete(category.id, category._count.products)}
                          disabled={category._count.products > 0}
                          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 ${
                            category._count.products > 0
                              ? "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200"
                              : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                          }`}
                       >
                          <Trash2 className="w-3.5 h-3.5" />
                          {category._count.products > 0 ? "Protected" : "Delete"}
                       </button>

                       <Link 
                          href={`/category/${category.slug}`}
                          target="_blank"
                          className="ml-auto flex items-center gap-2 px-4 py-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all"
                       >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Atelier
                       </Link>
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
