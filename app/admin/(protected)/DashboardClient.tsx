"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Package, FolderTree, Star, Plus, Settings } from "lucide-react";

interface Stats {
  productsCount: number;
  categoriesCount: number;
  featuredCount: number;
}

export default function DashboardClient({ stats }: { stats: Stats }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 
          className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Studio Overview
        </h1>
        <p className="text-slate-500 font-medium max-w-md">
          Welcome back! Here's a quick glance at your curated collection and active store metrics.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: "Total Articles", value: stats.productsCount, icon: <Package className="w-6 h-6" />, color: "emerald", href: "/admin/products" },
          { label: "Active Categories", value: stats.categoriesCount, icon: <FolderTree className="w-6 h-6" />, color: "blue", href: "/admin/categories" },
          { label: "Collection Spotlights", value: stats.featuredCount, icon: <Star className="w-6 h-6" />, color: "amber", href: "/admin/products" },
        ].map((stat, idx) => (
          <Link key={idx} href={stat.href}>
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-8 shadow-sm border border-slate-200/60 hover:shadow-xl hover:shadow-${stat.color}-500/10 transition-all duration-300 relative overflow-hidden group h-full`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-${stat.color}-500/10 transition-colors duration-500`} />
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <span className={`text-${stat.color}-600 text-[10px] font-bold uppercase tracking-widest`}>Overview</span>
              </div>
              
              <div className="relative z-10">
                <div className="text-4xl font-serif font-bold text-slate-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60 mt-8">
        <h2 className="text-xl font-serif font-bold text-slate-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          Quick Actions
        </h2>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <Link
            href="/admin/products/new"
            className="group relative overflow-hidden flex items-center gap-6 p-6 border border-slate-200/60 rounded-3xl hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 bg-slate-50/50 hover:bg-emerald-50/30"
          >
            <div className="w-14 h-14 bg-white shadow-sm group-hover:bg-emerald-100 group-hover:text-emerald-600 rounded-2xl flex items-center justify-center text-slate-400 transition-all duration-300">
              <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-500" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                Create New Article
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Add a new masterpiece to your collection
              </div>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="group relative overflow-hidden flex items-center gap-6 p-6 border border-slate-200/60 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 bg-slate-50/50 hover:bg-blue-50/30"
          >
            <div className="w-14 h-14 bg-white shadow-sm group-hover:bg-blue-100 group-hover:text-blue-600 rounded-2xl flex items-center justify-center text-slate-400 transition-all duration-300">
              <Settings className="w-6 h-6 transition-transform group-hover:rotate-90 duration-500" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                Manage Categories
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Organize your product classifications
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
