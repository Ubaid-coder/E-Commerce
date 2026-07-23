"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ProductCard from "./ProductCard";
import { ProductType } from "@/types/product";
import {
  getProducts,
  getCategories,
  getFeaturedProductsByCategory,
} from "@/services/product.service";
import BloomLoader from "../Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2, Sparkles } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface CategoryGroup {
  _id: string;
  categoryName: string;
  products: ProductType[];
}

export default function ProductList() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Selected filter state: "" = All, "featured" = Featured, or a Category ID
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Sentinel DOM node reference to trigger infinite loading
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Debounce logic for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 600);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 1. Fetch Categories on mount
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

  // 2. Fetch Products Function
  const fetchProducts = useCallback(
    async (
      pageNumber: number,
      categoryMode: string,
      searchQuery: string,
      isReset: boolean = false
    ) => {
      try {
        setLoading(true);

        // FEATURED MODE: Call backend featured endpoint when user clicks 'Featured' button
        if (categoryMode === "featured" && !searchQuery) {
          const response = await getFeaturedProductsByCategory();
          const groups: CategoryGroup[] =
            response?.data?.data || response?.data || response?.featured || [];

       

          setProducts(groups);
          
          setHasMore(false); // No infinite scrolling for the set of featured items
          return;
        }

        // STANDARD / CATEGORY / SEARCH MODE: Standard paginated API fetch
        const targetCategory = categoryMode === "featured" ? "" : categoryMode;
        const response = await getProducts(
          pageNumber,
          12,
          targetCategory,
          searchQuery
        );

        if (response?.success) {
          const fetchedProducts =
            response.products ||
            response.data?.products ||
            response.data ||
            [];
          const totalPages =
            response.pagination?.totalPages || response.totalPages || 1;

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

  // 3. Category/Filter Click Event Handler
  const handleCategorySelect = (categoryMode: string) => {
    if (selectedCategory === categoryMode) return;

    setSelectedCategory(categoryMode);
    setPage(1);
    setProducts([]);
    setHasMore(true);

    fetchProducts(1, categoryMode, debouncedSearch, true);
  };

  // 4. Trigger fetch when search query updates
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(1, selectedCategory, debouncedSearch, true);
  }, [debouncedSearch, fetchProducts]);

  // 5. Infinite Scroll Observer
  useEffect(() => {
    // Disable infinite scroll listener in static featured mode when there is no active search query
    if (selectedCategory === "featured" && !debouncedSearch) return;

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
  }, [
    hasMore,
    loading,
    initialLoading,
    selectedCategory,
    debouncedSearch,
    fetchProducts,
  ]);

  if (initialLoading) {
    return (
      <div className="text-center py-20 flex justify-center items-center">
        <BloomLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6">
      
      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 rounded-full bg-background border-border shadow-sm focus-visible:ring-primary"
        />

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

      {/* Category & Featured Pills Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* All Products Option */}
        <Button
          variant={selectedCategory === "" ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategorySelect("")}
          className="rounded-full text-xs font-semibold px-4 shrink-0 transition-all"
        >
          All
        </Button>

        {/* Featured Products Button */}
        <Button
          variant={selectedCategory === "featured" ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategorySelect("featured")}
          className="rounded-full text-xs font-semibold px-4 shrink-0 transition-all gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          Featured
        </Button>

        {/* Dynamic Categories */}
        {categories.length > 0 &&
          categories.map((category) => (
            <Button
              key={category._id}
              variant={
                selectedCategory === category._id ? "default" : "outline"
              }
              size="sm"
              onClick={() => handleCategorySelect(category._id)}
              className="rounded-full text-xs font-semibold px-4 shrink-0 transition-all"
            >
              {category.name}
            </Button>
          ))}
      </div>

      {/* Product Cards Grid */}
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
                  : "No products available in this selection."}
              </p>
            </div>
          )
        )}
      </div>

      {/* Bottom Loading Indicator & Infinite Scroll Target */}
      <div
        ref={observerTarget}
        className="py-8 flex flex-col items-center justify-center min-h-[80px]"
      >
        {loading && <BloomLoader />}

        {!hasMore && products.length > 0 && (
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {selectedCategory === "featured"
              ? "Showing all featured products"
              : "You've reached the end of the catalog"}
          </p>
        )}
      </div>

    </div>
  );
}