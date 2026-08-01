import { Request, Response } from "express";
import { createReview } from "./review.service";
import { getProductReviews } from "./review.service";
import { canUserReview } from "./review.service";

interface UserRequest extends Request{
    user?:{
        id:string;
    }
}

export const create = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user?.id as string;

    const { productId, rating, comment } = req.body;

    const review = await createReview({
      userId,
      productId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong.",
    });
  }
};


export const getByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params as { productId: string };

    const reviews = await getProductReviews(productId);

    res.status(200).json({
      success: true,
      reviews,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};

export const canReview = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { productId } = req.params as { productId: string };

    const result = await canUserReview(userId, productId);

    res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};