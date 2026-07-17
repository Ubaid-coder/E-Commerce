"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCategory } from "@/services/categories.service";
import { toast } from "react-hot-toast";

interface NewCategoryFormData {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  image:string
}

export default function NewCategoryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<NewCategoryFormData>({
    name: "",
    slug: "",
    description: "",
    isActive: true,
    image:""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        // Automatically generate a basic URL slug as they type the category name
        if (name === "name") {
          updated.slug = value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
        }
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      // Replace with your category creation POST API endpoint
      const response = await createCategory(formData);

      const {data} = await response;
      console.log(data);
        toast.success("Category Added Successfully");
        router.push("/admin/categories");
     
    } catch (error: any) {
        toast.error(error.message);
      console.error("Error creating category:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      {/* Header back navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/category")}
          type="button"
          className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Category</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Add a new structured segment to your store layout.</p>
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        
        {/* Category Name Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Category Title</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900"
            placeholder="e.g. Smart Home Electronics"
          />
        </div>

        {/* Image  Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Category Image</label>
          <input
            type="text"
            name="image"
            required
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900"
            placeholder="Image Name"
          />
        </div>

        {/* URL Slug Input (Auto-populates, but remains editable) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">URL Slug Route</label>
          <div className="flex items-center">
            <span className="bg-slate-100 border border-r-0 border-slate-200 text-slate-400 text-sm px-3 py-2.5 rounded-l-xl select-none">
              /category/
            </span>
            <input
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 font-mono"
              placeholder="smart-home-electronics"
            />
          </div>
        </div>

        {/* Summary Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Brief Description</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 resize-none"
            placeholder="Describe what kind of products fit inside this department mapping..."
          />
        </div>

        {/* Visibility Setting */}
        <div className="pt-4 border-t border-slate-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800">Activate Section</span>
              <span className="text-[10px] text-slate-400">Make this visible on user search indices and navbar listings immediately</span>
            </div>
          </label>
        </div>

        {/* Form Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => router.push("/admin/category")}
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
                Creating...
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                Add Category
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}