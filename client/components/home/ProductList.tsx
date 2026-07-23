"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ProductCard from "./ProductCard";
import { ProductType } from "@/types/product";
import { getProducts, getCategories } from "@/services/product.service";
import BloomLoader from "../Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Empty string = All Products
  
  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Sentinel DOM node reference to trigger infinite loading
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Debounce logic: Increased delay to 600ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 600);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 1. Fetch Categories once on mount
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await getCategories();
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
    async (
      pageNumber: number,
      category: string,
      searchQuery: string,
      isReset: boolean = false
    ) => {
      try {
        setLoading(true);
        const response = await getProducts(pageNumber, 12, category, searchQuery);

        if (response?.success) {
          const fetchedProducts =
            response.products || response.data?.products || response.data || [];
          const totalPages =
            response.pagination?.totalPages || response.totalPages || 1;

          // Replace list if selecting new category/search/page 1, otherwise append
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

    setSelectedCategory(category);
    setPage(1);
    setProducts([]);
    setHasMore(true);

    fetchProducts(1, category, debouncedSearch, true);
  };

  // 4. Trigger fetch when debounced search term changes
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(1, selectedCategory, debouncedSearch, true);
  }, [debouncedSearch, fetchProducts]);

  // 5. Infinite Scroll Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading && !initialLoading) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchProducts(nextPage, selectedCategory, debouncedSearch, false);
            return nextPage;
          });
        }
      },
      { rootMargin: "300px" }
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
  }, [hasMore, loading, initialLoading, selectedCategory, debouncedSearch, fetchProducts]);

  if (initialLoading) {
    return (
      <div className="text-center py-20 flex justify-center items-center">
        <BloomLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6">
      
      {/* Search Input Bar with Embedded Spinner */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 rounded-full bg-background border-border shadow-sm focus-visible:ring-primary"
        />

        {/* Show active spinner inside input when fetching search results */}
        {loading && searchTerm ? (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        ) : searchTerm ? (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

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
                {debouncedSearch
                  ? `No items match "${debouncedSearch}"`
                  : "No products available in this category."}
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