"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
 // If using react-hot-toast, change to: import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { submitProductReview } from "@/services/reviews.service";
import { ProductType } from "@/types/product";
import noImageFound from "@/public/images/NoImage.jpg";
import { getProduct } from "@/services/product.service";
import Toast, { toast } from "react-hot-toast";

export default function ReviewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  
  // Form States
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Fetch product summary to display on the review page
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const response = await getProduct(id as string);
        setProduct(response?.data);
      } catch (err) {
        console.error("Failed to load product details:", err);
        toast.error("Could not load product details.");
      } finally {
        setLoadingProduct(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);

      await submitProductReview({
        productId: id as string,
        rating,
        comment,
      });

      setIsSuccess(true);
      toast.success("Review submitted successfully!");

      setTimeout(() => {
        router.push(`/`);
      }, 2000);
    } catch (err: any) {
      toast.error("Already submitted a review for this product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageSrc =
    product?.images?.[0] ||
    (typeof noImageFound === "string" ? noImageFound : noImageFound.src);

  if (loadingProduct) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-10">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

     

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Write a Review</CardTitle>
          <CardDescription>
            Share your experience with other customers
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Product Header */}
          {product && (
            <div className="flex items-center gap-4 p-4 border rounded-lg mb-6 bg-muted/40">
              <div className="relative h-16 w-16 overflow-hidden rounded-md flex-shrink-0">
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 animate-bounce" />
              <h3 className="text-xl font-semibold">Thank you for your review!</h3>
              <p className="text-sm text-muted-foreground">
                Redirecting you back to the home page...
              </p>
            </div>
          ) : (
            /* Review Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">
                  Overall Rating <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">
                  Your Review
                </label>
                <Textarea
                  placeholder="What did you like or dislike about this product?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}