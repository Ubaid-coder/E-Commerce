import AdminSidebar from "@/components/admin/Sidebar";
import React from "react";


export const metadata = {
  title: "Admin Dashboard - Management Portal",
  description: "Internal management area for products, orders, and users.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Wrapper */}
      <div className="pl-64">
        {/* Top bar placeholder for global admin actions (e.g., Search, Admin profile) */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-semibold text-slate-700">Management Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-900">Admin User</span>
              
            </div>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}