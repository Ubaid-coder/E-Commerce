"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Users, 
  Settings, 
  LogOut,
  ShieldCheck,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Layers,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Handle your logout logic here (clear tokens, router push, etc.)
    console.log("Logging out...");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 font-sans">
      {/* Brand Logo / Header */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Admin Portal</h2>
          <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Management</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          // Matches exact route or sub-routes (e.g. /admin/products/new matches /admin/products)
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive 
                    ? "text-emerald-600" 
                    : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout Button */}
      <div className="border-t border-slate-100 pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50/50 transition-colors group"
        >
          <LogOut className="h-5 w-5 shrink-0 text-rose-400 group-hover:text-rose-600 transition-colors" />
          Logout
        </button>
      </div>
    </aside>
  );
}