// components/admin/AdminNav.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  FolderTree, 
  Mail, 
  LogOut,
  User as UserIcon,
  ChevronRight,
  Bell,
  Globe
} from "lucide-react";
import { useEffect, useState } from "react";

type User = {
  name?: string | null;
  email?: string | null;
};

export default function AdminNav({ user }: { user?: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const [newEnquiryCount, setNewEnquiryCount] = useState(0);

  useEffect(() => {
    const checkNewEnquiries = async () => {
      try {
        const res = await fetch("/api/enquiries");
        const data = await res.json();
        if (Array.isArray(data)) {
          const count = data.filter((e: any) => e.status === "new").length;
          setNewEnquiryCount(count);
        }
      } catch (err) {
        console.error("Failed to fetch enquiries:", err);
      }
    };

    checkNewEnquiries();
    const interval = setInterval(checkNewEnquiries, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { href: "/", label: "Go to Website", icon: <Globe className="w-4 h-4" /> },
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: "/admin/products", label: "Products", icon: <Briefcase className="w-4 h-4" /> },
    { href: "/admin/categories", label: "Categories", icon: <FolderTree className="w-4 h-4" /> },
    { href: "/admin/enquiries", label: "Enquiries", icon: <Mail className="w-4 h-4" />, badge: newEnquiryCount > 0 },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 md:h-20 gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-3 transition-opacity hover:opacity-80 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-950 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-300">
                <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <div className="font-serif font-bold text-slate-900 tracking-tight text-base md:text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  StylishBlazer
                </div>
                <div className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-emerald-600">
                  Admin Studio
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-8 h-8 bg-red-50 text-red-600 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop & Mobile Nav Links */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold md:font-semibold transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span className={`${isActive ? "text-emerald-600" : "text-slate-400"} transition-colors`}>
                    {item.icon}
                  </span>
                  {item.label}
                  {item.badge && (
                    <span className="absolute top-1 right-1 md:top-2 md:right-2 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Area (Desktop only) */}
          <div className="hidden md:flex items-center gap-6">
            <div className="items-center gap-3 pl-6 border-l border-slate-100 hidden lg:flex">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 ring-4 ring-slate-50">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="text-right text-[10px] font-bold text-slate-900 truncate max-w-[120px]">
                {user?.name || "Admin"}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="group items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border border-transparent hover:border-red-100 hidden md:flex"
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
