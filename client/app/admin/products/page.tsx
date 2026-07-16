"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/services/product.service";
import { getProducts } from "@/services/product.service";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  brand: string;
  category: {
    _id: string;
    name: string;
    slug: string
  };
  images: string[];
  stock: number;
  isFeatured: boolean;
  isPublished: boolean;
  ratingsAverage: number;
  ratingsQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
        console.log(response.data)

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(productId);

      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
      toast.success("Product Deleted Successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products</h1>
          <p className="text-sm text-slate-500 mt-1">Manage, edit, and track your store's inventory.</p>
        </div>
        <Link href={'products/new'}>
        
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl h-11 px-5 shadow-sm transition-all duration-200">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
        </Link>
      </div>

      {/* Controls Bar (Search and Filters) */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto gap-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Product Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg className="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium text-slate-400">Loading your catalog...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 px-4">
            <p className="text-slate-500 font-medium">No products found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusted search queries or add a brand new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Product & Brand</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">DiscountPrice</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={56}
                          height={56}
                          className="rounded-lg object-cover border"
                        />

                        <div>
                          <h3 className="font-semibold">
                            {product.name}
                          </h3>

                          <p className="text-xs text-slate-500 mt-1">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {product.category.name}
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      ${product.price}
                    </td>

                    <td className="px-6 py-4 font-semibold text-green-600">
                      ${product.discountPrice}
                    </td>

                    <td className="px-6 py-4">
                      {product.stock}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${product.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {product.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                        >
                          <Link href={`/admin/products/edit/${product._id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

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