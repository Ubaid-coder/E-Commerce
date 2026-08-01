import mongoose from "mongoose";
import Review from "./review.model";
import Product from "../product/product.model";
import Order from "../order/order.model";

interface CreateReviewData {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
}

const updateProductRatings = async (productId: string) => {
  const result = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $group: {
        _id: "$product",
        ratingsAverage: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  console.log(result);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: Number(result[0].ratingsAverage.toFixed(1)),
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

export const createReview = async ({
  userId,
  productId,
  rating,
  comment,
}: CreateReviewData) => {
  // 1. Check product exists
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  // 2. Check user purchased & received product
  const order = await Order.findOne({
    user: userId,
    status: "delivered",
    "items.product": productId,
  });

  if (!order) {
    throw new Error(
      "You can only review products you have purchased and received."
    );
  }

  // 3. Check already reviewed
  const alreadyReviewed = await Review.findOne({
    user: userId,
    product: productId,
  });

  if (alreadyReviewed) {
    throw new Error("You have already reviewed this product.");
  }

  // 4. Create review
  const review = await Review.create({
    user: userId,
    product: productId,
    rating,
    comment,
  });

  // 5. Update product ratings
  await updateProductRatings(productId);

  return review;
};

export const getProductReviews = async (productId: string) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  const reviews = await Review.find({
    product: productId,
  })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  return reviews;
};

export const canUserReview = async (
  userId: string,
  productId: string
) => {
  // 1. Product exists
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  // 2. Already reviewed?
  const alreadyReviewed = await Review.findOne({
    user: userId,
    product: productId,
  });

  if (alreadyReviewed) {
    return {
      canReview: false,
      reason: "already_reviewed",
    };
  }

  // 3. Purchased & Delivered?
  const order = await Order.findOne({
    user: userId,
    status: "delivered",
    "items.product": productId,
  });

  if (!order) {
    return {
      canReview: false,
      reason: "not_purchased",
    };
  }

  return {
    canReview: true,
    reason: null,
  };
};