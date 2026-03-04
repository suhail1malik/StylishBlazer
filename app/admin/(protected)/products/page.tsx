import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { 
  Plus, 
  Search, 
  Package, 
  Filter, 
  Star, 
  Eye, 
  EyeOff, 
  MoreVertical,
  Edit2,
  TrendingUp,
  LayoutGrid,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    featured: products.filter(p => p.isFeatured).length,
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 space-y-12">
      {/* ── Header & Action ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 
            className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Product Studio
          </h1>
          <p className="text-slate-500 font-medium max-w-md">
            Manage your curated collection of artisanal outerwear and bespoke garments.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-emerald-950 text-emerald-50 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-900/10 hover:bg-emerald-900 transition-all active:scale-95 group"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          Create New Article
        </Link>
      </div>

      {/* ── Stats Overview ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { label: "Total Articles", value: stats.total, icon: <Package />, color: "bg-slate-900 text-white" },
          { label: "Visible in Store", value: stats.active, icon: <Eye />, color: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
          { label: "Collection Spotlights", value: stats.featured, icon: <Star />, color: "bg-amber-50 text-amber-700 border border-amber-100" },
        ].map((stat, idx) => (
          <div key={idx} className={`p-8 rounded-[32px] flex items-center justify-between ${stat.color}`}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-1">{stat.label}</p>
              <p className="text-3xl font-serif font-bold">{stat.value}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Inventory Section ─────────────────────────────────────────── */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-serif font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Active Inventory</h2>
             <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full">{products.length} Units</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search collection..." 
                className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-full md:w-64"
              />
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-emerald-600 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-[40px] p-24 text-center border-2 border-dashed border-slate-100 italic text-slate-400">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-serif text-lg">Your atelier is currently empty.</p>
            <p className="text-xs uppercase tracking-widest mt-2">Start by creating your first masterpiece</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id}
                className="group bg-white rounded-[32px] overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col"
              >
                {/* Visual Area */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-200 bg-slate-50">
                      <LayoutGrid className="w-16 h-16" />
                    </div>
                  )}
                  
                  {/* Status Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isActive ? (
                      <span className="bg-emerald-500 text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-emerald-500/20">Active</span>
                    ) : (
                      <span className="bg-slate-500 text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Draft</span>
                    )}
                    {product.isFeatured && (
                      <span className="bg-amber-400 text-white p-1.5 rounded-full shadow-lg self-start">
                        <Star className="w-3 h-3 fill-current" />
                      </span>
                    )}
                  </div>

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                    >
                      <Edit2 className="w-5 h-5" />
                    </Link>
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>
                </div>

                {/* Narrative Area */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-1">
                        {product.category?.name || "Bespoke Collection"}
                      </p>
                      <h3 className="text-xl font-serif font-bold text-slate-900 line-clamp-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {product.name}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-slate-900">₹{product.price?.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6">
                    {product.description || "No description provided for this collection piece."}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${product.isActive ? "text-emerald-500" : "text-slate-300"}`} />
                        {product.isActive ? "In Store" : "Archived"}
                     </div>
                     <Link 
                        href={`/admin/products/${product.id}/edit`}
                        className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                     >
                        Refine Article <ChevronRight className="w-3 h-3" />
                     </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
