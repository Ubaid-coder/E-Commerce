"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductType } from "@/types/product";
import { getProducts } from "@/services/product.service";
import Image from "next/image";
import Link from "next/link";
import BloomLoader from "../../components/Loader";

interface RelatedProductsProps {
  categoryId?: string;
  currentProductId: string;
}

export default function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Sentinel ref for infinite scroll
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Fetch products by category
  const fetchRelatedProducts = useCallback(
    async (pageNumber: number) => {
      if (!categoryId) return;

      try {
        setLoading(true);
        // Fetch products for specific category
        const response = await getProducts(pageNumber, 8, categoryId);

        if (response?.success) {
          const fetchedProducts =
            response.products || response.data?.products || response.data || [];
          const totalPages =
            response.pagination?.totalPages || response.totalPages || 1;

          // Exclude the current product being viewed
          const filteredProducts = fetchedProducts.filter(
            (item: ProductType) => item._id !== currentProductId
          );

          setProducts((prev) =>
            pageNumber === 1 ? filteredProducts : [...prev, ...filteredProducts]
          );

          setHasMore(pageNumber < totalPages);
        }
      } catch (error) {
        console.error("Failed to load related products:", error);
      } finally {
        setLoading(false);
      }
    },
    [categoryId, currentProductId]
  );

  // Reset and load initial page on mount or product/category change
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchRelatedProducts(1);
  }, [categoryId, currentProductId, fetchRelatedProducts]);

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchRelatedProducts(nextPage);
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
  }, [hasMore, loading, fetchRelatedProducts]);

  if (!categoryId) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-foreground">Related Products</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((relatedProduct, index) => (
          <Card
            key={`${relatedProduct._id}-${index}`}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <Link href={`/product/${relatedProduct._id}`}>
              <div className="aspect-square overflow-hidden bg-muted">
                <Image
                  src={relatedProduct.images[0]}
                  alt={relatedProduct.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-1 mb-2">
                  {relatedProduct.name}
                </h3>
                <p className="text-lg font-bold text-primary">
                  ${relatedProduct.price.toFixed(2)}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Infinite Scroll Trigger Indicator */}
      <div
        ref={observerTarget}
        className="py-8 flex flex-col items-center justify-center min-h-[80px]"
      >
        {loading && <BloomLoader />}

        {!hasMore && products.length > 0 && (
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            No more related products
          </p>
        )}
      </div>
    </div>
  );
}