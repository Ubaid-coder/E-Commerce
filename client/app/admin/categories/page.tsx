"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCategory, getCategories } from "@/services/categories.service";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    productCount: number;
}

export default function AdminCategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await getCategories();
                const product = await response.data;

                setCategories(product);


            } catch (error) {
                console.error("Failed to load categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);


    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this category?")) {
            setCategories(categories.filter((c) => c._id !== id));
            try {
                await deleteCategory(id);
                toast.success("Product Delted Successfully");
            } catch (error: any) {
                toast.error(error.message);
            }

        }
    };

    return (
        <div className="space-y-6">
            {/* Top Heading Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Categories</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Manage, edit, and audit your store departments.</p>
                </div>
                <Link href={"/admin/categories/new"}>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl h-11 px-5 shadow-sm transition-all duration-200">
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Button>
                </Link>
            </div>

            {/* Standalone Search Deck */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Main Categories Grid/Table wrapper */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <svg className="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-sm font-medium text-slate-400">Loading catalog segments...</span>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <p className="text-slate-500 font-medium">No categories found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">Category Details</th>
                                    <th className="px-6 py-4">Visibility Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                                {categories.map((category) => (
                                    <tr key={category._id} className="hover:bg-slate-50/50 transition-colors group">
                                        {/* Category Title info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shrink-0">
                                                    <Folder className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900">{category.name}</h4>
                                                    {category.description && (
                                                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{category.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Active state switch status pill */}
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wide ${category.isActive
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : "bg-slate-50 text-slate-500 border-slate-200"
                                                }`}>
                                                {category.isActive ? "Active" : "Archived"}
                                            </span>
                                        </td>

                                        {/* CRUD Actions column matches exactly with product listing */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link href={`/admin/categories/edit/${category._id}`}>
                                                    <button className="p-1.5 bg-slate-100 rounded-lg text-slate-400  hover:text-emerald-600 transition-colors">
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category._id)}
                                                    className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400  hover:text-rose-600 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}