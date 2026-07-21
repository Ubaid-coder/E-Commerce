"use client";

import { useEffect, useState } from "react";
import products from "@/data/products.json";
import ProductCard from "./ProductCard";
import { ProductType } from "@/types/product";
import { getProducts } from "@/services/product.service";
import BloomLoader from "../Loader";

export default function ProductList() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
       <BloomLoader />
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
      {products?.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>

          <h3 className="text-xl font-semibold mb-2">
            No products found
          </h3>

          <p className="text-muted-foreground">
            No products available.
          </p>
        </div>
      )}
    </div>
  );
}