"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProduct, updateProduct } from "@/services/product.service";
import { toast } from "react-hot-toast";

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    discountPrice: number;
    brand: string;

    stock: number;
    imageInput: string; // To let users update the image URL string easily
    isFeatured: boolean;
    isPublished: boolean;
}

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        price: 0,
        discountPrice: 0,
        brand: "",
        stock: 0,
        imageInput: "",
        isFeatured: false,
        isPublished: true,
    });

    // Fetch product data on load
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                // Replace with your endpoint for retrieving a single product detail
                const response = await getProduct(id as string);
                const product:ProductFormData = response.data;


                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    price: product.price || 0,
                    discountPrice: product.discountPrice || 0,
                    brand: product.brand || "",
                    stock: product.stock || 0,
                    imageInput: product.images?.[0] || "",
                    isFeatured: product.isFeatured || false,
                    isPublished: product.isPublished ?? true,
                });
              

            } catch (error) {
                console.error("Failed to load product for editing:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

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

            await updateProduct(id as string, {
                name: formData.name,
                description: formData.description,
                brand: formData.brand,
                category: formData.category,
                price: Number(formData.price),
                discountPrice: Number(formData.discountPrice),
                stock: Number(formData.stock),
                image: formData.imageInput,
                isFeatured: formData.isFeatured,
                isPublished: formData.isPublished,
            });

            toast.success("Product updated successfully!");

            router.push("/admin/products");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update product.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin h-8 w-8 text-emerald-600" />
                <span className="text-sm font-medium text-slate-500">Retrieving product specs...</span>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header action back navigation */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push("/admin/products")}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Product</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Modify properties, images, and pricing details.</p>
                </div>
            </div>

            {/* Main Edit Form */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">

                {/* Row 1: Product Name */}
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

                {/* Row 2: Description */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Detailed Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 resize-none"
                        placeholder="Introduce features, quality, and box content details..."
                    />
                </div>

                {/* Row 3: Grid fields (Category, Brand, Stock) */}
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
                            placeholder="Brand name"
                        />
                    </div>

                    {/* <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Category ID / Name</label>
                        <input
                            type="text"
                            name="category"
                            required
                            value={formData.category._id}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            placeholder="Category slug/ID"
                        />
                    </div> */}

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

                {/* Row 4: Pricing Grid */}
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

                {/* Row 5: Cover Image URL Link */}
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

                {/* Row 6: Configuration Switches (Featured & Live status) */}
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
                            <span className="text-[10px] text-slate-400">Promote it on home pages or featured slots</span>
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
                            <span className="text-[10px] text-slate-400">Let it be visible immediately to shoppers</span>
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
                                <Save className="h-4 w-4" />
                                Save Product
                            </>
                        )}
                    </Button>
                </div>

            </form>
        </div>
    );
}