"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ProductCard from "./ProductCard";
import { ProductType } from "@/types/product";
import { getProducts } from "@/services/product.service";
import BloomLoader from "../Loader";

export default function ProductList() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Sentinel DOM reference for triggering the next page load
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const fetchProducts = useCallback(async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await getProducts(pageNumber, 12);

      if (response?.success) {
        // Append new items to previous ones
        setProducts((prev) =>
          pageNumber === 1 ? response.products : [...prev, ...response.products]
        );

        // Check if there are more pages available
        setHasMore(pageNumber < response.pagination.totalPages );
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  // Fetch initial page on mount
  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  // Observer callback to detect scrolling near the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading && !initialLoading) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchProducts(nextPage);
            return nextPage;
          });
        }
      },
      { rootMargin: "500px" } // Triggers 500px before reaching the exact bottom
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, initialLoading, fetchProducts]);

  if (initialLoading) {
    return (
      <div className="text-center py-20 flex justify-center items-center">
        <BloomLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6">
      {/* Product Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products?.length > 0 ? (
          products.map((product, index) => (
            <ProductCard key={`${product._id}-${index}`} product={product} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">No products available.</p>
          </div>
        )}
      </div>

      {/* Infinite Scroll Trigger Sentinel & Loading Indicator */}
      <div ref={observerTarget} className="py-8 flex flex-col items-center justify-center min-h-[80px]">
        {loading && (
          <div className="flex items-center gap-2">
            <BloomLoader />
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            You've reached the end of the catalog
          </p>
        )}
      </div>
    </div>
  );
}