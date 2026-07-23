"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ProductCard from "./ProductCard";
import { ProductType } from "@/types/product";
import { getProducts, getCategories } from "@/services/product.service";
import BloomLoader from "../Loader";
import { Button } from "@/components/ui/button";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Empty string = All Products

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Sentinel DOM node reference to trigger infinite loading
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // 1. Fetch Categories once when the component mounts
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await getCategories();
        // Fallback checks to safely extract categories list regardless of API structure
        const list =
          response?.data?.data ||
          response?.data ||
          response?.categories ||
          [];

        if (Array.isArray(list)) {
          setCategories(list);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    fetchCategoriesData();
  }, []);

  // 2. Main Fetch Products Function
  const fetchProducts = useCallback(
    async (pageNumber: number, category: string, isReset: boolean = false) => {
      try {
        setLoading(true);
        const response = await getProducts(pageNumber, 12, category);

        if (response?.success) {
          const fetchedProducts =
            response.products || response.data?.products || response.data || [];
          const totalPages =
            response.pagination?.totalPages || response.totalPages || 1;

          // Replace list if selecting a new category/page 1, otherwise append
          setProducts((prev) =>
            isReset || pageNumber === 1
              ? fetchedProducts
              : [...prev, ...fetchedProducts]
          );

          setHasMore(pageNumber < totalPages);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    []
  );

  // 3. Category Click Event Handler
  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) return;

    // Reset pagination state
    setSelectedCategory(category);
    setPage(1);
    setProducts([]); // Clear existing items immediately for smooth UI transition
    setHasMore(true);

    // Fetch page 1 for the newly selected category immediately
    fetchProducts(1, category, true);
  };

  // 4. Initial Mount Load
  useEffect(() => {
    fetchProducts(1, "");
  }, [fetchProducts]);

  // 5. Infinite Scroll Intersection Observer (Triggers for Page 2, 3, etc.)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading && !initialLoading) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchProducts(nextPage, selectedCategory, false);
            return nextPage;
          });
        }
      },
      { rootMargin: "300px" } // Pre-fetches 300px before scrolling hits the bottom
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
  }, [hasMore, loading, initialLoading, selectedCategory, fetchProducts]);

  if (initialLoading) {
    return (
      <div className="text-center py-20 flex justify-center items-center">
        <BloomLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6">
      
      {/* Category Pills Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Button
          variant={selectedCategory === "" ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategorySelect("")}
          className="rounded-full text-xs font-semibold px-4 shrink-0 transition-all"
        >
          All
        </Button>

        {categories.length > 0 &&
          categories.map((category) => (
            <Button
              key={category._id}
              variant={selectedCategory === category._id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategorySelect(category._id)}
              className="rounded-full text-xs font-semibold px-4 shrink-0 transition-all"
            >
              {category.name}
            </Button>
          ))}
      </div>

      {/* Product Card Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products?.length > 0 ? (
          products.map((product, index) => (
            <ProductCard key={`${product._id}-${index}`} product={product} />
          ))
        ) : (
          !loading && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                No products available in this category.
              </p>
            </div>
          )
        )}
      </div>

      {/* Infinite Scroll Trigger & Bottom Loading Indicator */}
      <div
        ref={observerTarget}
        className="py-8 flex flex-col items-center justify-center min-h-[80px]"
      >
        {loading && <BloomLoader />}

        {!hasMore && products.length > 0 && (
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            You've reached the end of the catalog
          </p>
        )}
      </div>

    </div>
  );
}