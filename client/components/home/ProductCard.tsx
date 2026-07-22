"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Eye, Heart, ShoppingCart, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { ProductType } from "@/types/product";
import noProductImage from "../../public/images/noProductImage.jpg";

export default function ProductCard({ product }: { product: ProductType }) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      images: product.images?.[0] || "",
      quantity: 1,
    });

    setIsAdding(false);
    setJustAdded(true);

    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Card className="group relative rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      
      {/* Top Image Preview & Actions Area */}
      <div className="relative overflow-hidden bg-muted/30">
        
        {/* Like Button Trigger */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Wishlist Button"
          className={cn(
            "absolute top-3 right-3 z-10 h-9 w-9 rounded-full transition-all duration-200 bg-background/80 backdrop-blur-md shadow-sm border border-border/40 hover:bg-background hover:scale-105",
            isLiked ? "opacity-100 text-rose-500 fill-rose-500" : "opacity-0 group-hover:opacity-100 text-muted-foreground"
          )}
          onClick={handleToggleLike}
        >
          <Heart className={cn("h-4 w-4 transition-transform", isLiked && "fill-current scale-110")} />
        </Button>

        {/* Product Brand Badge */}
        {product.brand && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-background/80 backdrop-blur-md border border-border/40 text-foreground shadow-sm">
            {product.brand}
          </div>
        )}

        {/* Main Product Image Container */}
        <Link href={`/product/${product._id}`} className="block relative aspect-square overflow-hidden">
          {!imageError && product?.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-108"
              onError={() => setImageError(true)}
            />
          ) : (
            <Image
              src={noProductImage}
              alt="No Image Available"
              fill
              className="object-cover opacity-60"
            />
          )}

          {/* Quick View Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full shadow-lg font-semibold text-xs gap-1.5 h-9 px-4 bg-background/95 hover:bg-background text-foreground"
            >
              <Eye className="h-3.5 w-3.5" />
              Quick View
            </Button>
          </div>
        </Link>
      </div>

      {/* Card Body Content */}
      <CardContent className="p-4 space-y-3 flex-grow flex flex-col justify-between">
        
        <div className="space-y-1.5">
          {/* Ratings Display */}
          {product.ratingsAverage !== undefined && (
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{product.ratingsAverage.toFixed(1)}</span>
              {product.ratingsQuantity !== undefined && (
                <span className="text-muted-foreground font-normal text-[11px]">
                  ({product.ratingsQuantity})
                </span>
              )}
            </div>
          )}

          {/* Title Link */}
          <Link href={`/product/${product._id}`}>
            <h3 className="font-semibold text-foreground text-sm line-clamp-2 leading-snug hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Add-to-Cart Controls */}
        <div className="space-y-3 pt-2 border-t border-border/40">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-foreground">
              ${(product.discountPrice || product.price).toFixed(2)}
            </span>
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-xs font-medium text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <Button
            className={cn(
              "w-full h-10 rounded-xl font-semibold text-xs transition-all duration-200 shadow-sm gap-2",
              justAdded
                ? "bg-emerald-600 text-white hover:bg-emerald-600"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : justAdded ? (
              <>
                <Check className="h-4 w-4" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}