import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Briefcase, 
  FolderTree, 
  Star, 
  Mail, 
  Plus, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  Inbox
} from "lucide-react";

async function getDashboardStats() {
  const [productsCount, categoriesCount, featuredCount, newEnquiriesCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.enquiry.count({ where: { status: "new" } }),
  ]);

  return { 
    productsCount, 
    categoriesCount, 
    featuredCount, 
    newEnquiriesCount 
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const cards = [
    { 
      label: "Inventory Overview", 
      value: stats.productsCount, 
      sub: "Total Crafted Articles",
      href: "/admin/products",
      icon: <Briefcase className="w-6 h-6" />,
      color: "text-blue-600",
      bg: "bg-blue-50/50"
    },
    { 
      label: "Active Segments", 
      value: stats.categoriesCount, 
      sub: "Curated Collections",
      href: "/admin/categories",
      icon: <FolderTree className="w-6 h-6" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50/50"
    },
    { 
      label: "New Leads", 
      value: stats.newEnquiriesCount, 
      sub: "Awaiting Consultation",
      href: "/admin/enquiries",
      icon: <Inbox className="w-6 h-6" />,
      color: "text-rose-600",
      bg: "bg-rose-50/50",
      highlight: stats.newEnquiriesCount > 0
    },
    { 
      label: "Featured Series", 
      value: stats.featuredCount, 
      sub: "Spotlighted in Hero",
      href: "/admin/products?filter=featured",
      icon: <Star className="w-6 h-6" />,
      color: "text-amber-600",
      bg: "bg-amber-50/50"
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Admin Studio
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base font-medium">
            Exclusively managing the look, feel and flow of StylishBlazer.
          </p>
        </div>
      </div>

      {/* Interactive Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`group relative overflow-hidden bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-premium hover:border-emerald-200 hover:-translate-y-1.5 transition-all duration-500 flex flex-col items-start gap-4`}
          >
            <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner`}>
              {card.icon}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-slate-900 tracking-tighter leading-none">
                  {card.value}
                </span>
                {card.highlight && (
                   <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                )}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 group-hover:text-emerald-600 transition-colors">
                {card.label}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                {card.sub}
              </p>
            </div>

            <ArrowRight className="absolute right-8 top-8 w-5 h-5 text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
            
            {/* Subtle Gradient Hint */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent group-hover:via-emerald-400/30 transition-all duration-700" />
          </Link>
        ))}
      </div>

      {/* Secondary Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quick Commands */}
        <div className="lg:col-span-12">
          <section className="bg-slate-950 rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 blur-[100px] translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3" /> System Ops
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Expansion Hub
                </h2>
                <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                  Scale your inventory or curate new collections with precision-designed management tools.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                <Link
                  href="/admin/products/new"
                  className="flex items-center gap-5 p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">New Article</h3>
                    <p className="text-xs text-slate-500 font-medium group-hover:text-emerald-400/70 transition-colors">Start Crafting</p>
                  </div>
                </Link>

                <Link
                  href="/admin/categories"
                  className="flex items-center gap-5 p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Organize</h3>
                    <p className="text-xs text-slate-500 font-medium group-hover:text-emerald-400/70 transition-colors">Curate Space</p>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
