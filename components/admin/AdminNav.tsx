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
  Menu,
  X,
  Bell,
  Phone
} from "lucide-react";
import { useEffect, useState } from "react";

type User = {
  name?: string | null;
  email?: string | null;
};

export default function AdminNav({ user }: { user?: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-3 transition-opacity hover:opacity-80 group">
            <div className="w-10 h-10 bg-emerald-950 rounded-xl flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-300">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-bold text-slate-900 tracking-tight text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                StylishBlazer
              </div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-emerald-600">
                Admin Studio
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
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
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-2 md:gap-6">
            {/* User Menu - Tablet/Desktop */}
            <div className="items-center gap-3 pl-6 border-l border-slate-100 hidden lg:flex">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 ring-4 ring-slate-50">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                  {user?.name || "Admin"}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">{user?.email || "admin@SB.com"}</div>
              </div>
            </div>

            {/* Logout - Desktop */}
            <button
              onClick={handleLogout}
              className="hidden md:flex group items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border border-transparent hover:border-red-100"
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Exit</span>
            </button>

            {/* Contact Display - Desktop */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100/50">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-950">+91 7906200663</span>
            </div>

            {/* Mobile Contact Icon */}
            <a 
              href="tel:+917906200663"
              className="md:hidden flex items-center justify-center w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl"
            >
              <Phone className="w-5 h-5" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-xl active:scale-95 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              {newEnquiryCount > 0 && !isMobileMenuOpen && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-2xl animate-in slide-in-from-top-4 duration-300 z-[99]">
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-4 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 active:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={isActive ? "text-emerald-600" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {item.badge ? (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {newEnquiryCount} New
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  )}
                </Link>
              );
            })}
            
            <div className="pt-4 mt-2 border-t border-slate-100">
               <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
