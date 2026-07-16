"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/services/product.service";
import { toast } from "react-hot-toast";
import { getCategories } from "@/services/categories.service";

interface NewProductFormData {
    name: string;
    description: string;
    price: number;
    discountPrice: number;
    brand: string;
    category: string;
    stock: number;
    imageInput: string;
    isFeatured: boolean;
    isPublished: boolean;
}

export default function NewProductPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState<NewProductFormData>({
        name: "",
        description: "",
        price: 0,
        discountPrice: 0,
        brand: "",
        category: "",
        stock: 0,
        imageInput: "",
        isFeatured: false,
        isPublished: true,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "number" ? Number(value) : value,
            }));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);

            const payload = {
                name: formData.name,
                slug: formData.name
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-"),

                description: formData.description,
                price: formData.price,
                discountPrice: formData.discountPrice,
                brand: formData.brand,
                category: formData.category,
                stock: formData.stock,

                images: [formData.imageInput], // ✅ array

                isFeatured: formData.isFeatured,
                isPublished: formData.isPublished,
            };

            await createProduct(payload);

            toast.success("Product created successfully!");
            router.push("/admin/products");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create product.");
        } finally {
            setSaving(false);
        }
    };


    return (
        <div className="max-w-3xl mx-auto space-y-6 font-sans">
            {/* Header action back navigation */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push("/admin/products")}
                    type="button"
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Product</h1>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">Add a brand new item to your store's inventory catalog.</p>
                </div>
            </div>

            {/* Main Creation Form */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">

                {/* Product Name */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Product Title</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900"
                        placeholder="e.g. Sony WH-1000XM5"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Detailed Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 resize-none"
                        placeholder="Introduce features, quality, specs, and packaging content..."
                    />
                </div>

                {/* Category, Brand, Stock */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            required
                            value={formData.brand}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            placeholder="e.g. Sony"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border rounded-xl"
                        >
                            <option value="">Select Category</option>

                            {categories.map((category: any) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Stock Quantity</label>
                        <input
                            type="number"
                            name="stock"
                            min={0}
                            required
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Regular Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            min={0}
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Discount Price ($)</label>
                        <input
                            type="number"
                            name="discountPrice"
                            min={0}
                            value={formData.discountPrice}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>
                </div>

                {/* Cover Image URL Link */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Product Image URL</label>
                    <div className="relative">
                        <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="url"
                            name="imageInput"
                            required
                            value={formData.imageInput}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            placeholder="https://images.unsplash.com/..."
                        />
                    </div>
                </div>

                {/* Configuration Switches (Featured & Live status) */}
                <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                            className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-800">Feature this product</span>
                            <span className="text-[10px] text-slate-400">Highlight this item on home pages or featured slots</span>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-800">Publish Product</span>
                            <span className="text-[10px] text-slate-400">Make it viewable and available for checkout instantly</span>
                        </div>
                    </label>
                </div>

                {/* Actions Submit / Cancel */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={saving}
                        onClick={() => router.push("/admin/products")}
                        className="rounded-xl h-11 px-5 border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 gap-2 min-w-32"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <PlusCircle className="h-4 w-4" />
                                Add Product
                            </>
                        )}
                    </Button>
                </div>

            </form>
        </div>
    );
}