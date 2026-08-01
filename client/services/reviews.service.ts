import api from './api'

export interface ReviewPayload {
  productId: string;
  rating: number;
  comment: string;
  message?:string;
};

export interface ReviewUser {
  _id: string;
  name: string;
};

export interface ProductReview {
  _id: string;
  user: ReviewUser;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export interface GetReviewsResponse {
  success: boolean;
  reviews: ProductReview[];
};

export const submitProductReview = async (payload: ReviewPayload) => {
  try{
    const response = await api.post(`/reviews`, payload);
    return response.data.message;
  }catch(error){
    console.log(error);
    throw new Error("Failed to submit review");
  }
};

export const getProductReviews = async (productId: string): Promise<GetReviewsResponse> => {
  try {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error?.response?.data?.message || "Failed to fetch product reviews");
  }
};