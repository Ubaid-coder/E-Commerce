"use client";

import Features from "@/components/product/Features";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";
import ProductNotFound from "@/components/product/ProductNotFound";
import RelatedProducts from "@/components/product/RelatedProducts";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { ProductType } from "@/types/product";
import { getProduct } from "@/services/product.service";
import { getProductReviews, ProductReview } from "@/services/reviews.service";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import noImageFound from "../../../public/images/NoImage.jpg";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  Loader2,
  Minus,
  MessageSquare,
  Plus,
  Share2,
  ShoppingCart,
  Star,
  User,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { BloomLoader } from "@/components/Loader";
import { toast } from "sonner";

export default function Product() {
  const { addToCart } = useCart();
  const { productId } = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  // Reviews States
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [showReviews, setShowReviews] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsFetched, setReviewsFetched] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProduct(productId as string);
        setProduct(response?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Fetch reviews when button is clicked
  const handleToggleReviews = async () => {
    if (!showReviews && !reviewsFetched) {
      try {
        setLoadingReviews(true);
        const response = await getProductReviews(productId as string);
        if (response.success) {
          setReviews(response.reviews);
          setReviewsFetched(true);
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to load reviews");
      } finally {
        setLoadingReviews(false);
      }
    }
    setShowReviews((prev) => !prev);
  };

  if (loading) {
    return <BloomLoader />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  const fallbackImageSrc =
    typeof noImageFound === "string" ? noImageFound : noImageFound.src;
  const mainImage = product.images?.[0] || fallbackImageSrc;

  const handleAddToCart = async () => {
    setIsAdding(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      images: mainImage,
      quantity: quantity,
    });

    setIsAdding(false);
    setJustAdded(true);

    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/cart");
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const categoryId =
    typeof product.category === "object" && product.category !== null
      ? (product.category as { _id: string })._id
      : (product.category as string);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductBreadcrumb />

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-4">
          <div className="w-full max-w-[500px] mx-auto flex flex-col items-center px-4">
            <div className="rounded-xl shadow-lg overflow-hidden mb-4 w-full">
              <Image
                src={mainImage}
                alt={product.name}
                width={600}
                height={600}
                priority
                className="rounded-xl object-cover w-full h-auto max-h-[500px]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              (4.8) • 127 reviews
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <Separator />

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("decrement")}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-r-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("increment")}
                    className="h-10 w-10 rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className={cn(
                  "flex-1 transition-all duration-300",
                  justAdded
                    ? "bg-green-600 text-white hover:bg-green-600"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : justAdded ? (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Added to Cart!
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </div>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                className="flex-1"
              >
                Buy Now
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  isLiked && "text-destructive"
                )}
              >
                <Heart
                  className={cn("h-4 w-4 mr-2", isLiked && "fill-current")}
                />
                Add to Wishlist
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CUSTOMER REVIEWS SECTION --- */}
      <div className="mb-16 border rounded-xl p-6 bg-card shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Customer Reviews</h2>
          </div>
          <Button
            variant="outline"
            onClick={handleToggleReviews}
            disabled={loadingReviews}
            className="flex items-center gap-2"
          >
            {loadingReviews ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : showReviews ? (
              <>
                Hide Reviews <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show Reviews <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {showReviews && (
          <div className="mt-6 space-y-4">
            <Separator />

            {reviews.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">
                No reviews yet for this product.
              </p>
            ) : (
              <div className="grid gap-4 pt-4">
                {reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-4 rounded-lg border bg-muted/20 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-foreground">
                          {rev.user?.name || "Anonymous User"}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-foreground/90">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Features />

      <RelatedProducts
        categoryId={categoryId}
        currentProductId={product._id}
      />
    </div>
  );
}