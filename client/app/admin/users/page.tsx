"use client";

import React, { useEffect, useState } from "react";
import { Search, ShieldAlert, UserCheck, Trash2, Mail, Shield } from "lucide-react";
import { deleteUser, getUsers, updateUser } from "@/services/user.service";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers();
        const data = await response.data;
          setUsers(data);
        
      } catch (error) {
        console.error("Failed to load user directories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: "user" | "admin") => {
    const newRole = currentRole === "admin" ? "customer" : "admin";
    if (confirm(`Change this account tier status to ${newRole.toUpperCase()}?`)) {
      try {
        const response = await updateUser(userId, newRole);
        const data = await response.data;
     
          setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
        toast.success(`User role chaned to ${newRole}`)
      } catch (error) {
        console.error("Failed to update security privileges:", error);
        toast.error("Failed to change Role")
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to permanently delete this user profile?")) {
      try {
        const response = await deleteUser(userId);

        const {success} = await response;
        if (success) {
          setUsers(users.filter((u) => u._id !== userId));
          toast.success("User deleted successfully");
        }
      } catch (error) {
        console.error("Failed to remove target credentials:", error);
        toast.error("User Failed to delte!");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Deck */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Accounts</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Audit member credentials, verify security levels, and monitor customer accounts.</p>
      </div>

      {/* Standalone Search Deck */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Main Registry Matrix Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg className="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium text-slate-400">Loading user profiles...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 px-4">
            <p className="text-slate-500 font-medium">No registered profiles matches your tracking text.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Full Identity Name</th>
                  <th className="px-6 py-4">Contact Parameter</th>
                  <th className="px-6 py-4">Registration Date</th>
                  <th className="px-6 py-4">Privilege Tier</th>
                  <th className="px-6 py-4 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                {users.map((user) => {
                  const isAdmin = user.role === "admin";

                  return (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                      {/* Name Details */}
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {user.name}
                      </td>

                      {/* Email Identity */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Created Node calendar timestamp */}
                      <td className="px-6 py-4 text-slate-400 font-medium">
                        {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>

                      {/* Security Tier Tag */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wide ${
                          isAdmin 
                            ? "bg-purple-50 text-purple-700 border-purple-100" 
                            : "bg-slate-50 text-slate-500 border-slate-200"
                        }`}>
                          <Shield className="h-2.5 w-2.5" />
                          {user.role}
                        </span>
                      </td>

                      {/* Actions modifications triggers */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button 
                            onClick={() => handleRoleToggle(user._id, user.role)}
                            title={isAdmin ? "Demote user status" : "Promote to Admin security tier"}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-amber-600 transition-colors"
                          >
                            {isAdmin ? <ShieldAlert className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user._id)}
                            title="Ban and strip access keys"
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}