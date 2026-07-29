"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct, getProducts } from "@/services/product.service";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  brand: string;
  category: Category | string;
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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 1000; // Number of items per page

  // Debounce search input to reset page and delay API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on new search query
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch products with dynamic page, limit, and search parameters
  const fetchProducts = useCallback(async (page: number, query: string) => {
    try {
      setLoading(true);
      const response = await getProducts(page, limit, "", query);

      // Extract products array safely
      const productList =
        response?.products ||
        response?.data?.products ||
        response?.data ||
        [];

      setProducts(Array.isArray(productList) ? productList : []);

      // Parse pagination metadata dynamically from backend
      const totalCount =
        response?.total ||
        response?.count ||
        response?.data?.total ||
        productList.length;

      const calcTotalPages =
        response?.pages ||
        response?.totalPages ||
        Math.ceil(totalCount / limit) ||
        1;

      setTotalProducts(totalCount);
      setTotalPages(calcTotalPages);
    } catch (error) {
      console.error("Failed to fetch admin products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Trigger fetch whenever page or debounced search changes
  useEffect(() => {
    fetchProducts(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch, fetchProducts]);

  // Delete product action handler
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

      // Refetch current page to adjust for item count change
      fetchProducts(currentPage, debouncedSearch);
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error("Failed to delete product.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Products
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, edit, and track your store's inventory.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl h-11 px-5 shadow-sm transition-all duration-200">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Controls Bar (Search Bar & Filters) */}
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
        <Button
          variant="outline"
          className="w-full sm:w-auto gap-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Product Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="animate-spin h-8 w-8 text-emerald-600" />
            <span className="text-sm font-medium text-slate-400">
              Loading your catalog...
            </span>
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-20 px-4">
            <p className="text-slate-500 font-medium">No products found</p>
            <p className="text-xs text-slate-400 mt-1">
              {debouncedSearch
                ? `No items matched "${debouncedSearch}"`
                : "Try adding a brand new product."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Product & Brand</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Discount Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                  {products?.map((product) => {
                    const imageSrc =
                      product.images?.[0] || "/placeholder-image.jpg";

                    const categoryName =
                      typeof product.category === "object" && product.category
                        ? product.category.name
                        : "Uncategorized";

                    return (
                      <tr
                        key={product._id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                              <Image
                                src={imageSrc}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div>
                              <h3 className="font-semibold text-slate-900 line-clamp-1">
                                {product.name}
                              </h3>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {product.brand || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {categoryName}
                        </td>

                        <td className="px-6 py-4 font-semibold text-slate-900">
                          ${product.price}
                        </td>

                        <td className="px-6 py-4 font-semibold text-emerald-600">
                          {product.discountPrice
                            ? `$${product.discountPrice}`
                            : "-"}
                        </td>

                        <td className="px-6 py-4 font-medium">{product.stock}</td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              product.isPublished
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
                              className="h-8 w-8 text-slate-600 hover:bg-slate-100"
                            >
                              <Link href={`/admin/products/edit/${product._id}`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>

                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDelete(product._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 text-xs text-slate-500 gap-3">
              <p>
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {Math.min((currentPage - 1) * limit + 1, totalProducts)}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-800">
                  {Math.min(currentPage * limit, totalProducts)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800">
                  {totalProducts}
                </span>{" "}
                products
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-3 rounded-lg border-slate-200 text-slate-600"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1 px-2">
                  <span className="font-semibold text-slate-800">
                    {currentPage}
                  </span>
                  <span>/</span>
                  <span>{totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage >= totalPages}
                  className="h-8 px-3 rounded-lg border-slate-200 text-slate-600"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}