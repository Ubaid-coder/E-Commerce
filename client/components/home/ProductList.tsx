"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ProductType } from "@/types/product";
import { getProducts } from "@/services/product.service";
import BloomLoader from "../Loader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationMeta {
  page: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 12,
    totalProducts: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts(currentPage, 12);

        if (response?.success) {
          setProducts(response.products);
          setPagination(response.pagination);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Helper function to calculate a clean page range (e.g. 1 2 3 ... 67)
  const getPageNumbers = () => {
    const total = pagination.totalPages;
    const current = currentPage;
    const pages: (number | string)[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, "...", total);
      } else if (current >= total - 2) {
        pages.push(1, "...", total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, "...", current - 1, current, current + 1, "...", total);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="text-center py-20 flex justify-center items-center">
        <BloomLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6">
      {/* Product Card Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products?.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">No products available.</p>
          </div>
        )}
      </div>

      {/* Truncated Pagination Footer Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground">
            Showing page <span className="font-bold text-foreground">{pagination.page}</span> of{" "}
            <span className="font-bold text-foreground">{pagination.totalPages}</span> ({pagination.totalProducts} total items)
          </p>

          <div className="flex items-center gap-2">
            {/* Previous Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="gap-1 text-xs"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Smart Page Range Buttons */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((item, idx) =>
                typeof item === "number" ? (
                  <Button
                    key={idx}
                    size="sm"
                    variant={currentPage === item ? "default" : "outline"}
                    onClick={() => handlePageChange(item)}
                    className="h-8 w-8 p-0 text-xs font-bold"
                  >
                    {item}
                  </Button>
                ) : (
                  <span key={idx} className="px-1 text-xs text-muted-foreground font-semibold">
                    {item}
                  </span>
                )
              )}
            </div>

            {/* Next Page Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="gap-1 text-xs"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}