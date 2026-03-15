import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Plus, 
  Package, 
  Star, 
  Eye, 
} from "lucide-react";
import ProductStudioClient from "./ProductStudioClient";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    })
  ]);

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

        <div className="flex flex-col items-end gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-emerald-950 text-emerald-50 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-900/10 hover:bg-emerald-900 transition-all active:scale-95 group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            Create New Article
          </Link>
        </div>
      </div>

      {/* ── Stats Overview ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { label: "Total Articles", value: stats.total, icon: <Package className="w-5 h-5" />, color: "bg-slate-900 text-white" },
          { label: "Visible in Store", value: stats.active, icon: <Eye className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
          { label: "Collection Spotlights", value: stats.featured, icon: <Star className="w-5 h-5" />, color: "bg-amber-50 text-amber-700 border border-amber-100" },
        ].map((stat, idx) => (
          <div key={idx} className={`p-6 md:p-8 rounded-[32px] flex items-center justify-between ${stat.color}`}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-1">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-serif font-bold">{stat.value}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Inventory Section ─────────────────────────────────────────── */}
      <div className="space-y-8">
        <ProductStudioClient initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}
